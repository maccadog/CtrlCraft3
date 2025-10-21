// Email Handler for CtrlCraft - Using EmailJS (Free & Simple)
// This solution requires no server, database, or Firebase

class EmailHandler {
    constructor() {
        // EmailJS Configuration
        // You'll need to sign up at https://www.emailjs.com and get these values
        this.SERVICE_ID = 'service_vh27g2b'; // Replace with your EmailJS service ID
        this.TEMPLATE_ID = 'template_a957hvd'; // Replace with your EmailJS template ID
        this.PUBLIC_KEY = 'S0zUDXqxW2Kw0getx'; // Replace with your EmailJS public key
        
        // Image collection array
        this.collectedImages = [];
        
        this.init();
    }

    init() {
        // Load EmailJS SDK
        this.loadEmailJS();
        
        // Setup form handlers
        this.setupFormHandlers();
        this.setupImageCollection();
    }

    setupImageCollection() {
        // Handle file uploads and store image data
        const fileInput = document.getElementById('inspiration-upload');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
    }

    handleFileUpload(files) {
        const fileList = document.getElementById('file-list');
        if (!fileList) return;

        fileList.innerHTML = '';
        this.collectedImages = [];

        if (files.length === 0) {
            fileList.innerHTML = '<p class="text-gray-400 text-sm">No files selected</p>';
            return;
        }

        Array.from(files).forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Store base64 image data
                    this.collectedImages.push(e.target.result);
                    
                    // Display file in UI
                    const fileItem = document.createElement('div');
                    fileItem.className = 'flex items-center justify-between bg-gray-800 p-2 rounded text-sm';
                    fileItem.innerHTML = `
                        <span class="text-gray-300">${file.name}</span>
                        <span class="text-teal-400 text-xs">${(file.size / 1024).toFixed(1)}KB</span>
                    `;
                    fileList.appendChild(fileItem);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    loadEmailJS() {
        // Add EmailJS script to head
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.onload = () => {
            // Initialize EmailJS with your public key
            if (typeof emailjs !== 'undefined') {
                emailjs.init(this.PUBLIC_KEY);
                console.log('EmailJS initialized successfully');
            }
        };
        document.head.appendChild(script);
    }

    setupFormHandlers() {
        // Handle inquiry form submissions
        const inquiryForm = document.getElementById('inquiry-form');
        if (inquiryForm) {
            inquiryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleInquirySubmission(e.target);
            });
        }

        // Handle contact form submissions (if any)
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmission(e.target);
            });
        }
    }

    async handleInquirySubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Validate required fields
            if (!data.name || !data.email || !data.message || !data['shipping-confirm']) {
                throw new Error('Please fill in all required fields and confirm shipping requirements');
            }
            
            // Prepare email parameters
            const emailParams = {
                to_email: 'mackenzie5688@gmail.com', // Your email address
                from_name: data.name,
                from_email: data.email,
                phone: data.phone || 'Not provided',
                service_type: data.service || 'Not specified',
                controller_type: data['controller-type'] || 'Not specified',
                timeline: data.timeline || 'Not specified',
                message: data.message,
                reply_to: data.email,
                images: this.collectedImages || [] // Array of image URLs if any
            };
            
            // Send email using EmailJS
            const response = await emailjs.send(
                this.SERVICE_ID,
                this.TEMPLATE_ID,
                emailParams
            );
            
            if (response.status === 200) {
                this.showNotification('Inquiry sent successfully! I\'ll contact you soon.', 'success');
                form.reset();
                
                // Reset service selection if exists
                document.querySelectorAll('.service-option').forEach(card => {
                    card.classList.remove('selected');
                });
            } else {
                throw new Error('Failed to send email');
            }
            
        } catch (error) {
            console.error('Email sending error:', error);
            this.showNotification('Failed to send inquiry. Please try again or contact directly.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    async handleContactSubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            const emailParams = {
                to_email: 'mackenzie5688@gmail.com',
                from_name: data.name,
                from_email: data.email,
                subject: data.subject || 'Contact Form Submission',
                message: data.message,
                reply_to: data.email
            };
            
            const response = await emailjs.send(
                this.SERVICE_ID,
                this.TEMPLATE_ID,
                emailParams
            );
            
            if (response.status === 200) {
                this.showNotification('Message sent successfully!', 'success');
                form.reset();
            } else {
                throw new Error('Failed to send email');
            }
            
        } catch (error) {
            console.error('Email sending error:', error);
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 p-4 rounded-lg text-white z-50 max-w-sm ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`;
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="mr-4">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize EmailHandler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if EmailJS credentials are properly set
    const handler = new EmailHandler();
    
    // Warn if credentials aren't configured
    setTimeout(() => {
        if (handler.SERVICE_ID === 'your_service_id') {
            console.warn('EmailJS not configured. Please set up your EmailJS credentials in email-handler.js');
        }
    }, 1000);
});