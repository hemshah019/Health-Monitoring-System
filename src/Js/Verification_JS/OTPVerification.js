const otpInputs = document.querySelectorAll('.otp-input');
const fullOtpInput = document.getElementById('full-otp');

function updateFullOtp() {
    let otp = '';
    otpInputs.forEach(input => {
        otp += input.value;
    });
    fullOtpInput.value = otp;
}

otpInputs.forEach((input, index) => {
    input.addEventListener('input', (event) => {
        const maxLength = parseInt(input.getAttribute('maxlength'));
        const currentLength = input.value.length;
        
        updateFullOtp();

        if (currentLength >= maxLength) {
            if (index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        }
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace') {
            if (input.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        }
    });
});