// ===== Authentication Module =====
class AuthManager {
  constructor() {
    this.apiBase = 'http://localhost:5000/api';
    this.token = localStorage.getItem('clipconnect_token');
    this.user = JSON.parse(localStorage.getItem('clipconnect_user') || 'null');
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkAuthStatus();
  }

  // ===== Event Listeners =====
  setupEventListeners() {
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      const modal = document.getElementById('authModal');
      if (e.target === modal) {
        this.closeModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  // ===== Authentication Status =====
  checkAuthStatus() {
    if (this.token && this.user) {
      this.updateUIForLoggedInUser();
    } else {
      this.updateUIForLoggedOutUser();
    }
  }

  isLoggedIn() {
    return !!this.token && !!this.user;
  }

  // ===== Modal Management =====
  showModal(content) {
    const modal = document.getElementById('authModal');
    const container = document.getElementById('authContainer');
    container.innerHTML = content;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  // ===== API Calls =====
  async apiCall(endpoint, options = {}) {
    const url = `${this.apiBase}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ===== Registration =====
  async register(userData) {
    try {
      const response = await this.apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (response.success) {
        this.setAuthData(response.data.token, response.data.user);
        this.showNotification('Registration successful!', 'success');
        this.closeModal();
        this.redirectToDashboard();
      }

      return response;
    } catch (error) {
      this.showNotification(error.message, 'error');
      throw error;
    }
  }

  // ===== Login =====
  async login(credentials) {
    try {
      const response = await this.apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      if (response.success) {
        this.setAuthData(response.data.token, response.data.user);
        this.showNotification('Login successful!', 'success');
        this.closeModal();
        this.redirectToDashboard();
      }

      return response;
    } catch (error) {
      this.showNotification(error.message, 'error');
      throw error;
    }
  }

  // ===== Logout =====
  logout() {
    this.clearAuthData();
    this.showNotification('Logged out successfully', 'info');
    this.updateUIForLoggedOutUser();
    window.location.href = 'index.html';
  }

  // ===== Profile Update =====
  async updateProfile(profileData) {
    try {
      const response = await this.apiCall('/auth/update-profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });

      if (response.success) {
        this.user = response.data.user;
        localStorage.setItem('clipconnect_user', JSON.stringify(this.user));
        this.showNotification('Profile updated successfully!', 'success');
      }

      return response;
    } catch (error) {
      this.showNotification(error.message, 'error');
      throw error;
    }
  }

  // ===== Auth Data Management =====
  setAuthData(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('clipconnect_token', token);
    localStorage.setItem('clipconnect_user', JSON.stringify(user));
    this.updateUIForLoggedInUser();
  }

  clearAuthData() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('clipconnect_token');
    localStorage.removeItem('clipconnect_user');
  }

  // ===== UI Updates =====
  updateUIForLoggedInUser() {
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
      navActions.innerHTML = `
        <div class="user-menu">
          <button class="btn btn-outline" onclick="authManager.showUserDropdown()">
            <i class="fas fa-user"></i>
            ${this.user.profile.firstName} ${this.user.profile.lastName}
          </button>
          <div id="userDropdown" class="user-dropdown">
            <a href="dashboard.html"><i class="fas fa-dashboard"></i> Dashboard</a>
            <a href="profile.html"><i class="fas fa-user-edit"></i> Profile</a>
            <a href="#" onclick="authManager.logout()"><i class="fas fa-sign-out-alt"></i> Logout</a>
          </div>
        </div>
      `;
    }

    // Update CTA buttons
    const ctaActions = document.querySelector('.cta-actions');
    if (ctaActions) {
      ctaActions.innerHTML = `
        <a href="dashboard.html" class="btn btn-primary btn-large">
          <i class="fas fa-tachometer-alt"></i>
          Go to Dashboard
        </a>
      `;
    }
  }

  updateUIForLoggedOutUser() {
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
      navActions.innerHTML = `
        <button class="btn btn-outline" onclick="authManager.showLogin()">Login</button>
        <button class="btn btn-primary" onclick="authManager.showSignup()">Get Started</button>
      `;
    }
  }

  // ===== Auth Forms =====
  showRoleSelection(role) {
    const content = `
      <div class="auth-container">
        <div class="auth-header">
          <h2>Join as ${role === 'client' ? 'Client' : 'Editor'}</h2>
          <p>Start creating amazing content today</p>
        </div>
        
        <div class="role-selection">
          <div class="role-card ${role === 'client' ? 'selected' : ''}" onclick="authManager.selectRole('client')">
            <i class="fas fa-hire-a-helper"></i>
            <h3>Client</h3>
            <p>Post projects and hire talented editors</p>
          </div>
          
          <div class="role-card ${role === 'editor' ? 'selected' : ''}" onclick="authManager.selectRole('editor')">
            <i class="fas fa-user-edit"></i>
            <h3>Editor</h3>
            <p>Showcase your skills and find work</p>
          </div>
        </div>
        
        <button class="btn btn-primary btn-large" onclick="authManager.showSignupForm()">
          Continue as ${role === 'client' ? 'Client' : 'Editor'}
        </button>
        
        <p class="auth-switch">
          Already have an account? <a href="#" onclick="authManager.showLogin()">Login</a>
        </p>
      </div>
    `;
    
    this.showModal(content);
  }

  showLogin() {
    const content = `
      <div class="auth-container">
        <div class="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>
        
        <form id="loginForm" onsubmit="authManager.handleLogin(event)">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          
          <button type="submit" class="btn btn-primary btn-large">
            <span class="btn-text">Sign In</span>
            <div class="loading-spinner" style="display: none;"></div>
          </button>
        </form>
        
        <p class="auth-switch">
          Don't have an account? <a href="#" onclick="authManager.showRoleSelection('client')">Sign Up</a>
        </p>
      </div>
    `;
    
    this.showModal(content);
  }

  showSignupForm() {
    const selectedRole = document.querySelector('.role-card.selected');
    if (!selectedRole) {
      this.showNotification('Please select a role', 'error');
      return;
    }

    const role = selectedRole.onclick.toString().match(/'(\w+)'/)[1];
    
    const content = `
      <div class="auth-container">
        <div class="auth-header">
          <h2>Create Account</h2>
          <p>Join as ${role === 'client' ? 'Client' : 'Editor'}</p>
        </div>
        
        <form id="signupForm" onsubmit="authManager.handleSignup(event)">
          <input type="hidden" id="role" name="role" value="${role}">
          
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" name="firstName" required>
            </div>
            
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required minlength="6">
          </div>
          
          <div class="form-group">
            <label for="bio">Bio (Optional)</label>
            <textarea id="bio" name="bio" rows="3"></textarea>
          </div>
          
          <button type="submit" class="btn btn-primary btn-large">
            <span class="btn-text">Create Account</span>
            <div class="loading-spinner" style="display: none;"></div>
          </button>
        </form>
        
        <p class="auth-switch">
          Already have an account? <a href="#" onclick="authManager.showLogin()">Login</a>
        </p>
      </div>
    `;
    
    this.showModal(content);
  }

  // ===== Form Handlers =====
  async handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.loading-spinner');

    // Show loading state
    btnText.style.display = 'none';
    spinner.style.display = 'inline-block';
    submitBtn.disabled = true;

    try {
      await this.login(credentials);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      // Reset button state
      btnText.style.display = 'inline';
      spinner.style.display = 'none';
      submitBtn.disabled = false;
    }
  }

  async handleSignup(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const userData = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      bio: formData.get('bio')
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.loading-spinner');

    // Show loading state
    btnText.style.display = 'none';
    spinner.style.display = 'inline-block';
    submitBtn.disabled = true;

    try {
      await this.register(userData);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      // Reset button state
      btnText.style.display = 'inline';
      spinner.style.display = 'none';
      submitBtn.disabled = false;
    }
  }

  // ===== Utility Functions =====
  selectRole(role) {
    document.querySelectorAll('.role-card').forEach(card => {
      card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
  }

  showUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  redirectToDashboard() {
    const dashboardUrl = this.user.role === 'editor' ? 'editor-dashboard.html' : 'client-dashboard.html';
    window.location.href = dashboardUrl;
  }
}

// ===== Global Functions =====
function showLogin() {
  authManager.showLogin();
}

function showSignup() {
  authManager.showRoleSelection('client');
}

function showRoleSelection(role) {
  authManager.showRoleSelection(role);
}

function closeModal() {
  authManager.closeModal();
}

// ===== Initialize Auth Manager =====
const authManager = new AuthManager();

// ===== Make available globally =====
window.authManager = authManager;
window.showLogin = showLogin;
window.showSignup = showSignup;
window.showRoleSelection = showRoleSelection;
window.closeModal = closeModal;
