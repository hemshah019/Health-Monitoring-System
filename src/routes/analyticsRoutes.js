const express = require('express');
const router = express.Router();
const { HeartRate, SpO2, BodyTemperature } = require('../config');
const dayjs = require('dayjs');

// Helper function to determine heart rate status
const getHeartRateStatus = (rate) => {
    if (rate < 60) return 'Low';
    if (rate > 100) return 'High';
    return 'Normal';
};

const getStatus = (value, type) => {
    if (type === 'SpO2') {
        if (value < 95) return 'Low';
        return 'Normal';
    } else if (type === 'Temperature') {
        if (value < 36.1) return 'Low';
        if (value > 37.2) return 'High';
        return 'Normal';
    }
};

// Heart Rate Analytics
router.get('/heart-rate/:patientId', async (req, res) => {
    try {
        const patientId = parseInt(req.params.patientId);
        const heartRates = await HeartRate.find({ Patient_ID: patientId }).limit(30);

        let lineChartData = heartRates.map(reading => {
            const date = reading.displayDateTime || 'No date';

            return {
                originalDate: new Date(reading.dateTime),
                date: dayjs(reading.dateTime).format('Do MMM h:mm A'),
                rate: reading.Current_Heart_Rate,
                status: reading.Status || getHeartRateStatus(reading.Current_Heart_Rate)
            };
        }).sort((a, b) => a.originalDate - b.originalDate);

        const statusCounts = heartRates.reduce((acc, reading) => {
            const status = reading.Status || getHeartRateStatus(reading.Current_Heart_Rate);
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        
        const pieChartData = Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count,
            percentage: Math.round((count / heartRates.length) * 100)
        }));
        
        pieChartData.sort((a, b) => {
            const order = { 'Normal': 1, 'Low': 2, 'High': 3 };
            return order[a.status] - order[b.status];
        });
        
        res.json({
            success: true,
            lineChartData,
            pieChartData,
            averageHeartRate: heartRates.length > 0 
                ? Math.round(heartRates.reduce((sum, reading) => sum + reading.Current_Heart_Rate, 0) / heartRates.length)
                : 0
        });
        
    } catch (error) {
        console.error('Error fetching heart rate analytics:', error);
        res.status(500).json({ success: false, message: 'Error fetching heart rate data' });
    }
});


// SpO2 Analytics
router.get('/spo2/:patientId', async (req, res) => {
    try {
        const patientId = parseInt(req.params.patientId);
        const readings = await SpO2.find({ Patient_ID: patientId }).limit(30);

        let lineChartData = readings.map(reading => {
            const date = reading.displayDateTime || 'No date';
            return {
                originalDate: new Date(reading.dateTime),
                date: dayjs(reading.dateTime).format('Do MMM h:mm A'),
                value: reading.Current_SpO2,
                status: reading.Status || getStatus(reading.Current_SpO2, 'SpO2')
            };
        }).sort((a, b) => a.originalDate - b.originalDate);

        const pieCounts = readings.reduce((acc, r) => {
            const status = r.Status || getStatus(r.Current_SpO2, 'SpO2');
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        const pieChartData = Object.entries(pieCounts).map(([status, count]) => ({
            status,
            count,
            percentage: Math.round((count / readings.length) * 100)
        }));

        res.json({
            success: true,
            lineChartData: lineChartData.map(({ date, value, status }) => ({ date, value, status })),
            pieChartData,
            averageSpO2: readings.length
                ? Math.round(readings.reduce((sum, r) => sum + r.Current_SpO2, 0) / readings.length)
                : 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to load SpO2 data' });
    }
});

// Temperature Analytics
router.get('/temperature/:patientId', async (req, res) => {
    try {
        const patientId = parseInt(req.params.patientId);
        const readings = await BodyTemperature.find({ Patient_ID: patientId }).limit(30);

        let lineChartData = readings.map(reading => {
            const date = reading.displayDateTime || 'No date';
            return {
                originalDate: new Date(reading.dateTime),
                date: dayjs(reading.dateTime).format('Do MMM h:mm A'),
                value: reading.Current_Temperature,
                status: reading.Status || getStatus(reading.Current_Temperature, 'Temperature')
            };
        }).sort((a, b) => a.originalDate - b.originalDate);

        const pieCounts = readings.reduce((acc, r) => {
            const status = r.Status || getStatus(r.Current_Temperature, 'Temperature');
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        const pieChartData = Object.entries(pieCounts).map(([status, count]) => ({
            status,
            count,
            percentage: Math.round((count / readings.length) * 100)
        }));

        res.json({
            success: true,
            lineChartData: lineChartData.map(({ date, value, status }) => ({ date, value, status })),
            pieChartData,
            averageTemperature: readings.length
                ? (readings.reduce((sum, r) => sum + r.Current_Temperature, 0) / readings.length).toFixed(1)
                : 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to load temperature data' });
    }
});

module.exports = router;