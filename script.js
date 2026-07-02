const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
const navLinks = Array.from(document.querySelectorAll('nav a'));
const panels = Array.from(document.querySelectorAll('.tab-panel'));
const toast = document.createElement('div');

toast.className = 'copy-toast';
toast.setAttribute('role', 'status');
toast.setAttribute('aria-live', 'polite');
document.body.appendChild(toast);

const savedTheme = readSavedTheme();

if (savedTheme === 'dark') {
   body.classList.add('dark');
}

updateThemeButton();
setupTabs();
setupThemeToggle();
setupCopyButtons();
setupProjectCards();

function setupTabs() {
   navLinks.forEach(link => {
      link.setAttribute('role', 'tab');
      link.setAttribute('aria-controls', link.hash.slice(1));
      link.setAttribute('aria-selected', 'false');

      link.addEventListener('click', event => {
         event.preventDefault();
         activatePanel(link.hash, true);
      });
   });

   panels.forEach(panel => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('tabindex', '0');
   });

   document.querySelectorAll('.button-link[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
         event.preventDefault();
         activatePanel(link.hash, true);
      });
   });

   window.addEventListener('hashchange', () => {
      activatePanel(window.location.hash || '#home', false);
   });

   activatePanel(window.location.hash || '#home', false);
}

function activatePanel(hash, updateHash) {
   const panelId = hash.replace('#', '');
   const targetPanel = panels.find(panel => panel.id === panelId) || document.getElementById('home');

   panels.forEach(panel => {
      const isActive = panel === targetPanel;

      panel.hidden = !isActive;
      panel.classList.toggle('active-panel', isActive);
      panel.setAttribute('aria-hidden', String(!isActive));
   });

   navLinks.forEach(link => {
      const isActive = link.hash === `#${targetPanel.id}`;

      link.classList.toggle('active', isActive);
      link.setAttribute('aria-selected', String(isActive));
   });

   if (updateHash) {
      history.pushState(null, '', `#${targetPanel.id}`);
   }

   if (targetPanel.id === 'snapshot') {
      setupCounters();
   }

   window.scrollTo({
      top: 0,
      behavior: 'smooth'
   });
}

function setupThemeToggle() {
   toggleButton.addEventListener('click', () => {
      body.classList.toggle('dark');
      saveTheme(body.classList.contains('dark') ? 'dark' : 'light');
      updateThemeButton();
   });
}

function updateThemeButton() {
   toggleButton.textContent = body.classList.contains('dark') ? 'Light Theme' : 'Switch Theme';
}

function readSavedTheme() {
   try {
      return localStorage.getItem('portfolio-theme');
   } catch (error) {
      return null;
   }
}

function saveTheme(theme) {
   try {
      localStorage.setItem('portfolio-theme', theme);
   } catch (error) {
      return;
   }
}

function setupCopyButtons() {
   document.querySelectorAll('[data-copy-email]').forEach(button => {
      button.addEventListener('click', () => {
         copyText(button.dataset.copyEmail);
      });
   });
}

function setupProjectCards() {
   document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', event => {
         const rect = card.getBoundingClientRect();
         const x = event.clientX - rect.left;
         const y = event.clientY - rect.top;
         const rotateX = ((y / rect.height) - 0.5) * -8;
         const rotateY = ((x / rect.width) - 0.5) * 8;

         card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
         card.style.transform = '';
      });

      card.addEventListener('click', event => {
         const link = card.querySelector('a');

         if (!link || event.target.closest('a')) {
            return;
         }

         link.click();
      });
   });
}

function setupCounters() {
   document.querySelectorAll('[data-count]').forEach(counter => {
      if (counter.dataset.counted === 'true') {
         return;
      }

      counter.dataset.counted = 'true';
      animateCounter(counter);
   });
}

function animateCounter(counter) {
   const target = Number(counter.dataset.count);
   const duration = 900;
   const start = performance.now();

   function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      counter.textContent = Math.round(target * eased);

      if (progress < 1) {
         requestAnimationFrame(tick);
      }
   }

   requestAnimationFrame(tick);
}

async function copyText(text) {
   try {
      if (navigator.clipboard) {
         await navigator.clipboard.writeText(text);
      } else {
         fallbackCopy(text);
      }

      showToast('Email copied');
   } catch (error) {
      fallbackCopy(text);
      showToast('Email copied');
   }
}

function fallbackCopy(text) {
   const input = document.createElement('textarea');

   input.value = text;
   input.setAttribute('readonly', '');
   input.style.position = 'fixed';
   input.style.opacity = '0';
   document.body.appendChild(input);
   input.select();
   document.execCommand('copy');
   document.body.removeChild(input);
}

function showToast(message) {
   toast.textContent = message;
   toast.classList.add('visible');

   window.clearTimeout(showToast.timeoutId);
   showToast.timeoutId = window.setTimeout(() => {
      toast.classList.remove('visible');
   }, 1800);
}
