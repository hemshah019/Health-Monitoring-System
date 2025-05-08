const express = require('express');
const router = express.Router();
const { Message, Patient, Compliance, Improvement, Alert, Task } = require('../config');
const dayjs = require('dayjs');

// Middleware to ensure the user is an admin
const ensureAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        console.warn('Unauthorized access attempt to admin action.');
        if (req.accepts('json')) {
           return res.status(403).json({ success: false, message: 'Unauthorized access. Please log in as an admin.' });
        } else {
           req.session.destroy(err => {
                 if (err) console.error("Error destroying session on unauthorized access:", err);
                 return res.redirect('/');
            });
           return;
        }
    }
    req.adminId = req.session.user.id;
    next();
};

// Message Actions
// GET: Fetch Message Details
router.get('/messages/:id', ensureAdmin, async (req, res) => {
    try {
        const messageId = parseInt(req.params.id, 10);

        if (isNaN(messageId)) {
            return res.status(400).json({ success: false, message: 'Invalid message ID format.' });
        }

        // Use aggregation to fetch message and related patient info
        const messageAggregation = await Message.aggregate([
            { $match: { Message_ID: messageId } },
            {
                $lookup: {
                    from: "patients",
                    localField: "Patient_ID",
                    foreignField: "Patient_ID",
                    as: "patientInfo"
                }
            },
            {
                $unwind: {
                    path: "$patientInfo",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).exec();

        if (!messageAggregation || messageAggregation.length === 0) {
            console.warn(`Message not found for ID: ${messageId}`);
            return res.status(404).json({ success: false, message: 'Message not found.' });
        }
        const message = messageAggregation[0];

        // Adding combined fields
        if (message.patientInfo) {
             message.patientFullName = `${message.patientInfo.First_Name || ''} ${message.patientInfo.Last_Name || ''}`.trim() || 'Unknown Patient';
        } else {
             message.patientFullName = 'Unknown Patient';
        }
        res.status(200).json(message);

    } catch (error) {
        console.error(`Error fetching single message ID ${req.params.id} for admin:`, error);
        res.status(500).json({ success: false, message: 'Server error while fetching message details.' });
    }
});

// POST: Submit Admin Response to a Message
router.post('/messages/respond/:id', ensureAdmin, async (req, res) => {
    try {
        const messageId = parseInt(req.params.id, 10);
        const { admin_response, response_status, response_date } = req.body;

        if (isNaN(messageId)) {
            return res.status(400).json({ success: false, message: 'Invalid message ID format.' });
        }

        // Basic validation
        if (!admin_response || !response_status || !response_date) {
            return res.status(400).json({ success: false, message: 'Missing required response fields (response, status, date).' });
        }

        const updatedMessage = await Message.findOneAndUpdate(
            { Message_ID: messageId },
            {
                $set: {
                    Admin_Response: admin_response,
                    Status: response_status,
                    Response_Date: new Date(response_date)
                }
            },
            { new: true }
        );

        if (!updatedMessage) {
            console.warn(`Message not found for responding. ID: ${messageId}`);
            return res.status(404).json({ success: false, message: 'Message not found. It might have been deleted.' });
        }
        res.status(200).json({ success: true, message: 'Response submitted successfully.', updatedMessage: updatedMessage });

    } catch (error) {
        console.error(`Error responding to message ID ${req.params.id}:`, error);
        if (error.name === 'ValidationError') {
             res.status(400).json({ success: false, message: `Validation Error: ${error.message}` });
        } else {
            res.status(500).json({ success: false, message: 'Server error while submitting response.' });
        }
    }
});

// DELETE: Delete a Message
router.delete('/messages/:id', ensureAdmin, async (req, res) => {
    try {
        const messageId = parseInt(req.params.id, 10);

        if (isNaN(messageId)) {
            return res.status(400).json({ success: false, message: 'Invalid message ID format.' });
        }

        const result = await Message.findOneAndDelete({ Message_ID: messageId });

        if (!result) {
            console.warn(`Message not found for deletion. ID: ${messageId}`);
            return res.status(404).json({ success: false, message: 'Message not found.' });
        }
        res.status(200).json({ success: true, message: 'Message deleted successfully.' });

    } catch (error) {
        console.error(`Error deleting message ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while deleting message.' });
    }
});


// Compliance Actions
// GET: Fetch Compliance Details
router.get('/compliances/:id', ensureAdmin, async (req, res) => {
    try {
        const complianceId = parseInt(req.params.id, 10);

        if (isNaN(complianceId)) {
            return res.status(400).json({ success: false, message: 'Invalid compliance ID format.' });
        }

        // Use aggregation to fetch compliance and related patient info
        const complianceAggregation = await Compliance.aggregate([
            { $match: { Compliance_ID: complianceId } },
            {
                $lookup: {
                    from: "patients",
                    localField: "Patient_ID",
                    foreignField: "Patient_ID",
                    as: "patientInfo"
                }
            },
            {
                $unwind: {
                    path: "$patientInfo",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).exec();

        if (!complianceAggregation || complianceAggregation.length === 0) {
            console.warn(`Compliance record not found for ID: ${complianceId}`);
            return res.status(404).json({ success: false, message: 'Compliance record not found.' });
        }

        // Adding combined fields
        const compliance = complianceAggregation[0];
        if (compliance.patientInfo) {
             compliance.patientFullName = `${compliance.patientInfo.First_Name || ''} ${compliance.patientInfo.Last_Name || ''}`.trim() || 'Unknown Patient';
             compliance.patientEmail = compliance.patientInfo.Email || 'N/A';
        } else {
             compliance.patientFullName = 'Unknown Patient';
             compliance.patientEmail = 'N/A';
        }
        res.status(200).json(compliance);

    } catch (error) {
        console.error(`Error fetching single compliance ID ${req.params.id} for admin:`, error);
        res.status(500).json({ success: false, message: 'Server error while fetching compliance details.' });
    }
});

// POST: Submit Admin Feedback for a Compliance Record
router.post('/compliances/feedback/:id', ensureAdmin, async (req, res) => {
    try {
        const complianceId = parseInt(req.params.id, 10);
        const { admin_feedback, compliance_status, feedback_date } = req.body;

        if (isNaN(complianceId)) {
            return res.status(400).json({ success: false, message: 'Invalid compliance ID format.' });
        }

        // Update validation to include compliance_status
        if (!admin_feedback || !compliance_status || !feedback_date) {
            return res.status(400).json({ success: false, message: 'Missing required feedback fields (feedback, status, date).' });
        }

        // Validate if compliance_status is one of the allowed values
        const allowedStatuses = ['Pending', 'Under-Review', 'Approved', 'Rejected'];
        if (!allowedStatuses.includes(compliance_status)) {
             return res.status(400).json({ success: false, message: `Invalid status value: ${compliance_status}` });
        }

        const updatedCompliance = await Compliance.findOneAndUpdate(
            { Compliance_ID: complianceId },
            {
                $set: {
                    Admin_Feedback: admin_feedback,
                    Feedback_Date: new Date(feedback_date),
                    Status: compliance_status
                }
            },
            { new: true }
        ).lean();

        if (!updatedCompliance) {
            console.warn(`Compliance record not found for feedback. ID: ${complianceId}`);
            return res.status(404).json({ success: false, message: 'Compliance record not found. It might have been deleted.' });
        }
        res.status(200).json({ success: true, message: 'Feedback submitted successfully.', updatedCompliance: updatedCompliance });

    } catch (error) {
        console.error(`Error providing feedback for compliance ID ${req.params.id}:`, error);
         if (error.name === 'ValidationError') {
             res.status(400).json({ success: false, message: `Validation Error: ${error.message}` });
        } else {
            res.status(500).json({ success: false, message: 'Server error while submitting feedback.' });
        }
    }
});

// DELETE: Delete a Compliance Record
router.delete('/compliances/:id', ensureAdmin, async (req, res) => {
    try {
        const complianceId = parseInt(req.params.id, 10);
        if (isNaN(complianceId)) {
            return res.status(400).json({ success: false, message: 'Invalid compliance ID format.' });
        }

        const result = await Compliance.findOneAndDelete({ Compliance_ID: complianceId });
        if (!result) {
            console.warn(`Compliance record not found for deletion. ID: ${complianceId}`);
            return res.status(404).json({ success: false, message: 'Compliance record not found.' });
        }

        res.status(200).json({ success: true, message: 'Compliance record deleted successfully.' });

    } catch (error) {
        console.error(`Error deleting compliance ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while deleting compliance record.' });
    }
});

// Improvement Actions
// GET: Fetch Improvement Suggestion
router.get('/improvements/:id', ensureAdmin, async (req, res) => {
    try {
        const improvementId = parseInt(req.params.id, 10);
        if (isNaN(improvementId)) {
            return res.status(400).json({ success: false, message: 'Invalid improvement ID format.' });
        }

        // Aggregation to get improvement and patient details
        const improvementAggregation = await Improvement.aggregate([
            { $match: { Improvement_ID: improvementId } },
            {
                $lookup: {
                    from: "patients",
                    localField: "Patient_ID",
                    foreignField: "Patient_ID",
                    as: "patientInfo"
                }
            },
            {
                $unwind: {
                    path: "$patientInfo",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).exec();

        if (!improvementAggregation || improvementAggregation.length === 0) {
            console.warn(`Improvement suggestion not found for ID: ${improvementId}`);
            return res.status(404).json({ success: false, message: 'Improvement suggestion not found.' });
        }

        const improvement = improvementAggregation[0];

        // Add convenient fields
        if (improvement.patientInfo) {
            improvement.patientFullName = `${improvement.patientInfo.First_Name || ''} ${improvement.patientInfo.Last_Name || ''}`.trim() || 'Unknown Patient';
            improvement.patientEmail = improvement.patientInfo.Email || 'N/A';
        } else {
            improvement.patientFullName = 'Unknown Patient';
            improvement.patientEmail = 'N/A';
        }
        res.status(200).json(improvement);

    } catch (error) {
        console.error(`Error fetching single improvement ID ${req.params.id} for admin:`, error);
        res.status(500).json({ success: false, message: 'Server error while fetching improvement details.' });
    }
});

// POST: Submit Admin Response to an Improvement Suggestion
router.post('/improvements/respond/:id', ensureAdmin, async (req, res) => {
    try {
        const improvementId = parseInt(req.params.id, 10);
        const { improvement_response, improvement_status, implementation_date } = req.body;

        if (isNaN(improvementId)) {
            return res.status(400).json({ success: false, message: 'Invalid improvement ID format.' });
        }

        if (!improvement_response || !improvement_status) {
            return res.status(400).json({ success: false, message: 'Missing required response fields (response, status).' });
        }

        const updateData = {
            Admin_Response: improvement_response,
            Status: improvement_status,
        };
        if (implementation_date) {
            try {
                const parsedDate = new Date(implementation_date);
                if (!isNaN(parsedDate.getTime())) {
                     updateData.Implementation_Date = parsedDate;
                } else {
                   console.warn(`Invalid implementation date string received: ${implementation_date}. Setting to null.`);
                   updateData.Implementation_Date = null;
                }
           } catch (dateError) {
               console.warn(`Error parsing implementation date: ${dateError.message}. Setting to null.`);
               updateData.Implementation_Date = null;
           }
       } else {
           updateData.Implementation_Date = null;
       }

        const updatedImprovement = await Improvement.findOneAndUpdate(
            { Improvement_ID: improvementId },
            { $set: updateData },
            { new: true }
        ).lean();

        if (!updatedImprovement) {
            console.warn(`Improvement suggestion not found for responding. ID: ${improvementId}`);
            return res.status(404).json({ success: false, message: 'Improvement suggestion not found.' });
        }
        res.status(200).json({ success: true, message: 'Response submitted successfully.', updatedImprovement: updatedImprovement });

    } catch (error) {
        console.error(`Error responding to improvement ID ${req.params.id}:`, error);
        if (error.name === 'ValidationError') {
             res.status(400).json({ success: false, message: `Validation Error: ${error.message}` });
        } else {
            res.status(500).json({ success: false, message: 'Server error while submitting response.' });
        }
    }
});

// DELETE: Delete an Improvement Suggestion
router.delete('/improvements/:id', ensureAdmin, async (req, res) => {
    try {
        const improvementId = parseInt(req.params.id, 10);
        if (isNaN(improvementId)) {
            return res.status(400).json({ success: false, message: 'Invalid improvement ID format.' });
        }

        const result = await Improvement.findOneAndDelete({ Improvement_ID: improvementId });
        if (!result) {
            console.warn(`Improvement suggestion not found for deletion. ID: ${improvementId}`);
            return res.status(404).json({ success: false, message: 'Improvement suggestion not found.' });
        }
        res.status(200).json({ success: true, message: 'Improvement suggestion deleted successfully.' });

    } catch (error) {
        console.error(`Error deleting improvement ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while deleting improvement suggestion.' });
    }
});


// Patient Actions (Admin)
// GET: Fetch Patient Details
router.get('/patients/:id', ensureAdmin, async (req, res) => {
    try {
        const patientId = parseInt(req.params.id, 10);
        if (isNaN(patientId)) {
            return res.status(400).json({ success: false, message: 'Invalid patient ID format.' });
        }

        const patient = await Patient.findOne({ Patient_ID: patientId }).lean();
        if (!patient) {
            console.warn(`Patient not found for ID: ${patientId}`);
            return res.status(404).json({ success: false, message: 'Patient not found.' });
        }
        res.status(200).json(patient);

    } catch (error) {
        console.error(`Error fetching single patient ID ${req.params.id} for admin:`, error);
        res.status(500).json({ success: false, message: 'Server error while fetching patient details.' });
    }
});

// DELETE: Delete a Patient Record
router.delete('/patients/:id', ensureAdmin, async (req, res) => {
    try {
        const patientId = parseInt(req.params.id, 10);
        if (isNaN(patientId)) {
            return res.status(400).json({ success: false, message: 'Invalid patient ID format.' });
        }

        const result = await Patient.findOneAndDelete({ Patient_ID: patientId });
        if (!result) {
            console.warn(`Patient not found for deletion. ID: ${patientId}`);
            return res.status(404).json({ success: false, message: 'Patient not found.' });
        }

        res.status(200).json({ success: true, message: `Patient (#P${patientId}) deleted successfully.` });

    } catch (error) {
        console.error(`Error deleting patient ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while deleting patient.' });
    }
});


// GET: Fetch Alert Details
router.get('/alerts/:id', ensureAdmin, async (req, res) => {
    try {
        const alertId = parseInt(req.params.id, 10);
        if (isNaN(alertId)) {
            return res.status(400).json({ success: false, message: 'Invalid alert ID format.' });
        }

        const alertAggregation = await Alert.aggregate([
            { $match: { Alert_ID: alertId } },
            {
                $lookup: {
                    from: "patients",
                    localField: "Patient_ID",
                    foreignField: "Patient_ID",
                    as: "patientInfo"
                }
            },
            {
                $unwind: {
                    path: "$patientInfo",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).exec();

        if (!alertAggregation || alertAggregation.length === 0) {
            console.warn(`Alert not found for ID: ${alertId}`);
            return res.status(404).json({ success: false, message: 'Alert not found.' });
        }

        const alert = alertAggregation[0];
        alert.patientFullName = alert.patientInfo 
            ? `${alert.patientInfo.First_Name} ${alert.patientInfo.Last_Name}` 
            : 'Unknown Patient';

        res.status(200).json(alert);
    } catch (error) {
        console.error(`Error fetching alert ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while fetching alert details.' });
    }
});

// GET: Fetch existing Task for an Alert
router.get('/alerts/:id/task', ensureAdmin, async (req, res) => {
    try {
        const alertId = parseInt(req.params.id, 10);
        if (isNaN(alertId)) {
            return res.status(400).json({ success: false, message: 'Invalid alert ID format.' });
        }

        const task = await Task.findOne({ Alert_ID: alertId }).lean();
        if (!task) {
            return res.status(404).json({ success: false, message: 'No task found for this alert.' });
        }

        res.status(200).json({ success: true, task });
    } catch (error) {
        console.error(`Error fetching task for alert ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while fetching task.' });
    }
});


// Alert Action
// POST: Add a Task for an Alert
router.post('/alerts/:id/tasks', ensureAdmin, async (req, res) => {
    try {
        const alertId = parseInt(req.params.id, 10);
        if (isNaN(alertId)) {
            return res.status(400).json({ success: false, message: 'Invalid alert ID format.' });
        }

        const { taskName, taskPriority, taskDescription, completionTime } = req.body;
        if (!taskName || !taskPriority || !taskDescription || !completionTime) {
            return res.status(400).json({ success: false, message: 'Missing required task fields.' });
        }

        // Check if the alert exists
        const alert = await Alert.findOne({ Alert_ID: alertId });
        if (!alert) {
            return res.status(404).json({ success: false, message: 'Alert not found.' });
        }

        // Check for existing task for the alert
        const existingTask = await Task.findOne({ Alert_ID: alertId });

        let updatedTask;
        if (existingTask) {
            // If task exists, update it
            existingTask.Task_Name = taskName;
            existingTask.Task_Description = taskDescription;
            existingTask.Task_Priority = taskPriority;
            existingTask.Completion_Time = new Date(completionTime);
            updatedTask = await existingTask.save();
        } else {
            // If no task exists, create a new one
            const newTask = new Task({
                Patient_ID: alert.Patient_ID,
                Alert_ID: alert.Alert_ID,
                Task_Name: taskName,
                Task_Description: taskDescription,
                Task_Priority: taskPriority,
                Completion_Time: new Date(completionTime)
            });
            updatedTask = await newTask.save();
        }

        // Always ensure Alert's Task_Assigned is set to 'Yes'
        alert.Task_Assigned = 'Yes';
        await alert.save();

        // Fetch updated alert with patient info
        const updatedAlert = await Alert.aggregate([
            { $match: { Alert_ID: alertId } },
            {
                $lookup: {
                    from: "patients",
                    localField: "Patient_ID",
                    foreignField: "Patient_ID",
                    as: "patientInfo"
                }
            },
            { $unwind: { path: "$patientInfo", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    patientFullName: { 
                        $concat: ['$patientInfo.First_Name', ' ', '$patientInfo.Last_Name'] 
                    }
                }
            }
        ]);

        res.status(201).json({ success: true, message: 'Task assigned/updated successfully!', updatedAlert: updatedAlert[0] });

    } catch (error) {
        console.error(`Error assigning/updating task for alert ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while assigning/updating task.' });
    }
});

// DELETE: Delete an Alert
router.delete('/alerts/:id', ensureAdmin, async (req, res) => {
    try {
        const alertId = parseInt(req.params.id, 10);
        if (isNaN(alertId)) {
            return res.status(400).json({ success: false, message: 'Invalid alert ID format.' });
        }

        const result = await Alert.findOneAndDelete({ Alert_ID: alertId });
        if (!result) {
            console.warn(`Alert not found for deletion. ID: ${alertId}`);
            return res.status(404).json({ success: false, message: 'Alert not found.' });
        }

        res.status(200).json({ success: true, message: 'Alert deleted successfully.' });

    } catch (error) {
        console.error(`Error deleting alert ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while deleting alert.' });
    }
});


// GET: Fetch Task Details
router.get('/tasks/:id', ensureAdmin, async (req, res) => {
    try {
        const taskId = parseInt(req.params.id, 10);
        if (isNaN(taskId)) {
            return res.status(400).json({ success: false, message: 'Invalid task ID format.' });
        }

        const taskAggregation = await Task.aggregate([
            { $match: { Task_ID: taskId } },
            {
                $lookup: {
                    from: "patients",
                    localField: "Patient_ID",
                    foreignField: "Patient_ID",
                    as: "patientInfo"
                }
            },
            { $unwind: { path: "$patientInfo", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "alerts",
                    localField: "Alert_ID",
                    foreignField: "Alert_ID",
                    as: "alertInfo"
                }
            },
            { $unwind: { path: "$alertInfo", preserveNullAndEmptyArrays: true } }
        ]).exec();

        if (!taskAggregation || taskAggregation.length === 0) {
            return res.status(404).json({ success: false, message: 'Task not found.' });
        }

        const task = taskAggregation[0];
        task.patientFullName = task.patientInfo 
            ? `${task.patientInfo.First_Name} ${task.patientInfo.Last_Name}`
            : 'Unknown Patient';
        task.patientEmail = task.patientInfo?.Email || 'N/A';

        res.status(200).json(task);
    } catch (error) {
        console.error(`Error fetching task ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while fetching task details.' });
    }
});

// DELETE: Delete a Task
router.delete('/tasks/:id', ensureAdmin, async (req, res) => {
    try {
        const taskId = parseInt(req.params.id, 10);
        if (isNaN(taskId)) {
            return res.status(400).json({ success: false, message: 'Invalid task ID format.' });
        }

        // Find the task first to get the Alert_ID
        const task = await Task.findOneAndDelete({ Task_ID: taskId });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found.' });
        }

        // Update the related Alert's Task_Assigned to 'No'
        if (task.Alert_ID) {
            await Alert.findOneAndUpdate(
                { Alert_ID: task.Alert_ID },
                { $set: { Task_Assigned: 'No' } }
            );
        }

        res.status(200).json({ success: true, message: 'Task deleted successfully!' });
    } catch (error) {
        console.error(`Error deleting task ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while deleting task.' });
    }
});

module.exports = router;