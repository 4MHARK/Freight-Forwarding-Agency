document.addEventListener("DOMContentLoaded", () => {
  const adminForm = document.getElementById("adminForm");

  adminForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    const adminAccounts = [
      { email: "Gloria", password: "gloria123" },
    ];

    const validAdmin = adminAccounts.find(
      (admin) => admin.email === email && admin.password === password
    );

    if (validAdmin) {
      // ✅ Save admin session
      localStorage.setItem(
        "adminSession",
        JSON.stringify({ email, role: "admin", loggedIn: true })
      );
      console.log("Redirecting to admin dashboard...");

      window.location.href = "./Admin/dashboard.html";
    } else {
      alert("Invalid email or password. Please try again.");
    }
  });
});
