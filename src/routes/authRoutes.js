const express = require('express');
const bcrypt = require('bcrypt');
const { Patient, Admin } = require('../config');

const router = express.Router();

// GET Sign In page
router.get('/', (req, res) => {
    const message = req.query.message;
    let successMessage = '';
    if (message === 'password-reset-success') {
        successMessage = 'Password reset successfully! Please log in.';
    }
    res.render('SignInPage/signIn', { successMessage });
});

// GET Register page
router.get('/register', (req, res) => {
    res.render('RegisterPage/register');
});

// POST Register (for patients only)
router.post('/register', async (req, res) => {
    try {
        const {
            First_Name, Last_Name, Age, Date_Of_Birth, Email,
            Phone_Number, Gender, Address, Username, Password
        } = req.body;

        if (!First_Name || !Last_Name || !Age || !Date_Of_Birth || !Email || !Phone_Number || !Gender || !Address || !Username || !Password) {
            return res.render('RegisterPage/register', { error: "All fields are required" });
        }

        let existingUser = await Patient.findOne({ $or: [{ Email }, { Username }] });
        if (existingUser) {
            return res.render('RegisterPage/register', { error: "Email or Username already registered" });
        }

        const lastPatient = await Patient.findOne({}, {}, { sort: { 'Patient_ID': -1 } });
        const newPatientID = lastPatient ? lastPatient.Patient_ID + 1 : 1000;

        const hashedPassword = await bcrypt.hash(Password, 10);

        const newPatient = new Patient({
            Patient_ID: newPatientID,
            First_Name,
            Last_Name,
            Age: parseInt(Age),
            Date_Of_Birth,
            Email,
            Phone_Number,
            Gender,
            Address,
            Username,
            Password: hashedPassword
        });
        await newPatient.save();

        console.log(`✅ Patient registered: ${Username} (ID: ${newPatientID})`);
        res.redirect('/');
    } 
    catch (error) {
        console.error("❌ Error registering patient:", error);
        res.render('RegisterPage/register', { error: "An error occurred during registration. Please try again." });
    }
});

// POST Sign In (for both admin and patient)
router.post('/SignInPage/signIn', async (req, res) => {
    try {
        const { Username, Password, role } = req.body;

        if (!Username || !Password || !role || role === 'Select a Role...') {
            return res.render('SignInPage/signIn', { error: "All fields are required, including selecting a role." });
        }

        console.log(`🔐 Sign-in attempt | Username: ${Username} | Role: ${role}`);

        let user;
        if (role === 'admin') {
            user = await Admin.findOne({ username: Username });
        } 
        else if (role === 'patient') {
            user = await Patient.findOne({ Username: Username });
        } 
        else {
            return res.render('SignInPage/signIn', { error: "Invalid role selected" });
        }

        if (!user) {
            console.log(`❌ Sign-in failed: User not found for username: ${Username}`);
            return res.render('SignInPage/signIn', { error: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(Password, user.Password || user.password);
        if (!isMatch) {
            console.log(`❌ Sign-in failed: Incorrect password for user: ${Username}`);
            return res.render('SignInPage/signIn', { error: "Invalid username or password" });
        }

        // Set session
        req.session.user = {
            id: role === 'admin' ? user.adminID : user.Patient_ID,
            role: role
        };

        console.log(`✅ Sign-in successful | Username: ${Username} | Role: ${role}`);

        // Redirect based on role (no query params)
        return res.redirect(role === 'admin' ? '/adminDashboard' : '/patientDashboard');
    } 
    catch (error) {
        console.error("❌ Error during sign-in:", error);
        return res.render('SignInPage/signIn', { error: "An error occurred during sign-in. Please try again." });
    }
});

// GET Logout
router.get('/auth/logout', (req, res) => {
    if (req.session && req.session.user) {
        console.log(`👋 Logging out user: ID ${req.session.user.id} | Role: ${req.session.user.role}`);
    }

    req.session.destroy(err => {
        if (err) {
            console.error('❌ Logout error:', err);
            return res.send("Logout failed");
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

module.exports = router;

