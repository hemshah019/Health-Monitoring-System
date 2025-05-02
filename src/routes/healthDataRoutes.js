const express = require('express');
const { HeartRate, SpO2, BodyTemperature, FallDetection, Patient } = require('../config');

const router = express.Router();

/* ----------------- IoT Sensor Data Endpoints (for ESP32) ----------------- */

// POST Heart Rate & SpO2 Data
router.post('/heartrate-spo2', async (req, res) => {
    const { patientId, heartRate, spo2, heartRateStatus, spo2Status, normalHeartRate, normalSpO2 } = req.body;

    try {
        // Validate patient existence
        const patient = await Patient.findOne({ Patient_ID: patientId });
        if (!patient) return res.status(400).json({ message: 'Invalid patient ID.' });

        // Save Heart Rate
        const newHeartRate = new HeartRate({
            Patient_ID: patientId,
            Current_Heart_Rate: heartRate,
            Average_Heart_Rate: heartRate,
            Normal_Heart_Rate: normalHeartRate,
            Status: heartRateStatus
        });
        await newHeartRate.save();

        // Save SpO2
        const newSpO2 = new SpO2({
            Patient_ID: patientId,
            Current_SpO2: spo2,
            Average_SpO2: spo2,
            Normal_SpO2: normalSpO2,
            Status: spo2Status
        });
        await newSpO2.save();

        res.status(201).json({ message: 'Heart Rate and SpO2 data saved successfully.' });
    } catch (error) {
        console.error('Error saving Heart Rate & SpO2:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// POST Temperature Data
router.post('/temperature', async (req, res) => {
    const { patientId, temperature, normalTemperature, status } = req.body;

    try {
        const patient = await Patient.findOne({ Patient_ID: patientId });
        if (!patient) return res.status(400).json({ message: 'Invalid patient ID.' });

        const newTemp = new BodyTemperature({
            Patient_ID: patientId,
            Current_Temperature: temperature,
            Average_Temperature: temperature,
            Normal_Temperature: normalTemperature,
            Status: status
        });
        await newTemp.save();

        res.status(201).json({ message: 'Temperature data saved successfully.' });
    } catch (error) {
        console.error('Error saving Temperature:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// POST Fall Detection Data
router.post('/fall-detection', async (req, res) => {
    const { patientId, fallDetected, fallDirection } = req.body;

    try {
        const patient = await Patient.findOne({ Patient_ID: patientId });
        if (!patient) return res.status(400).json({ message: 'Invalid patient ID.' });

        const newFall = new FallDetection({
            Patient_ID: patientId,
            Fall_Detected: fallDetected,
            Fall_Direction: fallDirection
        });
        await newFall.save();

        res.status(201).json({ message: 'Fall Detection data saved successfully.' });
    } catch (error) {
        console.error('Error saving Fall Detection:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

/* ----------------- Patient Authenticated Routes (Frontend) ----------------- */

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
        console.log('Session user:', req.session.user);
        console.log('Patient ID from middleware:', req.patientId);

        const recordId = parseInt(req.params.id, 10);
        const patientId = req.patientId;

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
        const patientId = req.patientId;

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
        const patientId = req.patientId;

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
        const patientId = req.patientId;

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