// ===== Auth Interactions Controller =====
class AuthInteractions {
  constructor() {
    this.currentForm = 'login';
    this.isSubmitting = false;
    this.init();
  }

  init() {
    this.setupFormSwitching();
    this.setupPasswordToggles();
    this.setupPasswordStrength();
    this.setupRoleToggle();
    this.setupImageUpload();
    this.setupFormValidation();
    this.setupSocialButtons();
    this.setupToastNotifications();
    this.setupTypewriterEffect();
    this.setupStatCounters();
    this.setup3DTilt();
    this.setupKeyboardShortcuts();
  }

  // ===== Form Switching =====
  setupFormSwitching() {
    const switchButtons = document.querySelectorAll('.switch-form');
    
    switchButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetForm = button.getAttribute('data-form');
        this.switchForm(targetForm);
      });
    });
  }

  switchForm(formType) {
    const currentFormElement = document.getElementById(`${this.currentForm}Form`);
    const targetFormElement = document.getElementById(`${formType}Form`);
    
    if (!currentFormElement || !targetFormElement) return;

    // Add switching animation
    currentFormElement.classList.add('switching');
    
    setTimeout(() => {
      currentFormElement.classList.add('hidden');
      currentFormElement.classList.remove('switching');
      
      targetFormElement.classList.remove('hidden');
      targetFormElement.classList.add('active');
      
      setTimeout(() => {
        targetFormElement.classList.remove('active');
      }, 800);
      
      this.currentForm = formType;
    }, 400);
  }

  // ===== Password Toggle =====
  setupPasswordToggles() {
    const toggles = document.querySelectorAll('.password-toggle');
    
    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const input = toggle.parentElement.querySelector('input');
        const icon = toggle.querySelector('i');
        
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    });
  }

  // ===== Password Strength =====
  setupPasswordStrength() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
      if (input.id.includes('Password') && !input.id.includes('login')) {
        input.addEventListener('input', () => {
          this.updatePasswordStrength(input);
        });
      }
    });
  }

  updatePasswordStrength(input) {
    const password = input.value;
    const strengthContainer = input.parentElement.parentElement.querySelector('.password-strength');
    
    if (!strengthContainer) return;

    const strengthBar = strengthContainer.querySelector('.strength-bar');
    const strengthText = strengthContainer.querySelector('.strength-text');
    
    if (password.length === 0) {
      strengthContainer.classList.remove('show');
      return;
    }
    
    strengthContainer.classList.add('show');
    
    let strength = 0;
    let strengthLabel = 'Weak';
    
    // Check password strength
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    // Update UI
    if (strength <= 2) {
      strengthBar.className = 'strength-bar weak';
      strengthLabel = 'Weak';
      strengthText.style.color = '#f44336';
    } else if (strength <= 3) {
      strengthBar.className = 'strength-bar medium';
      strengthLabel = 'Medium';
      strengthText.style.color = '#ff9800';
    } else {
      strengthBar.className = 'strength-bar strong';
      strengthLabel = 'Strong';
      strengthText.style.color = '#4CAF50';
    }
    
    strengthText.textContent = `Password strength: ${strengthLabel}`;
  }

  // ===== Role Toggle =====
  setupRoleToggle() {
    const roleInputs = document.querySelectorAll('input[name="role"]');
    
    roleInputs.forEach(input => {
      input.addEventListener('change', () => {
        this.updateRoleSelection(input.value);
      });
    });
  }

  updateRoleSelection(role) {
    // Add visual feedback for role selection
    const roleOptions = document.querySelectorAll('.role-option');
    roleOptions.forEach(option => {
      option.style.animation = 'none';
      setTimeout(() => {
        option.style.animation = '';
      }, 10);
    });
  }

  // ===== Image Upload =====
  setupImageUpload() {
    const uploadPreview = document.getElementById('imagePreview');
    const fileInput = document.getElementById('profileImage');
    
    if (!uploadPreview || !fileInput) return;

    uploadPreview.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      this.handleImageUpload(e.target.files[0]);
    });
  }

  handleImageUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
      this.showToast('Please select a valid image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.showToast('Image size should be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const uploadPreview = document.getElementById('imagePreview');
      uploadPreview.innerHTML = `<img src="${e.target.result}" alt="Profile">`;
      uploadPreview.style.animation = 'imageReveal 0.5s ease';
    };
    reader.readAsDataURL(file);
  }

  // ===== Form Validation =====
  setupFormValidation() {
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('registerFormElement');
    
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }
    
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    // Real-time validation
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('error')) {
          this.validateField(input);
        }
      });
    });
  }

  validateField(input) {
    const formGroup = input.closest('.form-group');
    let isValid = true;

    // Basic validation
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
    }

    // Email validation
    if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(input.value);
    }

    // Password confirmation
    if (input.id === 'confirmPassword') {
      const password = document.getElementById('registerPassword').value;
      isValid = input.value === password;
    }

    // Update UI
    if (isValid) {
      formGroup.classList.remove('error');
      formGroup.classList.add('success');
    } else {
      formGroup.classList.remove('success');
      formGroup.classList.add('error');
    }

    return isValid;
  }

  async handleLogin(e) {
    e.preventDefault();
    
    if (this.isSubmitting) return;

    const form = e.target;
    const email = form.querySelector('#loginEmail').value;
    const password = form.querySelector('#loginPassword').value;

    if (!this.validateForm(form)) {
      this.shakeForm(form);
      return;
    }

    await this.submitForm(form, 'login', { email, password });
  }

  async handleRegister(e) {
    e.preventDefault();
    
    if (this.isSubmitting) return;

    const form = e.target;
    const formData = new FormData(form);
    
    if (!this.validateForm(form)) {
      this.shakeForm(form);
      return;
    }

    const userData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('registerEmail'),
      password: formData.get('registerPassword'),
      role: formData.get('role'),
    };

    await this.submitForm(form, 'register', userData);
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  shakeForm(form) {
    form.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
      form.style.animation = '';
    }, 500);
  }

  async submitForm(form, type, data) {
    this.isSubmitting = true;
    const submitBtn = form.querySelector('.submit-btn');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      // Simulate API call
      await this.simulateAPICall(type, data);
      
      // Show success state
      submitBtn.classList.remove('loading');
      submitBtn.classList.add('success');
      
      setTimeout(() => {
        submitBtn.classList.remove('success');
        this.showSuccessMessage(type);
      }, 1000);

    } catch (error) {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      this.showToast(error.message, 'error');
    } finally {
      this.isSubmitting = false;
      submitBtn.disabled = false;
    }
  }

  simulateAPICall(type, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate API response
        if (Math.random() > 0.1) { // 90% success rate
          resolve({ success: true, data: { id: '123', ...data } });
        } else {
          reject(new Error('Invalid credentials or email already exists'));
        }
      }, 2000);
    });
  }

  showSuccessMessage(type) {
    const formWrapper = document.getElementById(`${type}Form`);
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    
    if (type === 'login') {
      successText.textContent = 'Welcome back! Redirecting to your dashboard...';
    } else {
      successText.textContent = 'Account created successfully! Please check your email to verify.';
    }
    
    formWrapper.classList.add('hidden');
    successMessage.classList.remove('hidden');

    // Redirect after delay
    setTimeout(() => {
      // window.location.href = '/dashboard';
      this.showToast('Redirecting to dashboard...', 'success');
    }, 3000);
  }

  // ===== Social Buttons =====
  setupSocialButtons() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
      button.addEventListener('click', () => {
        const provider = button.classList.contains('google-btn') ? 'Google' : 'GitHub';
        this.showToast(`${provider} login coming soon!`, 'info');
      });
    });
  }

  // ===== Toast Notifications =====
  setupToastNotifications() {
    const toast = document.getElementById('toast');
    const closeBtn = toast.querySelector('.toast-close');
    
    closeBtn.addEventListener('click', () => {
      this.hideToast();
    });

    // Auto-hide after 5 seconds
    toast.addEventListener('mouseenter', () => {
      clearTimeout(this.toastTimeout);
    });

    toast.addEventListener('mouseleave', () => {
      this.toastTimeout = setTimeout(() => {
        this.hideToast();
      }, 3000);
    });
  }

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon i');
    
    // Update content
    toastMessage.textContent = message;
    
    // Update icon and styling
    toast.className = `toast-notification ${type}`;
    
    if (type === 'success') {
      toastIcon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
      toastIcon.className = 'fas fa-exclamation-circle';
    } else {
      toastIcon.className = 'fas fa-info-circle';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Auto-hide
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.hideToast();
    }, 5000);
  }

  hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('show');
  }

  // ===== Typewriter Effect =====
  setupTypewriterEffect() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;

    const text = typewriterElement.textContent;
    typewriterElement.textContent = '';
    
    let index = 0;
    const typeSpeed = 100;
    
    const type = () => {
      if (index < text.length) {
        typewriterElement.textContent += text.charAt(index);
        index++;
        setTimeout(type, typeSpeed);
      }
    };
    
    // Start typing when element is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          type();
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(typewriterElement);
  }

  // ===== Stat Counters =====
  setupStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    
    statNumbers.forEach(stat => {
      observer.observe(stat);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    element.classList.add('counting');
    
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

  // ===== 3D Tilt Effect =====
  setup3DTilt() {
    const formContainer = document.querySelector('.form-container');
    if (!formContainer) return;

    formContainer.addEventListener('mousemove', (e) => {
      const rect = formContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      formContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    formContainer.addEventListener('mouseleave', () => {
      formContainer.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  }

  // ===== Keyboard Shortcuts =====
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Enter key on forms
      if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === 'INPUT') {
          const form = activeElement.closest('form');
          if (form) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
          }
        }
      }
      
      // Escape key to close toast
      if (e.key === 'Escape') {
        this.hideToast();
      }
      
      // Tab switching
      if (e.key === 'Tab' && e.shiftKey) {
        // Handle reverse tab if needed
      }
    });
  }

  // ===== Forgot Password =====
  setupForgotPassword() {
    const forgotLink = document.querySelector('.forgot-link');
    if (!forgotLink) return;

    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.showToast('Password reset functionality coming soon!', 'info');
    });
  }

  // ===== Terms and Privacy =====
  setupTermsLinks() {
    const termsLinks = document.querySelectorAll('a[href="#"]');
    
    termsLinks.forEach(link => {
      if (link.textContent.includes('Terms') || link.textContent.includes('Privacy')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.showToast('Terms and Privacy pages coming soon!', 'info');
        });
      }
    });
  }

  // ===== Continue Button =====
  setupContinueButton() {
    const continueBtn = document.getElementById('continueBtn');
    if (!continueBtn) return;

    continueBtn.addEventListener('click', () => {
      this.showToast('Redirecting to dashboard...', 'success');
      // window.location.href = '/dashboard';
    });
  }
}

// ===== Initialize Auth Interactions =====
document.addEventListener('DOMContentLoaded', () => {
  window.authInteractions = new AuthInteractions();
  
  // Initialize additional features
  setTimeout(() => {
    window.authInteractions.setupForgotPassword();
    window.authInteractions.setupTermsLinks();
    window.authInteractions.setupContinueButton();
  }, 100);
});

// ===== Export for global access =====
window.AuthInteractions = AuthInteractions;
