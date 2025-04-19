const express = require('express');
const { HeartRate, Patient } = require('../config');

const router = express.Router();

// Middleware to check if the user is authenticated as a patient
const isPatientAuthenticated = (req, res, next) => {
    console.log('Session user:', req.session.user);
    
    // Check for user session with case-insensitive property names
    if (req.session.user && 
        (req.session.user.role === 'patient' || req.session.user.Role === 'Patient') && 
        (req.session.user.id || req.session.user.Patient_ID)) {
        
        // For consistency in your route handlers
        req.patientId = req.session.user.id || req.session.user.Patient_ID;
        next();
    } else {
        console.log('Authentication failed:', { 
            hasUser: !!req.session.user, 
            role: req.session.user?.role || req.session.user?.Role, 
            patientId: req.session.user?.id || req.session.user?.Patient_ID 
        });
        
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.status(401).json({ message: 'Unauthorized: Please log in.' });
        } else {
            res.redirect('/login');
        }
    }
};

// Heart Rate Routes
// FETCHING HEART RATE DATA
router.get('/heart-rate', isPatientAuthenticated, async (req, res) => {
    try {
        const patientId = req.patientId;
        const heartRateData = await HeartRate.find({ Patient_ID: patientId })
        .sort({ Heart_Rate_ID: -1 });

        res.status(200).json(heartRateData);

    } catch (error) {
        console.error("Error fetching heart rate data:", error);
        res.status(500).json({ message: 'Failed to fetch heart rate data', error: error.message });
    }
});

// DELETE
router.delete('/heart-rate/:id', isPatientAuthenticated, async (req, res) => {
    try {
        const recordId = parseInt(req.params.id, 10);
        const patientId = req.session.user.Patient_ID;

        if (isNaN(recordId)) {
             return res.status(400).json({ message: 'Invalid Heart Rate ID format.' });
        }

        const result = await HeartRate.findOneAndDelete({
            Heart_Rate_ID: recordId,
            Patient_ID: patientId
        });

        if (!result) {
            return res.status(404).json({ message: 'Heart rate record not found or access denied.' });
        }

        console.log(`Heart rate record ${recordId} deleted successfully for patient ${patientId}`);
        res.status(200).json({ message: 'Heart rate record deleted successfully.' });

    } catch (error) {
        console.error("Error deleting heart rate record:", error);
        res.status(500).json({ message: 'Failed to delete heart rate record', error: error.message });
    }
});

module.exports = router;