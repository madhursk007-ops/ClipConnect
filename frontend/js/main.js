// ===== Main Application Controller =====
class ClipConnectApp {
  constructor() {
    this.apiBase = 'http://localhost:5000/api';
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupMobileMenu();
    this.setupSmoothScrolling();
    this.setupFormValidation();
    this.setupSearchFunctionality();
    this.loadFeaturedEditors();
    this.setupTestimonialCarousel();
    this.initializeTooltips();
    this.setupKeyboardShortcuts();
  }

  // ===== Navigation Setup =====
  setupNavigation() {
    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // ===== Mobile Menu =====
  setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navActions = document.querySelector('.nav-actions');

    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navActions.classList.toggle('active');
        navToggle.classList.toggle('active');
      });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navActions.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  // ===== Smooth Scrolling =====
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ===== Form Validation =====
  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', () => {
          this.validateField(input);
        });

        input.addEventListener('input', () => {
          if (input.classList.contains('invalid')) {
            this.validateField(input);
          }
        });
      });

      // Form submission
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });
    });
  }

  validateField(field) {
    const isValid = field.checkValidity();
    const formGroup = field.closest('.form-group');
    
    if (formGroup) {
      if (isValid) {
        formGroup.classList.remove('invalid');
        formGroup.classList.add('valid');
      } else {
        formGroup.classList.remove('valid');
        formGroup.classList.add('invalid');
      }
    }

    return isValid;
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // ===== Search Functionality =====
  setupSearchFunctionality() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
      let debounceTimer;
      
      input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        
        debounceTimer = setTimeout(() => {
          if (query.length >= 2) {
            this.performSearch(query);
          } else {
            this.clearSearchResults();
          }
        }, 300);
      });
    });
  }

  async performSearch(query) {
    try {
      const response = await fetch(`${this.apiBase}/users?search=${query}&limit=5`);
      const data = await response.json();
      
      if (data.success) {
        this.displaySearchResults(data.data.users);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  displaySearchResults(results) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="no-results">No results found</div>';
    } else {
      searchResults.innerHTML = results.map(user => `
        <div class="search-result-item" onclick="app.navigateToUser('${user._id}')">
          <img src="${user.profile.avatar || 'https://picsum.photos/seed/default/40/40.jpg'}" alt="${user.username}">
          <div class="search-result-info">
            <h4>${user.profile.firstName} ${user.profile.lastName}</h4>
            <p>${user.role === 'editor' ? 'Video Editor' : 'Client'}</p>
          </div>
        </div>
      `).join('');
    }

    searchResults.style.display = 'block';
  }

  clearSearchResults() {
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
      searchResults.style.display = 'none';
    }
  }

  // ===== Load Featured Editors =====
  async loadFeaturedEditors() {
    try {
      const response = await fetch(`${this.apiBase}/users/editors/featured?limit=6`);
      const data = await response.json();
      
      if (data.success) {
        this.displayFeaturedEditors(data.data.editors);
      }
    } catch (error) {
      console.error('Error loading featured editors:', error);
      this.displayPlaceholderEditors();
    }
  }

  displayFeaturedEditors(editors) {
    const carousel = document.querySelector('.editors-carousel');
    if (!carousel) return;

    carousel.innerHTML = editors.map(editor => `
      <div class="editor-card scroll-reveal" onclick="app.navigateToUser('${editor._id}')">
        <div class="editor-avatar">
          <img src="${editor.profile.avatar || `https://picsum.photos/seed/${editor._id}/100/100.jpg`}" alt="${editor.username}">
          <div class="status-indicator ${editor.editorProfile.availability ? 'online' : 'away'}"></div>
        </div>
        <h3>${editor.profile.firstName} ${editor.profile.lastName}</h3>
        <p class="editor-specialty">${this.getEditorSpecialty(editor)}</p>
        <div class="editor-rating">
          <div class="stars">
            ${this.generateStars(editor.ratings.average)}
          </div>
          <span>${editor.ratings.average.toFixed(1)} (${editor.ratings.count} reviews)</span>
        </div>
        <div class="editor-rate">
          <span class="rate">$${editor.editorProfile.hourlyRate || 50}</span>
          <span class="rate-unit">/hour</span>
        </div>
        <div class="editor-skills">
          ${editor.editorProfile.skills.slice(0, 3).map(skill => 
            `<span class="skill-tag">${this.formatSkill(skill)}</span>`
          ).join('')}
        </div>
        <button class="btn btn-outline btn-small">View Profile</button>
      </div>
    `).join('');

    // Re-initialize scroll animations
    if (window.animationController) {
      window.animationController.setupScrollAnimations();
    }
  }

  displayPlaceholderEditors() {
    const carousel = document.querySelector('.editors-carousel');
    if (!carousel) return;

    const placeholders = Array(3).fill(null).map((_, index) => ({
      _id: `placeholder-${index}`,
      profile: {
        firstName: ['Alex', 'Sarah', 'Mike'][index],
        lastName: ['Rivera', 'Chen', 'Johnson'][index],
        avatar: `https://picsum.photos/seed/editor${index}/100/100.jpg`
      },
      editorProfile: {
        availability: true,
        hourlyRate: [75, 60, 85][index],
        skills: [['video-editing', 'motion-graphics'], ['color-grading', 'audio-editing'], ['animation', 'vfx']][index]
      },
      ratings: {
        average: [4.9, 4.8, 5.0][index],
        count: [127, 89, 203][index]
      }
    }));

    this.displayFeaturedEditors(placeholders);
  }

  // ===== Testimonial Carousel =====
  setupTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    if (testimonials.length === 0) return;

    let currentIndex = 0;
    
    const showTestimonial = (index) => {
      testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? 'block' : 'none';
      });
    };

    // Auto-advance testimonials
    setInterval(() => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(currentIndex);
    }, 5000);

    // Show first testimonial
    showTestimonial(0);
  }

  // ===== Tooltips =====
  initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.showTooltip(e.target);
      });

      element.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  showTooltip(element) {
    const text = element.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    setTimeout(() => tooltip.classList.add('show'), 10);
  }

  hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }

  // ===== Keyboard Shortcuts =====
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.focusSearch();
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  focusSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }

  closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
  }

  // ===== Utility Functions =====
  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
  }

  formatSkill(skill) {
    return skill.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  getEditorSpecialty(editor) {
    const skills = editor.editorProfile.skills || [];
    if (skills.includes('motion-graphics')) return 'Motion Graphics Expert';
    if (skills.includes('color-grading')) return 'Color Grading Specialist';
    if (skills.includes('animation')) return 'Animation Expert';
    if (skills.includes('vfx')) return 'VFX Artist';
    return 'Video Editing Professional';
  }

  navigateToUser(userId) {
    window.location.href = `profile.html?id=${userId}`;
  }

  // ===== API Helper =====
  async apiCall(endpoint, options = {}) {
    const url = `${this.apiBase}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ===== Notification System =====
  showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto remove
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }
}

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
  window.app = new ClipConnectApp();
  
  // Add global styles for notifications
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      max-width: 400px;
      background: var(--secondary-black);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    }
    
    .notification.show {
      transform: translateX(0);
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
    
    .notification-success {
      border-color: #4CAF50;
      color: #4CAF50;
    }
    
    .notification-error {
      border-color: #f44336;
      color: #f44336;
    }
    
    .notification-warning {
      border-color: #ff9800;
      color: #ff9800;
    }
    
    .notification-info {
      border-color: var(--accent-blue);
      color: var(--accent-blue);
    }
    
    .notification-close {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      margin-left: auto;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    
    .notification-close:hover {
      opacity: 1;
    }
    
    .tooltip {
      position: absolute;
      background: var(--secondary-black);
      color: var(--text-primary);
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      font-size: 14px;
      white-space: nowrap;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.2s;
      pointer-events: none;
    }
    
    .tooltip.show {
      opacity: 1;
    }
    
    .navbar.scrolled {
      background: rgba(11, 11, 15, 0.98);
      backdrop-filter: blur(20px);
    }
    
    .nav-link.active {
      color: var(--accent-purple);
    }
    
    .nav-menu.active,
    .nav-actions.active {
      display: flex;
    }
    
    .nav-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
      opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .form-group.invalid input,
    .form-group.invalid textarea,
    .form-group.invalid select {
      border-color: #f44336;
    }
    
    .form-group.valid input,
    .form-group.valid textarea,
    .form-group.valid select {
      border-color: #4CAF50;
    }
    
    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--secondary-black);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      max-height: 300px;
      overflow-y: auto;
      z-index: 1000;
    }
    
    .search-result-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm);
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .search-result-item:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    
    .search-result-item img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    
    .no-results {
      padding: var(--spacing-md);
      text-align: center;
      color: var(--text-secondary);
    }
    
    @media (max-width: 768px) {
      .nav-menu,
      .nav-actions {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--secondary-black);
        flex-direction: column;
        padding: var(--spacing-md);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .notification {
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
  `;
  document.head.appendChild(style);
});

// ===== Global Functions =====
window.navigateToUser = (userId) => {
  window.app.navigateToUser(userId);
};
