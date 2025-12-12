const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

toggleButton.addEventListener('click', () => {
   body.classList.toggle('dark');
   toggleButton.textContent = body.classList.contains('dark') 
      ? '☀️ Switch Theme' 
      : '🌙 Switch Theme';
});

// Smooth scroll for nav links
document.querySelectorAll('nav a').forEach(anchor => {
   anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
         behavior: 'smooth'
      });
   });
});
