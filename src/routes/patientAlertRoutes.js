const express = require('express');
const router = express.Router();
const { generateAlertsForPatient, generateAlertsForAllPatients } = require('../../utils/alertGenerator');
const { Alert } = require('../config'); 

// Middleware to ensure patient authentication
const ensurePatient = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'patient') {
        console.warn('Unauthorized access attempt to patient alerts.');
        return res.status(403).json({ success: false, message: 'Unauthorized access. Please log in as a patient.' });
    }
    if (!req.session.user.id) {
        console.error('Session is missing user ID.');
        return res.status(401).json({ success: false, message: 'Authentication error. Please log in again.' });
    }
    req.patientId = req.session.user.id;
    next();
};

// Alert Generating Action
// Generate alerts for a specific patient
router.get('/generate-alerts/:patientId', async (req, res) => {
    try {
        const patientId = parseInt(req.params.patientId);
        await generateAlertsForPatient(patientId);
        res.send('Alerts generated successfully!');
    } catch (err) {
        res.status(500).send('Error generating alerts');
    }
});

// Generate alerts for all patients
router.get('/generate-alerts', async (req, res) => {
    try {
        await generateAlertsForAllPatients();
        res.send('Alerts generated for all patients!');
    } catch (err) {
        res.status(500).send('Error generating alerts');
    }
});

// Fetch alerts for logged-in patient
router.get('/patient-alerts', ensurePatient, async (req, res) => {
    try {
        const patientId = req.patientId;
        const alerts = await Alert.find({ Patient_ID: patientId }).sort({ Alert_ID: -1 });
        res.status(200).json(alerts);
    } catch (error) {
        console.error('Error fetching patient alerts:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching alerts.' });
    }
});

// Delete a specific alert for the logged-in patient
router.delete('/:id', ensurePatient, async (req, res) => {
    try {
        const patientId = req.patientId;
        const alertMongoId = req.params.id;

        // Validate if the alert exists and belongs to the patient
        const alert = await Alert.findOne({ _id: alertMongoId, Patient_ID: patientId });
        if (!alert) {
            return res.status(404).json({ success: false, message: 'Alert not found or unauthorized access.' });
        }

        // Delete the alert
        await Alert.deleteOne({ _id: alertMongoId });
        res.status(200).json({ success: true, message: 'Alert deleted successfully.' });
    } catch (error) {
        console.error('Error deleting patient alert:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting alert.' });
    }
});

module.exports = router;