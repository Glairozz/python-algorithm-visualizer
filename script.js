document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const content = document.getElementById('content');
    const barFill = document.getElementById('bar-fill');
    const typedText = document.getElementById('typed-text');

    // Loading Screen
    (function runLoading() {
        const duration = 3000;
        const interval = 50;
        const step = (interval / duration) * 100;
        let progress = 0;

        if (!loadingScreen) {
            if (content) content.style.display = 'block';
            return;
        }

        if (!barFill) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    if (content) content.style.display = 'block';
                }, 600);
            }, duration);
            return;
        }

        const iv = setInterval(() => {
            progress += step;
            if (progress > 100) progress = 100;
            barFill.style.width = progress + '%';

            if (progress >= 100) {
                clearInterval(iv);
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    if (content) content.style.display = 'block';
                }, 600);
            }
        }, interval);
    })();

    // Typewriter Effect
    (function setupTypewriter() {
        if (!typedText) return;
        const texts = [
            'Fullstack Developer',
            'Aspiring Software Engineer',
            'Creative Problem Solver',
            'Lifelong Learner'
        ];
        let currentText = 0;
        let charIndex = 0;
        const typingSpeed = 100;
        const deletingSpeed = 50;
        const pauseAfterFull = 1400;

        function type() {
            const t = texts[currentText];
            if (charIndex < t.length) {
                typedText.textContent += t.charAt(charIndex);
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(deleteText, pauseAfterFull);
            }
        }

        function deleteText() {
            if (charIndex > 0) {
                typedText.textContent = typedText.textContent.slice(0, charIndex - 1);
                charIndex--;
                setTimeout(deleteText, deletingSpeed);
            } else {
                currentText = (currentText + 1) % texts.length;
                setTimeout(type, 200);
            }
        }

        setTimeout(type, 350);
    })();

    // Scroll-based Animations and Parallax
    (function setupScrollAnimations() {
        // Add fade-in animation to sections
        const sections = document.querySelectorAll('.section');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            section.classList.add('fade-in-section');
            observer.observe(section);
        });

        // Parallax effect for hero section
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (header && scrolled < 500) {
                header.style.transform = `translateY(${scrolled * 0.5}px)`;
                header.style.opacity = 1 - (scrolled / 500);
            }
        });

        // Add staggered animation to about containers
        const aboutContainers = document.querySelectorAll('.about-container');
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    setTimeout(() => {
                        entry.target.style.animation = 'slideInLeft 0.6s ease-out forwards';
                    }, index * 100);
                }
            });
        }, { threshold: 0.2 });

        aboutContainers.forEach(container => aboutObserver.observe(container));

        // Add animation to education boxes
        const educationBoxes = document.querySelectorAll('.education-box');
        const eduObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    setTimeout(() => {
                        entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
                    }, index * 150);
                }
            });
        }, { threshold: 0.2 });

        educationBoxes.forEach(box => eduObserver.observe(box));
    })();

    // Infinite Carousels
    (function setupInfiniteCarousels() {
        function initInfiniteCarousel(trackSelector, containerSelector, speed = 0.5) {
            const container = document.querySelector(containerSelector);
            const track = document.querySelector(trackSelector);
            if (!container || !track) return;

            track.style.display = 'flex';
            track.style.flexWrap = 'nowrap';
            track.style.alignItems = 'center';

            let scroll = 0;
            let paused = false;

            container.addEventListener('mouseenter', () => paused = true);
            container.addEventListener('mouseleave', () => paused = false);

            track.innerHTML += track.innerHTML;
            const trackWidth = track.scrollWidth / 2;

            function animate() {
                if (!paused) {
                    scroll += speed;
                    if (scroll >= trackWidth) scroll = 0;
                    track.style.transform = `translateX(-${scroll}px)`;
                }
                requestAnimationFrame(animate);
            }

            // Add hover effect for individual items
            const items = track.querySelectorAll('img');
            items.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'scale(1.2) rotate(5deg)';
                    item.style.filter = 'brightness(1.2)';
                    item.style.transition = 'all 0.3s ease';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'scale(1)';
                    item.style.filter = 'brightness(1)';
                });
            });

            animate();
        }

        initInfiniteCarousel('.softwares-track', '.softwares-container', 0.3);
        initInfiniteCarousel('.tools-track', '.tools-container', 0.3);
    })();

    // Mobile Menu Toggle
    (function setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navBar = document.querySelector('.nav-bar');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            document.querySelectorAll('.nav-bar nav ul li a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        // Add scroll effect to navbar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navBar.classList.add('scrolled');
            } else {
                navBar.classList.remove('scrolled');
            }
        });
    })();

    // Particle System
    (function setupParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = 0;
        let mouseY = 0;
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.color = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`;
                this.alpha = Math.random() * 0.5 + 0.3;
                this.pulseSpeed = Math.random() * 0.02 + 0.01;
                this.pulsePhase = Math.random() * Math.PI * 2;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Mouse interaction
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100 && distance > 0) {
                    const force = (100 - distance) / 100;
                    this.x -= (dx / distance) * force * 2;
                    this.y -= (dy / distance) * force * 2;
                }
                
                // Wrap around edges
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
                
                // Pulsing effect
                this.pulsePhase += this.pulseSpeed;
                this.currentSize = this.size + Math.sin(this.pulsePhase) * 0.5;
            }
            
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Create particles
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }
        
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Connect particles with lines
        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        ctx.save();
                        ctx.globalAlpha = (120 - distance) / 120 * 0.3;
                        ctx.strokeStyle = '#3b82f6';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
        }
        
        function animate() {
            if (!ctx || !canvas) return;
            
            try {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach(particle => {
                    if (particle && typeof particle.update === 'function' && typeof particle.draw === 'function') {
                        particle.update();
                        particle.draw();
                    }
                });
                
                connectParticles();
                requestAnimationFrame(animate);
            } catch (error) {
                console.error('Animation error:', error);
            }
        }
        
        animate();
    })();

    // Enhanced Scroll Animations
    (function setupEnhancedScrollAnimations() {
        // Add magnetic effect to interactive elements
        const magneticElements = document.querySelectorAll('.contact li, .project-item, .certificates, .education-box');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const angle = Math.atan2(y, x);
                const distance = Math.min(Math.sqrt(x * x + y * y), 50);
                const force = (50 - distance) / 50;
                
                element.style.transform = `
                    translateX(${Math.cos(angle) * force * 5}px) 
                    translateY(${Math.sin(angle) * force * 5}px)
                    scale(${1 + force * 0.02})
                `;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
        
        // Parallax for skills section (removed to prevent conflicts with existing animations)
    })();

    // Error Handling
    window.addEventListener('error', ev => {
        console.error('Runtime error captured:', ev.message, ev.filename, 'line', ev.lineno);
    });
});