// ===============================================================
// ==   CUSTOM NOTIFICATION FUNCTION  (same as auth.js style)
// ===============================================================
function showNotification(title, message, type = "success", duration = 5000) {
    const container = document.getElementById("notification-container");
    if (!container) return console.error("Notification container not found!");
  
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-icon">
        ${
          type === "success"
            ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>`
        }
      </div>
      <div class="notification-content">
        <p class="notification-title">${title}</p>
        <p class="notification-message">${message}</p>
      </div>
      <button class="notification-close">×</button>
    `;
  
    container.appendChild(notification);
  
    const remove = () => {
      notification.classList.add("exiting");
      notification.addEventListener("transitionend", () => notification.remove());
    };
  
    const timer = duration ? setTimeout(remove, duration) : null;
    notification.querySelector(".notification-close").addEventListener("click", () => {
      clearTimeout(timer);
      remove();
    });
  }
  
  // ===============================================================
  // ==   DASHBOARD INTERACTIONS
  // ===============================================================
  
  // Navigation
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      navItems.forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");
    });
  });
  
  // Counter Animation
  function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  }
  
  // Animate stat values on load
  window.addEventListener("load", () => {
    document.querySelectorAll(".stat-value[data-count]").forEach((element) => {
      const target = parseInt(element.dataset.count);
      setTimeout(() => {
        animateCounter(element, target);
      }, 600);
    });
  });
  
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const sidebar = document.getElementById("sidebar");
  
  mobileMenuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("mobile-open");
    const icon = mobileMenuBtn.querySelector(".material-symbols-outlined");
    icon.textContent = sidebar.classList.contains("mobile-open") ? "close" : "menu";
  });
  
  // Close sidebar on outside click (mobile)
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        sidebar.classList.remove("mobile-open");
        mobileMenuBtn.querySelector(".material-symbols-outlined").textContent =
          "menu";
      }
    }
  });
  
  // Search bar interaction
  const searchBar = document.querySelector(".search-bar input");
  searchBar.addEventListener("focus", () => {
    searchBar.parentElement.style.transform = "translateY(-2px)";
  });
  searchBar.addEventListener("blur", () => {
    searchBar.parentElement.style.transform = "";
  });
  
  // Export buttons
  const exportBtns = document.querySelectorAll(".export-btn");
  exportBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const format = this.textContent.trim();
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
        showNotification("Export Started", `Exporting data as ${format}...`, "info");
      }, 200);
    });
  });
  
  // Action button
  const actionBtn = document.querySelector(".action-btn");
  actionBtn.addEventListener("click", function () {
    this.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.style.transform = "";
      showNotification("Announcement", "Opening announcement form...", "info");
    }, 200);
  });
  
  // Table row interactions
  const tableRows = document.querySelectorAll("tbody tr");
  tableRows.forEach((row) => {
    row.addEventListener("click", function (e) {
      if (!e.target.closest("button")) {
        this.style.transform = "scale(1.01)";
        setTimeout(() => {
          this.style.transform = "";
        }, 200);
      }
    });
  });
  
  // Action buttons in table
  const actionIconBtns = document.querySelectorAll(".action-icon-btn");
  actionIconBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const action = this.querySelector(".material-symbols-outlined").textContent;
      console.log(`Action: ${action}`);
    });
  });
  
  // Pagination
  const paginationBtns = document.querySelectorAll(".pagination-btn:not(:disabled)");
  paginationBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      if (!this.classList.contains("active")) {
        paginationBtns.forEach((b) => b.classList.remove("active"));
        if (this.textContent.match(/\d/)) {
          this.classList.add("active");
        }
      }
    });
  });
  
  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );
  
  document
    .querySelectorAll(".stat-card, .chart-card, .table-card")
    .forEach((el) => observer.observe(el));
  
  // Card hover effects
  const cards = document.querySelectorAll(".stat-card, .chart-card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.zIndex = "10";
    });
    card.addEventListener("mouseleave", function () {
      this.style.zIndex = "1";
    });
  });
  
  // Logout button
  const logoutBtn = document.querySelector(".logout-btn");
  logoutBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      showNotification("Logging Out", "Redirecting to login page...", "success", 3000);
      setTimeout(() => {
        localStorage.removeItem("adminSession");
        window.location.href = "../index.html";
      }, 3000);
    }
  });
  
  // Notification bell
  const notificationBtn = document.querySelector(".notification-btn");
  notificationBtn.addEventListener("click", () => {
    showNotification("Notifications", "You have 3 new alerts today.", "info");
  });
  
  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      sidebar.classList.remove("mobile-open");
      mobileMenuBtn.querySelector(".material-symbols-outlined").textContent = "menu";
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      searchBar.focus();
      showNotification("Search", "Focus moved to search bar", "info", 1500);
    }
  });
  
  // ===============================================================
  // ==   ADMIN SESSION VALIDATION
  // ===============================================================
  document.addEventListener("DOMContentLoaded", () => {
    const adminData = JSON.parse(localStorage.getItem("adminSession"));
  
    if (!adminData || !adminData.loggedIn) {
      console.warn("No valid admin session found — redirecting to index.");
      showNotification("Session Expired", "Please log in again.", "error", 2500);
      setTimeout(() => (window.location.href = "../index.html"), 2500);
      return;
    }
  
    const nameEl = document.getElementById("userName");
    const statusEl = document.getElementById("userStatus");
  
    if (nameEl) nameEl.textContent = adminData.email;
    if (statusEl) statusEl.textContent = adminData.role;
  
    console.log("✅ Admin dashboard loaded successfully.");
  });
  
  console.log("CRFFN Admin Portal loaded successfully! 🚀");