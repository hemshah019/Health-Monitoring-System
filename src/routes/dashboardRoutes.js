const express = require('express');
const router = express.Router();
const { Admin, Patient, Message, Compliance, Improvement, HeartRate, SpO2, BodyTemperature, FallDetection } = require('../config'); 
const dayjs = require('dayjs');

function requireLogin(role) {
    return (req, res, next) => {
        if (!req.session.user || req.session.user.role !== role) {
            console.log(`⚠️ Unauthorized access attempt to /${role}Dashboard. Redirecting to login.`);
            req.session.destroy(err => {
                 if (err) console.error("Error destroying session on unauthorized access:", err);
                 return res.redirect('/?message=auth_required');
            });
            return;
        }
        console.log(`🔑 Authorized access for role: ${role}, ID: ${req.session.user.id}`);
        next();
    };
}

// --- Aggregation Pipeline Helper ---
const patientLookupPipeline = [
    {
        $lookup: {
            from: "patients",
            localField: "Patient_ID",
            foreignField: "Patient_ID",
            as: "patientInfo"
        }
    },
    {
        $unwind: {
            path: "$patientInfo",
            preserveNullAndEmptyArrays: true
        }
    }
];

// Admin dashboard (GET)
router.get('/adminDashboard', requireLogin('admin'), async (req, res) => {
    try {
        const adminId = req.session.user.id;
        const message = req.query.message;
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Fetch all data concurrently
        const [
            adminData,
            allPatients, 
            allMessages,
            allCompliances,
            allImprovements,
            patientCount,
            messageCount,
            complianceCount,
            improvementCount,
            pendingMessageCount, 
            pendingComplianceCount, 
            pendingImprovementCount,
            todayEnrollmentsCount 
        ] = await Promise.all([
            Admin.findOne({ adminID: adminId }).lean(),
            Patient.find({}).sort({ Patient_ID: 1 }).lean(), 
            Message.aggregate([{ $sort: { Message_ID: -1 } }, ...patientLookupPipeline]),
            Compliance.aggregate([{ $sort: { Compliance_ID: -1 } }, ...patientLookupPipeline]),
            Improvement.aggregate([{ $sort: { Improvement_ID: -1 } }, ...patientLookupPipeline]),

            // Counts for Stat Cards
            Patient.countDocuments(),
            Message.countDocuments(),
            Compliance.countDocuments(),
            Improvement.countDocuments(),

            // Counts for 'Alerts' (Pending items)
            Message.countDocuments({ Status: 'Pending' }),
            Compliance.countDocuments({ Status: 'Pending' }),
            Improvement.countDocuments({ Status: 'Pending' }),
            // Count patients enrolled in last 24 hours
            Patient.countDocuments({ 
                Enrollment_Date: { $gte: twentyFourHoursAgo } 
            })
        ]);

        if (!adminData) {
            console.error(`❌ ERROR: Admin data not found in DB for logged-in admin ID: ${adminId}`);
            req.session.destroy(err => {
                if (err) console.error("Error destroying session for missing admin:", err);
                return res.redirect('/?message=session_error');
            });
            return;
        }

        // Calculate total 'Alerts' count (sum of pending items)
        const alertCount = pendingMessageCount + pendingComplianceCount + pendingImprovementCount;

        res.render('AdminDashboard/adminDashboard', {
            adminData: adminData,
            patients: allPatients,       
            messages: allMessages,       
            compliances: allCompliances, 
            improvements: allImprovements,

            // Data for the main dashboard content
            patientCount: patientCount,
            messageCount: messageCount,
            complianceCount: complianceCount,
            improvementCount: improvementCount,
            alertCount: alertCount,
            dashboardPatients: allPatients.slice(0, 3),
            message: message,
            todayEnrollmentsCount: todayEnrollmentsCount 
        });

    } catch (error) {
        console.error("❌ Error fetching data for admin dashboard:", error);
        res.status(500).render('Errors/500', { errorMsg: "An error occurred while loading the admin dashboard."});
    }
});

