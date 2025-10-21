// CtrlCraft Main JavaScript - Fixed Version
// Using CDN versions of libraries instead of ES6 imports

class CtrlCraftApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initAnimations();
        this.setupFormHandlers();
        this.initCarousels();
        this.createParticleEffect();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll animations
        window.addEventListener('scroll', () => {
            this.handleScrollAnimations();
        });
    }

    initAnimations() {
        // Typewriter effect for hero text
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) {
            this.typewriterEffect(heroTitle, 'Precision Gaming, Perfected');
        } else {
            console.warn('Hero title element not found!');
        }

        // Animate service cards on load
        setTimeout(() => {
            this.animateServiceCards();
        }, 1000);
    }

    typewriterEffect(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };

        type();
    }

    animateServiceCards() {
        const cards = document.querySelectorAll('.service-card');
        if (cards.length === 0) return;

        // Check if Anime.js is available
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.service-card',
                opacity: [0, 1],
                translateY: [50, 0],
                easing: 'easeOutExpo',
                delay: anime.stagger(150),
                duration: 800
            });
        } else {
            console.warn('Anime.js not loaded — using fallback CSS animation');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }
    }

    handleScrollAnimations() {
        const elements = document.querySelectorAll('.scroll-reveal');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    setupFormHandlers() {
        const inquiryForm = document.getElementById('inquiry-form');
        if (inquiryForm) {
            inquiryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleInquirySubmission(e.target);
            });
        }

        // Service selection
        const serviceCards = document.querySelectorAll('.service-option');
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectService(card);
            });
        });

        // File upload handling
        const fileInput = document.getElementById('inspiration-upload');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target);
            });
        }
    }

    selectService(selectedCard) {
        // Remove previous selections
        document.querySelectorAll('.service-option').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked card
        selectedCard.classList.add('selected');
        
        // Update hidden form field
        const serviceInput = document.getElementById('selected-service');
        if (serviceInput) {
            serviceInput.value = selectedCard.dataset.service;
        }
    }

    handleFileUpload(input) {
        const fileList = document.getElementById('file-list');
        if (fileList && input.files.length > 0) {
            fileList.innerHTML = '';
            Array.from(input.files).forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item flex items-center justify-between bg-gray-800 p-3 rounded-lg mb-2';
                    
                    // Create image preview
                    const img = document.createElement('img');
                    img.className = 'w-16 h-16 object-cover rounded mr-3';
                    img.src = URL.createObjectURL(file);
                    
                    // Create file info
                    const fileInfo = document.createElement('div');
                    fileInfo.className = 'flex-1';
                    fileInfo.innerHTML = `
                        <div class="text-sm font-medium text-white">${file.name}</div>
                        <div class="text-xs text-gray-400">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    `;
                    
                    // Create remove button
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'text-red-400 hover:text-red-300 ml-2 text-lg font-bold';
                    removeBtn.innerHTML = '✕';
                    removeBtn.onclick = () => {
                        fileItem.remove();
                        // Remove from file input (create new input without this file)
                        const dt = new DataTransfer();
                        const files = Array.from(input.files);
                        files.forEach((f, i) => {
                            if (i !== index) dt.items.add(f);
                        });
                        input.files = dt.files;
                        if (input.files.length === 0) {
                            fileList.innerHTML = '<p class="text-gray-400 text-sm">No files selected</p>';
                        }
                    };
                    
                    fileItem.appendChild(img);
                    fileItem.appendChild(fileInfo);
                    fileItem.appendChild(removeBtn);
                    fileList.appendChild(fileItem);
                }
            });
        } else if (fileList) {
            fileList.innerHTML = '<p class="text-gray-400 text-sm">No files selected</p>';
        }
    }

    async handleInquirySubmission(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showNotification('Inquiry sent successfully! We\'ll contact you soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Reset service selection
            document.querySelectorAll('.service-option').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Reset file upload display
            const fileList = document.getElementById('file-list');
            if (fileList) {
                fileList.innerHTML = '<p class="text-gray-400 text-sm">No files selected</p>';
            }
            
            // Redirect to main page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } catch (error) {
            this.showNotification('Failed to send inquiry. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Inquiry';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    initCarousels() {
        // Initialize portfolio carousel
        const portfolioCarousel = document.getElementById('portfolio-carousel');
        if (portfolioCarousel) {
            this.createInfiniteCarousel(portfolioCarousel);
        }
    }

    createInfiniteCarousel(container) {
        const items = container.querySelectorAll('.carousel-item');
        if (items.length === 0) return;
        
        let currentIndex = 0;
        
        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % items.length;
            this.updateCarouselPosition(container, items, currentIndex);
        };
        
        // Auto-advance carousel
        setInterval(nextSlide, 4000);
    }

    updateCarouselPosition(container, items, index) {
        const offset = -index * 100;
        container.style.transform = `translateX(${offset}%)`;
    }

    createParticleEffect() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 50;
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        // Animate particles
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(20, 184, 166, ${particle.opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CtrlCraftApp();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .scroll-reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .scroll-reveal.active {
        opacity: 1;
        transform: translateY(0);
    }
    
    .service-option {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .service-option:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    
    .service-option.selected {
        background: linear-gradient(135deg, #14b8a6, #3b82f6);
        color: white;
    }
    
    .metallic-shine {
        background: linear-gradient(135deg, #c0c0c0, #e0e0e0, #c0c0c0);
        background-size: 200% 200%;
        animation: metallic-shine 3s ease-in-out infinite;
    }
    
    @keyframes metallic-shine {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }
    
    .carousel-container {
        overflow: hidden;
        position: relative;
    }
    
    .carousel-track {
        display: flex;
        transition: transform 0.5s ease;
    }
    
    .carousel-item {
        min-width: 100%;
        flex-shrink: 0;
    }
`;
document.head.appendChild(style);