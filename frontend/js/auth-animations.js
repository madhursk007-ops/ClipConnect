// ===== Auth Animations Controller =====
class AuthAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.initializeParticles();
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupLoadingAnimations();
    this.setupSuccessAnimations();
    this.setupErrorAnimations();
    this.setupMicroInteractions();
    this.setupBackgroundAnimations();
    this.setupCursorGlow();
  }

  // ===== Particle System =====
  initializeParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;

    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      this.createParticle(particlesContainer, i);
    }
  }

  createParticle(container, index) {
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
      animation: particleFloat ${duration}s infinite linear;
    `;
    
    container.appendChild(particle);
  }

  // ===== Scroll Animations =====
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          
          // Stagger animation for multiple items
          if (entry.target.classList.contains('stagger-container')) {
            this.animateStaggerItems(entry.target);
          }
        }
      });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.animate-on-scroll, .feature-item, .stat-item').forEach(el => {
      observer.observe(el);
    });
  }

  animateStaggerItems(container) {
    const items = container.querySelectorAll('.stagger-item');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animated');
      }, index * 100);
    });
  }

  // ===== Hover Effects =====
  setupHoverEffects() {
    // Button hover effects
    const buttons = document.querySelectorAll('.submit-btn, .social-btn, .btn-continue');
    buttons.forEach(button => {
      this.addButtonHoverEffect(button);
    });

    // Input hover effects
    const inputs = document.querySelectorAll('.floating-label input');
    inputs.forEach(input => {
      this.addInputHoverEffect(input);
    });

    // Card hover effects
    const cards = document.querySelectorAll('.feature-item, .upload-preview');
    cards.forEach(card => {
      this.addCardHoverEffect(card);
    });
  }

  addButtonHoverEffect(button) {
    button.addEventListener('mouseenter', (e) => {
      const ripple = document.createElement('span');
      ripple.className = 'button-ripple';
      
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;
      
      button.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  }

  addInputHoverEffect(input) {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
  }

  addCardHoverEffect(card) {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  }

  // ===== Loading Animations =====
  setupLoadingAnimations() {
    // Submit button loading
    const submitButtons = document.querySelectorAll('.submit-btn');
    submitButtons.forEach(button => {
      this.setupSubmitButtonLoading(button);
    });
  }

  setupSubmitButtonLoading(button) {
    const form = button.closest('form');
    if (!form) return;

    form.addEventListener('submit', () => {
      button.classList.add('loading');
      
      // Simulate loading completion
      setTimeout(() => {
        button.classList.remove('loading');
        button.classList.add('success');
        
        setTimeout(() => {
          button.classList.remove('success');
        }, 1000);
      }, 2000);
    });
  }

  // ===== Success Animations =====
  setupSuccessAnimations() {
    // Success message animation
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
      this.observeElement(successMessage, () => {
        this.animateSuccessMessage();
      });
    }

    // Checkbox success animation
    const checkboxes = document.querySelectorAll('.checkbox-container input');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.animateCheckboxSuccess(e.target);
        }
      });
    });
  }

  animateSuccessMessage() {
    const successIcon = document.querySelector('.success-icon');
    if (successIcon) {
      successIcon.style.animation = 'successIconBounce 1s ease';
    }
  }

  animateCheckboxSuccess(checkbox) {
    const checkmark = checkbox.nextElementSibling;
    if (checkmark) {
      checkmark.style.animation = 'checkboxCheck 0.4s ease';
    }
  }

  // ===== Error Animations =====
  setupErrorAnimations() {
    // Form validation errors
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
      input.addEventListener('invalid', (e) => {
        e.preventDefault();
        this.animateInputError(input);
      });
    });
  }

  animateInputError(input) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('error');
      formGroup.style.animation = 'shake 0.5s ease';
      
      setTimeout(() => {
        formGroup.style.animation = '';
      }, 500);
    }
  }

  // ===== Micro Interactions =====
  setupMicroInteractions() {
    // Label floating animation
    const floatingLabels = document.querySelectorAll('.floating-label');
    floatingLabels.forEach(label => {
      this.setupFloatingLabel(label);
    });

    // Role toggle animation
    const roleToggle = document.querySelector('.role-toggle');
    if (roleToggle) {
      this.setupRoleToggleAnimation(roleToggle);
    }

    // Social button interactions
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
      this.setupSocialButtonAnimation(button);
    });
  }

  setupFloatingLabel(labelContainer) {
    const input = labelContainer.querySelector('input');
    const label = labelContainer.querySelector('label');
    
    if (!input || !label) return;

    input.addEventListener('focus', () => {
      label.style.animation = 'labelFloat 0.3s ease';
    });

    input.addEventListener('blur', () => {
      if (!input.value) {
        label.style.animation = 'labelSink 0.3s ease';
      }
    });
  }

  setupRoleToggleAnimation(roleToggle) {
    const roleOptions = roleToggle.querySelectorAll('.role-option');
    
    roleOptions.forEach(option => {
      option.addEventListener('click', () => {
        roleOptions.forEach(opt => {
          opt.style.animation = 'none';
        });
        
        setTimeout(() => {
          option.style.animation = 'roleSelect 0.4s ease';
        }, 10);
      });
    });
  }

  setupSocialButtonAnimation(button) {
    button.addEventListener('mouseenter', () => {
      const icon = button.querySelector('i');
      if (icon) {
        icon.style.animation = 'pulse 0.5s ease';
      }
    });
  }

  // ===== Background Animations =====
  setupBackgroundAnimations() {
    // Floating shapes animation
    const floatingShapes = document.querySelectorAll('.floating-shape');
    floatingShapes.forEach((shape, index) => {
      this.animateFloatingShape(shape, index);
    });

    // Gradient animation
    this.animateGradientBackground();
  }

  animateFloatingShape(shape, index) {
    const duration = 20 + (index * 5);
    const delay = index * 2;
    
    shape.style.animation = `float ${duration}s infinite ease-in-out`;
    shape.style.animationDelay = `${delay}s`;
  }

  animateGradientBackground() {
    const bgAnimation = document.querySelector('.bg-animation');
    if (bgAnimation) {
      bgAnimation.style.animation = 'gradientShift 30s ease infinite';
    }
  }

  // ===== Cursor Glow Effect =====
  setupCursorGlow() {
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    cursorGlow.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, rgba(127, 90, 240, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: all 0.1s ease;
      opacity: 0;
    `;
    
    document.body.appendChild(cursorGlow);
    
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
      cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });

    // Glow on interactive elements
    const interactiveElements = document.querySelectorAll('button, input, a, .upload-preview');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(2)';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(127, 90, 240, 0.6) 0%, transparent 70%)';
      });

      element.addEventListener('mouseleave', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(127, 90, 240, 0.3) 0%, transparent 70%)';
      });
    });
  }

  // ===== Utility Functions =====
  observeElement(element, callback) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(element);
  }

  // ===== Form Transition Animations =====
  animateFormTransition(fromForm, toForm) {
    fromForm.style.animation = 'fadeOutUp 0.4s ease forwards';
    
    setTimeout(() => {
      fromForm.classList.add('hidden');
      toForm.classList.remove('hidden');
      toForm.style.animation = 'fadeInUp 0.8s ease forwards';
    }, 400);
  }

  // ===== Progress Animation =====
  animateProgress(element, targetPercent) {
    element.style.transition = 'width 2s ease';
    setTimeout(() => {
      element.style.width = `${targetPercent}%`;
    }, 100);
  }

  // ===== Text Animation =====
  animateText(element, text, speed = 50) {
    element.textContent = '';
    let index = 0;
    
    const type = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      }
    };
    
    type();
  }

  // ===== Number Animation =====
  animateNumber(element, targetNumber, duration = 2000) {
    const startNumber = 0;
    const increment = targetNumber / (duration / 16);
    let currentNumber = startNumber;
    
    const updateNumber = () => {
      currentNumber += increment;
      if (currentNumber < targetNumber) {
        element.textContent = Math.floor(currentNumber);
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = targetNumber;
      }
    };
    
    updateNumber();
  }
}

// ===== Animation Keyframes (Dynamic) =====
const addAnimationKeyframes = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.6;
      }
      90% {
        opacity: 0.6;
      }
      100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
      }
    }

    @keyframes ripple {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(4);
        opacity: 0;
      }
    }

    @keyframes labelFloat {
      0% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(-20px);
      }
    }

    @keyframes labelSink {
      0% {
        transform: translateY(-20px);
      }
      100% {
        transform: translateY(0);
      }
    }

    @keyframes fadeOutUp {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-30px);
      }
    }

    .cursor-glow {
      mix-blend-mode: screen;
    }
  `;
  
  document.head.appendChild(style);
};

// ===== Initialize Auth Animations =====
document.addEventListener('DOMContentLoaded', () => {
  addAnimationKeyframes();
  window.authAnimations = new AuthAnimations();
});

// ===== Export for global access =====
window.AuthAnimations = AuthAnimations;
