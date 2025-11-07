function showNotification(title, message, type = "success", duration = 5000) {
    const container = document.getElementById("notification-container");
    if (!container) return console.error("Notification container not found!");
  
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