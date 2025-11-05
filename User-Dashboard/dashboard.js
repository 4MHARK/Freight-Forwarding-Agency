// Sample document data
const documentsData = [
    {
        id: 1,
        name: 'Certificate of Incorporation',
        uploadDate: '24 Oct 2023',
        status: 'verified',
        filename: 'certificate_incorporation.pdf',
        feedback: null
    },
    {
        id: 2,
        name: 'Company License',
        uploadDate: '21 Oct 2023',
        status: 'rejected',
        filename: 'company_license_v1.pdf',
        feedback: 'License has expired. Please upload a current valid license.'
    },
    {
        id: 3,
        name: 'Proof of Address',
        uploadDate: '15 Oct 2023',
        status: 'pending',
        filename: 'proof_address.jpg',
        feedback: null
    },
    {
        id: 4,
        name: 'Tax Clearance Certificate',
        uploadDate: '02 Sep 2023',
        status: 'verified',
        filename: 'tax_clearance_2023.pdf',
        feedback: null
    },
    {
        id: 5,
        name: 'Audited Financial Statement',
        uploadDate: '28 Aug 2023',
        status: 'review',
        filename: 'financial_statement_2023.pdf',
        feedback: null
    }
];

const requiredDocuments = [
    { id: 1, name: 'Commercial Invoice', status: 'rejected', icon: 'description' },
    { id: 2, name: 'Bill of Loading', status: 'verified', icon: 'description' },
    { id: 3, name: 'Packing List', status: 'pending', icon: 'description' },
    { id: 4, name: 'Certificate of Origin', status: 'missing', icon: 'description' }
];

let currentDocument = null;
let uploadedFiles = {};

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initAnalyticsNavigation();
    initDocumentManagement();
    animateStats();
});

// Navigation Handler
function initNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".section");

    navItems.forEach((item) => {
        item.addEventListener("click", () => {
            navItems.forEach((nav) => nav.classList.remove("active"));
            item.classList.add("active");

            sections.forEach((sec) => {
                sec.classList.remove("visible");
                sec.classList.add("hidden");
            });

            const sectionId = item.getAttribute("data-section") + "-section";
            const targetSection = document.getElementById(sectionId);
            
            // Toggle analytics class on main-content
            const mainContent = document.querySelector('.main-content');
            if (sectionId === "analytics-section") {
                mainContent.classList.add('analytics-section-active');
            } else {
                mainContent.classList.remove('analytics-section-active');
            }

            if (targetSection) {
                targetSection.classList.remove("hidden");
                targetSection.classList.add("visible");

                if (sectionId === "shipments-section") {
                    showDocView('doc-list-view');
                    loadDocumentTable();
                }
            }

            setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 200);
        });
    });
}

// Initialize Analytics Navigation
function initAnalyticsNavigation() {
    const analyticsNavItems = document.querySelectorAll('.analytics-nav-item');
    const analyticsSubsections = document.querySelectorAll('.analytics-subsection');

    analyticsNavItems.forEach((item) => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            analyticsNavItems.forEach((nav) => nav.classList.remove('active'));
            item.classList.add('active');

            // Hide all subsections
            analyticsSubsections.forEach((subsection) => {
                subsection.classList.remove('active-subsection');
            });

            // Show target subsection
            const sectionId = item.getAttribute('data-analytics-section') + '-subsection';
            const targetSubsection = document.getElementById(sectionId);
            if (targetSubsection) {
                targetSubsection.classList.add('active-subsection');
            }

            // Scroll to top
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 200);
        });
    });
}

