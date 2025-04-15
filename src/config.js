const mongoose = require('mongoose');

// Connect to the correct database
const connect = mongoose.connect("mongodb://localhost:27017/HealthMonitoringSystemDB");

connect.then(() => {
    console.log('Connected to MongoDB Successfully...');
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});

// Define the Patient schema with Role
const PatientSchema = new mongoose.Schema({
    Patient_ID: { type: Number, unique: true },
    First_Name: { type: String, required: true },
    Last_Name: { type: String, required: true },
    Age: { type: Number, required: true },
    Date_Of_Birth: { type: Date, required: true },
    Email: { type: String, required: true, unique: true },
    Phone_Number: { type: Number, required: true },
    Gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    Address: { type: String, required: true },
    Username: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Role: { type: String, default: 'Patient' }
});

// Auto-generate Patient_ID before saving
PatientSchema.pre('save', async function (next) {
    if (!this.Patient_ID) {
        const lastPatient = await Patient.findOne({}, {}, { sort: { 'Patient_ID': -1 } });
        this.Patient_ID = lastPatient ? lastPatient.Patient_ID + 1 : 1000;
    }
    next();
});

const Patient = mongoose.model("patients", PatientSchema);

module.exports = Patient;
