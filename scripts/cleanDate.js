// const mongoose = require('mongoose');
// const dayjs = require('dayjs');
// const Patient = require('../config'); // Adjust to your schema

// mongoose.connect('mongodb://localhost:27017/HealthMonitoringSystemDB');

// function removeOrdinalSuffix(dateStr) {
//   return dateStr.replace(/(\d{1,2})(st|nd|rd|th)/, '$1');
// }

// (async () => {
//   const patients = await Patient.find({});

//   for (const p of patients) {
//     const rawDate = p.datetime;
//     const cleanedDate = removeOrdinalSuffix(rawDate);

//     // Optional: reformat it back to your target format without suffixes
//     const parsed = dayjs(cleanedDate, "dddd, D MMMM YYYY h:mm A", true);
//     if (parsed.isValid()) {
//       p.datetime = parsed.format("dddd, D MMMM YYYY h:mm A");
//       await p.save();
//       console.log(`Updated Patient ID ${p.Patient_ID}`);
//     } else {
//       console.log(`Invalid date for Patient ID ${p.Patient_ID}: ${rawDate}`);
//     }
//   }

//   mongoose.connection.close();
// })();
