const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const { HeartRate, Alert } = require('../config');

// Route to generate heart rate alerts for Low/High statuses
router.post('/generate-heart-rate-alerts', async (req, res) => {
    try {
        const abnormalHeartRates = await HeartRate.find({
            Status: { $in: ['Low', 'High'] }
        });

        let newAlerts = [];

        for (const hr of abnormalHeartRates) {
            const existingAlert = await Alert.findOne({
                Patient_ID: hr.Patient_ID,
                Alert_Type: 'Heart Rate',
                Alert_DateTime: hr.Date_Time
            });

            if (!existingAlert) {
                const lastAlert = await Alert.findOne({}, {}, { sort: { 'Alert_ID': -1 } });
                const newAlertID = lastAlert ? lastAlert.Alert_ID + 1 : 8000;

                const alert = new Alert({
                    Alert_ID: newAlertID,
                    Patient_ID: hr.Patient_ID,
                    Alert_Type: 'Heart Rate',
                    Current_Value: hr.Current_Heart_Rate,
                    Normal_Range: hr.Normal_Heart_Rate,
                    Alert_DateTime: hr.Date_Time,
                    Alert_Status: 'Critical',
                    Task_Assigned: 'No',
                    Admin_Response: null,
                    Response_Date: null
                });

                await alert.save();
                newAlerts.push(alert);
            }
        }

        if (newAlerts.length > 0) {
            res.status(200).json({
                message: `${newAlerts.length} new heart rate alerts generated.`,
                alerts: newAlerts
            });
        } else {
            res.status(200).json({
                message: 'No new alerts. All current data already processed or within normal range.'
            });
        }

    } catch (error) {
        console.error('Error generating heart rate alerts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

