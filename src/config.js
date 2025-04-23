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
    Phone_Number: { type: String, required: true },
    Gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    Address: { type: String, required: true },
    Username: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Role: { type: String, default: 'Patient' },
    Enrollment_DateTime: { type: String },
    Enrollment_Date: { type: Date }
});

// Pre-save hook for Patient ID and Enrollment DateTime
PatientSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastPatient = await Patient.findOne({}, {}, { sort: { 'Patient_ID': -1 } });
        this.Patient_ID = lastPatient ? lastPatient.Patient_ID + 1 : 1000; 

        const now = new Date();
        this.Enrollment_DateTime = dayjs(now).format('dddd, D MMMM YYYY h:mm A');
        this.Enrollment_Date = now;
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
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' }
});

// Pre-save hook for Admin ID (optional, but good practice)
AdminSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastAdmin = await Admin.findOne({}, {}, { sort: { 'adminID': -1 } });
        this.adminID = lastAdmin ? lastAdmin.adminID + 1 : 2000;
    }
    next();
});

const Admin = mongoose.model("admins", AdminSchema);

/* ====== Message Schema ====== */
const MessageSchema = new mongoose.Schema({
    Message_ID: { type: Number, unique: true },
    Patient_ID: { type: Number, required: true, index: true },
    Message_Type: { type: String, required: true },
    Message_Content: { type: String, required: true },
    Message_Sent_DateTime: { type: String },
    Status: { type: String, required: true, enum: ['Pending', 'Resolved', 'Viewed'], default: 'Pending' },
    Admin_Response: { type: String, default: null },
    Response_Date: { type: Date, default: null }
});

// Pre-save hook for auto-incrementing Message_ID
MessageSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastMessage = await Message.findOne({}, {}, { sort: { 'Message_ID': -1 } });
        this.Message_ID = lastMessage ? lastMessage.Message_ID + 1 : 2000;

        if (!this.Message_Sent_DateTime) {
            this.Message_Sent_DateTime = dayjs().format('dddd, Do MMMM YYYY h:mm A');
        }
    }
    next();
});

const Message = mongoose.model("messages", MessageSchema);


/* ====== Compliance Schema ====== */
const ComplianceSchema = new mongoose.Schema({
    Compliance_ID: { type: Number, unique: true },
    Patient_ID: { type: Number, required: true, index: true },
    Compliance_Type: { type: String, required: true },
    Compliance_Notes: { type: String, required: true },
    Compliance_Date: { type: String },
    Status: { type: String, required: true, enum: ['Pending', 'Reviewed', 'Action Required'], default: 'Pending' },
    Admin_Feedback: { type: String, default: null },
    Feedback_Date: { type: Date, default: null }
});

// Pre-save hook for auto-incrementing Compliance_ID
ComplianceSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastCompliance = await Compliance.findOne({}, {}, { sort: { 'Compliance_ID': -1 } });
        this.Compliance_ID = lastCompliance ? lastCompliance.Compliance_ID + 1 : 3000;

        if (!this.Compliance_Date) {
            this.Compliance_Date = dayjs().format('dddd, Do MMMM YYYY h:mm A');
        }
    }
    next();
});

const Compliance = mongoose.model("compliances", ComplianceSchema);


/* ====== Improvement Schema ====== */
const ImprovementSchema = new mongoose.Schema({
    Improvement_ID: { type: Number, unique: true },
    Patient_ID: { type: Number, required: true, index: true },
    Category: { type: String, required: true },
    Suggestion_Description: { type: String, required: true },
    Date_Submitted: { type: String },
    Status: { type: String, required: true, enum: ['Pending', 'Under Review', 'Implemented', 'Rejected'], default: 'Pending' },
    Admin_Response: { type: String, default: null },
    Implementation_Date: { type: Date, default: null }
});

// Pre-save hook for auto-incrementing Improvement_ID
ImprovementSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastImprovement = await Improvement.findOne({}, {}, { sort: { 'Improvement_ID': -1 } });
        this.Improvement_ID = lastImprovement ? lastImprovement.Improvement_ID + 1 : 4000;

        if (!this.Date_Submitted) {
            this.Date_Submitted = dayjs().format('dddd, Do MMMM YYYY h:mm A');
        }
    }
    next();
});

const Improvement = mongoose.model("improvements", ImprovementSchema);


/* ====== Heart Rate Schema ====== */
const HeartRateSchema = new mongoose.Schema({
    Heart_Rate_ID: { type: Number, unique: true },
    Patient_ID: { type: Number, required: true, index: true }, 
    Current_Heart_Rate: { type: Number, required: true }, 
    Average_Heart_Rate: { type: Number, required: true }, 
    Normal_Heart_Rate: { type: String, required: true },
    dateTime: { type: Date },
    displayDateTime: { type: String },
    Status: { type: String, required: true }
});

// Pre-save hook for Heart Rate ID and DateTime
HeartRateSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastHeartRate = await this.constructor.findOne({}, {}, { sort: { 'Heart_Rate_ID': -1 } });
        this.Heart_Rate_ID = lastHeartRate ? lastHeartRate.Heart_Rate_ID + 1 : 5000;

        const now = new Date();
        this.dateTime = now;
        this.displayDateTime = dayjs(now).format('dddd, Do MMMM YYYY h:mm A');
    }
    next();
});

