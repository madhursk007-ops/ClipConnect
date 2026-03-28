// ===== Animation Controller =====
class AnimationController {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupCounterAnimations();
    this.setupFloatingElements();
    this.setupParallaxEffects();
    this.setupTypewriterEffect();
    this.initializeParticles();
  }

  // ===== Scroll-triggered Animations =====
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          // Stagger animation for multiple items
          if (entry.target.classList.contains('stagger-container')) {
            const items = entry.target.querySelectorAll('.stagger-item');
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('animated');
              }, index * 100);
            });
          }
        }
      });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right').forEach(el => {
      observer.observe(el);
    });

    document.querySelectorAll('.stagger-container').forEach(el => {
      observer.observe(el);
    });
  }

  // ===== Counter Animation =====
  setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          this.animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  }

  // ===== Floating Elements =====
  setupFloatingElements() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
      // Random animation delays and durations
      const delay = Math.random() * 2;
      const duration = 4 + Math.random() * 4;
      
      card.style.animationDelay = `${delay}s`;
      card.style.animationDuration = `${duration}s`;
      
      // Add hover effect
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.05)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ===== Parallax Effects =====
  setupParallaxEffects() {
    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
      
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
  }

  // ===== Typewriter Effect =====
  setupTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.style.borderRight = '2px solid var(--accent-purple)';
      
      let index = 0;
      const typeSpeed = 100;
      
      const type = () => {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
          setTimeout(type, typeSpeed);
        } else {
          // Remove cursor after typing is complete
          setTimeout(() => {
            element.style.borderRight = 'none';
          }, 1000);
        }
      };
      
      // Start typing when element is in view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            type();
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(element);
    });
  }

  // ===== Particle System =====
  initializeParticles() {
    const particleContainer = document.querySelector('.particles');
    if (!particleContainer) return;

    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random properties
      const size = Math.random() * 4 + 1;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 20;
      const duration = 15 + Math.random() * 10;
      
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${posX}%;
        top: ${posY}%;
        background: radial-gradient(circle, rgba(127, 90, 240, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
      `;
      
      particleContainer.appendChild(particle);
    }
  }

  // ===== Button Ripple Effect =====
  setupRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.classList.add('ripple');
      
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  // ===== Smooth Scroll =====
  setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ===== Loading Animation =====
  showLoadingState(element) {
    element.classList.add('loading');
    element.innerHTML = '<div class="loading-spinner"></div>';
  }

  hideLoadingState(element, originalContent) {
    element.classList.remove('loading');
    element.innerHTML = originalContent;
  }

  // ===== Animate on Page Load =====
  animatePageLoad() {
    const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) translateX(0)';
      }, index * 100);
    });
  }

  // ===== Navbar Animation on Scroll =====
  setupNavbarAnimation() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll <= 0) {
        navbar.classList.remove('scrolled');
        navbar.style.transform = 'translateY(0)';
      } else {
        navbar.classList.add('scrolled');
        
        if (currentScroll > lastScroll && currentScroll > 100) {
          // Scrolling down
          navbar.style.transform = 'translateY(-100%)';
        } else {
          // Scrolling up
          navbar.style.transform = 'translateY(0)';
        }
      }
      
      lastScroll = currentScroll;
    });
  }

  // ===== Form Validation Animation =====
  setupFormValidation() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      // Focus animation
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentElement.classList.remove('focused');
        }
      });
      
      // Validation animation
      input.addEventListener('invalid', (e) => {
        e.preventDefault();
        input.parentElement.classList.add('invalid');
        input.parentElement.classList.remove('valid');
      });
      
      input.addEventListener('input', () => {
        if (input.checkValidity()) {
          input.parentElement.classList.add('valid');
          input.parentElement.classList.remove('invalid');
        } else {
          input.parentElement.classList.remove('valid');
        }
      });
    });
  }

  // ===== Card 3D Tilt Effect =====
  setupCardTiltEffect() {
    const cards = document.querySelectorAll('.editor-card, .testimonial-card, .project-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  // ===== Initialize All Animations =====
  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupFloatingElements();
        this.setupParallaxEffects();
        this.setupTypewriterEffect();
        this.setupRippleEffect();
        this.setupSmoothScroll();
        this.setupNavbarAnimation();
        this.setupFormValidation();
        this.setupCardTiltEffect();
        this.initializeParticles();
        this.animatePageLoad();
      });
    } else {
      this.setupScrollAnimations();
      this.setupCounterAnimations();
      this.setupFloatingElements();
      this.setupParallaxEffects();
      this.setupTypewriterEffect();
      this.setupRippleEffect();
      this.setupSmoothScroll();
      this.setupNavbarAnimation();
      this.setupFormValidation();
      this.setupCardTiltEffect();
      this.initializeParticles();
      this.animatePageLoad();
    }
  }
}

// ===== Initialize Animation Controller =====
const animationController = new AnimationController();

// ===== Export for use in other modules =====
window.AnimationController = AnimationController;
window.animationController = animationController;