// Document Management
function initDocumentManagement() {
    loadDocumentTable();

    document.getElementById('btn-new-document')?.addEventListener('click', () => {
        showDocView('doc-upload-view');
        loadRequiredDocs('required-docs-list');
        setupFileUpload('doc-dropzone', 'file-input-upload', 'upload-file-details', 'upload-file-info');
    });

    document.getElementById('btn-back-from-view')?.addEventListener('click', () => {
        showDocView('doc-list-view');
    });

    document.getElementById('btn-submit-review')?.addEventListener('click', () => {
        alert('Documents submitted for review!');
        showDocView('doc-list-view');
    });

    document.getElementById('btn-submit-replacement')?.addEventListener('click', () => {
        alert('Replacement documents submitted for review!');
        showDocView('doc-list-view');
    });

    document.getElementById('btn-replace-file')?.addEventListener('click', () => {
        document.getElementById('file-input-replace').click();
    });

    document.getElementById('btn-delete-doc')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this document?')) {
            alert('Document deleted!');
            showDocView('doc-list-view');
        }
    });

    setupFileUpload('doc-dropzone-replace', 'file-input-replace', 'replace-file-details', 'replace-file-info');

    document.getElementById('doc-search')?.addEventListener('input', (e) => {
        filterDocuments(e.target.value.toLowerCase());
    });
}

function showDocView(viewId) {
    document.querySelectorAll('.doc-view').forEach(view => {
        view.classList.remove('active-view');
    });

    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active-view');
    }
}

function loadDocumentTable() {
    const tbody = document.getElementById('doc-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    documentsData.forEach(doc => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${doc.name}</td>
            <td>${doc.uploadDate}</td>
            <td>
                <span class="doc-status-badge status-${doc.status}">
                    <span class="material-symbols-outlined">${getStatusIcon(doc.status)}</span>
                    ${capitalizeFirst(doc.status)}
                </span>
            </td>
            <td>
                <button class="doc-action-btn ${doc.status === 'rejected' ? 'btn-replace' : 'btn-view'}" 
                        data-id="${doc.id}">
                    ${doc.status === 'rejected' ? 'Replace' : 'View'}
                </button>
            </td>
        `;

        const actionBtn = row.querySelector('.doc-action-btn');
        actionBtn.addEventListener('click', () => {
            if (doc.status === 'rejected') {
                openReplaceView(doc);
            } else {
                openViewDocument(doc);
            }
        });

        tbody.appendChild(row);
    });
}

function getStatusIcon(status) {
    const icons = {
        verified: 'check_circle',
        rejected: 'cancel',
        pending: 'schedule',
        review: 'hourglass_empty',
        missing: 'info'
    };
    return icons[status] || 'info';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function openViewDocument(doc) {
    currentDocument = doc;

    document.getElementById('view-doc-title').textContent = doc.name;
    document.getElementById('view-doc-subtitle').textContent = `Document details and verification status`;
    document.getElementById('view-upload-date').textContent = doc.uploadDate;
    document.getElementById('view-filename').textContent = doc.filename;

    const statusBadge = `
        <span class="doc-status-badge status-${doc.status}">
            <span class="material-symbols-outlined">${getStatusIcon(doc.status)}</span>
            ${capitalizeFirst(doc.status)}
        </span>
    `;
    document.getElementById('view-status-badge').innerHTML = statusBadge;

    const feedbackSection = document.getElementById('view-feedback-section');
    if (doc.feedback) {
        feedbackSection.classList.remove('hidden');
        document.getElementById('view-feedback-content').innerHTML = `<p>${doc.feedback}</p>`;
    } else {
        feedbackSection.classList.add('hidden');
    }

    showDocView('doc-view-only');
}

function openReplaceView(doc) {
    currentDocument = doc;

    document.getElementById('replace-doc-title').textContent = `Manage Documents for Shipment #ID-738-2910`;
    document.getElementById('replace-current-filename').textContent = doc.filename;

    loadRequiredDocs('replace-docs-list');

    if (doc.feedback) {
        const feedbackContent = document.querySelector('#replace-file-details .feedback-content');
        if (feedbackContent) {
            feedbackContent.innerHTML = `<p><strong>Reason for rejection:</strong> ${doc.feedback}</p>`;
        }
    }

    const rejectedCount = requiredDocuments.filter(d => d.status === 'rejected').length;
    document.getElementById('rejected-count').textContent = rejectedCount;

    showDocView('doc-replace-view');
}

function loadRequiredDocs(listId) {
    const list = document.getElementById(listId);
    if (!list) return;

    list.innerHTML = '';

    requiredDocuments.forEach(doc => {
        const li = document.createElement('li');
        li.className = 'doc-required-item';
        li.innerHTML = `
            <div class="doc-required-item-content">
                <span class="material-symbols-outlined">${doc.icon}</span>
                <span class="doc-required-item-text">${doc.name}</span>
            </div>
            <span class="doc-status-badge status-${doc.status}">
                <span class="material-symbols-outlined">${getStatusIcon(doc.status)}</span>
            </span>
        `;

        li.addEventListener('click', () => {
            list.querySelectorAll('.doc-required-item').forEach(item => {
                item.classList.remove('active');
            });
            li.classList.add('active');
            currentDocument = doc;
        });

        list.appendChild(li);
    });
}

function setupFileUpload(dropzoneId, inputId, detailsId, infoId) {
    const dropzone = document.getElementById(dropzoneId);
    const fileInput = document.getElementById(inputId);
    const detailsSection = document.getElementById(detailsId);
    const fileInfo = document.getElementById(infoId);

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFileUpload(e.target.files[0], detailsSection, fileInfo);
    });

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        handleFileUpload(file, detailsSection, fileInfo);
    });
}

