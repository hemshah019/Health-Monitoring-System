// Get all individual OTP input boxes and the hidden full OTP field
const otpInputs = document.querySelectorAll('.otp-input');
const fullOtpInput = document.getElementById('full-otp');

// Combines all individual OTP digits into the hidden full OTP field
function updateFullOtp() {
    let otp = '';
    otpInputs.forEach(input => {
        otp += input.value;
    });
    fullOtpInput.value = otp;
}

// Add event listeners to each OTP input box
otpInputs.forEach((input, index) => {
    input.addEventListener('input', (event) => {
        const maxLength = parseInt(input.getAttribute('maxlength'));
        const currentLength = input.value.length;
        
        updateFullOtp();

        // Auto-focus next field if current field is filled
        if (currentLength >= maxLength) {
            if (index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        }
    });

    // Handle backspace key
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace') {
            if (input.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        }
    });
});