const express = require('express');
const bcrypt = require('bcrypt');
const collection = require('../config');

const router = express.Router();

// GET route for the Sign In page (root)
router.get('/', (req, res) => {
    const message = req.query.message;
    let successMessage = '';
    if (message === 'password-reset-success') {
        successMessage = 'Password reset successfully! Please log in.';
    }
    res.render('SignInPage/signIn', { successMessage });
});

// GET route for the Register page
router.get('/register', (req, res) => {
    res.render('RegisterPage/register');
});

// POST route for User Registration
router.post('/register', async (req, res) => {
    try {
        const { First_Name, Last_Name, Age, Date_Of_Birth, Email, Phone_Number, Gender, Address, Username, Password } = req.body;

        if (!First_Name || !Last_Name || !Age || !Date_Of_Birth || !Email || !Phone_Number || !Gender || !Address || !Username || !Password) {
             return res.render('RegisterPage/register', { error: "All fields are required" });
        }

        let existingUser = await collection.findOne({ $or: [{ Email }, { Username }] });
        if (existingUser) {
            return res.render('RegisterPage/register', { error: "Email or Username already registered" });
        }

        const lastPatient = await collection.findOne({}, {}, { sort: { 'Patient_ID': -1 } });
        const newPatientID = lastPatient ? lastPatient.Patient_ID + 1 : 1000;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Password, saltRounds);

        const newPatient = new collection({
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
        res.redirect('/');

    } catch (error) {
        console.error("Error registering patient:", error);
        res.render('RegisterPage/register', { error: "An error occurred during registration. Please try again." });
    }
});

// POST route for User Sign In
router.post('/SignInPage/signIn', async (req, res) => {
    try {
        const { Username, Password } = req.body;

        if (!Username || !Password) {
            return res.render('SignInPage/signIn', { error: "Username and Password are required" });
        }

        console.log("Sign-in attempt with Username:", Username);
        const user = await collection.findOne({ Username: Username });

        if (!user) {
            return res.render('SignInPage/signIn', { error: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(Password, user.Password);

        if (isMatch) {
            return res.redirect(`/dashboard?patientId=${user.Patient_ID}`);
        } else {
            return res.render('SignInPage/signIn', { error: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.render('SignInPage/signIn', { error: "An error occurred during sign-in. Please try again." });
    }
});

module.exports = router;