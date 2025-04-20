// function to see and hide password
function togglePasswordVisibility() {
    const passwordInput = document.querySelector('input[name="Password"]');
    const eyeClosedIcon = document.querySelector('.eye-closed');
    const eyeOpenIcon = document.querySelector('.eye-open');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeClosedIcon.style.display = 'none';
        eyeOpenIcon.style.display = 'inline';
    } else {
        passwordInput.type = 'password';
        eyeClosedIcon.style.display = 'inline';
        eyeOpenIcon.style.display = 'none';
    }
}


const params = new URLSearchParams(window.location.search);
const messageType = params.get('message');

const toast = document.getElementById('toastMessage');

const messages = {
    "login-success": { text: "Signed in successfully!", type: "success" },
    "invalid-username": { text: "Username not found!", type: "error" },
    "invalid-password": { text: "Incorrect password!", type: "error" },
    "password-reset-success": { text: "Password reset successful!", type: "success" },
    "missing-fields":  { text: "Missing Fields!", type: "error" }
};

if (messageType && messages[messageType]) {
    const { text, type } = messages[messageType];
    toast.textContent = text;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');

    // Add close (X) button
    const closeBtn = document.createElement('span');
    closeBtn.textContent = '×';
    closeBtn.classList.add('close');
    closeBtn.onclick = () => toast.classList.add('hidden');
    toast.appendChild(closeBtn);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);

      // Remove query param from URL after showing toast
  if (window.location.search.includes('message=logout-success')) {
    const url = new URL(window.location);
    url.searchParams.delete('message');
    window.history.replaceState({}, document.title, url.pathname);
  }
}

setTimeout(() => {
    const toast = document.getElementById('toast');
    if (toast) toast.style.display = 'none';
  }, 3000);

  // Remove query param from URL after showing toast
  if (window.location.search.includes('message=logout-success')) {
    const url = new URL(window.location);
    url.searchParams.delete('message');
    window.history.replaceState({}, document.title, url.pathname);
  }