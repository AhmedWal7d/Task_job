// Main JavaScript Functions

// Initialize when document is ready
$(document).ready(function() {
    initializeCarousel();
    initializeScrollToTop();
    initializeLanguageSelector();
    initializeFormValidation();
    initializeModalHandlers();
});

// Carousel Initialization
function initializeCarousel() {
    $(".owl-carousel").owlCarousel({
        rtl: true,
        loop: true,
        margin: 30,
        dots: true,
        autoplay: true,
        autoplayTimeout: 4000,
        responsive: {
            0: { items: 1 },
            576: { items: 1 },
            768: { items: 2 },
            992: { items: 3 },
            1200: { items: 3 }
        }
    });
    console.log("Owl Carousel Initialized");
}

// Scroll to Top Functionality
function initializeScrollToTop() {
    const scrollBtn = document.getElementById("scrollBtn");
    
    window.onscroll = function() {
        if (window.scrollY > 300) {
            scrollBtn.style.display = "block";
        } else {
            scrollBtn.style.display = "none";
        }
    };
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Language Selector - Now handled by LanguageManager
function initializeLanguageSelector() {
    // Language switching is now handled by LanguageManager
    // This function is kept for any additional language-related functionality
    
    // Close dropdown after language selection
    $('#arabicCheckbox, #englishCheckbox').on('change', function() {
        setTimeout(() => {
            $('.dropdown-menu').removeClass('show');
        }, 300);
    });
}

// Form Validation
function initializeFormValidation() {
    $('.form-section').on('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            unit: $('input[name="unit"]:checked').val(),
            finish: $('input[name="finish"]:checked').val(),
            design: $('input[name="design"]:checked').val(),
            electric: $('input[name="electric"]:checked').val()
        };
        
        if (validateForm(formData)) {
            submitForm(formData);
        }
    });
}

function validateForm(data) {
    let isValid = true;
    const requiredFields = ['unit', 'finish', 'design', 'electric'];
    
    requiredFields.forEach(field => {
        if (!data[field]) {
            isValid = false;
            showError(`يرجى اختيار ${getFieldName(field)}`);
        }
    });
    
    return isValid;
}

function getFieldName(field) {
    const names = {
        unit: 'نوع الوحدة',
        finish: 'نمط التشطيب',
        design: 'التصميم الداخلي',
        electric: 'اختيار الألوان'
    };
    return names[field] || field;
}

function showError(message) {
    // Create and show error message
    const errorDiv = $('<div class="alert alert-danger mt-3">' + message + '</div>');
    $('.form-section').append(errorDiv);
    
    setTimeout(() => {
        errorDiv.fadeOut(() => errorDiv.remove());
    }, 3000);
}

function submitForm(data) {
    // Show loading state
    const submitBtn = $('.btn-submit');
    const originalText = submitBtn.text();
    submitBtn.text('جاري الإرسال...').prop('disabled', true);
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.text(originalText).prop('disabled', false);
        showSuccess('تم إرسال الطلب بنجاح! سنتواصل معك قريباً.');
        
        // Reset form
        $('.form-section')[0].reset();
    }, 2000);
}

function showSuccess(message) {
    const successDiv = $('<div class="alert alert-success mt-3">' + message + '</div>');
    $('.form-section').append(successDiv);
    
    setTimeout(() => {
        successDiv.fadeOut(() => successDiv.remove());
    }, 5000);
}

// Modal Handlers
function initializeModalHandlers() {
    // Handle modal form submissions
    $('#exampleModal form').on('submit', function(e) {
        e.preventDefault();
        
        const formType = $(this).closest('.tab-pane').attr('id');
        const formData = new FormData(this);
        
        if (formType === 'home') {
            handleLogin(formData);
        } else if (formType === 'profile') {
            handleRegistration(formData);
        }
    });
}

function handleLogin(formData) {
    const phone = formData.get('phone');
    
    if (!phone) {
        showModalError('يرجى إدخال رقم الهاتف');
        return;
    }
    
    // Simulate login process
    showModalSuccess('تم إرسال رمز التحقق إلى هاتفك');
}

function handleRegistration(formData) {
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    
    if (!name || !phone) {
        showModalError('يرجى إدخال الاسم ورقم الهاتف');
        return;
    }
    
    // Simulate registration process
    showModalSuccess('تم إنشاء الحساب بنجاح!');
}

function showModalError(message) {
    const errorDiv = $('<div class="alert alert-danger mt-3">' + message + '</div>');
    $('#exampleModal .modal-body').append(errorDiv);
    
    setTimeout(() => {
        errorDiv.fadeOut(() => errorDiv.remove());
    }, 3000);
}

function showModalSuccess(message) {
    const successDiv = $('<div class="alert alert-success mt-3">' + message + '</div>');
    $('#exampleModal .modal-body').append(successDiv);
    
    setTimeout(() => {
        successDiv.fadeOut(() => successDiv.remove());
        $('#exampleModal').modal('hide');
    }, 2000);
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR'
    }).format(price);
}

function animateOnScroll() {
    $('.package-card, .step, .testimonial-card').each(function() {
        const elementTop = $(this).offset().top;
        const elementBottom = elementTop + $(this).outerHeight();
        const viewportTop = $(window).scrollTop();
        const viewportBottom = viewportTop + $(window).height();
        
        if (elementBottom > viewportTop && elementTop < viewportBottom) {
            $(this).addClass('animate-in');
        }
    });
}

// Initialize scroll animations
$(window).on('scroll', animateOnScroll);
$(document).ready(animateOnScroll);

// Export functions for global use
window.scrollToTop = scrollToTop;
window.changeLanguage = changeLanguage;
window.formatPrice = formatPrice; 