
// Initial tickets data
const defaultTickets = [
    {
        id: '#876321',
        subject: 'Issue with customs declaration for EU shipment',
        updated: '2 hours ago',
        status: 'progress'
    },
    {
        id: '#876198',
        subject: 'Billing inquiry for invoice INV-12345',
        updated: '1 day ago',
        status: 'open'
    },
    {
        id: '#875543',
        subject: 'Tracking update requested for shipment ABC-XYZ',
        updated: '3 days ago',
        status: 'closed'
    }
];

// Load tickets from localStorage or use defaults
let tickets = JSON.parse(localStorage.getItem('tickets')) || defaultTickets;
let currentFilter = 'all';

// Render tickets
function renderTickets(filter = 'all') {
    const tbody = document.getElementById('ticketsTableBody');
    tbody.innerHTML = '';

    const filtered = filter === 'all' 
        ? tickets 
        : tickets.filter(t => t.status === filter);

    filtered.forEach((ticket, index) => {
        const tr = document.createElement('tr');
        tr.style.animationDelay = `${index * 0.1}s`;
        
        const statusClass = `status-${ticket.status}`;
        const statusText = ticket.status === 'progress' ? 'In Progress' 
            : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1);

        tr.innerHTML = `
            <td class="ticket-id">${ticket.id}</td>
            <td class="ticket-subject">${ticket.subject}</td>
            <td>${ticket.updated}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        `;
        tbody.appendChild(tr);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #9ca3af;">No tickets found</td></tr>';
    }
}

// Filter tickets
function filterTickets(status) {
    currentFilter = status;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    renderTickets(status);
}

// Open ticket modal
function openTicketModal() {
    document.getElementById('ticketModal').classList.add('show');
}

// Close ticket modal
function closeTicketModal() {
    document.getElementById('ticketModal').classList.remove('show');
    document.getElementById('ticketForm').reset();
    document.getElementById('fileName').textContent = '';
}

// File upload handler
document.getElementById('fileInput').addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length > 0) {
        const fileNames = Array.from(files).map(f => f.name).join(', ');
        document.getElementById('fileName').textContent = `📎 ${fileNames}`;
    }
});

// Form submission
document.getElementById('ticketForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        id: `#${Math.floor(Math.random() * 900000) + 100000}`,
        subject: document.getElementById('subject').value,
        updated: 'Just now',
        status: 'open',
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value
    };

    // Add to tickets array
    tickets.unshift(formData);

    // Save to localStorage
    localStorage.setItem('tickets', JSON.stringify(tickets));

    // Close modal and show notification
    closeTicketModal();
    showNotification('Ticket Created', 'Support will respond shortly.', 'success');

    // Re-render tickets
    renderTickets(currentFilter);
});

// Show notification
function showNotification(title, body, type = 'info') {
    const notification = document.getElementById('notification');
    const icon = document.getElementById('notifIcon');
    const titleEl = document.getElementById('notifTitle');
    const bodyEl = document.getElementById('notifBody');

    // Set icon based on type
    const icons = {
        success: '✅',
        error: '❌',
        info: '💬'
    };

    icon.textContent = icons[type] || icons.info;
    titleEl.textContent = title;
    bodyEl.textContent = body;

    // Set notification type
    notification.className = `notification ${type} show`;

    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (!searchTerm) {
        renderTickets(currentFilter);
        return;
    }

    const tbody = document.getElementById('ticketsTableBody');
    tbody.innerHTML = '';

    const filtered = tickets.filter(ticket => 
        ticket.subject.toLowerCase().includes(searchTerm) ||
        ticket.id.toLowerCase().includes(searchTerm)
    );

    filtered.forEach((ticket, index) => {
        const tr = document.createElement('tr');
        tr.style.animationDelay = `${index * 0.1}s`;
        
        const statusClass = `status-${ticket.status}`;
        const statusText = ticket.status === 'progress' ? 'In Progress' 
            : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1);

        tr.innerHTML = `
            <td class="ticket-id">${ticket.id}</td>
            <td class="ticket-subject">${ticket.subject}</td>
            <td>${ticket.updated}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        `;
        tbody.appendChild(tr);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #9ca3af;">No results found</td></tr>';
    }
});