const HeartRate = mongoose.model("heart_rates", HeartRateSchema);


/* ====== SpO2 (Oxygen Saturation) Schema ====== */
const SpO2Schema = new mongoose.Schema({
    SpO2_ID: { type: Number, unique: true },
    Patient_ID: { type: Number, required: true, index: true }, 
    Current_SpO2: { type: Number, required: true },
    Average_SpO2: { type: Number, required: true }, 
    Normal_SpO2: { type: String, required: true },
    dateTime: { type: Date }, 
    displayDateTime: { type: String },
    Status: { type: String, required: true }
});

// Pre-save hook for SpO2 ID and DateTime
SpO2Schema.pre('save', async function (next) {
    if (this.isNew) {
        const lastSpO2 = await this.constructor.findOne({}, {}, { sort: { 'SpO2_ID': -1 } });
        this.SpO2_ID = lastSpO2 ? lastSpO2.SpO2_ID + 1 : 6000;

        const now = new Date();
        this.dateTime = now;
        this.displayDateTime = dayjs(now).format('dddd, Do MMMM YYYY h:mm A');
    }
    next();
});

const SpO2 = mongoose.model("spo2", SpO2Schema);


/* ====== Body Temperature Schema ====== */
const BodyTemperatureSchema = new mongoose.Schema({
    Temperature_ID: { type: Number, unique: true },
    Patient_ID: { type: Number, required: true, index: true },
    Current_Temperature: { type: Number, required: true },
    Average_Temperature: { type: Number, required: true },
    Normal_Temperature: { type: String, required: true },
    dateTime: { type: Date }, 
    displayDateTime: { type: String }, 
    Status: { type: String, required: true } 
});

// Pre-save hook for Temperature ID and DateTime
BodyTemperatureSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastTemperature = await this.constructor.findOne({}, {}, { sort: { 'Temperature_ID': -1 } });
        this.Temperature_ID = lastTemperature ? lastTemperature.Temperature_ID + 1 : 7000;

        const now = new Date();
        this.dateTime = now;
        this.displayDateTime = dayjs(now).format('dddd, Do MMMM YYYY h:mm A');
    }
    next();
});

const BodyTemperature = mongoose.model("body_temperatures", BodyTemperatureSchema);


/* ====== Fall Detection Schema ====== */
const FallDetectionSchema = new mongoose.Schema({
    Fall_ID: { type: Number, unique: true },
    Patient_ID: { type: Number, required: true, index: true },
    Fall_Detected: { type: String, required: true, enum: ['Yes'] },
    Fall_Direction: { type: String, required: true, enum : ['Forward Fall', 'Backward Fall', 'Left Side Fall', 'Right Side Fall']},
    dateTime: { type: Date },
    displayDateTime: { type: String }
});

// Pre-save hook for auto-incrementing Fall_ID and setting Date_Time
FallDetectionSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastFall = await FallDetection.findOne({}, {}, { sort: { 'Fall_ID': -1 } });
        this.Fall_ID = lastFall ? lastFall.Fall_ID + 1 : 8000;

        const now = new Date();
        this.dateTime = now;
        this.displayDateTime = dayjs(now).format('dddd, Do MMMM YYYY h:mm A');
    }
    next();
});

const FallDetection = mongoose.model("body_fall_detections", FallDetectionSchema);


/* ====== Alert Schema ====== */
const AlertSchema = new mongoose.Schema({
    Alert_ID: { type: Number, unique: true },
    Heart_Rate_ID: { type: Number, required: false, index: true, default: null },  
    SpO2_ID: { type: Number, required: false, index: true, default: null },        
    Temperature_ID: { type: Number, required: false, index: true, default: null }, 
    Fall_ID: { type: Number, required: false, index: true, default: null },        
    Patient_ID: { type: Number, required: true, index: true },
    Alert_Type: { type: String, required: true, enum: ['Heart Rate', 'Body Temperature', 'Oxygen Saturation (SpO2)', 'Body Fall Detection'] },
    Current_Value: { type: Number, required: false, default: null }, 
    Fall_Direction: { type: String, required: false, default: null },
    Normal_Range: { type: String, required: true },
    dateTime: { type: Date },
    displayDateTime: { type: String },
    Alert_Status: { type: String, required: true, enum: ['Medium', 'Critical', 'High', 'Low'] },
    Task_Assigned: { type: String, default: 'No' },
    Admin_Response: { type: String, default: null },
    Response_Date: { type: Date, default: null }
});

// Pre-save hook for auto-incrementing Alert_ID and setting Alert_DateTime
AlertSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastAlert = await Alert.findOne({}, {}, { sort: { 'Alert_ID': -1 } });
        this.Alert_ID = lastAlert ? lastAlert.Alert_ID + 1 : 9000;

        const now = new Date();
        this.dateTime = now;
        this.displayDateTime = dayjs(now).format('dddd, Do MMMM YYYY h:mm A');
    }
    next();
});

const Alert = mongoose.model("alerts", AlertSchema);


/* ====== Export All Models ====== */
module.exports = {
    Patient,
    Admin,
    Message,
    Compliance,
    Improvement,
    HeartRate,      
    SpO2,          
    BodyTemperature,
    FallDetection,
    Alert
};