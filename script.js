const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
const navLinks = Array.from(document.querySelectorAll('nav a'));
const sections = Array.from(document.querySelectorAll('main section, footer'));
const toast = document.createElement('div');
const backToTop = document.createElement('button');

toast.className = 'copy-toast';
toast.setAttribute('role', 'status');
toast.setAttribute('aria-live', 'polite');
document.body.appendChild(toast);

backToTop.className = 'back-to-top';
backToTop.type = 'button';
backToTop.textContent = 'Top';
document.body.appendChild(backToTop);

const savedTheme = readSavedTheme();

if (savedTheme === 'dark') {
   body.classList.add('dark');
}

updateThemeButton();

toggleButton.addEventListener('click', () => {
   body.classList.toggle('dark');
   saveTheme(body.classList.contains('dark') ? 'dark' : 'light');
   updateThemeButton();
});

document.querySelectorAll('nav a, .button-link[href^="#"]').forEach(anchor => {
   anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));

      if (!target) {
         return;
      }

      e.preventDefault();
      target.scrollIntoView({
         behavior: 'smooth'
      });
   });
});

document.querySelectorAll('[data-copy-email]').forEach(button => {
   button.addEventListener('click', () => {
      copyText(button.dataset.copyEmail);
   });
});

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

backToTop.addEventListener('click', () => {
   window.scrollTo({
      top: 0,
      behavior: 'smooth'
   });
});

window.addEventListener('scroll', () => {
   backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

setupActiveNavigation();
setupRevealAnimation();
setupCounters();

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

function setupActiveNavigation() {
   const sectionById = new Map(sections.map(section => [section.id, section]));

   const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
         if (!entry.isIntersecting) {
            return;
         }

         navLinks.forEach(link => {
            const id = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', sectionById.get(id) === entry.target);
         });
      });
   }, {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
   });

   sections.forEach(section => observer.observe(section));
}

function setupRevealAnimation() {
   const revealItems = document.querySelectorAll('main section, .project-card, section li, .stat-card');

   if (!('IntersectionObserver' in window)) {
      revealItems.forEach(item => item.classList.add('visible'));
      return;
   }

   revealItems.forEach(item => item.classList.add('reveal'));

   const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
         if (!entry.isIntersecting) {
            return;
         }

         entry.target.classList.add('visible');
         observer.unobserve(entry.target);
      });
   }, {
      threshold: 0.16
   });

   revealItems.forEach(item => observer.observe(item));
}

function setupCounters() {
   const counters = document.querySelectorAll('[data-count]');

   if (!('IntersectionObserver' in window)) {
      counters.forEach(counter => {
         counter.textContent = counter.dataset.count;
      });
      return;
   }

   const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
         if (!entry.isIntersecting) {
            return;
         }

         animateCounter(entry.target);
         observer.unobserve(entry.target);
      });
   }, {
      threshold: 0.65
   });

   counters.forEach(counter => observer.observe(counter));
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
