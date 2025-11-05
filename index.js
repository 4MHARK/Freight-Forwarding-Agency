document.addEventListener("DOMContentLoaded", () => {
  // --- Element Selection ---
  const formContainer = document.getElementById("formContainer");
  const formFlipper = document.querySelector(".form-flipper");

  // Buttons for switching forms
  const goToLogin = document.getElementById("goToLogin");
  const goToAdmin = document.getElementById("goToAdmin");
  const goToRegistrationFromLogin = document.getElementById("goToRegistrationFromLogin");
  const goToRegistrationFromAdmin = document.getElementById("goToRegistrationFromAdmin");

  // Forms
  const registrationForm = document.getElementById("registrationForm");
  const loginForm = document.getElementById("loginForm");
  const adminForm = document.getElementById("adminForm");

  const allInputs = document.querySelectorAll("input, textarea");

  // --- Functions ---
  function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const icon =
      input.nextElementSibling?.querySelector(".material-symbols-outlined");
    if (!icon) return;

    if (input.type === "password") {
      input.type = "text";
      icon.textContent = "visibility";
    } else {
      input.type = "password";
      icon.textContent = "visibility_off";
    }
  }

  function adjustContainerHeight(activeForm) {
    if (formContainer && activeForm) {
      formContainer.style.height = `${activeForm.offsetHeight}px`;
    }
  }

  // --- Initial Setup ---
  setTimeout(() => adjustContainerHeight(registrationForm), 150);

  // --- Form Navigation ---

  // Go to Login
  if (goToLogin) {
    goToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      formFlipper.classList.remove("show-admin");
      formFlipper.classList.add("show-login");
      adjustContainerHeight(loginForm);
    });
  }

  // Go to Admin
  if (goToAdmin) {
    goToAdmin.addEventListener("click", (e) => {
      e.preventDefault();
      formFlipper.classList.remove("show-login");
      formFlipper.classList.add("show-admin");
      adjustContainerHeight(adminForm);
    });
  }

  // Go back to Registration from Login
  if (goToRegistrationFromLogin) {
    goToRegistrationFromLogin.addEventListener("click", (e) => {
      e.preventDefault();
      formFlipper.classList.remove("show-login", "show-admin");
      adjustContainerHeight(registrationForm);
    });
  }

  // Go back to Registration from Admin
  if (goToRegistrationFromAdmin) {
    goToRegistrationFromAdmin.addEventListener("click", (e) => {
      e.preventDefault();
      formFlipper.classList.remove("show-login", "show-admin");
      adjustContainerHeight(registrationForm);
    });
  }

  // --- Prevent default form submissions ---
  [registrationForm, loginForm, adminForm].forEach((form) => {
    if (form) form.addEventListener("submit", (e) => e.preventDefault());
  });

  // --- Password toggle click handler ---
  allInputs.forEach((input) => {
    const icon =
      input.nextElementSibling?.querySelector(".material-symbols-outlined");
    if (icon) icon.addEventListener("click", () => togglePassword(input.id));
  });

  // --- Height adjustment on resize ---
  window.addEventListener("resize", () => {
    if (formFlipper.classList.contains("show-login")) {
      adjustContainerHeight(loginForm);
    } else if (formFlipper.classList.contains("show-admin")) {
      adjustContainerHeight(adminForm);
    } else {
      adjustContainerHeight(registrationForm);
    }
  });

  window.togglePassword = togglePassword;
});