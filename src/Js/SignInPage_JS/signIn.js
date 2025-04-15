function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const eyeClosed = document.querySelector('.eye-closed');
    const eyeOpen = document.querySelector('.eye-open');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeClosed.style.display = 'none';
        eyeOpen.style.display = 'block';
    } else {
        passwordInput.type = 'password';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
    }
}
