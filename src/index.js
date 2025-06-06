const express = require('express');
const path = require('path');
const session = require('express-session');
const { Patient, Admin } = require('./config');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const patientActionsRoutes = require('./routes/patientActionsRoutes'); 
const adminActionsRoutes = require('./routes/adminActionsRoutes');
const healthDataRoutes = require('./routes/healthDataRoutes'); 
const analyticsRoutes = require('./routes/analyticsRoutes');
const patientAlertRoutes = require('./routes/patientAlertRoutes'); 
const uploadRoutes = require('./routes/uploadRoutes');

// Import alert generator
const { generateAlertsForAllPatients } = require('../utils/alertGenerator'); 

const app = express();

//  Express-session middleware setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'a_default_secret_key_for_development',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
       }
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static Files
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'src')));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

// Verify transporter configuration on startup.
transporter.verify(function (error, success) {
    if (error) {
        console.error("[Health Montoring System] Nodemailer configuration error:", error);
    } else {
        console.log("[Health Montoring System] Nodemailer is ready to send emails");
    }
});

// In-memory OTP Store
const otpStore = new Map();

// Routes Mounting
app.use('/', authRoutes);
app.use('/', passwordResetRoutes(transporter, otpStore));
app.use('/', dashboardRoutes);
app.use('/', patientActionsRoutes);
app.use('/admin', adminActionsRoutes);
app.use('/health', healthDataRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/alerts', patientAlertRoutes);
app.use('/image', uploadRoutes);


// Server Start
const port = process.env.PORT || 3000;
app.listen(port, async  () => {
    console.log(`[Health Montoring System] Server running on Port: ${port}`);
    console.log(`[Health Montoring System] Access application at: http://localhost:${port}`);

    // Run alert generation on startup
    try {
        await generateAlertsForAllPatients();
        console.log("[Health Montoring System] Initial alert check completed.");
    } catch (err) {
        console.error("[Health Montoring System] Error during alert generation at startup:", err);
    }
});