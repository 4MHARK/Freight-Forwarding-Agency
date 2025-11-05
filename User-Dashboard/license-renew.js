
// ============================================
// STATE MANAGEMENT
// ============================================
let currentStep = 1;
const formData = {
    application: {},
    payment: {},
    file: null
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadDraftFromStorage();
    updateProgress();
});

// ============================================
// EVENT LISTENERS
// ============================================
function initializeEventListeners() {
    // Header scroll effect
    window.addEventListener('scroll', handleScroll);

    // File upload
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileUpload');

    fileUploadArea.addEventListener('click', () => fileInput.click());
    fileUploadArea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('dragleave', handleDragLeave);
    fileUploadArea.addEventListener('drop', handleFileDrop);

    // File remove
    document.getElementById('fileRemove').addEventListener('click', removeFile);

    // Card formatting
    document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
    document.getElementById('expiryMonth').addEventListener('input', formatExpiryDate);
    document.getElementById('cvv').addEventListener('input', formatCVV);
    document.getElementById('phone').addEventListener('input', formatPhoneNumber);

    // Real-time validation
    setupRealtimeValidation();

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Auto-save draft
    setInterval(autoSaveDraft, 30000); // Every 30 seconds
}

// ============================================
// HEADER FUNCTIONALITY
// ============================================
function handleScroll() {
    const header = document.getElementById('header');
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// ============================================
// FILE UPLOAD
// ============================================
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        validateAndDisplayFile(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('dragover');
}

function handleFileDrop(e) {
    e.preventDefault();
    const fileUploadArea = document.getElementById('fileUploadArea');
    fileUploadArea.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file) {
        validateAndDisplayFile(file);
    }
}

function validateAndDisplayFile(file) {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const filePreview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const errorMsg = document.getElementById('fileUploadError');

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
        showToast('Error', 'Please upload a PDF, PNG, or JPG file', '❌');
        return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        showToast('Error', 'File size must be less than 5MB', '❌');
        return;
    }

    // Display file
    formData.file = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    filePreview.classList.add('show');
    fileUploadArea.classList.add('has-file');
    errorMsg.classList.remove('show');

    showToast('Success', 'File uploaded successfully', '✓');
}

function removeFile() {
    const fileInput = document.getElementById('fileUpload');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const filePreview = document.getElementById('filePreview');

    fileInput.value = '';
    formData.file = null;
    filePreview.classList.remove('show');
    fileUploadArea.classList.remove('has-file');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================
// INPUT FORMATTING
// ============================================
function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value;
    validateCardNumber(e.target);
}

function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
    validateExpiryDate(e.target);
}

function formatCVV(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
    validateCVV(e.target);
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0 && !value.startsWith('234')) {
        value = '234' + value;
    }
    if (value.length > 3) {
        value = '+' + value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 9) + ' ' + value.slice(9, 13);
    }
    e.target.value = value;
}

// ============================================
// VALIDATION
// ============================================
function setupRealtimeValidation() {
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
        if (input.type !== 'file') {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateInput(input);
                }
            });
        }
    });
}

function validateInput(input) {
    const errorMsg = input.nextElementSibling;
    const successMsg = errorMsg?.nextElementSibling;

    // Clear previous states
    input.classList.remove('error', 'success');
    errorMsg?.classList.remove('show');
    successMsg?.classList.remove('show');

    if (!input.value.trim()) {
        if (input.hasAttribute('required')) {
            input.classList.add('error');
            errorMsg?.classList.add('show');
            return false;
        }
        return true;
    }

    // Specific validations
    if (input.type === 'email' && !isValidEmail(input.value)) {
        input.classList.add('error');
        errorMsg?.classList.add('show');
        return false;
    }

    if (input.id === 'regNumber' && !isValidRegNumber(input.value)) {
        input.classList.add('error');
        errorMsg?.classList.add('show');
        return false;
    }

    if (input.id === 'cardNumber' && !isValidCardNumber(input.value)) {
        input.classList.add('error');
        errorMsg?.classList.add('show');
        return false;
    }

    if (input.id === 'expiryMonth' && !isValidExpiryDate(input.value)) {
        input.classList.add('error');
        errorMsg?.classList.add('show');
        return false;
    }

    if (input.id === 'cvv' && (input.value.length < 3 || input.value.length > 4)) {
        input.classList.add('error');
        errorMsg?.classList.add('show');
        return false;
    }

    // Success state
    input.classList.add('success');
    successMsg?.classList.add('show');
    return true;
}

