const express = require('express');
const router = express.Router();
const { Admin, Patient } = require('../config');

// Middleware to protect dashboard routes
function requireLogin(role) {
    return (req, res, next) => {
        if (!req.session.user || req.session.user.role !== role) {
            console.log(`⚠️ Unauthorized access attempt to /${role}Dashboard. Redirecting to login.`);
            return res.redirect('/');
        }
        console.log(`🔑 Authorized access for role: ${role}, ID: ${req.session.user.id}`);
        next();
    };
}

// Admin dashboard
router.get('/adminDashboard', requireLogin('admin'), async (req, res) => {
    try {
        const adminId = req.session.user.id;
        console.log(`Fetching data for admin ID: ${adminId}`);

        const adminData = await Admin.findOne({ adminID: adminId });

        if (!adminData) {
            console.error(`❌ ERROR: Admin data not found in DB for logged-in admin ID: ${adminId}`);
            req.session.destroy();
            return res.redirect('/?message=session_error');
        }

        const allPatients = await Patient.find({}).sort({ Patient_ID: 1 });
        console.log(`✅ Admin data fetched successfully for ${adminData.username}`);
        console.log(`✅ Fetched ${allPatients.length} patients for the admin dashboard.`);

        res.render('AdminDashboard/adminDashboard', {
            adminData: adminData,
            patients: allPatients
        });

    } catch (error) {
        console.error("❌ Error fetching admin data for dashboard:", error);
        res.status(500).send("An error occurred while loading the dashboard.");
    }
});

// // Patient dashboard
// router.get('/patientDashboard', requireLogin('patient'), (req, res) => {
//     const patientId = req.session.user.id;
//     res.render('PatientDashboard/patientDashboard', { patientId });
// });

// Patient Dashboard
router.get('/patientDashboard', requireLogin('patient'), async (req, res) => {
    try {
        const patientId = req.session.user.id;
        console.log(`Fetching data for patient ID: ${patientId}`);

        const patientData = await Patient.findOne({ Patient_ID: patientId });

        if (!patientData) {
            console.error(`❌ ERROR: Patient data not found in DB for logged-in patient ID: ${patientId}`);
            req.session.destroy(err => {
                if (err) console.error("Error destroying session:", err);
                return res.redirect('/?message=session_error');
            });
            return;
        }

        console.log(`✅ Patient data fetched successfully for ${patientData.Username}`);

        res.render('PatientDashboard/patientDashboard', { patientData: patientData });

    } catch (error) {
        console.error("❌ Error fetching patient data for dashboard:", error);
        res.status(500).send("An error occurred while loading the dashboard.");
    }
});

module.exports = router;