function handleFileUpload(file, detailsSection, fileInfo) {
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 
                         'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please upload PDF, JPG, PNG, or DOCX files.');
        return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('File size exceeds 10MB limit.');
        return;
    }

    if (detailsSection) {
        detailsSection.classList.remove('hidden');
    }

    if (fileInfo) {
        const now = new Date();
        const dateStr = now.toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        fileInfo.innerHTML = `
            <p class="file-name">${file.name}</p>
            <p class="file-meta">Uploaded: ${dateStr}</p>
            <p class="file-meta">Size: ${formatFileSize(file.size)}</p>
            <div class="file-status status-pending">
                <span class="material-symbols-outlined">schedule</span>
                Ready to Submit
            </div>
        `;
    }

    if (currentDocument) {
        uploadedFiles[currentDocument.id] = file;
    }

    console.log('File uploaded:', file.name);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function filterDocuments(searchTerm) {
    const tbody = document.getElementById('doc-table-body');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Stat counter animation
function animateValue(element, start, end, duration, isPercentage = false) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        if (isPercentage) {
            const value = (progress * (end - start) + start).toFixed(1);
            element.textContent = value + '%';
        } else {
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
        }

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function animateStats() {
    setTimeout(() => {
        const statValues = document.querySelectorAll('.stat-value');
        if (statValues.length >= 4) {
            animateValue(statValues[0], 0, 124, 2000);
            animateValue(statValues[1], 0, 18, 2000);
            animateValue(statValues[2], 0, 3, 2000);
            animateValue(statValues[3], 0, 98.2, 2000, true);
        }
    }, 600);
}

// Additional interactions
document.querySelector('.new-shipment-btn')?.addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
        alert('Opening new shipment form...');
    }, 100);
});

// Search functionality for main header
const searchInput = document.querySelector('.search-bar input');
searchInput?.addEventListener('focus', () => {
    document.querySelector('.search-bar').style.transform = 'translateY(-2px)';
});
searchInput?.addEventListener('blur', () => {
    document.querySelector('.search-bar').style.transform = 'translateY(0)';
});

// Table row interactions
const tableRows = document.querySelectorAll('tbody tr');
tableRows.forEach(row => {
    row.addEventListener('click', function() {
        this.style.transform = 'scale(1.02)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
});

// User avatar click
const userAvatar = document.querySelector('.user-avatar');
userAvatar?.addEventListener('click', () => {
    userAvatar.style.transform = 'scale(1.1) rotate(5deg)';
    setTimeout(() => {
        userAvatar.style.transform = '';
    }, 200);
});

console.log('FreightForward Dashboard loaded successfully!');