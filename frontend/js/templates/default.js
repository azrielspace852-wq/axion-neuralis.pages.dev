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
  window.AXION_TEMPLATE_LIFECYCLE = {
    init: initTemplate,
    destroy: destroyTemplate
  };
})();