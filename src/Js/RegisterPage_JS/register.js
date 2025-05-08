document.addEventListener("DOMContentLoaded", () => {
  const toggleIcons = document.querySelectorAll(".toggle-password");
  const form = document.querySelector("form");

  // Added click event listeners to each password toggle icon
  toggleIcons.forEach(icon => {
    icon.addEventListener("click", () => {
      const input = icon.parentElement.querySelector("input");
      const eyeOpen = icon.querySelector(".eye-open");
      const eyeClosed = icon.querySelector(".eye-closed");

      if (input.type === "password") {
        input.type = "text";
        eyeOpen.style.display = "inline";
        eyeClosed.style.display = "none";
      } else {
        input.type = "password";
        eyeOpen.style.display = "none";
        eyeClosed.style.display = "inline";
      }
    });
  });

  // Form submission validation
  form.addEventListener("submit", (e) => {
    const age = parseInt(form.Age.value);
    const phone = form.Phone_Number.value.trim();
    const username = form.Username.value.trim();
    const password = form.Password.value;
    const confirmPassword = form.Confirm_Password.value;

    // Password requirements regex patterns
    const passwordRegex = {
      length: /.{8,}/,
      letter: /[A-Za-z]/,
      number: /\d/,
      special: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/
    };

    // Age validation (must be 18+)
    if (age < 18) {
      e.preventDefault();
      showToast("You must be at least 18 years old.", "error");
      return;
    }

    // Phone number validation (exactly 10 digits)
    if (!/^\d{10}$/.test(phone)) {
      e.preventDefault();
      showToast("Phone number must be exactly 10 digits.", "error");
      return;
    }

    // Username validation (must contain at least one number)
    if (!/\d/.test(username)) {
      e.preventDefault();
      showToast("Username must include at least one number.", "error");
      return;
    }

    // Password strength validation
    if (
      !passwordRegex.length.test(password) ||
      !passwordRegex.letter.test(password) ||
      !passwordRegex.number.test(password) ||
      !passwordRegex.special.test(password)
    ) {
      e.preventDefault();
      showToast("Password must be at least 8 characters and include letter, number, and special character.", "error");
      return;
    }

    if (password !== confirmPassword) {
      e.preventDefault();
      showToast("Passwords do not match.", "error");
      return;
    }
  });
});

// Toast message function
function showToast(message, type = "error") {
  const existing = document.getElementById("dynamic-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "dynamic-toast";
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="close" onclick="this.parentElement.style.display='none'"></button>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}
