document.addEventListener("DOMContentLoaded", () => {
    /**
     * SCROLL ANIMATION
     * Adds a 'is-visible' class to elements with the 'data-animate' attribute
     * when they enter the viewport.
     */
    const animatedElements = document.querySelectorAll("[data-animate]");
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Optional: unobserve after animation to save resources
            // observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );
  
    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  
    /**
     * DARK MODE TOGGLE (Example)
     * This is an example of how you could toggle dark mode.
     * You would need to add a button with the id 'darkModeToggle' to your HTML.
     */
    const toggleButton = document.getElementById("darkModeToggle");
    const htmlElement = document.documentElement;
  
    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        if (htmlElement.classList.contains("dark")) {
          htmlElement.classList.remove("dark");
          htmlElement.classList.add("light");
        } else {
          htmlElement.classList.remove("light");
          htmlElement.classList.add("dark");
        }
      });
    }
  });