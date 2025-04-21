const express = require('express');
const router = express.Router();
const { HeartRate } = require('../config');
const dayjs = require('dayjs');

// Helper function to determine heart rate status
const getHeartRateStatus = (rate) => {
    if (rate < 60) return 'Low';
    if (rate > 100) return 'High';
    return 'Normal';
};

// Get heart rate data for analytics
router.get('/heart-rate/:patientId', async (req, res) => {
    try {
        const patientId = parseInt(req.params.patientId);
        
        // Get heart rate data for the patient
        const heartRates = await HeartRate.find({ Patient_ID: patientId })
            .sort({ Date_Time: 1 })
            .limit(30);
        
        // Format data for charts
        const lineChartData = heartRates.map(reading => ({
            date: dayjs(reading.Date_Time).format('MMM D, h:mm A'),
            rate: reading.Current_Heart_Rate,
            status: reading.Status || getHeartRateStatus(reading.Current_Heart_Rate)
        }));
        
        // Calculate status distribution for pie chart
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
        
        // Sort the pie chart data to ensure consistent order: Normal, Low, High
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

module.exports = router;