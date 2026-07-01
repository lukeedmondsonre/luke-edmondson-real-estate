// ============================================
//   LUKE EDMONDSON REAL ESTATE — SCRIPT.JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ============ HERO SLIDER ============
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideTimer;

  function goToSlide(n) {
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function startSlider() {
    if (slides.length < 2) return;
    clearInterval(slideTimer);
    slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5500);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { clearInterval(slideTimer); goToSlide(i); startSlider(); });
  });

  if (slides.length) startSlider();

  // ============ MOBILE MENU ============
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // ============ SCROLL FADE ANIMATIONS ============
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // small, capped stagger based on position within its row
            const idx = Array.prototype.indexOf.call(entry.target.parentNode.children, entry.target);
            const delay = Math.min(idx, 5) * 80;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
      fadeEls.forEach(el => obs.observe(el));

      // Failsafe: reveal everything after 3s in case any element was missed
      setTimeout(() => fadeEls.forEach(el => el.classList.add('visible')), 3000);
    } else {
      // Older browsers: just show everything
      fadeEls.forEach(el => el.classList.add('visible'));
    }
  }

  // ============ COUNTER ANIMATION ============
  function animateCount(el, target, suffix, duration) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { el.textContent = target + suffix; clearInterval(timer); }
      else { el.textContent = Math.floor(start) + suffix; }
    }, 16);
  }

  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCount(el, parseInt(el.dataset.target), el.dataset.suffix || '', 2200);
          cObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObs.observe(c));
  }

  // ============ STICKY CTA BAR ============
  const stickyBar = document.querySelector('.sticky-bar');
  if (stickyBar) {
    window.addEventListener('scroll', () => {
      stickyBar.classList.toggle('show', window.scrollY > 700);
    }, { passive: true });
  }

  // ============ CONTACT FORM (Formspree) ============
  const cForm = document.getElementById('contact-form');
  if (cForm) {
    cForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = cForm.querySelector('button[type="submit"]');
      const origText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      try {
        const res = await fetch(cForm.action, {
          method: 'POST',
          body: new FormData(cForm),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          const succ = document.getElementById('form-success');
          if (succ) succ.style.display = 'block';
          cForm.reset();
          btn.textContent = '✓ Message Sent!';
          setTimeout(() => { btn.textContent = origText; btn.disabled = false; }, 5000);
        } else {
          btn.textContent = origText;
          btn.disabled = false;
          alert('There was a problem. Please call Luke directly at (530) 966-4921.');
        }
      } catch { btn.textContent = origText; btn.disabled = false; }
    });
  }

  // ============ MINI HERO FORM → CONTACT PAGE ============
  const miniForm = document.getElementById('mini-form');
  if (miniForm) {
    miniForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const n = miniForm.querySelector('[name="name"]')?.value || '';
      const p = miniForm.querySelector('[name="phone"]')?.value || '';
      const int = miniForm.querySelector('[name="interest"]')?.value || '';
      window.location.href = `contact.html?name=${encodeURIComponent(n)}&phone=${encodeURIComponent(p)}&interest=${encodeURIComponent(int)}`;
    });
  }

  // ============ PREFILL CONTACT FROM URL PARAMS ============
  const params = new URLSearchParams(window.location.search);
  if (params.get('name') && document.getElementById('contact-form')) {
    const f = document.getElementById('contact-form');
    if (f.querySelector('[name="name"]')) f.querySelector('[name="name"]').value = params.get('name');
    if (f.querySelector('[name="phone"]')) f.querySelector('[name="phone"]').value = params.get('phone') || '';
    const sel = f.querySelector('[name="interest"]');
    if (sel && params.get('interest')) sel.value = params.get('interest');
  }

  // ============ ACTIVE NAV LINK ============
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === page) a.style.color = '#C8102E';
  });

  // ============ SMOOTH SCROLL FOR ANCHOR LINKS ============
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
