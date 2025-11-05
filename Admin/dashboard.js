
// Navigation
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
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

// Animate stat values on load
window.addEventListener('load', () => {
    document.querySelectorAll('.stat-value[data-count]').forEach(element => {
        const target = parseInt(element.dataset.count);
        setTimeout(() => {
            animateCounter(element, target);
        }, 600);
    });
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');

mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
    icon.textContent = sidebar.classList.contains('mobile-open') ? 'close' : 'menu';
});

// Close sidebar on outside click (mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
            mobileMenuBtn.querySelector('.material-symbols-outlined').textContent = 'menu';
        }
    }
});

// Search bar interaction
const searchBar = document.querySelector('.search-bar input');
searchBar.addEventListener('focus', () => {
    searchBar.parentElement.style.transform = 'translateY(-2px)';
});
searchBar.addEventListener('blur', () => {
    searchBar.parentElement.style.transform = '';
});

// Export buttons
const exportBtns = document.querySelectorAll('.export-btn');
exportBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const format = this.textContent.trim();
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
            alert(`Exporting data as ${format}...`);
        }, 200);
    });
});

// Action button
const actionBtn = document.querySelector('.action-btn');
actionBtn.addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
        alert('Opening announcement form...');
    }, 200);
});

// Table row interactions
const tableRows = document.querySelectorAll('tbody tr');
tableRows.forEach(row => {
    row.addEventListener('click', function(e) {
        if (!e.target.closest('button')) {
            this.style.transform = 'scale(1.01)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        }
    });
});

// Action buttons in table
const actionIconBtns = document.querySelectorAll('.action-icon-btn');
actionIconBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const action = this.querySelector('.material-symbols-outlined').textContent;
        console.log(`Action: ${action}`);
    });
});

// Pagination
const paginationBtns = document.querySelectorAll('.pagination-btn:not(:disabled)');
paginationBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        if (!this.classList.contains('active')) {
            paginationBtns.forEach(b => b.classList.remove('active'));
            if (this.textContent.match(/\d/)) {
                this.classList.add('active');
            }
        }
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

document.querySelectorAll('.stat-card, .chart-card, .table-card').forEach(el => {
    observer.observe(el);
});

// Card hover effects
const cards = document.querySelectorAll('.stat-card, .chart-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// Logout button
const logoutBtn = document.querySelector('.logout-btn');
logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        alert('Logging out...');
    }
});

// Notification button
const notificationBtn = document.querySelector('.notification-btn');
notificationBtn.addEventListener('click', () => {
    alert('You have 3 new notifications');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        sidebar.classList.remove('mobile-open');
        mobileMenuBtn.querySelector('.material-symbols-outlined').textContent = 'menu';
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchBar.focus();
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(localStorage.getItem("sessionUser"));
    if (!userData) {
      window.location.href = "../index.html"; // safety redirect
      return;
    }
    
    document.getElementById("userName").textContent = userData.companyName;
    document.getElementById("userStatus").textContent = userData.status;
  
    // Optional: display success notification
    if (userData.status === "ACTIVE") {
      console.log("✅ User is active and dashboard loaded successfully.");
    }
  });
console.log('CRFFN Admin Portal loaded successfully! 🚀');