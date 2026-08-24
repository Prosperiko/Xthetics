/* ============================================
   MAGNIFICO — Interactive Layer
   Pure Vanilla JS, no dependencies
   ============================================ */

(function() {
  'use strict';

  // ==========================================
  // CUSTOM CURSOR
  // ==========================================
  const cursor = document.getElementById('cursor');
  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
  let isTouch = window.matchMedia('(hover: none)').matches;

  if (!isTouch && cursor) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX - 6 + 'px';
      cursor.style.top = cursorY - 6 + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects for cursor
    const hoverElements = document.querySelectorAll('a, button, .collection-card, .lookbook-item, .featured-btn');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  // ==========================================
  // SCROLL REVEAL (IntersectionObserver)
  // ==========================================
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1, 
      rootMargin: '0px 0px -50px 0px' 
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    reveals.forEach(el => el.classList.add('active'));
  }

  // ==========================================
  // SMOOTH SCROLL NAVIGATION
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        const navToggle = document.getElementById('navToggle');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          navToggle.classList.remove('active');
          document.body.style.overflow = ''; // <-- FIX: re-enable scrolling
        }
      }
    });
  });

  // ==========================================
  // PARALLAX HERO SHAPES
  // ==========================================
  const shapes = document.querySelectorAll('.shape');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        shapes.forEach((shape, i) => {
          const speed = 3 + (i * 0.05);
          shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // ==========================================
  // MOBILE MENU TOGGLE
  // ==========================================
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // ==========================================
  // NEWSLETTER FORM
  // ==========================================
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterSuccess = document.getElementById('newsletterSuccess');
  const emailInput = document.getElementById('emailInput');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value;

      // Simulate API call
      console.log('Newsletter signup:', email);

      // Show success
      newsletterForm.style.opacity = '0.3';
      newsletterForm.style.pointerEvents = 'none';
      newsletterSuccess.classList.add('show');

      // Reset after 3 seconds
      setTimeout(() => {
        newsletterForm.style.opacity = '1';
        newsletterForm.style.pointerEvents = 'all';
        newsletterSuccess.classList.remove('show');
        emailInput.value = '';
      }, 3000);
    });
  }

  // ==========================================
  // ADD TO CART (Hook for your Python backend)
  // ==========================================
  window.addToCart = function(productName, price) {
    // This is where you'd call your Python API
    console.log('Adding to cart:', { product: productName, price: price });

    // Example fetch for your backend:
    // fetch('/api/cart/add', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ product: productName, price: price })
    // })
    // .then(res => res.json())
    // .then(data => console.log(data));

    // Visual feedback
    const btn = event.target.closest('.featured-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Loved ✓';
    btn.style.background = 'var(--accent)';

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 1500);
  };

  // ==========================================
  // NAV BACKGROUND ON SCROLL
  // ==========================================
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll >= 0) {
      nav.style.background = 'rgba(10, 10, 10, 0.9)';
      nav.style.backdropFilter = 'blur(10px)';
    } else {
      nav.style.background = 'transparent';
      nav.style.backdropFilter = 'none';
    }

    lastScroll = currentScroll;
  });

  // ==========================================
  // MARQUEE SPEED ADJUSTMENT ON SCROLL
  // ==========================================
  const marqueeTrack = document.querySelector('.marquee-track');
  let scrollSpeed = 30;

  window.addEventListener('scroll', () => {
    const scrollVelocity = Math.abs(window.scrollY - lastScroll);
    if (scrollVelocity > 5) {
      marqueeTrack.style.animationDuration = '15s';
    } else {
      marqueeTrack.style.animationDuration = '30s';
    }
  });

  // ==========================================
  // PREFERS REDUCED MOTION
  // ==========================================
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.shape').forEach(s => s.style.animation = 'none');
    document.querySelectorAll('.marquee-track').forEach(m => m.style.animation = 'none');
    document.querySelectorAll('.scroll-line').forEach(s => s.style.animation = 'none');
  }

})();