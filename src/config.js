const mongoose = require('mongoose');
const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');
const weekday = require('dayjs/plugin/weekday');

dayjs.extend(advancedFormat);
dayjs.extend(weekday);

// Connect to MongoDB
const connect = mongoose.connect("mongodb://localhost:27017/HealthMonitoringSystemDB");

connect.then(() => {
    console.log('Connected to MongoDB Successfully...');
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});

/* ====== Patient Schema ====== */
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
    Role: { type: String, default: 'Patient' },
    Enrollment_DateTime: { type: String } // Formatted string
});

// Pre-save hook for Patient ID and Enrollment DateTime
PatientSchema.pre('save', async function (next) {
    if (!this.Patient_ID) {
        const lastPatient = await Patient.findOne({}, {}, { sort: { 'Patient_ID': -1 } });
        this.Patient_ID = lastPatient ? lastPatient.Patient_ID + 1 : 1000;
    }

    if (!this.Enrollment_DateTime) {
        this.Enrollment_DateTime = dayjs().format('dddd, Do MMMM YYYY h:mm A');
    }

    next();
});

const Patient = mongoose.model("patients", PatientSchema);

/* ====== Admin Schema ====== */
const AdminSchema = new mongoose.Schema({
    adminID: { type: Number, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' }
});

const Admin = mongoose.model("admins", AdminSchema);

/* ====== Export Both ====== */
module.exports = { Patient, Admin };
