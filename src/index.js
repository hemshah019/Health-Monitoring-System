const express = require('express');
const path = require('path');
const collection = require('./config');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');


const app = express();

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
transporter.verify(function(error, success) {
  if (error) {
    console.error("Nodemailer configuration error:", error);
  } else {
    console.log("Nodemailer is ready to send emails");
  }
});

// In-memory OTP Store
const otpStore = new Map();

// Routes
app.use('/', authRoutes);
app.use('/', passwordResetRoutes(transporter, otpStore));
app.use('/', dashboardRoutes);

// Server Start 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
    console.log(`Access application at: http://localhost:${port}`);
});