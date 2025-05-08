// DOM Elements
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const form = document.querySelector('form');

// Password requirement indicators
const lengthReq = document.getElementById('length');
const letterReq = document.getElementById('letter');
const numberReq = document.getElementById('number');
const specialReq = document.getElementById('special');

// Regular expression for special character validation
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/;

// Real-time password validation on input
passwordInput.addEventListener('input', () => {
  const pwd = passwordInput.value;
  lengthReq.className = pwd.length >= 8 ? 'valid' : 'invalid';
  letterReq.className = /[A-Za-z]/.test(pwd) ? 'valid' : 'invalid';
  numberReq.className = /\d/.test(pwd) ? 'valid' : 'invalid';
  specialReq.className = specialCharRegex.test(pwd) ? 'valid' : 'invalid';
});

// Form submission with validation
form.addEventListener('submit', (event) => {
  const pwd = passwordInput.value;
  const confirmPwd = confirmPasswordInput.value;

  const isValid =
    pwd.length >= 8 &&
    /[A-Za-z]/.test(pwd) &&
    /\d/.test(pwd) &&
    specialCharRegex.test(pwd);

  if (!isValid) {
    event.preventDefault();
    showToast('Password does not meet the requirements.');
    return;
  }

  if (pwd !== confirmPwd) {
    event.preventDefault();
    showToast('Passwords do not match.');
    return;
  }
});

// Function to toggles password visibility between text and password type
function togglePassword(fieldId, iconEl) {
  const input = document.getElementById(fieldId);
  if (input.type === 'password') {
    input.type = 'text';
    iconEl.querySelector('svg').style.fill = '#000';
  } else {
    input.type = 'password';
    iconEl.querySelector('svg').style.fill = '#888';
  }
}

// Show toast message dynamically
function showToast(message, type = 'error') {
  const existingToast = document.getElementById('dynamic-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.id = 'dynamic-toast';
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="close" onclick="this.parentElement.style.display='none'">&times;</button>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.display = 'none';
  }, 5000);
}
