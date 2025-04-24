// const { HeartRate, SpO2, BodyTemperature, FallDetection, Alert, Patient } = require('../src/config');
// const nodemailer = require('nodemailer');
// require('dotenv').config();

// // Nodemailer Transporter Setup
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     },
// });

// // Email Notification Function with HTML Template
// async function sendAlertEmail(patientId, alertType, currentValue, normalRange, alertStatus) {
//     const patient = await Patient.findOne({ Patient_ID: patientId });
//     if (!patient) {
//         console.error(`Patient with ID ${patientId} not found.`);
//         return;
//     }

//     const mailOptions = {
//         from: `"Health Monitoring System" <${process.env.EMAIL_USER}>`,
//         to: patient.Email,
//         subject: `⚠️ Health Alert: ${alertType} - ${alertStatus}`,
//         html: `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//                 <h2 style="color: #d32f2f;">⚠️ Health Alert Notification</h2>
//                 <p>Dear <strong>${patient.First_Name}</strong>,</p>
//                 <p>A new health alert has been triggered for you. Please review the details below:</p>

//                 <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
//                     <tr style="background-color: #f5f5f5;">
//                         <td style="padding: 10px; border: 1px solid #ddd;">Alert Type</td>
//                         <td style="padding: 10px; border: 1px solid #ddd;">${alertType}</td>
//                     </tr>
//                     <tr>
//                         <td style="padding: 10px; border: 1px solid #ddd;">Current Value</td>
//                         <td style="padding: 10px; border: 1px solid #ddd;">${currentValue !== null ? currentValue : 'N/A'}</td>
//                     </tr>
//                     <tr style="background-color: #f5f5f5;">
//                         <td style="padding: 10px; border: 1px solid #ddd;">Normal Range</td>
//                         <td style="padding: 10px; border: 1px solid #ddd;">${normalRange}</td>
//                     </tr>
//                     <tr>
//                         <td style="padding: 10px; border: 1px solid #ddd;">Alert Status</td>
//                         <td style="padding: 10px; border: 1px solid #ddd; color: ${alertStatus === 'Critical' ? '#d32f2f' : alertStatus === 'High' ? '#f57c00' : alertStatus === 'Low' ? '#1976d2' : '#388e3c'};">
//                             <strong>${alertStatus}</strong>
//                         </td>
//                     </tr>
//                 </table>

//                 <p>Please consult your healthcare provider if necessary.</p>
//                 <p style="color: #888;">This is an automated message from the Health Monitoring System.</p>
//             </div>
//         `
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         console.log(`📧 Alert email sent to ${patient.Email}`);
//     } catch (error) {
//         console.error('❌ Error sending alert email:', error);
//     }
// }

// // Helper: Get next Alert_ID
// async function getNextAlertId() {
//     const lastAlert = await Alert.findOne({}, {}, { sort: { 'Alert_ID': -1 } });
//     return lastAlert ? lastAlert.Alert_ID + 1 : 9000; 
// }

const { HeartRate, SpO2, BodyTemperature, FallDetection, Alert, Patient } = require('../src/config');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

// Email Notification Function with HTML Template
async function sendAlertEmail(patientId, alertType, currentValue, normalRange, alertStatus, fallDirection = null) {
    const patient = await Patient.findOne({ Patient_ID: patientId });
    if (!patient) {
        console.error(`Patient with ID ${patientId} not found.`);
        return;
    }

    const mailOptions = {
        from: `"Health Monitoring System" <${process.env.EMAIL_USER}>`,
        to: patient.Email,
        subject: `⚠️ Health Alert: ${alertType} - ${alertStatus}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #d32f2f;">⚠️ Health Alert Notification</h2>
                <p>Dear <strong>${patient.First_Name}</strong>,</p>
                <p>A new health alert has been triggered for you. Please review the details below:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background-color: #f5f5f5;">
                        <td style="padding: 10px; border: 1px solid #ddd;">Alert Type</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${alertType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">Current Value</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">
                            ${
                                alertType === 'Body Fall Detection'
                                    ? 'N/A'
                                    : currentValue !== null 
                                        ? `${currentValue} ${
                                            alertType === 'Heart Rate' ? 'BPM' :
                                            alertType === 'Oxygen Saturation (SpO2)' ? '%' :
                                            alertType === 'Body Temperature' ? '°C' :
                                            ''
                                        }`
                                        : 'N/A'
                            }
                        </td>
                    </tr>
                    ${
                        alertType === 'Body Fall Detection'
                        ? `
                            <tr style="background-color: #f5f5f5;">
                                <td style="padding: 10px; border: 1px solid #ddd;">Fall Direction</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${fallDirection || 'Unknown'}</td>
                            </tr>
                        `
                        : ''
                    }
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">Normal Range</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${normalRange}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">Alert Status</td>
                        <td style="padding: 10px; border: 1px solid #ddd; color: ${alertStatus === 'Critical' ? '#d32f2f' : alertStatus === 'High' ? '#f57c00' : alertStatus === 'Low' ? '#1976d2' : '#388e3c'};">
                            <strong>${alertStatus}</strong>
                        </td>
                    </tr>
                </table>
                <p>Please consult your healthcare provider if necessary.</p>
                <p style="color: #888;">This is an automated message from the Health Monitoring System.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Alert email sent to ${patient.Email}`);
    } catch (error) {
        console.error('❌ Error sending alert email:', error);
    }
}

// Helper: Get next Alert_ID
async function getNextAlertId() {
    const lastAlert = await Alert.findOne({}, {}, { sort: { 'Alert_ID': -1 } });
    return lastAlert ? lastAlert.Alert_ID + 1 : 9000;
}

