// ── Starfield Canvas ──
const canvas = document.getElementById('starfield');
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

// ── Waitlist Logic (Supabase) ──
const supabaseUrl = 'https://owuvvjibqikiyxyucdsi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93dXZ2amlicWlraXl4eXVjZHNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTI1NDUsImV4cCI6MjA5Mjk2ODU0NX0.VJ0u7vny8Vrwg6yw2wflZfOJ287oqVAU_ZVImD3isco';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function joinWaitlist(type) {
  const emailInput = document.getElementById(type + '-email');
  const form = document.getElementById(type + '-form');
  const success = document.getElementById(type + '-success');
  const email = emailInput.value.trim();

  if (email.includes('@')) {
    try {
      const { error } = await _supabase
        .from('waitlist')
        .insert([{ email: email, source: type }]);qa    4

      if (error) throw error;217      form.style.display = 'none';
      success.style.display = 'block';
    } catch (err) {
      console.error('Waitlist Error:', err);
      alert('Something went wrong. Please try again later.');
    }
  } else {
    alert('Please enter a valid email address.');
  }
}
