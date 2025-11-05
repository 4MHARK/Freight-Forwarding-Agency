// =====================================================
// DIGITAL-FORM.JS — Prefills, handles uploads, and submits application
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  // =================================================================
  // ==           SECTION 1: HELPER FUNCTIONS
  // =================================================================

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
  function showNotification(title, message, type = "success", duration = 4000) {
    const container = document.getElementById("notification-container");
    if (!container) {
      alert(`${title}: ${message}`);
      return;
    }

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-icon">
        <span class="material-symbols-outlined">
          ${type === "success" ? "check_circle" : "error"}
        </span>
      </div>
      <div class="notification-content">
        <p class="notification-title">${title}</p>
        <p class="notification-message">${message}</p>
      </div>
      <button class="notification-close">&times;</button>
    `;

    container.appendChild(notification);

    const removeNotification = () => notification.remove();
    notification
      .querySelector(".notification-close")
      .addEventListener("click", removeNotification);
    setTimeout(removeNotification, duration);
  }

  // =================================================================
  // ==           SECTION 2: PAGE INITIALIZATION & PREFILL
  // =================================================================

  const sessionUser = getSession();
  if (!sessionUser) {
    // Route Protection
    window.location.href = "../index.html";
    return;
  }

  // ✅ Prefill company data using IDs with hyphens
  const prefillMap = [
    ["company-name", sessionUser.companyName],
    ["rc-number", sessionUser.rcNumber],
    ["email", sessionUser.email],
    ["phone", sessionUser.phone],
    ["address", sessionUser.address],
  ];
  prefillMap.forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el && value) el.value = value;
  });

  // Optional: profile picture avatar
  const profilePic = document.getElementById("user-profile-picture");
  if (profilePic) {
    profilePic.style.backgroundImage = `url('https://avatar.vercel.sh/${sessionUser.email}.svg')`;
  }

  // =================================================================
  // ==           SECTION 3: FILE UPLOAD LOGIC (UNCHANGED)
  // =================================================================

  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-upload");
  const fileListContainer = document.getElementById("file-list-container");
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  if (dropZone && fileInput && fileListContainer) {
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("is-active");
    });

    dropZone.addEventListener("dragleave", () =>
      dropZone.classList.remove("is-active")
    );

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("is-active");
      handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener("change", (e) => handleFiles(e.target.files));
  }

  function handleFiles(files) {
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        addFileToList(file, "error", "File is too large (max 5MB).");
      } else {
        const sizeMB = (file.size / 1024 / 1024).toFixed(2);
        addFileToList(file, "success", `${sizeMB} MB - Upload complete`);
      }
    }
  }

  function addFileToList(file, status, message) {
    const fileItem = document.createElement("div");
    fileItem.className = `file-item ${status}`;
    const icon = status === "success" ? "task_alt" : "error";
    fileItem.innerHTML = `
      <div class="file-icon">
        <span class="material-symbols-outlined">${icon}</span>
      </div>
      <div class="file-details">
        <p class="file-name">${file.name}</p>
        <p class="file-status ${status === "error" ? "error-message" : ""}">
          ${message}
        </p>
      </div>
      <button type="button" class="file-action-btn">
        <span class="material-symbols-outlined">delete</span>
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

      // Get users db + current user record
      const users = getUsers();
      const idx = users.findIndex((u) => u.email === sessionUser.email);

      if (idx === -1) {
        showNotification(
          "Session Error",
          "Could not find your user session. Please log in again.",
          "error"
        );
        setTimeout(() => (window.location.href = "../index.html"), 2000);
        return;
      }

      // ✅ Update and sync new company data
      const updatedUser = {
        ...users[idx],
        companyName: document.getElementById("company-name").value.trim(),
        rcNumber: document.getElementById("rc-number").value.trim(),
        incorporationDate:
          document.getElementById("incorporation-date").value.trim() || "",
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        status: "ACTIVE",
        updatedAt: new Date().toISOString(),
      };

      users[idx] = updatedUser;
      saveUsers(users);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

      showNotification(
        "Application Submitted!",
        "Redirecting you to your dashboard...",
        "success",
        2500
      );

      setTimeout(() => {
        window.location.href = "../User-Dashboard/dashboard.html";
      }, 2500);
    });
  }
});