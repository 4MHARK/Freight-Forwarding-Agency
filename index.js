// Password toggle functionality
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling.querySelector('.material-symbols-outlined');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = 'visibility';
    } else {
        input.type = 'password';
        button.textContent = 'visibility_off';
    }
}

// Form submission
const form = document.getElementById('registrationForm');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Add loading state
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.querySelector('span').textContent = 'Creating Account...';

    // Simulate API call
    setTimeout(() => {
        alert('Account created successfully!');
        form.reset();
        submitBtn.classList.remove('loading');
        submitBtn.querySelector('span').textContent = 'Create Account';
    }, 2000);
});

// Add floating animation to inputs on focus
const inputs = document.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.01)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Add ripple effect to button
const button = document.querySelector('.btn-submit');
button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
});

// Parallax effect for background particles
document.addEventListener('mousemove', (e) => {
    const particles = document.querySelectorAll('.particle');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    particles.forEach((particle, index) => {
        const speed = (index + 1) * 20;
        particle.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// Form validation with visual feedback
inputs.forEach(input => {
    input.addEventListener('input', function() {
        if (this.validity.valid) {
            this.style.borderColor = '#16a34a';
        } else if (this.value !== '') {
            this.style.borderColor = '#dc2626';
        }
    });
});

// Animate form groups on scroll into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.form-group').forEach(group => {
    observer.observe(group);
});