// Generate alerts for a specific patient
async function generateAlertsForPatient(patientId) {
    try {
        const alertsToInsert = [];
        let nextAlertId = await getNextAlertId();

        // Heart Rate Alerts
        const heartRates = await HeartRate.find({ Patient_ID: patientId, Status: { $in: ['Low', 'High'] } });
        for (const hr of heartRates) {
            const exists = await Alert.findOne({ Heart_Rate_ID: hr.Heart_Rate_ID });
            if (exists) continue;

            alertsToInsert.push({
                Alert_ID: nextAlertId++,
                Heart_Rate_ID: hr.Heart_Rate_ID,
                SpO2_ID: null,
                Temperature_ID: null,
                Fall_ID: null,
                Patient_ID: hr.Patient_ID,
                Alert_Type: 'Heart Rate',
                Current_Value: hr.Current_Heart_Rate,
                Fall_Direction: null,
                Normal_Range: hr.Normal_Heart_Rate,
                dateTime: hr.dateTime,
                displayDateTime: hr.displayDateTime,
                Alert_Status: hr.Status,
            });

            await sendAlertEmail(hr.Patient_ID, 'Heart Rate', hr.Current_Heart_Rate, hr.Normal_Heart_Rate, hr.Status);
        }

        // SpO2 Alerts
        const spo2Readings = await SpO2.find({ Patient_ID: patientId, Status: { $in: ['Low', 'High'] } });
        for (const spo2 of spo2Readings) {
            const exists = await Alert.findOne({ SpO2_ID: spo2.SpO2_ID });
            if (exists) continue;

            alertsToInsert.push({
                Alert_ID: nextAlertId++,
                Heart_Rate_ID: null,
                SpO2_ID: spo2.SpO2_ID,
                Temperature_ID: null,
                Fall_ID: null,
                Patient_ID: spo2.Patient_ID,
                Alert_Type: 'Oxygen Saturation (SpO2)',
                Current_Value: spo2.Current_SpO2,
                Fall_Direction: null,
                Normal_Range: spo2.Normal_SpO2,
                dateTime: spo2.dateTime,
                displayDateTime: spo2.displayDateTime,
                Alert_Status: spo2.Status,
            });

            await sendAlertEmail(spo2.Patient_ID, 'Oxygen Saturation (SpO2)', spo2.Current_SpO2, spo2.Normal_SpO2, spo2.Status);
        }

        // Body Temperature Alerts
        const temperatures = await BodyTemperature.find({ Patient_ID: patientId, Status: { $in: ['Low', 'High'] } });
        for (const temp of temperatures) {
            const exists = await Alert.findOne({ Temperature_ID: temp.Temperature_ID });
            if (exists) continue;

            alertsToInsert.push({
                Alert_ID: nextAlertId++,
                Heart_Rate_ID: null,
                SpO2_ID: null,
                Temperature_ID: temp.Temperature_ID,
                Fall_ID: null,
                Patient_ID: temp.Patient_ID,
                Alert_Type: 'Body Temperature',
                Current_Value: temp.Current_Temperature,
                Fall_Direction: null,
                Normal_Range: temp.Normal_Temperature,
                dateTime: temp.dateTime,
                displayDateTime: temp.displayDateTime,
                Alert_Status: temp.Status,
            });

            await sendAlertEmail(temp.Patient_ID, 'Body Temperature', temp.Current_Temperature, temp.Normal_Temperature, temp.Status);
        }

        // Fall Detection Alerts
        const falls = await FallDetection.find({ Patient_ID: patientId, Fall_Detected: 'Yes' });
        for (const fall of falls) {
            const exists = await Alert.findOne({ Fall_ID: fall.Fall_ID });
            if (exists) continue;

            alertsToInsert.push({
                Alert_ID: nextAlertId++,
                Heart_Rate_ID: null,
                SpO2_ID: null,
                Temperature_ID: null,
                Fall_ID: fall.Fall_ID,
                Patient_ID: fall.Patient_ID,
                Alert_Type: 'Body Fall Detection',
                Current_Value: null,
                Fall_Direction: fall.Fall_Direction,
                Normal_Range: 'N/A',
                dateTime: fall.dateTime,
                displayDateTime: fall.displayDateTime,
                Alert_Status: 'Critical',
            });

            await sendAlertEmail(fall.Patient_ID, `Body Fall Detection`, null, 'N/A', 'Critical', fall.Fall_Direction);
        }

        // Insert Alerts
        if (alertsToInsert.length > 0) {
            await Alert.insertMany(alertsToInsert);
            console.log(`Inserted ${alertsToInsert.length} alerts for patient ${patientId}`);
            return true;
        } else {
            console.log(`No new alerts to insert for patient ${patientId}`);
            return false;
        }
    } catch (error) {
        console.error('Error generating alerts:', error);
        return false;
    }
}

// Generate alerts for all patients
async function generateAlertsForAllPatients() {
    try {
        const patientIds = await HeartRate.distinct('Patient_ID');
        let totalPatientsWithAlerts = 0;

        for (const id of patientIds) {
            const inserted = await generateAlertsForPatient(id);
            if (inserted) totalPatientsWithAlerts++;
        }

        if (totalPatientsWithAlerts > 0) {
            console.log(`✅ Generated alerts for ${totalPatientsWithAlerts} patients.`);
        } else {
            console.log('✅ No alert-worthy health data found at startup.');
        }
    } catch (error) {
        console.error('Error generating alerts for all patients:', error);
    }
}

module.exports = { generateAlertsForPatient, generateAlertsForAllPatients };
