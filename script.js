const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

toggleButton.addEventListener('click', () => {
   body.classList.toggle('dark');
   toggleButton.textContent = body.classList.contains('dark')
      ? 'Light Theme'
      : 'Switch Theme';
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
