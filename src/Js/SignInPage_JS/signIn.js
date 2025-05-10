// function to toggles password visibility between text and password input
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

// Get URL query parameters to check for messages to display
const params = new URLSearchParams(window.location.search);
const messageType = params.get('message');

// Reference to toast notification element
const toast = document.getElementById('toastMessage');

// Message configurations with text and type (success/error)
const messages = {
    "login-success": { text: "Signed in successfully!", type: "success" },
    "invalid-username": { text: "Username not found!", type: "error" },
    "invalid-password": { text: "Incorrect password!", type: "error" },
    "password-reset-success": { text: "Password reset successful!", type: "success" },
    "missing-fields":  { text: "Missing Fields!", type: "error" }
};

// Display toast message if valid message type exists in URL
if (messageType && messages[messageType]) {
    const { text, type } = messages[messageType];

    toast.textContent = text;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');

    const closeBtn = document.createElement('span');
    closeBtn.textContent = '×';
    closeBtn.classList.add('close');
    closeBtn.onclick = () => toast.classList.add('hidden');
    toast.appendChild(closeBtn);

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);

    const url = new URL(window.location);
    url.searchParams.delete('message');
    window.history.replaceState({}, document.title, url.pathname);
}

// Fallback auto-dismiss for any toast after 3 seconds
setTimeout(() => {
    const toast = document.getElementById('toast');
    if (toast) toast.style.display = 'none';
}, 3000);

// Special case handling for logout success message
if (window.location.search.includes('message=logout-success')) {
    const url = new URL(window.location);
    url.searchParams.delete('message');
    window.history.replaceState({}, document.title, url.pathname);
}