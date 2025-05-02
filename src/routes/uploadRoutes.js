const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Admin, Patient } = require('../config');

const router = express.Router();

// Ensure upload directory exists
const adminUploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'admins');

const patientUploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'patients');

if (!fs.existsSync(adminUploadDir)) {
    fs.mkdirSync(adminUploadDir, { recursive: true });
}

// Create directory if not exists
if (!fs.existsSync(patientUploadDir)) {
    fs.mkdirSync(patientUploadDir, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, adminUploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const adminId = req.session.user?.id;
        if (!adminId) {
            return cb(new Error('Admin session not found'), null);
        }
        cb(null, `admin_${adminId}${ext}`);
    }
});

// Multer storage for patients
const patientStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, patientUploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const patientId = req.session.user?.id;
        if (!patientId) {
            return cb(new Error('Patient session not found'), null);
        }
        cb(null, `patient_${patientId}${ext}`);
    }
});

const upload = multer({ storage });

const patientUpload = multer({ storage: patientStorage });

// Upload Profile Route
router.post('/upload-profile', upload.single('profileImage'), async (req, res) => {
    const adminId = req.session.user?.id;

    console.log("SESSION USER:", req.session.user);
    console.log("RECEIVED FILE:", req.file);  

    if (!adminId || !req.file) {
        console.log("Admin ID not found in session");
        return res.status(400).json({ success: false, message: 'Missing admin session or file.' });
    }
    if (!req.file) {
        console.log("File not received");
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
        const imagePath = `/uploads/admins/${req.file.filename}`;

        const updated = await Admin.findOneAndUpdate(
            { adminID: parseInt(adminId) },
            { profileImage: imagePath },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Admin not found.' });
        }

        return res.status(200).json({ success: true, imagePath });
    } catch (error) {
        console.error('❌ Error during admin image upload:', error);
        return res.status(500).json({ success: false, message: 'Server error while uploading image.' });
    }
});

// DELETE Profile Image Route
router.delete('/delete-profile', async (req, res) => {
    const adminId = req.session.user?.id;
    if (!adminId) {
        return res.status(400).json({ success: false, message: 'Admin not logged in' });
    }

    try {
        const admin = await Admin.findOne({ adminID: parseInt(adminId) });
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        const imagePath = path.join(adminUploadDir, `admin_${adminId}.png`);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // delete file
        }

        // Reset profileImage to default (null or default path)
        admin.profileImage = null;
        await admin.save();

        res.status(200).json({ success: true, message: 'Profile image deleted', defaultImage: '/image/admin.png' });
    } catch (error) {
        console.error('Error deleting profile image:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting image.' });
    }
});


// Upload Profile Route for Patient
router.post('/upload-patient-profile', patientUpload.single('profileImage'), async (req, res) => {
    const patientId = req.session.user?.id;

    if (!patientId || !req.file) {
        return res.status(400).json({ success: false, message: 'Missing patient session or file.' });
    }

    try {
        const imagePath = `/uploads/patients/${req.file.filename}`;

        const updated = await Patient.findOneAndUpdate(
            { Patient_ID: parseInt(patientId) },
            { patientProfileImage: imagePath },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Patient not found.' });
        }

        return res.status(200).json({ success: true, imagePath });
    } catch (error) {
        console.error('❌ Error uploading patient image:', error);
        return res.status(500).json({ success: false, message: 'Server error while uploading image.' });
    }
});

// Delete Patient Profile Image
router.delete('/delete-patient-profile', async (req, res) => {
    const patientId = req.session.user?.id;
    if (!patientId) {
        return res.status(400).json({ success: false, message: 'Patient not logged in' });
    }

    try {
        const patient = await Patient.findOne({ Patient_ID: parseInt(patientId) });
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        const imagePath = path.join(patientUploadDir, `patient_${patientId}.png`);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        patient.Profile_Image = null;
        await patient.save();

        res.status(200).json({ success: true, message: 'Profile image deleted', defaultImage: '/image/patient.png' });
    } catch (error) {
        console.error('Error deleting patient profile image:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting image.' });
    }
});

module.exports = router;
