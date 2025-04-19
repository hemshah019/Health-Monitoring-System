const express = require('express');
const router = express.Router();
const { Message, Patient, Compliance, Improvement } = require('../config');
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
                 return res.redirect('/?message=auth_required');
            });
           return;
        }
    }
    req.adminId = req.session.user.id;
    next();
};

// Message Actions
// GET: Fetch Single Message Details (for View Modal and Response Form Population)
router.get('/messages/:id', ensureAdmin, async (req, res) => {
    try {
        const messageId = parseInt(req.params.id, 10);

        if (isNaN(messageId)) {
            return res.status(400).json({ success: false, message: 'Invalid message ID format.' });
        }
        console.log(`Admin attempting to fetch message ID: ${messageId}`);

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

        // Optionally format dates or add combined fields if needed by frontend
        if (message.patientInfo) {
             message.patientFullName = `${message.patientInfo.First_Name || ''} ${message.patientInfo.Last_Name || ''}`.trim() || 'Unknown Patient';
        } else {
             message.patientFullName = 'Unknown Patient';
        }
        console.log(`Successfully fetched message ID: ${messageId} with patient info.`);
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
        console.log(`Admin attempting to respond to message ID: ${messageId}`);

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
        console.log(`Successfully responded to message ID: ${messageId}`);
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
        console.log(`Admin attempting to delete message ID: ${messageId}`);

        const result = await Message.findOneAndDelete({ Message_ID: messageId });

        if (!result) {
            console.warn(`Message not found for deletion. ID: ${messageId}`);
            return res.status(404).json({ success: false, message: 'Message not found.' });
        }

        console.log(`Successfully deleted message ID: ${messageId}`);
        res.status(200).json({ success: true, message: 'Message deleted successfully.' });

    } catch (error) {
        console.error(`Error deleting message ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while deleting message.' });
    }
});


// Compliance Actions
// GET: Fetch Single Compliance Details (for View Modal and Feedback Form Population)
router.get('/compliances/:id', ensureAdmin, async (req, res) => {
    try {
        const complianceId = parseInt(req.params.id, 10);

        if (isNaN(complianceId)) {
            return res.status(400).json({ success: false, message: 'Invalid compliance ID format.' });
        }
        console.log(`Admin attempting to fetch compliance ID: ${complianceId}`);

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

        const compliance = complianceAggregation[0];
        if (compliance.patientInfo) {
             compliance.patientFullName = `${compliance.patientInfo.First_Name || ''} ${compliance.patientInfo.Last_Name || ''}`.trim() || 'Unknown Patient';
             compliance.patientEmail = compliance.patientInfo.Email || 'N/A';
        } else {
             compliance.patientFullName = 'Unknown Patient';
             compliance.patientEmail = 'N/A';
        }

        console.log(`Successfully fetched compliance ID: ${complianceId} with patient info.`);
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
        // Destructure compliance_status from the body
        const { admin_feedback, compliance_status, feedback_date } = req.body;

        if (isNaN(complianceId)) {
            return res.status(400).json({ success: false, message: 'Invalid compliance ID format.' });
        }

        // Update validation to include compliance_status
        if (!admin_feedback || !compliance_status || !feedback_date) {
            return res.status(400).json({ success: false, message: 'Missing required feedback fields (feedback, status, date).' });
        }

        // Optional: Validate if compliance_status is one of the allowed values
        const allowedStatuses = ['Pending', 'Under-Review', 'Approved', 'Rejected'];
        if (!allowedStatuses.includes(compliance_status)) {
             return res.status(400).json({ success: false, message: `Invalid status value: ${compliance_status}` });
        }

        console.log(`Admin attempting to provide feedback for compliance ID: ${complianceId} with status: ${compliance_status}`);

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

        console.log(`Successfully provided feedback for compliance ID: ${complianceId}. New status: ${updatedCompliance.Status}`);
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
        console.log(`Admin attempting to delete compliance ID: ${complianceId}`);

        const result = await Compliance.findOneAndDelete({ Compliance_ID: complianceId });

        if (!result) {
            console.warn(`Compliance record not found for deletion. ID: ${complianceId}`);
            return res.status(404).json({ success: false, message: 'Compliance record not found.' });
        }

        console.log(`Successfully deleted compliance ID: ${complianceId}`);
        res.status(200).json({ success: true, message: 'Compliance record deleted successfully.' });

    } catch (error) {
        console.error(`Error deleting compliance ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while deleting compliance record.' });
    }
});

// Improvement Actions
// GET: Fetch Single Improvement Suggestion (for View Modal and Response Form)
router.get('/improvements/:id', ensureAdmin, async (req, res) => {
    try {
        const improvementId = parseInt(req.params.id, 10);

        if (isNaN(improvementId)) {
            return res.status(400).json({ success: false, message: 'Invalid improvement ID format.' });
        }
        console.log(`Admin attempting to fetch improvement ID: ${improvementId}`);

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

        // Add convenient fields for frontend
        if (improvement.patientInfo) {
            improvement.patientFullName = `${improvement.patientInfo.First_Name || ''} ${improvement.patientInfo.Last_Name || ''}`.trim() || 'Unknown Patient';
            improvement.patientEmail = improvement.patientInfo.Email || 'N/A';
        } else {
            improvement.patientFullName = 'Unknown Patient';
            improvement.patientEmail = 'N/A';
        }

        console.log(`Successfully fetched improvement ID: ${improvementId} with patient info.`);
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
        console.log(`Admin attempting to respond to improvement ID: ${improvementId}`);
        console.log(`Received implementation_date:`, implementation_date);

        const updateData = {
            Admin_Response: improvement_response,
            Status: improvement_status,
        };
        if (implementation_date) {
            try {
                const parsedDate = new Date(implementation_date);
                if (!isNaN(parsedDate.getTime())) {
                     updateData.Implementation_Date = parsedDate;
                     console.log(`Setting Implementation_Date to:`, parsedDate);
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
           console.log(`Setting Implementation_Date to null.`);
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

        console.log(`Successfully responded to improvement ID: ${improvementId}`);
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
        console.log(`Admin attempting to delete improvement ID: ${improvementId}`);

        const result = await Improvement.findOneAndDelete({ Improvement_ID: improvementId });

        if (!result) {
            console.warn(`Improvement suggestion not found for deletion. ID: ${improvementId}`);
            return res.status(404).json({ success: false, message: 'Improvement suggestion not found.' });
        }
        console.log(`Successfully deleted improvement ID: ${improvementId}`);
        res.status(200).json({ success: true, message: 'Improvement suggestion deleted successfully.' });

    } catch (error) {
        console.error(`Error deleting improvement ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while deleting improvement suggestion.' });
    }
});


// Patient Actions (Admin)
// GET: Fetch Single Patient Details (for View Modal)
router.get('/patients/:id', ensureAdmin, async (req, res) => {
    try {
        const patientId = parseInt(req.params.id, 10);

        if (isNaN(patientId)) {
            return res.status(400).json({ success: false, message: 'Invalid patient ID format.' });
        }
        console.log(`Admin attempting to fetch patient ID: ${patientId}`);

        const patient = await Patient.findOne({ Patient_ID: patientId }).lean();

        if (!patient) {
            console.warn(`Patient not found for ID: ${patientId}`);
            return res.status(404).json({ success: false, message: 'Patient not found.' });
        }

        console.log(`Successfully fetched patient ID: ${patientId}`);
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
        console.log(`Admin attempting to delete patient ID: ${patientId}`);

        const result = await Patient.findOneAndDelete({ Patient_ID: patientId });

        if (!result) {
            console.warn(`Patient not found for deletion. ID: ${patientId}`);
            return res.status(404).json({ success: false, message: 'Patient not found.' });
        }

        console.log(`Successfully deleted patient ID: ${patientId}`);
        res.status(200).json({ success: true, message: `Patient (#P${patientId}) deleted successfully.` });

    } catch (error) {
        console.error(`Error deleting patient ID ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error while deleting patient.' });
    }
});

module.exports = router;