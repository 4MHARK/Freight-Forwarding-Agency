
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.getElementById("sidebarToggle");
  const navItems = document.querySelectorAll(".nav-item");

  // Toggle sidebar manually (menu icon click)
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // Handle nav click: expand -> navigate -> collapse again
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const path = item.getAttribute("data-link");

      // Expand fully first (if collapsed)
      sidebar.classList.remove("collapsed");

      // Small delay for expansion effect before navigating
      setTimeout(() => {
        window.location.href = path;

        // After navigation (you can also apply this on load)
        setTimeout(() => {
          sidebar.classList.add("collapsed");
        }, 1500);
      }, 250);
    });
  });

  // Optional: auto-collapse sidebar on smaller screens
  function handleResize() {
    if (window.innerWidth < 768) {
      sidebar.classList.add("collapsed");
    } else {
      sidebar.classList.remove("collapsed");
    }
  }

  window.addEventListener("resize", handleResize);
  handleResize();
});