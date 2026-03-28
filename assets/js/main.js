/* ============================================================
   main.js — Deepaksakthi V K Portfolio
   Vanilla JS — no jQuery, no heavy deps
   ============================================================ */

(function () {
  'use strict';

  /* ── Utility ────────────────────────────────────────────── */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── DOM Ready ──────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initTyping();
    initScrollReveal();
    initActiveNav();
    initLightbox();
    initContactForm();
    initFooterYear();
    initScrollIndicator();
  });

  /* ── Navigation ─────────────────────────────────────────── */
  function initNav() {
    const nav       = qs('.nav');
    const hamburger = qs('.nav__hamburger');
    const navLinks  = qs('.nav__links');
    const links     = qsa('.nav__link[href^="#"]');

    // Scrolled class
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Hamburger toggle
    hamburger?.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    // Close menu on link click (mobile)
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const target = qs(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        hamburger?.classList.remove('open');
        navLinks?.classList.remove('open');
        hamburger?.setAttribute('aria-expanded', 'false');
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });

    // Hero CTA smooth scroll
    qsa('[data-scroll]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = qs(btn.dataset.scroll);
        if (!target) return;
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ── Active nav link on scroll ──────────────────────────── */
  function initActiveNav() {
    const sections = qsa('section[id]');
    const navLinks = qsa('.nav__link[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinks.forEach(link => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${entry.target.id}`
              );
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(s => observer.observe(s));
  }

  /* ── Typing animation ───────────────────────────────────── */
  function initTyping() {
    const el    = qs('.hero__typing');
    if (!el) return;

    const words = ['Backend Engineer', 'AI/ML Engineer', 'SDE @ SuperOps', 'Problem Solver'];
    let wordIdx = 0;
    let charIdx = 0;
    let deleting = false;

    const type = () => {
      const current = words[wordIdx];
      if (deleting) {
        charIdx--;
        el.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          wordIdx  = (wordIdx + 1) % words.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 50);
      } else {
        charIdx++;
        el.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
        setTimeout(type, 90);
      }
    };

    setTimeout(type, 1000);
  }

  /* ── Scroll-triggered reveal ────────────────────────────── */
  function initScrollReveal() {
    const revealClasses = ['.reveal', '.reveal-left', '.reveal-right'];
    const elements = qsa(revealClasses.join(','));

    if (!elements.length) return;

    // Assign stagger delay from index for elements inside .stagger
    qsa('.stagger').forEach(parent => {
      qsa(':scope > *', parent).forEach((child, i) => {
        child.style.setProperty('--i', i);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));
  }

  /* ── Lightbox ───────────────────────────────────────────── */
  function initLightbox() {
    const lightbox = qs('.lightbox');
    const lbImg    = qs('.lightbox__img');
    const lbClose  = qs('.lightbox__close');

    if (!lightbox) return;

    qsa('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.dataset.src || item.querySelector('img')?.src;
        if (!src) return;
        lbImg.src = src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    const close = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { lbImg.src = ''; }, 300);
    };

    lbClose?.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ── Contact form ───────────────────────────────────────── */
  function initContactForm() {
    const form = qs('.contact-form form');
    const msg  = qs('.form-message');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = form.querySelector('[name="name"]').value.trim();
      const email   = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        showMessage(msg, 'Please fill in all fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showMessage(msg, 'Please enter a valid email address.', 'error');
        return;
      }

      // Simulate sending (frontend only)
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        form.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
        showMessage(
          msg,
          "Thanks for reaching out! I'll get back to you soon.",
          'success'
        );
        setTimeout(() => { msg.style.display = 'none'; }, 5000);
      }, 1200);
    });
  }

  function showMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = `form-message ${type}`;
    el.style.display = 'block';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ── Footer year ────────────────────────────────────────── */
  function initFooterYear() {
    const el = qs('#footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── Scroll indicator ───────────────────────────────────── */
  function initScrollIndicator() {
    const indicator = qs('.hero__scroll');
    if (!indicator) return;
    indicator.addEventListener('click', () => {
      const about = qs('#about');
      if (!about) return;
      const top = about.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

})();

/* ============================================================
   Chatbot — DK Assistant
   Streams responses from http://localhost:8000/chat (SSE)
   ============================================================ */
(function () {
  'use strict';

  const API_URL     = 'https://ai-backend-new.onrender.com/chat';
  const HEALTH_URL  = 'https://ai-backend-new.onrender.com/health';
  const QUICK_CHIPS = ['Skills & Tech', 'Projects', 'Education', 'Resume'];
  const MAX_REQUESTS = 10;
  const SESSION_KEY  = 'dk_chat_count';

  /* ── State ───────────────────────────────────────────────── */
  let isOpen        = false;
  let hasOpened     = false;
  let isStreaming   = false;
  let serverReady   = false;          // true once /health returns ok
  let healthPoller  = null;           // setInterval reference
  const conversationHistory = [];     // {role, content} pairs sent to API

  /* ── Element refs ────────────────────────────────────────── */
  const trigger     = document.getElementById('chatbot-trigger');
  const triggerIcon = document.getElementById('chatbot-trigger-icon');
  const panel       = document.getElementById('chatbot-panel');
  const messages    = document.getElementById('chatbot-messages');
  const input       = document.getElementById('chatbot-input');
  const sendBtn     = document.getElementById('chatbot-send');

  if (!trigger || !panel || !messages || !input || !sendBtn) return;

  /* ── Utilities ───────────────────────────────────────────── */
  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  /** Convert markdown-ish text to safe HTML */
  function renderMarkdown(raw) {
    // Escape HTML first
    let html = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Bullet list items: lines starting with "- "
    html = html.replace(/(^|\n)- /g, '$1• ');
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  function appendUserMessage(text) {
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg chat-msg--user';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    const ts = document.createElement('div');
    ts.className = 'chat-timestamp';
    ts.textContent = getTime();
    msgEl.appendChild(bubble);
    msgEl.appendChild(ts);
    messages.appendChild(msgEl);
    scrollToBottom();
  }

  /** Creates an empty bot bubble and returns the inner bubble element for streaming into */
  function createBotBubble() {
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg chat-msg--bot';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    const ts = document.createElement('div');
    ts.className = 'chat-timestamp';
    ts.textContent = getTime();
    msgEl.appendChild(bubble);
    msgEl.appendChild(ts);
    messages.appendChild(msgEl);
    scrollToBottom();
    return bubble;
  }

  function appendBotMessage(text) {
    const bubble = createBotBubble();
    bubble.innerHTML = renderMarkdown(text);
    scrollToBottom();
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'chat-typing';
    el.id = 'chat-typing-indicator';
    el.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(el);
    scrollToBottom();
  }

  function removeTyping() {
    const el = document.getElementById('chat-typing-indicator');
    if (el) el.remove();
  }

  function setInputDisabled(disabled) {
    input.disabled  = disabled;
    sendBtn.disabled = disabled;
    isStreaming      = disabled;
  }

  /* ── API call with SSE streaming ────────────────────────── */
  async function streamBotResponse(userText) {
    setInputDisabled(true);
    showTyping();

    // Build messages payload including history
    const payload = {
      messages: [...conversationHistory, { role: 'user', content: userText }]
    };

    let bubble     = null;
    let fullText   = '';

    try {
      const res = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE lines are delimited by \n
        const lines = buffer.split('\n');
        // Keep the last (possibly incomplete) line in buffer
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          let data;
          try { data = JSON.parse(jsonStr); } catch { continue; }

          if (data.type === 'delta' && typeof data.content === 'string') {
            // Remove typing indicator on first delta
            if (!bubble) {
              removeTyping();
              bubble = createBotBubble();
            }
            fullText += data.content;
            bubble.innerHTML = renderMarkdown(fullText);
            scrollToBottom();
          } else if (data.type === 'done') {
            break;
          }
        }
      }

      // If nothing came back at all
      if (!bubble) {
        removeTyping();
        appendBotMessage("Sorry, I didn't get a response. Is the server running?");
      }

      // Save to history for multi-turn context
      conversationHistory.push({ role: 'user',      content: userText  });
      conversationHistory.push({ role: 'assistant', content: fullText  });

    } catch (err) {
      removeTyping();
      if (!bubble) {
        appendBotMessage(`⚠️ Couldn't reach the assistant. Make sure the server is running at ${API_URL}.`);
      }
      console.error('[Chatbot]', err);
    }

    setInputDisabled(false);
    input.focus();
  }

  /* ── Request counter (sessionStorage) ───────────────────── */
  function getCount()  { return parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10); }
  function bumpCount() { sessionStorage.setItem(SESSION_KEY, getCount() + 1); }

  function updateLimitUI() {
    const used = getCount();
    const remaining = MAX_REQUESTS - used;
    const counter = document.getElementById('chat-limit-counter');
    if (counter) {
      counter.textContent = `${remaining} / ${MAX_REQUESTS} messages left`;
      counter.classList.toggle('chat-limit-counter--low', remaining <= 3);
    }
    if (remaining <= 0) lockChat();
  }

  function lockChat() {
    setInputDisabled(true);
    const existing = document.getElementById('chat-limit-msg');
    if (existing) return;
    const el = document.createElement('div');
    el.id = 'chat-limit-msg';
    el.className = 'chat-limit-msg';
    el.innerHTML = `<i class="fa-solid fa-lock"></i> You've used all <strong>${MAX_REQUESTS}</strong> messages for this session.<br><span>Hard-reload the page to start fresh.</span>`;
    messages.appendChild(el);
    scrollToBottom();
  }

  /* ── Handle user input ───────────────────────────────────── */
  function handleUserInput(text) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    if (getCount() >= MAX_REQUESTS) { lockChat(); return; }
    input.value = '';
    bumpCount();
    updateLimitUI();
    appendUserMessage(trimmed);
    streamBotResponse(trimmed);
  }

  /* ── Quick reply chips ───────────────────────────────────── */
  function addQuickChips() {
    const row = document.createElement('div');
    row.className = 'chat-quick-replies';
    QUICK_CHIPS.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'chat-quick-chip';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        row.remove();
        if (label === 'Resume') {
          appendUserMessage('Resume');
          appendBotMessage("Here's Deepaksakthi's resume — click below to download! 📄");
          // Inject download link bubble
          const msgEl = document.createElement('div');
          msgEl.className = 'chat-msg chat-msg--bot';
          const a = document.createElement('a');
          a.href = 'assets/docs/john_doe.pdf';
          a.download = 'Deepaksakthi_VK_Resume.pdf';
          a.className = 'chat-resume-link';
          a.innerHTML = '<i class="fa-solid fa-file-arrow-down"></i> Download Resume';
          const ts = document.createElement('div');
          ts.className = 'chat-timestamp';
          ts.textContent = getTime();
          msgEl.appendChild(a);
          msgEl.appendChild(ts);
          messages.appendChild(msgEl);
          scrollToBottom();
        } else {
          handleUserInput(label);
        }
      });
      row.appendChild(btn);
    });
    messages.appendChild(row);
    scrollToBottom();
  }

  /* ── Health check & wake-up flow ────────────────────────── */
  function showWakeUp() {
    // Inject a dedicated wake-up status row (removed once ready)
    const el = document.createElement('div');
    el.id = 'chat-wakeup';
    el.className = 'chat-wakeup';
    el.innerHTML = `
      <div class="chat-wakeup__spinner">
        <span></span><span></span><span></span><span></span>
      </div>
      <p class="chat-wakeup__text">Waking up server<span class="chat-wakeup__dots"></span></p>
      <p class="chat-wakeup__sub">Render cold-starts take ~2 min. Hang tight!</p>
    `;
    messages.appendChild(el);
    scrollToBottom();

    // Animate the trailing dots
    const dots = el.querySelector('.chat-wakeup__dots');
    let d = 0;
    el._dotsTimer = setInterval(() => {
      d = (d + 1) % 4;
      dots.textContent = '.'.repeat(d);
    }, 500);
  }

  function removeWakeUp() {
    const el = document.getElementById('chat-wakeup');
    if (!el) return;
    clearInterval(el._dotsTimer);
    el.remove();
  }

  function startHealthPolling() {
    if (serverReady || healthPoller) return;

    showWakeUp();
    setInputDisabled(true);

    healthPoller = setInterval(async () => {
      try {
        const res = await fetch(HEALTH_URL, { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'ok') {
            clearInterval(healthPoller);
            healthPoller  = null;
            serverReady   = true;

            removeWakeUp();
            setInputDisabled(false);

            appendBotMessage("Hi there! 👋 I'm Deepaksakthi's AI assistant. Ask me anything about his skills, projects, education, or how to reach him.");
            addQuickChips();
            input.focus();
          }
        }
      } catch (_) { /* server still starting, keep polling */ }
    }, 4000);   // poll every 4 s
  }

  /* ── Open / Close ────────────────────────────────────────── */
  function openChat() {
    isOpen = true;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    triggerIcon.className = 'fa-solid fa-xmark';

    updateLimitUI();   // sync counter badge on every open

    if (!hasOpened) {
      hasOpened = true;
      setTimeout(() => {
        if (getCount() >= MAX_REQUESTS) {
          // Already exhausted from a previous session segment
          appendBotMessage("Hi! 👋 It looks like you've used all your messages this session. Hard-reload the page to start fresh.");
          lockChat();
          return;
        }
        if (serverReady) {
          appendBotMessage("Hi there! 👋 I'm Deepaksakthi's AI assistant. Ask me anything about his skills, projects, education, or how to reach him.");
          addQuickChips();
          input.focus();
        } else {
          startHealthPolling();
        }
      }, 200);
    } else {
      setTimeout(() => input.focus(), 350);
    }
  }

  function closeChat() {
    isOpen = false;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    triggerIcon.className = "fa-regular fa-message";
  }

  /* ── Events ──────────────────────────────────────────────── */
  trigger.addEventListener('click', () => isOpen ? closeChat() : openChat());

  sendBtn.addEventListener('click', () => handleUserInput(input.value));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserInput(input.value);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

}());
