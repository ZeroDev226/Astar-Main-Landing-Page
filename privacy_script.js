// ── Starfield Canvas ──
const canvas = document.getElementById('starfield');
if (canvas) {
    const ctx = canvas.getContext('2d');

    let width, height, stars = [];

    function initCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      stars = [];
      for(let i=0; i<200; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2,
          opacity: 0.3 + Math.random() * 0.7,
          speed: 0.5 + Math.random() * 1.5
        });
      }
    }

    function drawStars() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#fff';

      stars.forEach(s => {
        ctx.globalAlpha = s.opacity;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        s.y += s.speed;
        if(s.y > height) {
          s.y = 0;
          s.x = Math.random() * width;
        }
      });

      requestAnimationFrame(drawStars);
    }

    window.addEventListener('resize', initCanvas);
    initCanvas();
    drawStars();
}

// ── Intersection Observer for Reveals ──
const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});
