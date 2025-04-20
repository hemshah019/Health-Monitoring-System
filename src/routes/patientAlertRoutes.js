// const express = require('express');
// const router = express.Router();
// const { HeartRate, SpO2, BodyTemperature, Alert } = require('../config');

// // Middleware to check if user is authenticated
// const isAuthenticated = (req, res, next) => {
//     if (req.session.user) {
//         return next();
//     }
//     res.redirect('/');
// };

// // Route to manually check and create alerts based on heart rate data
// router.get('/check-heart-rate-alerts', isAuthenticated, async (req, res) => {
//     try {
//         // Find heart rate readings with High or Low status
//         const abnormalHeartRates = await HeartRate.find({ 
//             Status: { $in: ['High', 'Low'] } 
//         }).sort({ Date_Time: -1 });

//         let createdAlerts = 0;

//         // Process each abnormal reading
//         for (const heartRate of abnormalHeartRates) {
//             // Check if alert already exists for this reading
//             const existingAlert = await Alert.findOne({ 
//                 Patient_ID: heartRate.Patient_ID,
//                 Alert_Type: 'Heart Rate',
//                 Current_Value: heartRate.Current_Heart_Rate,
//                 Alert_DateTime: heartRate.Date_Time
//             });

//             // If no alert exists, create one
//             if (!existingAlert) {
//                 const newAlert = new Alert({
//                     Patient_ID: heartRate.Patient_ID,
//                     Alert_Type: 'Heart Rate',
//                     Current_Value: heartRate.Current_Heart_Rate,
//                     Normal_Range: heartRate.Normal_Heart_Rate,
//                     Alert_Status: 'Critical',
//                     Task_Assigned: 'No'
//                 });

//                 await newAlert.save();
//                 createdAlerts++;
//             }
//         }

//         res.json({ 
//             success: true, 
//             message: `Created ${createdAlerts} new alerts from abnormal heart rate readings`,
//             processedReadings: abnormalHeartRates.length
//         });
//     } catch (error) {
//         console.error('Error creating heart rate alerts:', error);
//         res.status(500).json({ success: false, message: 'Server error while creating alerts' });
//     }
// });

// // API endpoint to get all alerts for a specific patient
// router.get('/patient/:patientId', isAuthenticated, async (req, res) => {
//     try {
//         const patientId = parseInt(req.params.patientId);
        
//         // Check if the logged-in user is the same as the requested patient or is admin
//         if (req.session.user.Role !== 'admin' && req.session.user.Patient_ID !== patientId) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         const alerts = await Alert.find({ Patient_ID: patientId }).sort({ Alert_DateTime: -1 });
//         res.json({ success: true, alerts });
//     } catch (error) {
//         console.error('Error fetching patient alerts:', error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// });

// // API endpoint to get all critical alerts for a specific patient
// router.get('/patient/:patientId/critical', isAuthenticated, async (req, res) => {
//     try {
//         const patientId = parseInt(req.params.patientId);
        
//         // Check if the logged-in user is the same as the requested patient or is admin
//         if (req.session.user.Role !== 'admin' && req.session.user.Patient_ID !== patientId) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         const criticalAlerts = await Alert.find({ 
//             Patient_ID: patientId,
//             Alert_Status: 'Critical'
//         }).sort({ Alert_DateTime: -1 });
        
//         res.json({ success: true, alerts: criticalAlerts });
//     } catch (error) {
//         console.error('Error fetching critical patient alerts:', error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// });

// // API endpoint to mark an alert as resolved
// router.put('/resolve/:alertId', isAuthenticated, async (req, res) => {
//     try {
//         const alertId = parseInt(req.params.alertId);
//         const { response } = req.body;
        
//         // Find the alert
//         const alert = await Alert.findOne({ Alert_ID: alertId });
        
//         if (!alert) {
//             return res.status(404).json({ success: false, message: 'Alert not found' });
//         }
        
//         // Check authorization - admin or owner
//         if (req.session.user.Role !== 'admin' && req.session.user.Patient_ID !== alert.Patient_ID) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         // Update the alert
//         alert.Alert_Status = 'Resolved';
//         alert.Admin_Response = response || 'Alert reviewed and resolved';
//         alert.Response_Date = new Date();
        
//         await alert.save();
        
//         res.json({ success: true, message: 'Alert marked as resolved', alert });
//     } catch (error) {
//         console.error('Error resolving alert:', error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// });

// // AUTOMATED ALERT SYSTEM - checks for new alerts every time this module runs
// const checkForNewAlerts = async () => {
//     try {
//         console.log('Running automated alert check for health metrics...');
        
//         // Check for abnormal heart rates
//         const abnormalHeartRates = await HeartRate.find({ 
//             Status: { $in: ['High', 'Low'] } 
//         }).sort({ Date_Time: -1 }).limit(100); // Limit to prevent processing too many at once
        
//         // Create alerts for each abnormal heart rate
//         for (const heartRate of abnormalHeartRates) {
//             // Check if alert already exists
//             const existingAlert = await Alert.findOne({ 
//                 Patient_ID: heartRate.Patient_ID,
//                 Alert_Type: 'Heart Rate',
//                 Current_Value: heartRate.Current_Heart_Rate,
//                 Alert_DateTime: heartRate.Date_Time
//             });
            
//             // If no alert exists, create one
//             if (!existingAlert) {
//                 const newAlert = new Alert({
//                     Patient_ID: heartRate.Patient_ID,
//                     Alert_Type: 'Heart Rate',
//                     Current_Value: heartRate.Current_Heart_Rate,
//                     Normal_Range: heartRate.Normal_Heart_Rate,
//                     Alert_Status: 'Critical',
//                     Task_Assigned: 'No'
//                 });
                
//                 await newAlert.save();
//                 console.log(`Created new heart rate alert for Patient ID: ${heartRate.Patient_ID}`);
//             }
//         }
        
//         console.log('Alert check completed successfully');
//     } catch (error) {
//         console.error('Error in automated alert check:', error);
//     }
// };

// // Run initial check when the module is first loaded
// checkForNewAlerts();

// // Schedule regular checks (can be adjusted or implemented with a proper scheduler)
// // For example, with a simple interval:
// // setInterval(checkForNewAlerts, 5 * 60 * 1000); // Check every 5 minutes

// module.exports = router;