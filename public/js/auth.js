/**
 * EnergySaver - Authentication Views (Frontend Integration Logic)
 * Connects login and registration forms to live Express & MySQL endpoints.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    setupPasswordVisibilityToggles();
    setupLoginForm();
    setupRegisterForm();
  });

  function setupPasswordVisibilityToggles() {
    document.querySelectorAll('.password-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        const input = this.previousElementSibling;
        if (!input) return;

        if (input.type === 'password') {
          input.type = 'text';
          this.textContent = 'Hide';
          this.setAttribute('aria-label', 'Hide password');
        } else {
          input.type = 'password';
          this.textContent = 'Show';
          this.setAttribute('aria-label', 'Show password');
        }
      });
    });
  }

  function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const emailInput = document.getElementById('loginEmailInput');
      const passwordInput = document.getElementById('loginPasswordInput');
      const submitBtn = form.querySelector('button[type="submit"]');
      const feedback = document.getElementById('authFeedbackMessage');

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      let isValid = true;
      if (!validateEmail(email)) {
        showFieldError('loginEmailInput', 'Please enter a valid email address');
        isValid = false;
      } else {
        clearFieldError('loginEmailInput');
      }

      if (!password || password.length < 8) {
        showFieldError('loginPasswordInput', 'Password must be at least 8 characters');
        isValid = false;
      } else {
        clearFieldError('loginPasswordInput');
      }

      if (!isValid) return;

      // Prevent duplicate submissions
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';

      try {
        const res = await window.EnergyApi.auth.login(email, password);
        if (res.success) {
          window.showToast('Login successful! Welcome back.');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 400);
        }
      } catch (err) {
        console.warn('Login failure:', err);
        if (feedback) {
          feedback.className = 'alert alert-danger';
          feedback.innerHTML = `<div><strong>Sign-in failed:</strong> ${err.message || 'Invalid email or password.'}</div>`;
          feedback.style.display = 'block';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
      }
    });
  }

  function setupRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('registerNameInput');
      const emailInput = document.getElementById('registerEmailInput');
      const passwordInput = document.getElementById('registerPasswordInput');
      const confirmInput = document.getElementById('registerConfirmPasswordInput');
      const submitBtn = form.querySelector('button[type="submit"]');
      const feedback = document.getElementById('authFeedbackMessage');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPass = confirmInput.value;

      let isValid = true;

      if (!name) {
        showFieldError('registerNameInput', 'Display name is required');
        isValid = false;
      } else {
        clearFieldError('registerNameInput');
      }

      if (!validateEmail(email)) {
        showFieldError('registerEmailInput', 'Please enter a valid email address');
        isValid = false;
      } else {
        clearFieldError('registerEmailInput');
      }

      if (!password || password.length < 8) {
        showFieldError('registerPasswordInput', 'Password must be at least 8 characters');
        isValid = false;
      } else {
        clearFieldError('registerPasswordInput');
      }

      if (password !== confirmPass) {
        showFieldError('registerConfirmPasswordInput', 'Passwords do not match');
        isValid = false;
      } else {
        clearFieldError('registerConfirmPasswordInput');
      }

      if (!isValid) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account...';

      try {
        const res = await window.EnergyApi.auth.register(email, password, name);
        if (res.success) {
          window.showToast('Account created in MySQL! Welcome to EnergySaver.');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 400);
        }
      } catch (err) {
        console.warn('Registration failure:', err);
        if (feedback) {
          feedback.className = 'alert alert-danger';
          feedback.innerHTML = `<div><strong>Registration failed:</strong> ${err.message || 'Could not create account.'}</div>`;
          feedback.style.display = 'block';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.classList.add('is-invalid');
    const parent = input.closest('.form-group');
    if (parent) {
      let err = parent.querySelector('.form-error');
      if (err) {
        err.textContent = message;
        err.style.display = 'block';
      }
    }
  }

  function clearFieldError(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.classList.remove('is-invalid');
    const parent = input.closest('.form-group');
    if (parent) {
      let err = parent.querySelector('.form-error');
      if (err) err.style.display = 'none';
    }
  }
})();
