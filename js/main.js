/**
 * main.js — Core functionality
 * Shivangi's Beauty Art & Hair
 */

'use strict';

/* ============================================================
   1. STICKY NAVBAR
   ============================================================ */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('nav-mobile');
  const mobileClose = document.getElementById('nav-mobile-close');

  if (!navbar) return;

  // Scroll-based class
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileClose && mobileNav) {
    mobileClose.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close on link click
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ============================================================
   2. SCROLL REVEAL ANIMATIONS
   ============================================================ */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => observer.observe(el));
})();

/* ============================================================
   3. COUNTER ANIMATION (stats strip)
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += step;
        if (current >= target) {
          el.textContent = target + suffix;
        } else {
          el.textContent = Math.floor(current) + suffix;
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   4. GALLERY LIGHTBOX
   ============================================================ */
(function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Create lightbox
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.style.cssText = `
    position:fixed;inset:0;z-index:500;
    background:rgba(26,15,10,0.92);backdrop-filter:blur(12px);
    display:none;align-items:center;justify-content:center;
    padding:2rem;cursor:zoom-out;
  `;

  const img = document.createElement('img');
  img.style.cssText = `
    max-width:90vw;max-height:90vh;border-radius:16px;
    box-shadow:0 32px 96px rgba(0,0,0,0.5);
    transform:scale(0.9);transition:transform 0.3s ease;
    pointer-events:none;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    position:absolute;top:1.5rem;right:1.5rem;
    background:rgba(255,255,255,0.15);border:none;
    color:#fff;font-size:2rem;width:50px;height:50px;
    border-radius:50%;cursor:pointer;display:flex;
    align-items:center;justify-content:center;
    transition:background 0.2s;
  `;
  closeBtn.onmouseenter = () => closeBtn.style.background = 'rgba(255,255,255,0.25)';
  closeBtn.onmouseleave = () => closeBtn.style.background = 'rgba(255,255,255,0.15)';

  lb.appendChild(img);
  lb.appendChild(closeBtn);
  document.body.appendChild(lb);

  const open = (src) => {
    img.src = src;
    lb.style.display = 'flex';
    requestAnimationFrame(() => {
      img.style.transform = 'scale(1)';
    });
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    img.style.transform = 'scale(0.9)';
    setTimeout(() => {
      lb.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  };

  items.forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const imgEl = item.querySelector('img');
      if (imgEl) open(imgEl.src);
    });
  });

  lb.addEventListener('click', close);
  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); close(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.style.display === 'flex') close();
  });
})();

/* ============================================================
   5. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   6. REVIEW CAROUSEL (Testimonials on Home page)
   ============================================================ */
(function initReviewCarousel() {
  const track = document.getElementById('review-track');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.review-card'));
  const prevBtn = document.getElementById('review-prev');
  const nextBtn = document.getElementById('review-next');
  if (!cards.length) return;

  let current = 0;
  let perView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  let autoPlay;

  const getPerView = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

  const goto = (idx) => {
    const max = cards.length - perView;
    current = Math.max(0, Math.min(idx, max));
    const pct = (100 / perView) * current;
    track.style.transform = `translateX(-${pct}%)`;
  };

  const next = () => goto(current + 1);
  const prev = () => goto(current - 1);

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  // Auto play
  const startAuto = () => {
    autoPlay = setInterval(() => {
      if (current >= cards.length - perView) { goto(0); }
      else next();
    }, 4000);
  };

  const stopAuto = () => clearInterval(autoPlay);

  startAuto();
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  // Touch support
  let touchStart = 0;
  track.addEventListener('touchstart', (e) => { touchStart = e.touches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const delta = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) { delta > 0 ? next() : prev(); }
    startAuto();
  });

  window.addEventListener('resize', () => {
    perView = getPerView();
    goto(0);
  });

  // Style track
  track.style.cssText = `
    display:flex;transition:transform 0.5s cubic-bezier(0.4,0,0.2,1);
    will-change:transform;
  `;
  cards.forEach(c => {
    c.style.cssText = `
      min-width:calc(${100 / perView}% - ${(perView - 1) * 1.5 / perView}rem);
      margin-right:1.5rem;flex-shrink:0;
    `;
  });
})();

/* ============================================================
   7. PARALLAX HERO (subtle)
   ============================================================ */
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.4}px)`;
  }, { passive: true });
})();

/* ============================================================
   8. BACK TO TOP
   ============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.style.opacity = window.scrollY > 400 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   9. SKILL BAR ANIMATION
   ============================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const w = bar.getAttribute('data-width') || '100%';
      bar.style.width = w;
      observer.unobserve(bar);
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
})();

/* ============================================================
   10. LAZY IMAGE LOADING (with fade-in)
   ============================================================ */
(function initLazyImages() {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  imgs.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    img.addEventListener('load', () => { img.style.opacity = '1'; });
    if (img.complete) img.style.opacity = '1';
  });
})();
