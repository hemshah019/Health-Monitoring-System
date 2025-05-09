const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { Patient, Admin } = require('../config');

const router = express.Router();

module.exports = (transporter, otpStore) => {

    // GET route for Forgot Password page
    router.get('/forgot-password', (req, res) => {
        res.render('Verification/ForgotPassword', { error: null, message: null });
    });

    // POST route to handle Forgot Password request (send OTP)
    router.post('/forgot-password', async (req, res) => {
        try {
            const { email } = req.body;
            console.log('[Health Montoring System] Received email:', email);

            if (!email) {
                return res.render('Verification/ForgotPassword', {
                    error: 'Please enter your email address.',
                    message: null
                });
            }

             // Check if the email belongs to a Patient or Admin
             let user;
             if (email.includes('admin')) { 
                user = await Admin.findOne({ email });
            } 
            else {
                user = await Patient.findOne({ Email: email });
            }

            if (!user) {
                return res.render('Verification/ForgotPassword', {
                    error: 'No account found with that email.',
                    message: null
                });
            }

            const otp = crypto.randomInt(1000, 9999).toString();
            const expiresAt = Date.now() + 10 * 60 * 1000;
            otpStore.set(email, { otp, expiresAt });

            console.log(`[Health Montoring System] OTP for ${email}: ${otp}`);

            // Send the OTP via email
            const mailOptions = {
                from: `"Health Monitoring System" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Your Password Reset Code',
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Password Reset OTP</title>
                        <style>
                            body {
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                line-height: 1.6;
                                color: #333;
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                            }
                            .email-container {
                                border: 1px solid #e0e0e0;
                                border-radius: 8px;
                                overflow: hidden;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                            }
                            .header {
                                background-color: #4285f4;
                                padding: 20px;
                                text-align: center;
                            }
                            .logo {
                                color: white;
                                font-size: 22px;
                                font-weight: bold;
                                margin: 0;
                            }
                            .content {
                                padding: 30px 25px;
                                background-color: #ffffff;
                            }
                            .greeting {
                                font-size: 18px;
                                margin-top: 0;
                                margin-bottom: 20px;
                            }
                            .otp-container {
                                background-color: #f5f7fa;
                                border-radius: 6px;
                                padding: 15px;
                                text-align: center;
                                margin: 25px 0;
                            }
                            .otp-code {
                                font-size: 32px;
                                font-weight: bold;
                                letter-spacing: 5px;
                                color: #4285f4;
                                margin: 10px 0;
                            }
                            .time-limit {
                                color: #757575;
                                font-size: 14px;
                                margin-top: 10px;
                            }
                            .warning {
                                color: #d93025;
                                font-size: 14px;
                                margin-top: 5px;
                            }
                            .footer {
                                background-color: #f5f7fa;
                                padding: 20px;
                                text-align: center;
                                color: #757575;
                                font-size: 14px;
                            }
                            .divider {
                                border-top: 1px solid #e0e0e0;
                                margin: 20px 0;
                            }
                            .security-note {
                                font-size: 13px;
                                color: #757575;
                                font-style: italic;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="header">
                                <h1 class="logo">Health Monitoring System</h1>
                            </div>
                            <div class="content">
                                <p class="greeting">Hello ${user.First_Name},</p>
                                
                                <p>We received a request to reset your password for your Health Monitoring System account. To proceed with this request, please use the verification code below:</p>
                                
                                <div class="otp-container">
                                    <p class="otp-code">${otp}</p>
                                    <p class="time-limit">This code will expire in 10 minutes</p>
                                    <p class="warning">Do not share this code with anyone</p>
                                </div>
                                
                                <p>If you did not request a password reset, please disregard this email and consider changing your password to secure your account.</p>
                                
                                <div class="divider"></div>
                                
                                <p class="security-note">For security reasons, this email was sent to the address associated with your Health Monitoring System account.</p>
                            </div>
                            <div class="footer">
                                <p>© 2025 Health Monitoring System</p>
                                <p>This is an automated message, please do not reply to this email.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            };
            try {
                await transporter.sendMail(mailOptions);
                console.log(`[Health Montoring System] OTP email sent successfully to ${email}`);
                // res.redirect(`/otp-verification?email=${encodeURIComponent(email)}`);
                res.redirect(`/otp-verification?email=${encodeURIComponent(email)}&message=${encodeURIComponent('OTP sent to your email')}`);
            } catch (mailError) {
                console.error('Error sending OTP email:', mailError);
                return res.render('Verification/ForgotPassword', {
                    error: 'Failed to send OTP. Please try again later.',
                    message: null
                });
            }

        } catch (error) {
            console.error('Error in forgot password process:', error);
            res.status(500).render('Verification/ForgotPassword', {
                error: 'An error occurred. Please try again later.',
                message: null
            });
        }
    });

    // GET - OTP Verification
    // router.get('/otp-verification', (req, res) => {
    //     const email = req.query.email;
    //     const message = req.query.message;
    //     if (!email) {
    //         return res.redirect('/forgot-password');
    //     }
    //     res.render('Verification/OTPVerification',  { email, error: null, message: message || null });
    // });

    router.get('/otp-verification', (req, res) => {
        const email = req.query.email;
        const message = req.query.message;

        if (!email) return res.redirect('/forgot-password');

        res.render('Verification/OTPVerification', {
            email,
            error: null,
            message: message || null,
        });
    });

    // POST - Verify OTP
    router.post('/verify-otp', async (req, res) => { 
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.render('Verification/OTPVerification', {
                    email,
                    error: 'Both email and OTP are required.',
                    message: null
                });
            }

            const storedOTPData = otpStore.get(email);

            if (!storedOTPData) {
                return res.render('Verification/OTPVerification', {
                    email,
                    error: 'OTP has expired or is invalid. Please try again.',
                    message: null
                });
            }

            if (Date.now() > storedOTPData.expiresAt) {
                otpStore.delete(email);
                return res.render('Verification/OTPVerification', {
                    email,
                    error: 'OTP has expired. Please request a new one.',
                    message: null
                });
            }

            if (otp === storedOTPData.otp) {
                otpStore.delete(email);
                // res.redirect(`/new-password?email=${encodeURIComponent(email)}`);
                res.redirect(`/new-password?email=${encodeURIComponent(email)}&message=${encodeURIComponent('OTP verified! Now you can change password')}`);

            } else {
                return res.render('Verification/OTPVerification', {
                    email,
                    error: 'Invalid OTP. Please try again.',
                    message: null
                });
            }

        } catch (error) {
            console.error('Error in OTP verification:', error);
             res.render('Verification/OTPVerification', { email: req.body.email, error: 'An server error occurred. Please try again later.', message: null });
        }
    });

    // GET route for New Password page
    // router.get('/new-password', (req, res) => {
    //     const email = req.query.email;
    //     if (!email) {
    //         return res.redirect('/forgot-password');
    //     }
    //     res.render('Verification/NewPassword', { email, error: null, message: null });
    // });

    router.get('/new-password', (req, res) => {
        const email = req.query.email;
        const message = req.query.message;

        if (!email) return res.redirect('/forgot-password');

        res.render('Verification/NewPassword', {
            email,
            error: null,
            message: message || null
        });
    });


    // POST route to update the password
    router.post('/update-password', async (req, res) => {
        try {
            const { email, password, confirmPassword } = req.body;

            if (!email || !password || !confirmPassword) {
                return res.render('Verification/NewPassword', {
                    email,
                    error: 'All fields are required.',
                    message: null
                });
            }

            if (password !== confirmPassword) {
                return res.render('Verification/NewPassword', {
                    email,
                    error: 'Passwords do not match.',
                    message: null
                });
            }

            let user;
            if (email.includes('admin')) { 
                user = await Admin.findOne({ email });
            } else {
                user = await Patient.findOne({ Email: email });
            }

            if (!user) {
                console.error(`Attempt to update password for non-existent user: ${email}`);
                return res.render('Verification/NewPassword', {
                    email,
                    error: 'No account found. Please try again.',
                    message: null
                });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Update the user's password in the database
            if (email.includes('admin')) {
                await Admin.updateOne(
                    { email: email },
                    { $set: { password: hashedPassword } }
                );
            } else {
                await Patient.updateOne(
                    { Email: email },
                    { $set: { Password: hashedPassword } }
                );
            }

            console.log(`[Health Montoring System] Password updated successfully for ${email}`);

            res.redirect('/?message=password-reset-success');

        } catch (error) {
            console.error('Error updating password:', error);
            res.status(500).render('Verification/NewPassword', {
                email,
                error: 'Failed to update password. Please try again later.',
                message: null
            });
        }
    });

    return router;
};