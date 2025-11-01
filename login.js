
// const togglePassword = (id) => {
//   const passwordInput = document.getElementById(id);
//   const toggle = document.getElementById('togglePwd');
//   const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
//   passwordInput.setAttribute('type', type);
//   toggle.textContent = type === 'password' ? 'visibility' : 'visibility_off';
// };


//   /* --- password toggle --- */
//   const togglePwd = document.getElementById("togglePwd");
//   const pwdField = document.getElementById("password");
//   togglePwd.addEventListener("click", () => {
//     const type =
//       pwdField.getAttribute("type") === "password" ? "text" : "password";
//     pwdField.setAttribute("type", type);
//     togglePwd.textContent =
//       type === "password" ? "visibility" : "visibility_off";
//   });

//   /* --- button press animation --- */
//   const btn = document.getElementById("loginBtn");
//   btn.addEventListener("click", () => {
//     btn.style.transform = "scale(0.95)";
//     setTimeout(() => (btn.style.transform = ""), 150);
//   });

//   /* --- simple scroll/visibility animation --- */
//   const observer = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add("visible");
//           observer.unobserve(entry.target);
//         }
//       });
//     },
//     { threshold: 0.15 }
//   );

//   document.querySelectorAll(".fade-section").forEach((sec) => observer.observe(sec));