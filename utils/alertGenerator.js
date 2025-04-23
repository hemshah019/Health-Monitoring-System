const { HeartRate, SpO2, BodyTemperature, FallDetection, Alert } = require('../src/config');

// Helper: Get next Alert_ID
async function getNextAlertId() {
    const lastAlert = await Alert.findOne({}, {}, { sort: { 'Alert_ID': -1 } });
    return lastAlert ? lastAlert.Alert_ID + 1 : 9000; 
}

// Generate alerts for a specific patient
async function generateAlertsForPatient(patientId) {
    try {
        const alertsToInsert = [];

        // Get the last Alert_ID once
        let nextAlertId = await getNextAlertId();

        // Heart Rate Alerts (Low or High)
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
        }

        // SpO2 Alerts (Low or High)
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
        }

        // Body Temperature Alerts (Low or High)
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
                Normal_Range: 'Fit Eg',
                dateTime: fall.dateTime,
                displayDateTime: fall.displayDateTime,
                Alert_Status: 'Critical',
            });
        }

        // Insert all alerts
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
