const express = require('express');
const router = express.Router();
const { Message, Compliance, Improvement, Task, Alert, Patient } = require('../config');
const dayjs = require('dayjs');

// Middleware to ensure the role is an patients
const ensurePatient = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'patient') {
        console.warn('Unauthorized access attempt to patient action.');
        return res.status(403).json({ success: false, message: 'Unauthorized access. Please log in as a patient.' });
    }
    if (!req.session.user.id) {
        console.error('Session is missing user ID.');
        return res.status(401).json({ success: false, message: 'Authentication error. Please log in again.' });
    }
    req.patientId = req.session.user.id;
    next();
};


// Message Action
// Submit New Message
router.post('/submit-message', async (req, res) => {
    try {
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

// Fetch Messages
router.get('/messages', async (req, res) => {
    try {
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

// View Message
router.get('/messages/:id', ensurePatient, async (req, res) => {
    try {
        const patientId = req.patientId;
        const messageId = parseInt(req.params.id, 10); 

        if (isNaN(messageId)) {
             return res.status(400).json({ success: false, message: 'Invalid message ID format.' });
        }

        const message = await Message.findOne({
            Message_ID: messageId,
            Patient_ID: patientId
        }).lean();

        if (!message) {
            console.warn(`Message not found or access denied for ID: ${messageId}, Patient_ID: ${patientId}`);
            return res.status(404).json({ success: false, message: 'Message not found or you do not have permission to view it.' });
        }

        res.status(200).json(message);

    } catch (error) {
        console.error(`Error fetching single message ID ${req.params.id} for Patient_ID ${req.patientId}:`, error);
        res.status(500).json({ success: false, message: 'Server error while fetching message details.' });
    }
});

// Delete Messages
router.delete('/messages/:id', ensurePatient, async (req, res) => {
    try {
        const patientId = req.patientId;
        const messageId = parseInt(req.params.id, 10);

         if (isNaN(messageId)) {
             return res.status(400).json({ success: false, message: 'Invalid message ID format.' });
        }

        const result = await Message.findOneAndDelete({
            Message_ID: messageId,
            Patient_ID: patientId
        });

        if (!result) {
            console.warn(`Message not found or access denied for deletion. ID: ${messageId}, Patient_ID: ${patientId}`);
            return res.status(404).json({ success: false, message: 'Message not found or you do not have permission to delete it.' });
        }

        res.status(200).json({ success: true, message: 'Message deleted successfully.' });

    } catch (error) {
        console.error(`Error deleting message ID ${req.params.id} for Patient_ID ${req.patientId}:`, error);
        res.status(500).json({ success: false, message: 'Server error while deleting message.' });
    }
});


// Compliances Action
// Submit New Compliances
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

// Fetch Compliances
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

// View Compliances
router.get('/compliances/:id', ensurePatient, async (req, res) => {
    try {
        const patientId = req.patientId;
        const complianceId = parseInt(req.params.id, 10);

        if (isNaN(complianceId)) {
            return res.status(400).json({ success: false, message: 'Invalid compliance ID format.' });
        }

        console.log(`Fetching Compliance ID: ${complianceId} for Patient_ID: ${patientId}`);

        const compliance = await Compliance.findOne({
            Compliance_ID: complianceId,
            Patient_ID: patientId
        }).lean();

        if (!compliance) {
            return res.status(404).json({ success: false, message: 'Compliance not found or unauthorized access.' });
        }

        res.status(200).json(compliance);
    } catch (error) {
        console.error(`Error fetching compliance ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while fetching compliance.' });
    }
});

// Delete Compliances
router.delete('/compliances/:id', ensurePatient, async (req, res) => {
    try {
        const patientId = req.patientId;
        const complianceId = parseInt(req.params.id, 10);

        if (isNaN(complianceId)) {
            return res.status(400).json({ success: false, message: 'Invalid compliance ID format.' });
        }

        const result = await Compliance.findOneAndDelete({
            Compliance_ID: complianceId,
            Patient_ID: patientId
        });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Compliance not found or unauthorized deletion.' });
        }

        res.status(200).json({ success: true, message: 'Compliance deleted successfully.' });
    } catch (error) {
        console.error(`Error deleting compliance ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while deleting compliance.' });
    }
});


// Impropement Action 
// Submit New Improvement
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

// Fetch Improvements
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

// View Improvements
router.get('/improvements/:id', ensurePatient, async (req, res) => {
    try {
        const patientId = req.patientId;
        const improvementId = parseInt(req.params.id, 10);

        if (isNaN(improvementId)) {
            return res.status(400).json({ success: false, message: 'Invalid improvement ID format.' });
        }

        const improvement = await Improvement.findOne({
            Improvement_ID: improvementId,
            Patient_ID: patientId
        }).lean();

        if (!improvement) {
            return res.status(404).json({ success: false, message: 'Improvement not found or unauthorized access.' });
        }

        res.status(200).json(improvement);
    } catch (error) {
        console.error(`Error fetching improvement ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while fetching improvement.' });
    }
});

// Delete Improvements
router.delete('/improvements/:id', ensurePatient, async (req, res) => {
    try {
        const patientId = req.patientId;
        const improvementId = parseInt(req.params.id, 10);

        if (isNaN(improvementId)) {
            return res.status(400).json({ success: false, message: 'Invalid improvement ID format.' });
        }

        const result = await Improvement.findOneAndDelete({
            Improvement_ID: improvementId,
            Patient_ID: patientId
        });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Improvement not found or unauthorized deletion.' });
        }

        res.status(200).json({ success: true, message: 'Improvement deleted successfully.' });

    } catch (error) {
        console.error(`Error deleting improvement ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while deleting improvement.' });
    }
});


// Tasks Action
// Fetch Tasks
router.get('/tasks', ensurePatient, async (req, res) => {
    try {
        const patientId = req.patientId;
        const tasks = await Task.aggregate([
            { $match: { Patient_ID: patientId } },
            {
                $lookup: {
                    from: 'alerts',
                    localField: 'Alert_ID',
                    foreignField: 'Alert_ID',
                    as: 'alertDetails'
                }
            },
            { $unwind: { path: '$alertDetails', preserveNullAndEmptyArrays: true } }, 
            { $sort: { Task_ID: -1 } }
        ]);

        res.status(200).json(tasks);

    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching tasks.' });
    }
});

// View Tasks
router.get('/tasks/:id', ensurePatient, async (req, res) => {
    try {
        const patientId = req.patientId;
        const taskId = parseInt(req.params.id, 10);

        if (isNaN(taskId)) {
            return res.status(400).json({ success: false, message: 'Invalid task ID format.' });
        }

        const task = await Task.aggregate([
            { $match: { Task_ID: taskId, Patient_ID: patientId } },
            {
                $lookup: {
                    from: 'alerts',
                    localField: 'Alert_ID',
                    foreignField: 'Alert_ID',
                    as: 'alertDetails'
                }
            },
            { $unwind: { path: '$alertDetails', preserveNullAndEmptyArrays: true } }
        ]);

        if (!task || task.length === 0) {
            return res.status(404).json({ success: false, message: 'Task not found or unauthorized access.' });
        }

        res.status(200).json(task[0]);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching task.' });
    }
});

// Delete Tasks
router.delete('/tasks/:id', ensurePatient, async (req, res) => {
    try {
        const patientId = req.patientId;
        const taskId = parseInt(req.params.id, 10);

        if (isNaN(taskId)) {
            return res.status(400).json({ success: false, message: 'Invalid task ID format.' });
        }

        const task = await Task.findOne({ Task_ID: taskId, Patient_ID: patientId });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found or unauthorized deletion.' });
        }

        // Delete the task
        await Task.deleteOne({ Task_ID: taskId, Patient_ID: patientId });
        if (task.Alert_ID) {
            await Alert.updateOne({ Alert_ID: task.Alert_ID }, { $set: { Task_Assigned: 'No' } });
        }

        res.status(200).json({ success: true, message: 'Task deleted successfully and alert updated.' });
        
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting task.' });
    }
});

module.exports = router;
