const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const form = document.querySelector('form');

const lengthReq = document.getElementById('length');
const letterReq = document.getElementById('letter');
const numberReq = document.getElementById('number');
const specialReq = document.getElementById('special');

const specialCharRegex = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/;

passwordInput.addEventListener('input', () => {
  const pwd = passwordInput.value;
  lengthReq.className = pwd.length >= 8 ? 'valid' : 'invalid';
  letterReq.className = /[A-Za-z]/.test(pwd) ? 'valid' : 'invalid';
  numberReq.className = /\d/.test(pwd) ? 'valid' : 'invalid';
  specialReq.className = specialCharRegex.test(pwd) ? 'valid' : 'invalid';
});

form.addEventListener('submit', (event) => {
  const pwd = passwordInput.value;
  const confirmPwd = confirmPasswordInput.value;

  const isValid =
    pwd.length >= 8 &&
    /[A-Za-z]/.test(pwd) &&
    /\d/.test(pwd) &&
    specialCharRegex.test(pwd);

  if (!isValid) {
    alert('Password does not meet the requirements.');
    event.preventDefault();
    return;
  }

  if (pwd !== confirmPwd) {
    alert('Passwords do not match.');
    event.preventDefault();
  }
});

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