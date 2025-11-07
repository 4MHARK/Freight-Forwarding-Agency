document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll(".nav-item");
    const sections = [
      document.querySelector(".page-content"), // Dashboard section
      ...document.querySelectorAll(".section"), // All other identified sections
    ];
  
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Remove active style from all
        navItems.forEach((nav) => nav.classList.remove("active"));
  
        // Add to the clicked one
        item.classList.add("active");
  
        // Hide everything
        sections.forEach((s) => s.classList.add("hidden"));
  
        // Show the right section
        const sectionId = item.getAttribute("data-section");
        if (sectionId === "dashboard") {
          document.querySelector(".page-content").classList.remove("hidden");
        } else {
          const sectionToShow = document.getElementById(`${sectionId}-section`);
          if (sectionToShow) {
            sectionToShow.classList.remove("hidden");
          }
        }
      });
    });
  });