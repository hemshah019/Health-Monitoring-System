const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Admin } = require('../config');

const router = express.Router();

// Ensure upload directory exists
const adminUploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'admins');

if (!fs.existsSync(adminUploadDir)) {
    fs.mkdirSync(adminUploadDir, { recursive: true });
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

const upload = multer({ storage });

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


module.exports = router;
