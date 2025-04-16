const express = require('express');
const router = express.Router();
const { Message, Compliance, Improvement, Patient } = require('../config');
const dayjs = require('dayjs');

// Submit new message
router.post('/submit-message', async (req, res) => {
    try {
        console.log('Session Data:', req.session);
        const { messageType, messageContent, messageDate } = req.body;

        const patient = req.session.user;
        if (!patient || patient.role !== 'patient') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        const newMessage = new Message({
            Patient_ID: patient.id, 
            Message_Type: messageType,
            Message_Content: messageContent,
            Message_Sent_DateTime: dayjs(messageDate).format('dddd, Do MMMM YYYY h:mm A'),
            Status: 'Pending'
        });

        await newMessage.save();
        res.status(200).json({ success: true, message: 'Message saved successfully' });

    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Fetch all messages for the logged-in patient
router.get('/messages', async (req, res) => {
    try {
        console.log('Session Data:', req.session);
        const patient = req.session.user;

        if (!patient || patient.role !== 'patient') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        const messages = await Message.find({ Patient_ID: patient.id }).sort({ Message_ID: -1 });

        res.status(200).json(messages);

    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Submit new compliance
router.post('/submit-compliance', async (req, res) => {
    try {
        const { complianceType, complianceNotes, complianceDate } = req.body;
        const patient = req.session.user;

        if (!patient || patient.role !== 'patient') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        const newCompliance = new Compliance({
            Patient_ID: patient.id,
            Compliance_Type: complianceType,
            Compliance_Notes: complianceNotes,
            Compliance_Date: dayjs(complianceDate).format('dddd, Do MMMM YYYY h:mm A'),
            Status: 'Pending'
        });

        await newCompliance.save();
        res.status(200).json({ success: true, message: 'Compliance saved successfully' });
    } catch (error) {
        console.error('Error saving compliance:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Fetch all compliances for the logged-in patient
router.get('/compliances', async (req, res) => {
    try {
        const patient = req.session.user;

        if (!patient || patient.role !== 'patient') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        const compliances = await Compliance.find({ Patient_ID: patient.id }).sort({ Compliance_ID: -1 });
        res.status(200).json(compliances);
    } catch (error) {
        console.error('Error fetching compliances:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Submit new improvement
router.post('/submit-improvement', async (req, res) => {
    try {
        const { improvementCategory, improvementDescription, improvementDate } = req.body;
        const patient = req.session.user;

        if (!patient || patient.role !== 'patient') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        const newImprovement = new Improvement({
            Patient_ID: patient.id,
            Category: improvementCategory,
            Suggestion_Description: improvementDescription,
            Date_Submitted: dayjs(improvementDate).format('dddd, Do MMMM YYYY h:mm A'),
            Status: 'Pending'
        });

        await newImprovement.save();
        res.status(200).json({ success: true, message: 'Improvement submitted successfully' });
    } catch (error) {
        console.error('Error saving improvement:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Fetch all improvements for the logged-in patient
router.get('/improvements', async (req, res) => {
    try {
        const patient = req.session.user;

        if (!patient || patient.role !== 'patient') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        const improvements = await Improvement.find({ Patient_ID: patient.id }).sort({ Improvement_ID: -1 });
        res.status(200).json(improvements);
    } catch (error) {
        console.error('Error fetching improvements:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
