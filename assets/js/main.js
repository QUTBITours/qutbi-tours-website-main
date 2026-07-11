// Qutbi Tours & Holidays — shared JS
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // Set current year in footer
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

  // Smooth reveal on scroll
  const revealables = document.querySelectorAll('.service-card, .dest-card, .why-card, .test-card, .stat, .info-card, .day');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = 1;
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    }, { threshold: .12 });
    revealables.forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      io.observe(el);
    });
  }
});
