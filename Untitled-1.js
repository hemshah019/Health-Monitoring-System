router.get('/heart-rate', isPatientAuthenticated, async (req, res) => {
    try {
        const patientId = req.patientId;
        console.log(`Fetching heart rate data for patient ID: ${patientId}`);
        
        // Log the query we're about to run
        console.log(`Running query: HeartRate.find({ Patient_ID: ${patientId} })`);
        
        const heartRateData = await HeartRate.find({ Patient_ID: patientId })
        .sort({ Heart_Rate_ID: -1 });

        console.log(`Found ${heartRateData.length} heart rate records`);
        
        // Log the first result if available
        if (heartRateData.length > 0) {
            console.log('First record:', JSON.stringify(heartRateData[0]));
        } else {
            console.log('No records found in database for this patient');
        }
        
        res.status(200).json(heartRateData);

    } catch (error) {
        console.error("Error fetching heart rate data:", error);
        res.status(500).json({ message: 'Failed to fetch heart rate data', error: error.message });
    }
});