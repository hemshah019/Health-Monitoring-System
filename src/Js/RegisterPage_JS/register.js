document.addEventListener("DOMContentLoaded", () => {
    const toggleIcons = document.querySelectorAll(".toggle-password");
  
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
  });
  

//   document.addEventListener("DOMContentLoaded", () => {
//     // Password toggle functionality (keep the existing code)
    
//     // Age to DOB calculation
//     const ageInput = document.querySelector('input[name="Age"]');
//     const dobInput = document.querySelector('input[name="Date_Of_Birth"]');
//     const ageError = document.getElementById('age-error');
    
//     ageInput.addEventListener('input', function() {
//         if (this.value) {
//             const age = parseInt(this.value);
//             if (age >= 18) {
//                 const currentDate = new Date();
//                 const birthYear = currentDate.getFullYear() - age;
//                 const dob = new Date(birthYear, currentDate.getMonth(), currentDate.getDate());
//                 dobInput.valueAsDate = dob;
//                 ageError.textContent = '';
//                 ageInput.parentElement.classList.remove('invalid');
//             } else {
//                 ageError.textContent = 'You must be at least 18 years old to register.';
//                 ageInput.parentElement.classList.add('invalid');
//                 this.value = '';
//                 dobInput.value = '';
//             }
//         } else {
//             dobInput.value = '';
//             ageError.textContent = '';
//             ageInput.parentElement.classList.remove('invalid');
//         }
//     });

//     // Username validation
//     const usernameInput = document.querySelector('input[name="Username"]');
//     const usernameError = document.getElementById('username-error');
//     usernameInput.addEventListener('blur', function() {
//         const username = this.value;
//         if (username && !/\d/.test(username)) {
//             usernameError.textContent = 'Username must contain at least one number.';
//             this.parentElement.classList.add('invalid');
//             this.focus();
//         } else {
//             usernameError.textContent = '';
//             this.parentElement.classList.remove('invalid');
//         }
//     });

//     // Password validation
//     const passwordInput = document.querySelector('input[name="Password"]');
//     const passwordError = document.getElementById('password-error');
//     passwordInput.addEventListener('blur', function() {
//         const password = this.value;
//         if (password) {
//             const hasLetter = /[a-zA-Z]/.test(password);
//             const hasNumber = /\d/.test(password);
//             const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            
//             let errorMsg = '';
//             if (!hasLetter) errorMsg += 'At least one letter. ';
//             if (!hasNumber) errorMsg += 'At least one number. ';
//             if (!hasSpecialChar) errorMsg += 'At least one special character.';
            
//             if (errorMsg) {
//                 passwordError.textContent = 'Password must contain: ' + errorMsg;
//                 this.parentElement.classList.add('invalid');
//             } else {
//                 passwordError.textContent = '';
//                 this.parentElement.classList.remove('invalid');
//             }
//         }
//     });

//     // Phone number validation
//     const phoneInput = document.querySelector('input[name="Phone_Number"]');
//     const phoneError = document.getElementById('phone-error');
//     phoneInput.addEventListener('blur', function() {
//         const phone = this.value;
//         if (phone && !/^\d{10}$/.test(phone)) {
//             phoneError.textContent = 'Phone number must be exactly 10 digits.';
//             this.parentElement.classList.add('invalid');
//             this.focus();
//         } else {
//             phoneError.textContent = '';
//             this.parentElement.classList.remove('invalid');
//         }
//     });

//     // Confirm password validation
//     const confirmPasswordInput = document.querySelector('input[name="Confirm_Password"]');
//     const confirmPasswordError = document.getElementById('confirm-password-error');
//     confirmPasswordInput.addEventListener('blur', function() {
//         const password = passwordInput.value;
//         const confirmPassword = this.value;
        
//         if (password && confirmPassword && password !== confirmPassword) {
//             confirmPasswordError.textContent = 'Passwords do not match!';
//             this.parentElement.classList.add('invalid');
//             this.focus();
//         } else {
//             confirmPasswordError.textContent = '';
//             this.parentElement.classList.remove('invalid');
//         }
//     });

//     // Form submission validation
//     const form = document.querySelector('form');
//     form.addEventListener('submit', function(e) {
//         let isValid = true;
        
//         // Check username contains number
//         if (!/\d/.test(usernameInput.value)) {
//             usernameError.textContent = 'Username must contain at least one number.';
//             usernameInput.parentElement.classList.add('invalid');
//             usernameInput.focus();
//             isValid = false;
//         }
        
//         // Check password strength
//         const password = passwordInput.value;
//         const hasLetter = /[a-zA-Z]/.test(password);
//         const hasNumber = /\d/.test(password);
//         const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//         if (!hasLetter || !hasNumber || !hasSpecialChar) {
//             let errorMsg = '';
//             if (!hasLetter) errorMsg += 'At least one letter. ';
//             if (!hasNumber) errorMsg += 'At least one number. ';
//             if (!hasSpecialChar) errorMsg += 'At least one special character.';
//             passwordError.textContent = 'Password must contain: ' + errorMsg;
//             passwordInput.parentElement.classList.add('invalid');
//             passwordInput.focus();
//             isValid = false;
//         }
        
//         // Check passwords match
//         if (passwordInput.value !== confirmPasswordInput.value) {
//             confirmPasswordError.textContent = 'Passwords do not match!';
//             confirmPasswordInput.parentElement.classList.add('invalid');
//             confirmPasswordInput.focus();
//             isValid = false;
//         }
        
//         // Check phone number
//         if (!/^\d{10}$/.test(phoneInput.value)) {
//             phoneError.textContent = 'Phone number must be exactly 10 digits.';
//             phoneInput.parentElement.classList.add('invalid');
//             phoneInput.focus();
//             isValid = false;
//         }
        
//         // Check age is >= 18
//         if (parseInt(ageInput.value) < 18) {
//             ageError.textContent = 'You must be at least 18 years old to register.';
//             ageInput.parentElement.classList.add('invalid');
//             ageInput.focus();
//             isValid = false;
//         }
        
//         if (!isValid) {
//             e.preventDefault();
//         }
//     });
// });