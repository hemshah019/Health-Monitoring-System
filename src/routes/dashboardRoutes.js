const express = require('express');
const router = express.Router();
const { Admin, Patient, Message, Compliance, Improvement } = require('../config'); 
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
            pendingImprovementCount 
        ] = await Promise.all([
            Admin.findOne({ adminID: adminId }).lean(),
            Patient.find({}).sort({ Patient_ID: 1 }).lean(), 

            // Fetch Messages with Patient Info for message table
            Message.aggregate([
                { $sort: { Message_ID: -1 } },
                ...patientLookupPipeline
            ]),

            // Fetch Compliances with Patient Info for compliance table
            Compliance.aggregate([
                { $sort: { Compliance_ID: -1 } },
                ...patientLookupPipeline
            ]),

            // Fetch Improvements with Patient Info for improvement table
            Improvement.aggregate([
                { $sort: { Improvement_ID: -1 } },
                ...patientLookupPipeline
            ]),

            // Counts for Stat Cards
            Patient.countDocuments(),
            Message.countDocuments(),
            Compliance.countDocuments(),
            Improvement.countDocuments(),

            // Counts for 'Alerts' (Pending items)
            Message.countDocuments({ Status: 'Pending' }),
            Compliance.countDocuments({ Status: 'Pending' }),
            Improvement.countDocuments({ Status: 'Pending' })
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
            message: message
        });

    } catch (error) {
        console.error("❌ Error fetching data for admin dashboard:", error);
        res.status(500).render('Errors/500', { errorMsg: "An error occurred while loading the admin dashboard."});
    }
});

// Patient Dashboard (GET)
router.get('/patientDashboard', requireLogin('patient'), async (req, res) => {
    try {
        const patientId = req.session.user.id;
        const message = req.query.message;

        const [patientData, messageCount, complianceCount, improvementCount] = await Promise.all([
            Patient.findOne({ Patient_ID: patientId }).lean(),
            Message.countDocuments({ Patient_ID: patientId }),
            Compliance.countDocuments({ Patient_ID: patientId }),
            Improvement.countDocuments({ Patient_ID: patientId })
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
            patientData: patientData,
            messageCount: messageCount,
            complianceCount: complianceCount,
            improvementCount: improvementCount,
            message: message
        });

    } catch (error) {
        console.error(`❌ Error fetching patient data or counts for dashboard (ID: ${req.session.user?.id}):`, error);
        res.status(500).render('Errors/500', {
            title: 'Server Error',
            errorMsg: "An error occurred while loading your dashboard."
        });
    }
});

module.exports = router;