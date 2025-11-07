document.addEventListener("DOMContentLoaded", () => {
  const adminForm = document.getElementById("adminForm");
  if (!adminForm) return;

  adminForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    const adminAccounts = [{ email: "Gloria", password: "gloria123" }];

    const validAdmin = adminAccounts.find(
      (admin) => admin.email === email && admin.password === password
    );

    if (validAdmin) {
      localStorage.setItem(
        "adminSession",
        JSON.stringify({ email, role: "admin", loggedIn: true })
      );

      // ✅ replace alert with showNotification
      showNotification(
        "Login Successful",
        "Welcome back, Gloria! Redirecting to Admin Dashboard...",
        "success",
        2000
      );

      setTimeout(() => {
        window.location.href = "Admin/dashboard.html";
      }, 2000);
    } else {
      // ❌ invalid credentials → notification instead of alert
      showNotification(
        "Login Failed",
        "Invalid email or password. Please try again.",
        "error",
        4000
      );
    }
  });
});