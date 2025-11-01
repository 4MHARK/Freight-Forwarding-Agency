document.addEventListener("DOMContentLoaded", () => {
  // =================================================================
  // ==           SECTION 1: HELPER FUNCTIONS
  // =================================================================

  // --- DATABASE & SESSION HELPERS ---
  const DB_KEY = "users";
  const SESSION_KEY = "sessionUser";

  function getUsers() {
    return JSON.parse(localStorage.getItem(DB_KEY)) || [];
  }
  function saveUsers(users) {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  }
  function getSession() {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  }

  // --- NOTIFICATION FUNCTION ---
  /**
   * Shows a styled notification on the page.
   * @param {string} title - The main title of the notification.
   * @param {string} message - The detailed message.
   * @param {string} type - The type ('success' or 'error').
   * @param {number} duration - How long to display in ms.
   */
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
  // ==           SECTION 2: PAGE INITIALIZATION & PROTECTION
  // =================================================================

  const sessionUser = getSession();
  if (!sessionUser) {
    // Route Protection: If no one is logged in, redirect them.
    window.location.href = "login.html";
    return; // Stop the script from running further
  }

  // Set user profile picture (optional but professional touch)
  const profilePic = document.getElementById("user-profile-picture");
  if (profilePic) {
    profilePic.style.backgroundImage = `url('https://avatar.vercel.sh/${sessionUser.email}.svg')`;
  }

  // =================================================================
  // ==           SECTION 3: DYNAMIC FILE UPLOAD LOGIC
  // =================================================================

  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-upload");
  const fileListContainer = document.getElementById("file-list-container");
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Highlight drop zone on drag over
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("is-active");
  });
  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("is-active");
  });

  // Handle file drop
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("is-active");
    handleFiles(e.dataTransfer.files);
  });

  // Handle file selection from browse button
  fileInput.addEventListener("change", (e) => handleFiles(e.target.files));

  function handleFiles(files) {
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        addFileToList(file, "error", "File is too large (max 5MB).");
      } else {
        const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
        addFileToList(file, "success", `${sizeInMB} MB - Upload complete`);
      }
    }
  }

  function addFileToList(file, status, message) {
    const fileItem = document.createElement("div");
    fileItem.className = `file-item ${status}`;
    let icon = status === "success" ? "task_alt" : status === "error" ? "error" : "description";
    let buttonIcon = status === "error" ? "refresh" : "delete";

    fileItem.innerHTML = `
      <div class="file-icon"><span class="material-symbols-outlined">${icon}</span></div>
      <div class="file-details">
        <p class="file-name">${file.name}</p>
        <p class="file-status ${status === 'error' ? 'error-message' : ''}">${message}</p>
      </div>
      <button type="button" class="file-action-btn">
        <span class="material-symbols-outlined">${buttonIcon}</span>
      </button>
    `;
    fileListContainer.appendChild(fileItem);

    fileItem.querySelector(".file-action-btn").addEventListener("click", () => {
      fileItem.remove();
    });
  }

  // =================================================================
  // ==           SECTION 4: FORM SUBMISSION LOGIC
  // =================================================================

  const digitalForm = document.getElementById("digital-form");
  if (digitalForm) {
    digitalForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const users = getUsers();
      const currentUserEmail = sessionUser.email;
      const userIndex = users.findIndex((u) => u.email === currentUserEmail);

      if (userIndex !== -1) {
        // --- THIS IS THE CRITICAL STEP ---
        // 1. Update the user's status to show they've completed this step.
        users[userIndex].status = "NEEDS_ADMIN_APPROVAL";

        // 2. Add all the detailed form data to the user's object.
        users[userIndex].companyDetails = {
          rcNumber: document.getElementById("rc-number").value,
          incorporationDate: document.getElementById("incorporation-date").value,
          phone: document.getElementById("phone").value,
          address: document.getElementById("address").value,
        };

        // 3. Save the updated information back to our "database".
        saveUsers(users);

        // 4. Give the user clear feedback and redirect them.
        showNotification(
          "Application Submitted!",
          "You will be redirected to your dashboard.",
          "success",
          3000
        );
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 3000);
      } else {
        // This is an edge case, but good to handle.
        showNotification(
          "Session Error",
          "Could not find your user session. Please log in again.",
          "error",
          4000
        );
        setTimeout(() => {
          window.location.href = "login.html";
        }, 4000);
      }
    });
  }
});