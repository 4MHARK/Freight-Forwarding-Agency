
// Navigation
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        navItems.forEach(nav => {
            nav.classList.remove('active');
            nav.querySelector('.material-symbols-outlined').classList.remove('fill');
        });
        this.classList.add('active');
        this.querySelector('.material-symbols-outlined').classList.add('fill');
    });
});

// Counter Animation
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Animate chart value on load
window.addEventListener('load', () => {
    const chartValue = document.getElementById('chartValue');
    setTimeout(() => {
        animateCounter(chartValue, 1204, 2000);
    }, 800);
});

// Filter Chips
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => {
    chip.addEventListener('click', function() {
        chips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        
        // Re-animate chart
        const pathStroke = document.querySelector('.chart-path-stroke');
        pathStroke.style.animation = 'none';
        setTimeout(() => {
            pathStroke.style.animation = '';
        }, 10);
    });
});

// New Shipment Button
const newShipmentBtn = document.querySelector('.new-shipment-btn');
newShipmentBtn.addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
        alert('Opening new shipment form...');
    }, 200);
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');

mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
    icon.textContent = sidebar.classList.contains('mobile-open') ? 'close' : 'menu';
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
            mobileMenuBtn.querySelector('.material-symbols-outlined').textContent = 'menu';
        }
    }
});

// Card Hover Effects
const cards = document.querySelectorAll('.chart-card, .progress-card, .performance-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// Achievement Click Animation
const achievements = document.querySelectorAll('.achievement');
achievements.forEach(achievement => {
    achievement.addEventListener('click', function() {
        if (this.classList.contains('locked')) {
            this.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        } else {
            const badge = this.querySelector('.achievement-badge');
            badge.style.animation = 'rotate 0.6s ease';
            setTimeout(() => {
                badge.style.animation = '';
            }, 600);
        }
    });
});

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Scroll Progress Indicator
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add parallax effect to cards
    const scrolled = window.pageYOffset;
    cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const offset = (window.innerHeight - rect.top) * 0.02;
            card.style.transform = `translateY(${-offset}px)`;
        }
    });
    
    lastScrollTop = scrollTop;
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.chart-card, .progress-card, .performance-card, .achievement').forEach(el => {
    observer.observe(el);
});

// Stat values counter animation on hover
const statValues = document.querySelectorAll('.stat-value');
statValues.forEach(stat => {
    stat.addEventListener('mouseenter', function() {
        this.style.color = 'var(--primary)';
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'all 0.3s ease';
    });
    
    stat.addEventListener('mouseleave', function() {
        this.style.color = '';
        this.style.transform = '';
    });
});

// Progress ring interaction
const progressRing = document.querySelector('.progress-ring-fill');
const progressCard = document.querySelector('.progress-card');

progressCard.addEventListener('mouseenter', () => {
    progressRing.style.strokeDashoffset = '10';
    progressRing.style.transition = 'stroke-dashoffset 0.5s ease';
});

progressCard.addEventListener('mouseleave', () => {
    progressRing.style.strokeDashoffset = '15';
});

// Add ripple effect to buttons and cards
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(19, 236, 91, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Add ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Apply ripple to interactive elements
chips.forEach(chip => {
    chip.addEventListener('click', function(e) {
        createRipple(e, this);
    });
});

newShipmentBtn.addEventListener('click', function(e) {
    createRipple(e, this);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        sidebar.classList.remove('mobile-open');
        mobileMenuBtn.querySelector('.material-symbols-outlined').textContent = 'menu';
    }
    
    // Ctrl/Cmd + N for new shipment
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        newShipmentBtn.click();
    }
});

// Performance optimization
const lazyElements = document.querySelectorAll('.chart-card, .progress-card, .performance-card, .achievement');

const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.willChange = 'transform, opacity';
            setTimeout(() => {
                entry.target.style.willChange = 'auto';
            }, 1000);
        }
    });
}, { threshold: 0.1 });

lazyElements.forEach(el => lazyObserver.observe(el));

// Add hover sound effect simulation (visual feedback)
navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.boxShadow = '0 4px 12px rgba(19, 236, 91, 0.2)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.boxShadow = '';
    });
});

// Auto-update time simulation
function updateDashboard() {
    // Simulate real-time updates
    console.log('Dashboard updated at:', new Date().toLocaleTimeString());
}

setInterval(updateDashboard, 30000); // Update every 30 seconds

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add tooltips to achievements
achievements.forEach(achievement => {
    const name = achievement.querySelector('.achievement-name').textContent;
    achievement.title = achievement.classList.contains('locked') 
        ? `${name} - Keep working to unlock!` 
        : `${name} - Earned!`;
});

// Console log for debugging
console.log('FreightForward Dashboard loaded successfully! 🚀');
console.log('Total animations:', document.querySelectorAll('[style*="animation"]').length);
