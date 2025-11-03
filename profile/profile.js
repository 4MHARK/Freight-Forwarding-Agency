
// Navigation
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', function() {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

// Save button
const saveBtn = document.getElementById('saveBtn');
const successMessage = document.getElementById('successMessage');

saveBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
        
        // Show success message
        successMessage.classList.add('show');
        
        setTimeout(() => {
            successMessage.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                successMessage.classList.remove('show');
                successMessage.style.animation = '';
            }, 300);
        }, 3000);
    }, 100);
});

// Cancel button
const cancelBtn = document.getElementById('cancelBtn');
cancelBtn.addEventListener('click', () => {
    if (confirm('Discard changes?')) {
        document.getElementById('profileForm').reset();
    }
});

// Upload button
const uploadBtn = document.getElementById('uploadBtn');
uploadBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    
    input.addEventListener('change', () => {
        if (input.files.length > 0) {
            alert('New profile picture uploaded!');
        }
    });
});

// Input focus animations
const inputs = document.querySelectorAll('input, select, textarea');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.01)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .form-group, .timeline-item').forEach(el => {
    observer.observe(el);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveBtn.click();
    }
});

console.log('Profile Settings loaded with animations!');