function validateCardNumber(input) {
    const value = input.value.replace(/\s/g, '');
    const errorMsg = document.getElementById('cardNumberError');
    const successMsg = errorMsg.nextElementSibling;

    input.classList.remove('error', 'success');
    errorMsg.classList.remove('show');
    successMsg.classList.remove('show');

    if (value.length === 16 && luhnCheck(value)) {
        input.classList.add('success');
        successMsg.classList.add('show');
    } else if (value.length > 0) {
        input.classList.add('error');
        errorMsg.classList.add('show');
    }
}

function validateExpiryDate(input) {
    const errorMsg = document.getElementById('expiryMonthError');
    const successMsg = errorMsg.nextElementSibling;

    input.classList.remove('error', 'success');
    errorMsg.classList.remove('show');
    successMsg.classList.remove('show');

    if (isValidExpiryDate(input.value)) {
        input.classList.add('success');
        successMsg.classList.add('show');
    } else if (input.value.length >= 5) {
        input.classList.add('error');
        errorMsg.classList.add('show');
    }
}

function validateCVV(input) {
    const errorMsg = document.getElementById('cvvError');
    const successMsg = errorMsg.nextElementSibling;

    input.classList.remove('error', 'success');
    errorMsg.classList.remove('show');
    successMsg.classList.remove('show');

    if (input.value.length >= 3 && input.value.length <= 4) {
        input.classList.add('success');
        successMsg.classList.add('show');
    } else if (input.value.length > 0) {
        input.classList.add('error');
        errorMsg.classList.add('show');
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidRegNumber(regNumber) {
    return /^CRFFN\/\d{4}\/\d{4}$/.test(regNumber);
}

function isValidCardNumber(cardNumber) {
    const digits = cardNumber.replace(/\s/g, '');
    return digits.length === 16 && luhnCheck(digits);
}

function isValidExpiryDate(expiry) {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    
    const [month, year] = expiry.split('/').map(Number);
    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
}

// Luhn algorithm for card validation
function luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

function validateStep() {
    const currentSection = document.getElementById(`step${currentStep}`);
    const inputs = currentSection.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (input.type === 'file') {
            const errorMsg = document.getElementById('fileUploadError');
            if (!formData.file) {
                errorMsg.classList.add('show');
                isValid = false;
            } else {
                errorMsg.classList.remove('show');
            }
        } else {
            if (!validateInput(input)) {
                isValid = false;
            }
        }
    });

    if (!isValid) {
        showToast('Validation Error', 'Please fill in all required fields correctly', '⚠️');
    }

    return isValid;
}

// ============================================
// NAVIGATION
// ============================================
function nextStep() {
    if (!validateStep()) {
        return;
    }

    // Save data from current step
    saveStepData();

    // Show loading for payment processing
    if (currentStep === 2) {
        showLoading();
        setTimeout(() => {
            hideLoading();
            proceedToNextStep();
        }, 2000);
        return;
    }

    proceedToNextStep();
}

function proceedToNextStep() {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // Populate review if moving to step 3
    if (currentStep === 3) {
        populateReview();
    }

    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    saveDraft(); // Auto-save
}

function prevStep() {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep--;
    document.getElementById(`step${currentStep}`).classList.add('active');
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToStep(step) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveStepData() {
    if (currentStep === 1) {
        formData.application = {
            agency: document.getElementById('agencyName').value,
            regNumber: document.getElementById('regNumber').value,
            expiryDate: document.getElementById('expiryDate').value,
            contactPerson: document.getElementById('contactPerson').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };
    } else if (currentStep === 2) {
        formData.payment = {
            cardName: document.getElementById('cardName').value,
            cardNumber: document.getElementById('cardNumber').value,
            expiry: document.getElementById('expiryMonth').value,
            cvv: document.getElementById('cvv').value
        };
    }
}

function populateReview() {
    document.getElementById('reviewAgency').textContent = formData.application.agency;
    document.getElementById('reviewReg').textContent = formData.application.regNumber;
    document.getElementById('reviewExpiry').textContent = new Date(formData.application.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('reviewContact').textContent = formData.application.contactPerson;
    document.getElementById('reviewEmail').textContent = formData.application.email;
    document.getElementById('reviewPhone').textContent = formData.application.phone;
    document.getElementById('reviewDoc').textContent = formData.file ? formData.file.name : 'No file uploaded';
    
    document.getElementById('reviewCardName').textContent = formData.payment.cardName;
    document.getElementById('reviewCardNum').textContent = '**** **** **** ' + formData.payment.cardNumber.slice(-4);
}

// ============================================
// PROGRESS BAR
// ============================================
function updateProgress() {
    const steps = document.querySelectorAll('.step');
    const progressFill = document.getElementById('progressFill');
    const progressBar = progressFill.parentElement;
    
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < currentStep) {
            step.classList.add('completed');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
        }
    });

    const progress = ((currentStep - 1) / 3) * 100;
    progressFill.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', progress);
}