// Update admin profile (POST)
router.post('/updateAdminProfile', requireLogin('admin'), async (req, res) => {
    try {
        const adminId = req.session.user.id;
        const { firstName, lastName, phoneNumber, email, username, password } = req.body;

        // Create update object with only the fields that are provided
        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (email) updateData.email = email;
        if (username) updateData.username = username;
        if (password) updateData.password = password;

        const updatedAdmin = await Admin.findOneAndUpdate(
            { adminID: adminId },
            updateData,
            { new: true }
        );

        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating admin profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// Delete admin account (POST)
router.post('/deleteAdminAccount', requireLogin('admin'), async (req, res) => {
    try {
        const adminId = req.session.user.id;

        const result = await Admin.deleteOne({ adminID: adminId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Destroy the session
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Error during account deletion' });
            }
            res.json({ message: 'Account deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting admin account:', error);
        res.status(500).json({ message: 'Failed to delete account' });
    }
});

// Patient Dashboard (GET)
router.get('/patientDashboard', requireLogin('patient'), async (req, res) => {
    try {
        const patientId = req.session.user.id;
        const message = req.query.message;

        const [
            patientData,
            messageCount,
            complianceCount,
            improvementCount,
            latestHeartRate,
            latestTemperature,
            latestSpO2,
            latestFallDetection
        ] = await Promise.all([
            Patient.findOne({ Patient_ID: patientId }).lean(),
            Message.countDocuments({ Patient_ID: patientId }),
            Compliance.countDocuments({ Patient_ID: patientId }),
            Improvement.countDocuments({ Patient_ID: patientId }),
            HeartRate.findOne({ Patient_ID: patientId }).sort({ Date_Time: -1 }).lean(),
            BodyTemperature.findOne({ Patient_ID: patientId }).sort({ Date_Time: -1 }).lean(),
            SpO2.findOne({ Patient_ID: patientId }).sort({ Date_Time: -1 }).lean(),
            FallDetection.findOne({ Patient_ID: patientId }).sort({ Date_Time: -1 }).lean()
        ]);

        if (!patientData) {
            console.error(`❌ ERROR: Patient data not found in DB for logged-in patient ID: ${patientId}`);
            req.session.destroy(err => {
                if (err) console.error("Error destroying session for missing patient:", err);
                return res.redirect('/?message=session_error');
            });
            return;
        }

        res.render('PatientDashboard/patientDashboard', {
            title: 'Patient Dashboard',
            patient: patientData,
            patientData: patientData,
            messageCount: messageCount,
            complianceCount: complianceCount,
            improvementCount: improvementCount,
            message: message,
            healthStats: {
                heartRate: latestHeartRate,
                temperature: latestTemperature,
                spO2: latestSpO2,
                fallDetection: latestFallDetection
            }
        });

    } catch (error) {
        console.error(`❌ Error fetching patient data or counts for dashboard (ID: ${req.session.user?.id}):`, error);
        res.status(500).render('Errors/500', {
            title: 'Server Error',
            errorMsg: "An error occurred while loading your dashboard."
        });
    }
});

// Update patient profile (POST)
router.post('/updatePatientProfile', requireLogin('patient'), async (req, res) => {
    try {
        const patientId = req.session.user.id;
        const { username, firstName, lastName, age, dob, gender, phoneNumber, email, address } = req.body;

        // Create update object
        const updateData = {
            Username: username,
            First_Name: firstName,
            Last_Name: lastName,
            Age: age,
            Date_Of_Birth: dob,
            Gender: gender,
            Phone_Number: phoneNumber,
            Email: email,
            Address: address
        };

        const updatedPatient = await Patient.findOneAndUpdate(
            { Patient_ID: patientId },
            updateData,
            { new: true }
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating patient profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// Delete patient account (POST)
router.post('/deletePatientAccount', requireLogin('patient'), async (req, res) => {
    try {
        const patientId = req.session.user.id;
        const result = await Patient.deleteOne({ Patient_ID: patientId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Destroy the session
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Error during account deletion' });
            }
            res.json({ message: 'Account deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting patient account:', error);
        res.status(500).json({ message: 'Failed to delete account' });
    }
});

module.exports = router;