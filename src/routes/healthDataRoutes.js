const express = require('express');
const { HeartRate, SpO2, BodyTemperature, FallDetection, Patient } = require('../config');

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
// FETCHING HEARTRATE DATA
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

// DELETE HEARTRATE DATA
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


// SpO2 Routes
// FETCHING SPO2 DATA
router.get('/spo2', isPatientAuthenticated, async (req, res) => {
    try {
        const patientId = req.patientId;
        const spo2Data = await SpO2.find({ Patient_ID: patientId })
            .sort({ SpO2_ID: -1 });

        res.status(200).json(spo2Data);

    } catch (error) {
        console.error("Error fetching SpO2 data:", error);
        res.status(500).json({ message: 'Failed to fetch SpO2 data', error: error.message });
    }
});

// DELETE
router.delete('/spo2/:id', isPatientAuthenticated, async (req, res) => {
    try {
        const recordId = parseInt(req.params.id, 10);
        const patientId = req.session.user.Patient_ID;

        if (isNaN(recordId)) {
            return res.status(400).json({ message: 'Invalid SpO2 ID format.' });
        }

        const result = await SpO2.findOneAndDelete({
            SpO2_ID: recordId,
            Patient_ID: patientId
        });

        if (!result) {
            return res.status(404).json({ message: 'SpO2 record not found or access denied.' });
        }

        console.log(`SpO2 record ${recordId} deleted successfully for patient ${patientId}`);
        res.status(200).json({ message: 'SpO2 record deleted successfully.' });

    } catch (error) {
        console.error("Error deleting SpO2 record:", error);
        res.status(500).json({ message: 'Failed to delete SpO2 record', error: error.message });
    }
});

// Body Temperature Routes
// FETCHING BODY TEMPERATURE DATA
router.get('/body-temperature', isPatientAuthenticated, async (req, res) => {
    try {
        const patientId = req.patientId;
        const bodyTempData = await BodyTemperature.find({ Patient_ID: patientId })
            .sort({ Temperature_ID: -1 });

        res.status(200).json(bodyTempData);

    } catch (error) {
        console.error("Error fetching body temperature data:", error);
        res.status(500).json({ message: 'Failed to fetch body temperature data', error: error.message });
    }
});

// DELETE
router.delete('/body-temperature/:id', isPatientAuthenticated, async (req, res) => {
    try {
        const recordId = parseInt(req.params.id, 10);
        const patientId = req.session.user.Patient_ID;

        if (isNaN(recordId)) {
            return res.status(400).json({ message: 'Invalid Temperature ID format.' });
        }

        const result = await BodyTemperature.findOneAndDelete({
            Temperature_ID: recordId,
            Patient_ID: patientId
        });

        if (!result) {
            return res.status(404).json({ message: 'Body temperature record not found or access denied.' });
        }

        console.log(`Body temperature record ${recordId} deleted successfully for patient ${patientId}`);
        res.status(200).json({ message: 'Body temperature record deleted successfully.' });

    } catch (error) {
        console.error("Error deleting body temperature record:", error);
        res.status(500).json({ message: 'Failed to delete body temperature record', error: error.message });
    }
});


// Fall Detection Routes
// FETCHING FALL DETECTION DATA
router.get('/fall-detection', isPatientAuthenticated, async (req, res) => {
    try {
        const patientId = req.patientId;
        const fallDetectionData = await FallDetection.find({ Patient_ID: patientId })
            .sort({ Fall_ID: -1 });

        res.status(200).json(fallDetectionData);

    } catch (error) {
        console.error("Error fetching fall detection data:", error);
        res.status(500).json({ message: 'Failed to fetch fall detection data', error: error.message });
    }
});

// DELETE FALL DETECTION DATA
router.delete('/fall-detection/:id', isPatientAuthenticated, async (req, res) => {
    try {
        const recordId = parseInt(req.params.id, 10);
        const patientId = req.session.user.Patient_ID;

        if (isNaN(recordId)) {
            return res.status(400).json({ message: 'Invalid Fall Detection ID format.' });
        }

        const result = await FallDetection.findOneAndDelete({
            Fall_ID: recordId,
            Patient_ID: patientId
        });

        if (!result) {
            return res.status(404).json({ message: 'Fall detection record not found or access denied.' });
        }

        console.log(`Fall detection record ${recordId} deleted successfully for patient ${patientId}`);
        res.status(200).json({ message: 'Fall detection record deleted successfully.' });

    } catch (error) {
        console.error("Error deleting fall detection record:", error);
        res.status(500).json({ message: 'Failed to delete fall detection record', error: error.message });
    }
});

module.exports = router;