// ============================================
// SUBMISSION
// ============================================
function submitApplication() {
    showLoading();

    // Simulate processing
    setTimeout(() => {
        hideLoading();
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep = 4;
        document.getElementById('step4').classList.add('active');
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Show success modal after processing
        setTimeout(() => {
            const refNumber = 'REN-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            document.getElementById('referenceNumber').textContent = refNumber;
            document.getElementById('successModal').classList.add('show');
            clearDraftFromStorage();
        }, 3000);
    }, 2000);
}

// ============================================
// MODAL
// ============================================
function closeModal() {
    document.getElementById('successModal').classList.remove('show');
    
    // Reset form
    resetForm();
    
    // Show success toast
    showToast('Success', 'Application submitted successfully!', '✓');
}

function resetForm() {
    // Reset to step 1
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep = 1;
    document.getElementById('step1').classList.add('active');
    updateProgress();
    
    // Clear form data
    formData.application = {};
    formData.payment = {};
    formData.file = null;
    
    // Reset file upload
    removeFile();
    
    // Clear payment fields
    document.getElementById('cardName').value = '';
    document.getElementById('cardNumber').value = '';
    document.getElementById('expiryMonth').value = '';
    document.getElementById('cvv').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    
    // Remove validation states
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('error', 'success');
    });
    document.querySelectorAll('.error-message, .success-message').forEach(msg => {
        msg.classList.remove('show');
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// DRAFT MANAGEMENT
// ============================================
function saveDraft() {
    saveStepData();
    localStorage.setItem('crffn_draft', JSON.stringify({
        step: currentStep,
        data: formData,
        timestamp: new Date().toISOString()
    }));
    showToast('Draft Saved', 'Your progress has been saved', '💾');
}

function autoSaveDraft() {
    if (currentStep < 4) {
        saveStepData();
        localStorage.setItem('crffn_draft', JSON.stringify({
            step: currentStep,
            data: formData,
            timestamp: new Date().toISOString()
        }));
    }
}

function loadDraftFromStorage() {
    const draft = localStorage.getItem('crffn_draft');
    if (draft) {
        try {
            const { step, data, timestamp } = JSON.parse(draft);
            
            // Check if draft is less than 7 days old
            const draftDate = new Date(timestamp);
            const now = new Date();
            const daysDiff = (now - draftDate) / (1000 * 60 * 60 * 24);
            
            if (daysDiff < 7) {
                // Restore data
                formData.application = data.application || {};
                formData.payment = data.payment || {};
                
                if (formData.application.agency) {
                    document.getElementById('agencyName').value = formData.application.agency;
                }
                if (formData.application.regNumber) {
                    document.getElementById('regNumber').value = formData.application.regNumber;
                }
                if (formData.application.expiryDate) {
                    document.getElementById('expiryDate').value = formData.application.expiryDate;
                }
                if (formData.application.contactPerson) {
                    document.getElementById('contactPerson').value = formData.application.contactPerson;
                }
                
                showToast('Draft Loaded', 'Your previous progress has been restored', 'ℹ️');
            }
        } catch (e) {
            console.error('Error loading draft:', e);
        }
    }
}

function clearDraftFromStorage() {
    localStorage.removeItem('crffn_draft');
}

// ============================================
// SEARCH
// ============================================
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#tableBody tr');
    
    rows.forEach(row => {
        const requestId = row.cells[0].textContent.toLowerCase();
        if (requestId.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// ============================================
// UI UTILITIES
// ============================================
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('show');
}

function showToast(title, message, icon = 'ℹ️') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');

    toastIcon.textContent = icon;
    toastTitle.textContent = title;
    toastMessage.textContent = message;

    toast.classList.add('show');

    setTimeout(() => {
        hideToast();
    }, 5000);
}

function hideToast() {
    document.getElementById('toast').classList.remove('show');
}