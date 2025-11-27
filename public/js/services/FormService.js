/**
 * Form Service - Backend API Integration
 * 
 * Handles all form submission logic with custom backend API
 * - Manages form event listeners and submission
 * - Handles validation for all form fields
 * - Sends data to backend API for email delivery
 * - Shows success/error messages with UI feedback
 * - Provides state management for form operations
 */
class FormService {
    constructor(config = {}) {
        this.config = {
            formSelector: '#contactForm',
            apiEndpoint: '/api/send-email',  // Your backend API endpoint
            ...config
        };
        this.form = null;
        this.isSubmitting = false;
    }

    /**
     * Initialize FormService
     * - Setup form event listeners
     * - No EmailJS initialization needed
     */
    async init() {
        console.log('📧 FormService initializing...');
        
        // Get form element
        this.form = document.querySelector(this.config.formSelector);
        if (!this.form) {
            console.error('❌ Form not found:', this.config.formSelector);
            return false;
        }
        
        // Setup form submission handler
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Setup custom subject field visibility
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            subjectSelect.addEventListener('change', (e) => this.handleSubjectChange(e));
        }
        
        console.log('✅ FormService initialized');
        return true;
    }

    /**
     * Handle subject dropdown change
     * Shows/hides custom subject input based on selection
     */
    handleSubjectChange(event) {
        const customInput = document.getElementById('customSubject');
        if (!customInput) return;
        
        if (event.target.value === '__custom') {
            customInput.classList.remove('hidden');
            customInput.focus();
        } else {
            customInput.classList.add('hidden');
        }
    }

    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        // Prevent double submission
        if (this.isSubmitting) {
            console.warn('⚠️ Form submission already in progress');
            return;
        }

        console.log('✉️ Form submitted');
        
        // Collect form data
        const formData = this.collectFormData();
        
        // Validate form data
        const validation = this.validateFormData(formData);
        if (!validation.valid) {
            console.warn('⚠️ Form validation failed:', validation.error);
            this.showError(validation.error);
            return;
        }
        
        // Check if EmailJS is available
        if (typeof emailjs === 'undefined') {
            console.error('❌ EmailJS not available');
            this.showError('Email service is loading. Please try again in a moment.');
            return;
        }

        // Mark as submitting and update button
        this.isSubmitting = true;
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent || 'Send';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Sending...';
        }

        try {
            // Prepare template parameters for backend
            const templateParams = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                company: formData.company,
                subject: formData.subject,
                message: formData.message,
                timestamp: new Date().toLocaleString()
            };

            console.log('🚀 Sending form data to backend:', templateParams);

            // Send to backend API
            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(templateParams)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Email sent successfully:', result);
            
            // Show success message
            const email = formData.email;
            const phone = formData.phone;
            let contactMessage = 'We\'ve received your message. Our team will get back to you shortly at ';
            
            if (email && phone) {
                contactMessage += `${email} or ${phone}`;
            } else if (email) {
                contactMessage += email;
            } else if (phone) {
                contactMessage += phone;
            }
            
            this.showSuccess(contactMessage);
            
            // Reset form
            this.resetForm();

        } catch (error) {
            console.error('❌ Error sending form data:', error);
            console.error('📋 Error details:', {
                message: error.message,
                status: error.status,
                name: error.name
            });
            
            // Provide specific error message based on error type
            let errorMsg = '❌ Oops! Something went wrong. Please check your information and try again.';
            if (error.message && error.message.includes('HTTP')) {
                errorMsg = `❌ Server error: ${error.message}. Please try again later.`;
            } else if (error.message && error.message.includes('Failed to fetch')) {
                errorMsg = '❌ Network error. Please check your connection and try again.';
            }
            
            this.showError(errorMsg);

        } finally {
            // Re-enable submit button
            this.isSubmitting = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    }

    /**
     * Collect all form data from input elements
     */
    collectFormData() {
        const subjectSelect = document.getElementById('subject');
        const customInput = document.getElementById('customSubject');
        
        return {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            company: document.getElementById('company')?.value || '',
            subject: subjectSelect?.value === '__custom' ? customInput?.value : subjectSelect?.value || '',
            message: document.getElementById('message')?.value || ''
        };
    }

    /**
     * Validate form data
     */
    validateFormData(data) {
        // Validate name
        if (!data.name || data.name.trim() === '') {
            return { valid: false, error: '⚠️ Name is required' };
        }

        // Validate email
        if (!data.email || !this.validateEmail(data.email)) {
            return { valid: false, error: '⚠️ Valid email is required' };
        }

        // Validate subject
        if (!data.subject || data.subject.trim() === '') {
            return { valid: false, error: '⚠️ Subject is required' };
        }

        // Validate message
        if (!data.message || data.message.trim() === '') {
            return { valid: false, error: '⚠️ Message is required' };
        }

        // Phone is optional but validate if provided
        if (data.phone && !this.validatePhone(data.phone)) {
            return { valid: false, error: '⚠️ Please provide a valid phone number' };
        }

        return { valid: true };
    }

    /**
     * Validate email format
     */
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email.trim());
    }

    /**
     * Validate phone format (basic validation)
     */
    validatePhone(phone) {
        // Remove common formatting characters
        const cleanPhone = phone.replace(/[\s\-()\.]/g, '');
        // Check if at least 10 digits
        return /^\d{10,}$/.test(cleanPhone);
    }

    /**
     * Reset form to initial state
     */
    resetForm() {
        if (!this.form) return;
        
        this.form.reset();
        
        // Reset subject dropdown and custom input
        const subjectSelect = document.getElementById('subject');
        const customInput = document.getElementById('customSubject');
        
        if (subjectSelect) subjectSelect.value = '';
        if (customInput) customInput.classList.add('hidden');
        
        console.log('🔄 Form reset');
    }

    /**
     * Show success message with alert
     */
    showSuccess(message) {
        console.log('🎉 showSuccess called with message:', message);
        
        // Try to find success alert element
        const successAlert = document.getElementById('successAlert');
        
        if (successAlert) {
            console.log('✓ successAlert element found, displaying message');
            successAlert.innerHTML = `<i class="bi bi-check-circle-fill"></i> <strong>✅ ${message}</strong>`;
            successAlert.classList.remove('hidden');
            successAlert.style.display = 'block';
            successAlert.style.visibility = 'visible';
            successAlert.style.opacity = '1';
            
            // Scroll into view
            setTimeout(() => {
                successAlert.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            
            // Auto-hide after 8 seconds
            setTimeout(() => {
                successAlert.classList.add('hidden');
            }, 8000);
        } else {
            console.warn('⚠️ successAlert element NOT FOUND, using fallback');
            alert(`✅ ${message}`);
        }
    }

    /**
     * Show error message with alert
     */
    showError(message) {
        console.log('❌ showError called with message:', message);
        
        // Try to find error alert elements
        const errorAlert = document.getElementById('errorAlert');
        const errorMsg = document.getElementById('errorMsg');
        
        if (errorAlert && errorMsg) {
            console.log('✓ errorAlert element found, displaying message');
            errorMsg.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> ${message}`;
            errorAlert.classList.remove('hidden');
            errorAlert.style.display = 'block';
            errorAlert.style.visibility = 'visible';
            errorAlert.style.opacity = '1';
            
            // Scroll into view
            errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Auto-hide after 8 seconds
            setTimeout(() => {
                errorAlert.classList.add('hidden');
            }, 8000);
        } else {
            console.warn('⚠️ errorAlert or errorMsg element NOT FOUND, using fallback');
            alert(message);
        }
    }

    /**
     * Update configuration
     */
    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('⚙️ FormService config updated:', this.config);
    }

    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormService;
}
