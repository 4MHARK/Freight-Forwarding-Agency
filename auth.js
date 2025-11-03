document.addEventListener("DOMContentLoaded", () => {
    // =================================================================
    // ==           CUSTOM NOTIFICATION FUNCTION
    // =================================================================
    function showNotification(
      title,
      message,
      type = "success",
      duration = 5000
    ) {
      const container = document.getElementById("notification-container");
      if (!container) {
        console.error("Notification container not found!");
        return;
      }
  
      const notification = document.createElement("div");
      notification.className = `notification ${type}`;
      notification.innerHTML = `
        <div class="notification-icon">
          ${
            type === "success"
              ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
              : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>`
          }
        </div>
        <div class="notification-content">
          <p class="notification-title">${title}</p>
          <p class="notification-message">${message}</p>
        </div>
        <button class="notification-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
        </button>
      `;
  
      container.appendChild(notification);
      const removeNotification = () => {
        notification.classList.add("exiting");
        notification.addEventListener("transitionend", () => notification.remove());
      };
      let timer;
      if (duration > 0) timer = setTimeout(removeNotification, duration);
      notification
        .querySelector(".notification-close")
        .addEventListener("click", () => {
          clearTimeout(timer);
          removeNotification();
        });
    }
  
    // =================================================================
    // ==           DATABASE & SESSION HELPERS
    // =================================================================
    const DB_KEY = "users";
    const SESSION_KEY = "sessionUser";
  
    function getUsers() {
      return JSON.parse(localStorage.getItem(DB_KEY)) || [];
    }
    function saveUsers(users) {
      localStorage.setItem(DB_KEY, JSON.stringify(users));
    }
    function setSession(user) {
      const { companyName, email } = user;
      localStorage.setItem(SESSION_KEY, JSON.stringify({ companyName, email }));
    }
  
    // =================================================================
    // ==           SIGNUP FORM LOGIC
    // =================================================================
    const registrationForm = document.getElementById("registrationForm");
    if (registrationForm) {
      registrationForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const companyName = document.getElementById("companyName").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const terms = document.getElementById("terms").checked;
  
        if (!terms) {
          return showNotification("Action Required", "Please agree to the Terms and Conditions.", "error");
        }
        if (password !== confirmPassword) {
          return showNotification("Signup Error", "Passwords do not match.", "error");
        }
  
        const users = getUsers();
        if (users.some((u) => u.email === email)) {
          return showNotification("Signup Error", "An account with this email already exists.", "error");
        }
  
        // --- NEW: Add user status for onboarding ---
        const newUser = {
          companyName,
          email,
          password,
          status: "NEEDS_FORM_SUBMISSION", // This is the key change
          // You can add other fields from your form here too
          rcNumber: document.getElementById("rcNumber").value.trim(),
          phone: document.getElementById("phone").value.trim(),
          address: document.getElementById("address").value.trim(),
          createdAt: new Date().toISOString(),
        };
  
        users.push(newUser);
        saveUsers(users);
        setSession(newUser);
  
        showNotification("Account Created!", "Redirecting you to complete your company profile...", "success", 3000);
  
        // --- FIXED: Redirect to the correct onboarding step ---
        setTimeout(() => {
          window.location.href = "digital-form-sub.html"; // Redirect to form submission
        }, 3000);
      });
    }
  
    // =================================================================
    // ==           LOGIN FORM LOGIC
    // =================================================================
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailOrName = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;
        const users = getUsers();
        const user = users.find(
          (u) =>
            (u.email === emailOrName || u.companyName.toLowerCase() === emailOrName) &&
            u.password === password
        );
  
        if (!user) {
          return showNotification("Login Failed", "Invalid credentials. Please try again.", "error");
        }
  
        setSession(user);
  
        // --- NEW: The Login Checkpoint ---
        let redirectUrl = "./User-Dashboard/dashboard.html"; // Default redirect location
        let welcomeMessage = `Welcome back, ${user.companyName}!`;
  
        if (user.status === "NEEDS_FORM_SUBMISSION") {
          redirectUrl = "./digital-form-submission/digital-form-sub.html";
          welcomeMessage = "Welcome! Please complete your profile.";
        }
        // You can add more else-if checks here later for other statuses like 'NEEDS_DOCUMENTS'
  
        showNotification(welcomeMessage, "Redirecting you now...", "success", 4000);
  
        // --- FIXED: Redirect logic is now dynamic ---
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 4000);
      });
    }
  
    // =================================================================
    // ==           PAGE SWITCHING & UI HELPERS
    // =================================================================
    const goToLoginBtn = document.getElementById("goToLogin");
    if (goToLoginBtn) {
      goToLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(".form-flipper").classList.add("show-login");
      });
    }
    const goToRegistrationBtn = document.getElementById("goToRegistration");
    if (goToRegistrationBtn) {
      goToRegistrationBtn.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(".form-flipper").classList.remove("show-login");
      });
    }
    window.togglePassword = function (id) {
      const input = document.getElementById(id);
      if (input) {
        input.type = input.type === "password" ? "text" : "password";
      }
    };
  });