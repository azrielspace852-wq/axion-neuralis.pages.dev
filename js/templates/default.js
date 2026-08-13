/**
 * AXION Neuralis - Default Template Lifecycle Management
 * Standard Intelligent Mode
 */

(function () {
  const templateName = 'default';

  function initTemplate() {
    console.log(`AXION ENGINE: Initializing "${templateName}" template.`);
    
    // Core structural document title configuration
    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    const isIndo = currentLang === 'id';
    document.title = isIndo 
      ? 'AXION Neuralis - Masa Depan Komputasi' 
      : 'AXION Neuralis - Future of Neural Computing';

    // Form Event Handler
    const contactForm = document.getElementById('contactForm');
    const feedbackEl = document.getElementById('formFeedback');

    if (contactForm && feedbackEl) {
      contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        feedbackEl.style.display = 'none';
        feedbackEl.className = 'form-feedback';

        const name = document.getElementById('formName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const message = document.getElementById('formMessage').value.trim();

        if (!name || !email || !message) {
          feedbackEl.textContent = isIndo 
            ? 'Harap lengkapi semua bidang isian.' 
            : 'Please fill in all fields.';
          feedbackEl.className = 'form-feedback error';
          feedbackEl.style.display = 'block';
          return;
        }

        if (!validateEmail(email)) {
          feedbackEl.textContent = isIndo 
            ? 'Alamat email tidak valid.' 
            : 'Invalid email address.';
          feedbackEl.className = 'form-feedback error';
          feedbackEl.style.display = 'block';
          return;
        }

        // Simulating robust corporate integration pipeline submission
        feedbackEl.textContent = isIndo 
          ? 'Mengirimkan pesan aman...' 
          : 'Sending secure payload...';
        feedbackEl.className = 'form-feedback';
        feedbackEl.style.display = 'block';

        setTimeout(() => {
          feedbackEl.textContent = isIndo 
            ? 'Pesan Anda telah berhasil dikirim dengan aman!' 
            : 'Your message has been sent securely!';
          feedbackEl.className = 'form-feedback success';
          contactForm.reset();
        }, 1500);
      });
    }

    // Dynamic setup listener for standard application language toggle shifts
    window.addEventListener('axion:language-changed', handleLanguageChange);

    // Trigger loaded callback hook
    const event = new CustomEvent('axion:template-loaded', {
      detail: { template: templateName }
    });
    window.dispatchEvent(event);
  }

  function destroyTemplate() {
    console.log(`AXION ENGINE: Tearing down "${templateName}" lifecycle.`);
    window.removeEventListener('axion:language-changed', handleLanguageChange);
  }

  function handleLanguageChange(e) {
    const newLang = e.detail?.lang || 'en';
    const isIndo = newLang === 'id';
    document.title = isIndo 
      ? 'AXION Neuralis - Masa Depan Komputasi' 
      : 'AXION Neuralis - Future of Neural Computing';
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Bind to dynamic standard templates namespace API
  window.AXION_TEMPLATES = window.AXION_TEMPLATES || {};
  window.AXION_TEMPLATES[templateName] = {
    init: initTemplate,
    destroy: destroyTemplate
  };
})();