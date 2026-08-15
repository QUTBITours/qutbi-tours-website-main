// Shared navigation, lead capture and conversion measurement.
document.addEventListener('DOMContentLoaded', function () {
  const WHATSAPP_NUMBER = '919028939352'; // Confirm with the business owner before publishing.
  const PHONE_NUMBER = '+919028939352';
  const toggle = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'primary-navigation');
    links.id = links.id || 'primary-navigation';
    toggle.addEventListener('click', function () {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('.year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  function trackLead(method, location) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', { method: method, link_location: location || window.location.pathname });
    }
  }

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a');
    if (!link) return;
    if (link.href.indexOf('wa.me/') !== -1) trackLead('whatsapp', link.textContent.trim());
    if (link.href.indexOf('tel:') === 0) trackLead('phone', link.textContent.trim());
  });

  // Give every WhatsApp enquiry useful context so the sales team knows which page generated it.
  document.querySelectorAll('a[href*="wa.me/"]').forEach(function (link) {
    const url = new URL(link.href);
    if (!url.searchParams.get('text')) {
      url.searchParams.set('text', 'Hello Qutbi Tours, I am interested in: ' + document.title + '. Please share details and a quote.');
      link.href = url.toString();
    }
  });

  const form = document.querySelector('[data-whatsapp-enquiry]');
  if (form) {
    const requestedService = new URLSearchParams(window.location.search).get('service');
    const serviceSelect = form.querySelector('[name="service"]');
    if (requestedService && serviceSelect) {
      const matchingOption = Array.from(serviceSelect.options).find(function (option) { return option.text === requestedService; });
      if (matchingOption) serviceSelect.value = matchingOption.value;
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const lines = [
        'Hello Qutbi Tours, I would like a travel quote.', '',
        'Name: ' + data.get('name'), 'Mobile: ' + data.get('mobile'),
        'Service: ' + data.get('service'), 'Destination: ' + (data.get('destination') || 'Not decided'),
        'Travel dates: ' + (data.get('dates') || 'Flexible'), 'Travellers: ' + (data.get('travellers') || 'Not specified'),
        'Budget: ' + (data.get('budget') || 'Not specified'), 'Email: ' + (data.get('email') || 'Not provided'),
        'Notes: ' + (data.get('notes') || 'None')
      ];
      trackLead('enquiry_form', 'contact_form');
      window.location.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    });
  }

  if (!document.querySelector('.mobile-lead-bar')) {
    const bar = document.createElement('aside');
    bar.className = 'mobile-lead-bar';
    bar.setAttribute('aria-label', 'Quick contact');
    bar.innerHTML = '<a class="mobile-call" href="tel:' + PHONE_NUMBER + '">Call now</a>' +
      '<a class="mobile-whatsapp" href="https://wa.me/' + WHATSAPP_NUMBER + '?text=' +
      encodeURIComponent('Hello Qutbi Tours, I would like help planning a trip.') + '">WhatsApp</a>';
    document.body.appendChild(bar);
  }

  const revealables = document.querySelectorAll('.service-card, .dest-card, .why-card, .test-card, .stat, .info-card, .day');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.style.opacity = 1; entry.target.style.transform = 'translateY(0)'; io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealables.forEach(function (el) {
      el.style.opacity = 0; el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease'; io.observe(el);
    });
  }
});