// Close modal when clicking outside
document.getElementById('ticketModal').addEventListener('click', (e) => {
    if (e.target.id === 'ticketModal') {
        closeTicketModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modal
    if (e.key === 'Escape') {
        closeTicketModal();
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// Simulate live chat connection
function startLiveChat() {
    showNotification('Live Chat', 'Connecting to support agent...', 'info');
    
    setTimeout(() => {
        showNotification('Live Chat', "You're now chatting with a support agent.", 'success');
    }, 2000);
}

// Add click handler to Live Chat card
document.querySelectorAll('.access-card')[3].addEventListener('click', startLiveChat);

// Add animation to status badges on hover
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .status-badge:hover {
            transform: scale(1.1);
            transition: transform 0.2s ease;
        }
    `;
    document.head.appendChild(style);
});

// Periodic ticket status updates (simulate backend)
setInterval(() => {
    const progressTickets = tickets.filter(t => t.status === 'progress');
    
    if (progressTickets.length > 0 && Math.random() > 0.7) {
        const ticket = progressTickets[Math.floor(Math.random() * progressTickets.length)];
        const index = tickets.findIndex(t => t.id === ticket.id);
        
        if (index !== -1) {
            tickets[index].status = 'closed';
            tickets[index].updated = 'Just now';
            localStorage.setItem('tickets', JSON.stringify(tickets));
            renderTickets(currentFilter);
            showNotification('Ticket Updated', `${ticket.id} has been closed.`, 'success');
        }
    }
}, 30000); // Check every 30 seconds

// Add right-click context menu for tickets (optional enhancement)
document.getElementById('ticketsTableBody').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const row = e.target.closest('tr');
    if (row) {
        const ticketId = row.querySelector('.ticket-id').textContent;
        showNotification('Ticket Action', `Right-clicked on ${ticketId}`, 'info');
    }
});

// Export tickets functionality
function exportTickets() {
    const dataStr = JSON.stringify(tickets, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `tickets-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Export Complete', 'Tickets exported successfully.', 'success');
}

// Clear all tickets (for testing)
function clearAllTickets() {
    if (confirm('Are you sure you want to clear all tickets?')) {
        tickets = defaultTickets;
        localStorage.setItem('tickets', JSON.stringify(tickets));
        renderTickets(currentFilter);
        showNotification('Tickets Reset', 'All tickets have been reset to defaults.', 'info');
    }
}

// Add keyboard shortcut info
console.log('%c🎫 FreightForward Support Center', 'color: #0d59f2; font-size: 16px; font-weight: bold;');
console.log('%cKeyboard Shortcuts:', 'color: #9ca3af; font-weight: bold;');
console.log('• ESC - Close modal');
console.log('• Ctrl/Cmd + K - Focus search');
console.log('%cFunctions available:', 'color: #9ca3af; font-weight: bold;');
console.log('• exportTickets() - Export all tickets to JSON');
console.log('• clearAllTickets() - Reset tickets to defaults');

// Initialize on page load
renderTickets();

// Add smooth scroll behavior to quick access cards
document.querySelectorAll('.access-card').forEach((card, index) => {
    if (index === 2) { // "My Support Tickets" card
        card.addEventListener('click', () => {
            document.querySelector('.tickets-section').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    }
});

// Add loading state for form submission
const originalSubmitHandler = document.getElementById('ticketForm').onsubmit;
document.getElementById('ticketForm').addEventListener('submit', function(e) {
    const submitBtn = this.querySelector('.submit-btn');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = 'Submit Ticket';
        submitBtn.disabled = false;
    }, 1000);
});

// Add tooltip for status badges
document.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('status-badge')) {
        e.target.title = `Status: ${e.target.textContent}`;
    }
});

// Animate ticket count
function animateCount() {
    const counts = {
        all: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        progress: tickets.filter(t => t.status === 'progress').length,
        closed: tickets.filter(t => t.status === 'closed').length
    };

    // Could add count badges to filter tabs
    console.log('Ticket counts:', counts);
}

animateCount();

// Add visual feedback when clicking filter tabs
document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
});

function startLiveChat() {
    showNotification('Live Chat', 'Connecting to support agent...', 'info');
  
    setTimeout(() => {
      showNotification('Live Chat', "You're now chatting with a support agent.", 'success');
      openChatBox();
      simulateAgentGreeting();
    }, 1500);
  }
  
  function openChatBox() {
    document.getElementById("liveChatBox").classList.add("show");
  }
  
  function closeChatBox() {
    document.getElementById("liveChatBox").classList.remove("show");
  }
  
  // Action buttons
  document.getElementById("closeChatBtn").addEventListener("click", closeChatBox);
  document.getElementById("sendChatBtn").addEventListener("click", sendUserMessage);
  document.getElementById("chatInput").addEventListener("keypress", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendUserMessage();
    }
  });
  
  function sendUserMessage() {
    const input = document.getElementById("chatInput");
    const message = input.value.trim();
    if (!message) return;
  
    const messages = document.getElementById("chatMessages");
  
    // Create user message bubble
    const userMsg = document.createElement("div");
    userMsg.classList.add("chat-msg", "user-msg");
    userMsg.textContent = message;
    messages.appendChild(userMsg);
  
    // Add timestamp
    const time = document.createElement("div");
    time.classList.add("chat-time");
    time.textContent = formatTime();
    messages.appendChild(time);
  
    input.value = "";
    messages.scrollTop = messages.scrollHeight;
  
    // Simulate agent response
    setTimeout(() => simulateAgentReply(message), 1500);
  }
  
  // Dummy responses
  const dummyReplies = [
    "Sure, I can help with that!",
    "Can you please provide more details?",
    "That sounds great. Let me check for you.",
    "Give me a moment to look into that.",
    "Alright. I just updated your request.",
    "Thanks for reaching out to us!",
    "You're welcome! 😊"
  ];
  
  function simulateAgentReply(userMessage) {
    const messages = document.getElementById("chatMessages");
  
    const reply = document.createElement("div");
    reply.classList.add("chat-msg", "agent-msg");
  
    // Random simulated response
    const agentText = dummyReplies[Math.floor(Math.random() * dummyReplies.length)];
    reply.textContent = agentText;
    messages.appendChild(reply);
  
    const time = document.createElement("div");
    time.classList.add("chat-time");
    time.textContent = formatTime();
    messages.appendChild(time);
  
    messages.scrollTop = messages.scrollHeight;
  }
  
  function simulateAgentGreeting() {
    const messages = document.getElementById("chatMessages");
    const greet = document.createElement("div");
    greet.classList.add("chat-msg", "agent-msg");
    greet.textContent = "👋 Hi there! I'm your support assistant. How can I help today?";
    messages.appendChild(greet);
  
    const time = document.createElement("div");
    time.classList.add("chat-time");
    time.textContent = formatTime();
    messages.appendChild(time);
  
    messages.scrollTop = messages.scrollHeight;
  }
  
  // Time formatter
  function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }