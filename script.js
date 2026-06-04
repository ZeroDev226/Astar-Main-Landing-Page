// --- Supabase Setup ---
const supabaseUrl = 'https://owuvvjibqikiyxyucdsi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93dXZ2amlicWlraXl4eXVjZHNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTI1NDUsImV4cCI6MjA5Mjk2ODU0NX0.VJ0u7vny8Vrwg6yw2wflZfOJ287oqVAU_ZVImD3isco';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

/* ── Starfield ── */
(function(){
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function initStars(){
    stars = [];
    for(let i=0;i<220;i++){
      stars.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*1.4+0.2,
        a: Math.random()*0.7+0.1,
        speed: Math.random()*0.3+0.05
      });
    }
  }
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(s=>{
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${s.a})`;
      ctx.fill();
      s.y += s.speed;
      if(s.y > canvas.height){ s.y=0; s.x=Math.random()*canvas.width; }
    });
    requestAnimationFrame(draw);
  }
  resize(); initStars(); draw();
  window.addEventListener('resize',()=>{ resize(); initStars(); });
})();

/* ── Starfield Helper for small phone screens ── */
function drawStars(id, w, h, count){
  const c = document.getElementById(id);
  if(!c) return;
  const ctx = c.getContext('2d');
  c.width = w * 2; c.height = h * 2;
  c.style.width = w + 'px'; c.style.height = h + 'px';
  ctx.scale(2,2);
  for(let i=0; i<count; i++){
    ctx.beginPath();
    ctx.arc(Math.random()*w, Math.random()*h, Math.random()*1.1+0.2, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.7+0.3})`;
    ctx.fill();
  }
}

/* ── Initialize phone screens components ── */
window.onload = () => {
  // Screen components removed
};

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
},{ threshold: 0.12 });
revealEls.forEach(el=>observer.observe(el));

/* ── Waitlist with Supabase ── */
async function joinWaitlist(source){
  const emailEl = document.getElementById(source==='hero'?'hero-email':'cta-email');
  const successEl = document.getElementById(source==='hero'?'hero-success':'cta-success');
  const formEl = document.getElementById(source==='hero'?'hero-form':'cta-form');
  const btnEl = formEl.querySelector('button');

  const email = emailEl.value.trim();
  if(!email || !email.includes('@')){
    emailEl.style.borderColor='rgba(239,68,68,0.6)';
    return;
  }

  btnEl.disabled = true;
  btnEl.textContent = 'Joining...';

  try {
    const { error } = await supabaseClient
      .from('waitlist')
      .insert([{ email, source: `landing_page_${source}` }]);

    if (error) throw error;

    formEl.style.display='none';
    successEl.classList.add('show');
  } catch (err) {
    console.error('Waitlist error:', err.message);
    alert('Failed to join. Please try again later.');
    btnEl.disabled = false;
    btnEl.textContent = source === 'hero' ? 'Join Waitlist' : 'Get Early Access';
  }
}
