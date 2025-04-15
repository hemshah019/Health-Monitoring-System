const express = require('express');
const router = express.Router();

// GET route for the Dashboard
router.get('/dashboard', (req, res) => {
    const patientId = req.query.patientId;
    if (!patientId) {
        return res.redirect('/');
    }
    res.render('dashboard', { patientId });
});

module.exports = router;