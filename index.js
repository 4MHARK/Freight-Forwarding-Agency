document.addEventListener("DOMContentLoaded", () => {
    // --- Element Selection ---
    const formContainer = document.getElementById("formContainer");
    const formFlipper = document.querySelector(".form-flipper");
    const goToRegistration = document.getElementById("goToRegistration");
    const goToLogin = document.getElementById("goToLogin");
    const registrationForm = document.getElementById("registrationForm");
    const loginForm = document.getElementById("loginForm");
    const allInputs = document.querySelectorAll("input, textarea");
  
    // --- Functions ---
  
    /**
     * Toggles the visibility of a password field.
     * @param {string} inputId The ID of the password input field.
     */
    function togglePassword(inputId) {
      const input = document.getElementById(inputId);
      if (!input) return;
      const icon =
        input.nextElementSibling?.querySelector(".material-symbols-outlined");
      if (!icon) return;
  
      if (input.type === "password") {
        input.type = "text";
        icon.textContent = "visibility"; // Show 'eye' icon
      } else {
        input.type = "password";
        icon.textContent = "visibility_off"; // Show 'slashed eye' icon
      }
    }
  
    /**
     * Adjusts the container height to smoothly fit the currently active form.
     * @param {HTMLElement} activeForm The form element that is currently visible.
     */
    function adjustContainerHeight(activeForm) {
      if (formContainer && activeForm) {
        formContainer.style.height = `${activeForm.offsetHeight}px`;
      }
    }
  
    // --- Initial Setup ---
  
    // Set initial height based on the default visible form (registration)
    // Use a small timeout to ensure all assets are rendered before calculating height
    setTimeout(() => {
      adjustContainerHeight(registrationForm);
    }, 100);
  
    // --- Event Listeners ---
  
    // Switch to Login Form
    if (goToLogin) {
      goToLogin.addEventListener("click", (e) => {
        e.preventDefault();
        formFlipper.classList.add("show-login");
        adjustContainerHeight(loginForm);
      });
    }
  
    // Switch to Registration Form
    if (goToRegistration) {
      goToRegistration.addEventListener("click", (e) => {
        e.preventDefault();
        formFlipper.classList.remove("show-login");
        adjustContainerHeight(registrationForm);
      });
    }
  
    // Re-adjust height on window resize to ensure responsiveness
    window.addEventListener("resize", () => {
      if (formFlipper.classList.contains("show-login")) {
        adjustContainerHeight(loginForm);
      } else {
        adjustContainerHeight(registrationForm);
      }
    });
  
    // Make the togglePassword function globally accessible for the `onclick` attribute
    window.togglePassword = togglePassword;
  
    // --- Form Submission / Validation ---
    if (registrationForm) {
      registrationForm.addEventListener("submit", function (e) {
        e.preventDefault();
        // Your existing validation and submission logic here...
        console.log("Registration form submitted!");
        alert("Registration form submitted!");
      });
    }
  
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        // Add login validation and submission logic here...
        console.log("Login form submitted!");
        alert("Login form submitted!");
      });
    }
  
    // --- UX Enhancements ---
  
    // Parallax effect for background particles
    document.addEventListener("mousemove", (e) => {
      const particles = document.querySelectorAll(".particle");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      particles.forEach((p, i) => {
        const speed = (i + 1) * 15;
        p.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  
    // Friendly input focus scale effect
    allInputs.forEach((input) => {
      const parent = input.closest(".form-group") || input.closest(".password-wrapper");
      if (parent) {
        input.addEventListener("focus", () => parent.classList.add("focused"));
        input.addEventListener("blur", () => parent.classList.remove("focused"));
      }
    });
  });