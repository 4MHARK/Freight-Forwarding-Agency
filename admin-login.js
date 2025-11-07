document.addEventListener("DOMContentLoaded", () => {
  const adminForm = document.getElementById("adminForm");
  const accounts = [{ email: "Gloria", password: "gloria123" }];

  adminForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    const validAdmin = accounts.find(
      (a) =>
        a.email.toLowerCase() === email.toLowerCase() &&
        a.password === password
    );

    if (validAdmin) {
      localStorage.setItem(
        "adminSession",
        JSON.stringify({ email, role: "admin", loggedIn: true })
      );
      alert("Login success! Redirecting...");
      window.location.href = "../Admin/dashboard.html";
    } else {
      alert("Invalid email or password. Please try again.");
    }
  });
});