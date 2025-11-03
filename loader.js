// Blue progress bar effect for all internal navigation
const progress = document.getElementById("page-progress");

// Select all internal navigation links
const internalLinks = document.querySelectorAll("a[href$='.html']");

internalLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = link.getAttribute("href");

    // Allow external links or empty hrefs to work normally
    if (!target || target.startsWith("http")) return;

    e.preventDefault();

    // Reset progress bar and start animation
    progress.style.width = "0%";
    progress.style.opacity = "1";

    // Trigger animation
    setTimeout(() => {
      progress.style.width = "100%";
    }, 50);

    // Optional fade-out just before next page
    setTimeout(() => {
      progress.style.opacity = "0";
    }, 1800); // this is slightly before the redirect

    // Redirect after ~2s delay
    setTimeout(() => {
      window.location.href = target;
    }, 2000);
  });
});

// Optional: show bar quickly on actual reloads (useful if page loads directly)
window.addEventListener("load", () => {
  progress.style.width = "100%";
  setTimeout(() => (progress.style.opacity = "0"), 600);
});