/* ==========================================================
   framesbyestelle — main.js
   ========================================================== */

(function () {
  'use strict';

  /* ── NAVBAR ─────────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const tick = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  /* ── HAMBURGER ──────────────────────────────────────── */
  const toggle  = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.nav-overlay');
  if (toggle && overlay) {
    const closeMenu = () => {
      toggle.classList.remove('open');
      overlay.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      overlay.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && toggle.classList.contains('open')) closeMenu();
    });
  }

  /* ── ACTIVE NAV LINK ────────────────────────────────── */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href').split('/').pop() === currentFile) {
      link.classList.add('active');
    }
  });

  /* ── PORTFOLIO FILTER ───────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.event-card');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        cards.forEach(card => {
          card.classList.toggle('hidden', cat !== 'all' && card.dataset.category !== cat);
        });
      });
    });
  }

  /* ── LIGHTBOX ───────────────────────────────────────── */
  let lbImages = [];
  let lbIndex  = 0;

  // Build lightbox DOM once
  const lb = document.createElement('div');
  lb.className   = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image lightbox');
  lb.innerHTML = `
    <div class="lightbox-img-wrap">
      <img class="lightbox-img" src="" alt="" draggable="false">
    </div>
    <button class="lb-btn lb-close" aria-label="Close">&times;</button>
    <button class="lb-btn lb-prev"  aria-label="Previous image">&#8592;</button>
    <button class="lb-btn lb-next"  aria-label="Next image">&#8594;</button>
    <div class="lb-counter" aria-live="polite"></div>
  `;
  document.body.appendChild(lb);

  const lbImg     = lb.querySelector('.lightbox-img');
  const lbCounter = lb.querySelector('.lb-counter');

  function lbShow(index) {
    lbIndex = ((index % lbImages.length) + lbImages.length) % lbImages.length;
    lbImg.classList.add('fading');
    const src = lbImages[lbIndex].src;
    const alt = lbImages[lbIndex].alt;
    const tmp = new window.Image();
    tmp.onload = () => {
      lbImg.src = src;
      lbImg.alt = alt;
      lbImg.classList.remove('fading');
    };
    tmp.onerror = () => { lbImg.src = src; lbImg.classList.remove('fading'); };
    tmp.src = src;
    lbCounter.textContent = `${lbIndex + 1} / ${lbImages.length}`;
  }

  function lbOpen(index) {
    lbImages = Array.from(document.querySelectorAll('.gallery-item img'));
    if (!lbImages.length) return;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbShow(index);
    lb.querySelector('.lb-close').focus();
  }

  function lbClose() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  lb.querySelector('.lb-close').addEventListener('click', lbClose);
  lb.querySelector('.lb-prev').addEventListener('click', () => lbShow(lbIndex - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => lbShow(lbIndex + 1));

  lb.addEventListener('click', e => {
    if (e.target === lb || e.target === lb.querySelector('.lightbox-img-wrap')) lbClose();
  });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      lbClose();
    if (e.key === 'ArrowLeft')   lbShow(lbIndex - 1);
    if (e.key === 'ArrowRight')  lbShow(lbIndex + 1);
  });

  // Touch/swipe
  let touchX = 0;
  lb.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; }, { passive: true });
  lb.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].screenX - touchX;
    if (Math.abs(dx) > 48) lbShow(dx < 0 ? lbIndex + 1 : lbIndex - 1);
  }, { passive: true });

  /* ── EVENT PAGE: PREVIOUS / NEXT EVENT ──────────────── */
  // Reads the card order from portfolio.html, so a new event card there is
  // picked up automatically. Wraps around at both ends.
  if (typeof EVENT_SLUG !== 'undefined' && document.getElementById('gallery')) {
    const portfolioUrl = new URL('../portfolio.html', window.location.href);

    const el = (tag, cls, text) => {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text) n.textContent = text;
      return n;
    };

    const placeNav = nav => {
      const section = document.querySelector('.gallery-section');
      (section ? section.parentNode : document.querySelector('main')).insertBefore(
        nav, section ? section.nextSibling : null
      );
    };

    const eventLink = (ev, dir) => {
      const a = el('a', `event-nav-link event-nav-${dir}`);
      a.href = ev.href;
      a.setAttribute('aria-label', `${dir === 'next' ? 'Next' : 'Previous'} event: ${ev.name}, ${ev.year}`);

      const thumb = el('span', 'event-nav-thumb');
      if (ev.cover) {
        const img = el('img');
        img.src = ev.cover;
        img.alt = '';
        img.loading = 'lazy';
        img.addEventListener('error', () => thumb.classList.add('no-cover'), { once: true });
        thumb.appendChild(img);
      } else {
        thumb.classList.add('no-cover');
      }

      const text = el('span', 'event-nav-text');
      const label = el('span', 'event-nav-label');
      const arrow = el('span', 'event-nav-arrow', dir === 'next' ? '→' : '←');
      arrow.setAttribute('aria-hidden', 'true');
      if (dir === 'next') { label.append('Next event ', arrow); }
      else                { label.append(arrow, ' Previous event'); }
      text.append(label, el('span', 'event-nav-name', ev.name), el('span', 'event-nav-year', ev.year));

      a.append(thumb, text);
      return a;
    };

    const backOnly = () => {
      const nav = el('nav', 'event-nav');
      nav.setAttribute('aria-label', 'More events');
      const wrap = el('div', 'container');
      const all = el('a', 'event-nav-all', 'Back to all events');
      all.href = portfolioUrl.href;
      wrap.appendChild(all);
      nav.appendChild(wrap);
      placeNav(nav);
    };

    fetch(portfolioUrl.href)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const events = Array.from(doc.querySelectorAll('.event-card')).map(card => {
          const href = card.getAttribute('href');
          const img = card.querySelector('.card-img-wrap img');
          return {
            slug: href.split('/').pop().replace(/\.html$/, ''),
            href: new URL(href, portfolioUrl).href,
            name: (card.querySelector('.card-name') || {}).textContent || '',
            year: (card.querySelector('.card-year') || {}).textContent || '',
            cover: img ? new URL(img.getAttribute('src'), portfolioUrl).href : ''
          };
        });

        const here = window.location.pathname.split('/').pop().replace(/\.html$/, '') || EVENT_SLUG;
        let i = events.findIndex(e => e.slug === here);
        if (i < 0) i = events.findIndex(e => e.slug === EVENT_SLUG);
        if (i < 0 || events.length < 2) return backOnly();

        const prev = events[(i - 1 + events.length) % events.length];
        const next = events[(i + 1) % events.length];

        const nav = el('nav', 'event-nav');
        nav.setAttribute('aria-label', 'More events');
        const wrap = el('div', 'container');
        const grid = el('div', 'event-nav-grid');
        grid.append(eventLink(prev, 'prev'), eventLink(next, 'next'));
        const all = el('a', 'event-nav-all', 'View all events');
        all.href = portfolioUrl.href;
        wrap.append(grid, all);
        nav.appendChild(wrap);
        placeNav(nav);
      })
      .catch(backOnly);
  }

  /* ── EVENT GALLERY BUILDER ──────────────────────────── */
  // Event pages define: const EVENT_IMAGES = [...]; const EVENT_SLUG = '...';
  if (typeof EVENT_IMAGES !== 'undefined' && typeof EVENT_SLUG !== 'undefined') {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    if (!EVENT_IMAGES.length) {
      gallery.innerHTML = `
        <div class="gallery-empty">
          <p class="gallery-empty-text">Photos coming soon</p>
          <p class="gallery-empty-hint">Drop images into images/${EVENT_SLUG}/ and update EVENT_IMAGES</p>
        </div>`;
      return;
    }

    const base = `../images/${EVENT_SLUG}/`;
    const friendlyName = EVENT_SLUG.replace(/-/g, ' ');

    gallery.innerHTML = EVENT_IMAGES.map((file, i) => `
      <div class="gallery-item"
           data-index="${i}"
           role="button"
           tabindex="0"
           aria-label="Open photo ${i + 1} of ${EVENT_IMAGES.length}">
        <img
          src="${base}${file}"
          alt="Photo ${i + 1} — ${friendlyName}"
          loading="lazy"
          decoding="async"
          width="900"
          height="600">
        <div class="gallery-item-overlay" aria-hidden="true">
          <div class="gallery-expand">+</div>
        </div>
      </div>`).join('');

    gallery.querySelectorAll('.gallery-item').forEach(item => {
      const open = () => lbOpen(+item.dataset.index);
      item.addEventListener('click', open);
      item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });

      const img = item.querySelector('img');
      if (img.complete && img.naturalWidth) {
        item.classList.add('img-loaded');
      } else {
        img.addEventListener('load',  () => item.classList.add('img-loaded'), { once: true });
        img.addEventListener('error', () => item.classList.add('img-loaded'), { once: true });
      }
    });
  }

  /* ── CONTACT FORM (local file:// fallback) ──────────── */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm && window.location.protocol === 'file:') {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      window.location.href = 'thankyou.html';
    });
  }

  /* ── FEATURED CARD FALLBACK ─────────────────────────── */
  document.querySelectorAll('.featured-card-img').forEach(img => {
    img.addEventListener('error', () => img.closest('.featured-card').classList.add('img-missing'), { once: true });
  });

  /* ── COVER IMG FALLBACK (portfolio cards) ───────────── */
  document.querySelectorAll('.card-img-wrap img').forEach(img => {
    img.addEventListener('error', () => img.closest('.card-img-wrap').classList.add('no-cover'), { once: true });
  });

})();
