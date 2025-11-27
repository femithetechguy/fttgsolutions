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
     * Show success message with styled popup
     */
    showSuccess(message) {
        console.log('🎉 showSuccess called with message:', message);
        
        // Create overlay if it doesn't exist
        let overlay = document.getElementById('formOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'formOverlay';
            overlay.className = 'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300';
            document.body.appendChild(overlay);
        }
        
        // Create or update modal
        let modal = document.getElementById('formStatusModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'formStatusModal';
            document.body.appendChild(modal);
        }
        
        modal.className = 'fixed inset-0 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-300">
                <div class="flex justify-center mb-4">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                        <i class="bi bi-check-circle-fill text-green-600 text-3xl"></i>
                    </div>
                </div>
                <h3 class="text-xl font-bold text-gray-900 text-center mb-3">Success!</h3>
                <p class="text-gray-700 text-center mb-6 leading-relaxed">${message}</p>
                <button onclick="document.getElementById('formStatusModal')?.remove(); document.getElementById('formOverlay')?.remove();" class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors">
                    Got it
                </button>
            </div>
        `;
        
        overlay.classList.remove('hidden');
        overlay.style.display = 'block';
        overlay.style.opacity = '1';
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                modal.remove();
                overlay.remove();
            }
        });
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            modal.remove();
            overlay.remove();
        }, 5000);
    }

    /**
     * Show error message with styled popup
     */
    showError(message) {
        console.log('❌ showError called with message:', message);
        
        // Create overlay if it doesn't exist
        let overlay = document.getElementById('formOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'formOverlay';
            overlay.className = 'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300';
            document.body.appendChild(overlay);
        }
        
        // Create or update modal
        let modal = document.getElementById('formStatusModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'formStatusModal';
            document.body.appendChild(modal);
        }
        
        modal.className = 'fixed inset-0 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-300">
                <div class="flex justify-center mb-4">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <i class="bi bi-exclamation-circle-fill text-red-600 text-3xl"></i>
                    </div>
                </div>
                <h3 class="text-xl font-bold text-gray-900 text-center mb-3">Oops!</h3>
                <p class="text-gray-700 text-center mb-6 leading-relaxed">${message}</p>
                <button onclick="document.getElementById('formStatusModal')?.remove(); document.getElementById('formOverlay')?.remove();" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors">
                    Try Again
                </button>
            </div>
        `;
        
        overlay.classList.remove('hidden');
        overlay.style.display = 'block';
        overlay.style.opacity = '1';
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                modal.remove();
                overlay.remove();
            }
        });
        
        // Auto-close after 8 seconds
        setTimeout(() => {
            modal.remove();
            overlay.remove();
        }, 8000);
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
