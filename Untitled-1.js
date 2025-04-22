// Patient Dashboard (GET)
// router.get('/patientDashboard', requireLogin('patient'), async (req, res) => {
//     try {
//         const patientId = req.session.user.id;
//         const message = req.query.message;

//         const [
//             patientData,
//             messageCount,
//             complianceCount,
//             improvementCount,
//             latestHeartRate,
//             latestTemperature,
//             latestSpO2,
//             latestFallDetection
//         ] = await Promise.all([
//             Patient.findOne({ Patient_ID: patientId }).lean(),
//             Message.countDocuments({ Patient_ID: patientId }),
//             Compliance.countDocuments({ Patient_ID: patientId }),
//             Improvement.countDocuments({ Patient_ID: patientId }),
//             HeartRate.findOne({ Patient_ID: patientId }).sort({ Date_Time: -1 }).lean(),
//             BodyTemperature.findOne({ Patient_ID: patientId }).sort({ Date_Time: -1 }).lean(),
//             SpO2.findOne({ Patient_ID: patientId }).sort({ Date_Time: -1 }).lean(),
//             FallDetection.findOne({ Patient_ID: patientId }).sort({ Date_Time: -1 }).lean()
//         ]);

//         if (!patientData) {
//             console.error(`❌ ERROR: Patient data not found in DB for logged-in patient ID: ${patientId}`);
//             req.session.destroy(err => {
//                 if (err) console.error("Error destroying session for missing patient:", err);
//                 return res.redirect('/?message=session_error');
//             });
//             return;
//         }

//         res.render('PatientDashboard/patientDashboard', {
//             title: 'Patient Dashboard',
//             patient: patientData,
//             patientData: patientData,
//             messageCount: messageCount,
//             complianceCount: complianceCount,
//             improvementCount: improvementCount,
//             message: message,
//             healthStats: {
//                 heartRate: latestHeartRate,
//                 temperature: latestTemperature,
//                 spO2: latestSpO2,
//                 fallDetection: latestFallDetection
//             }
//         });

//     } catch (error) {
//         console.error(`❌ Error fetching patient data or counts for dashboard (ID: ${req.session.user?.id}):`, error);
//         res.status(500).render('Errors/500', {
//             title: 'Server Error',
//             errorMsg: "An error occurred while loading your dashboard."
//         });
//     }
// });