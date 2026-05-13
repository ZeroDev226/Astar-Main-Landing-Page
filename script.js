// Sticky Header Effect
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('reveal-on-scroll');
    observer.observe(section);
});

// Form handling
const waitlistForm = document.querySelector('.waitlist-form');
if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = waitlistForm.querySelector('input').value;
        alert(`Success! ${email} has been added to the waitlist.`);
        waitlistForm.reset();
    });
}

const canvas = document.getElementById('constellationCanvas');
const ctx = canvas.getContext('2d');

let stars = [];
let shootingStar = null;
let constellations = [];
let activeConstellationIndex = 0;
const starCount = 200;

function getRandomStarIndices() {
    const count = 4 + Math.floor(Math.random() * 3); // 4 to 6 points
    const indices = [];
    for (let i = 0; i < count; i++) {
        indices.push(Math.floor(Math.random() * stars.length));
    }
    return indices;
}

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];

    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 0.4 + Math.random() * 1.6,
            opacity: 0.3 + Math.random() * 0.5, // Increased base opacity
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2,
            twinkleOffset: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.02 + Math.random() * 0.05
        });
    }

    constellations = [];
    for (let i = 0; i < 5; i++) {
        constellations.push({
            starIndices: getRandomStarIndices(),
            phase: 'waiting',
            progress: 0,
            opacity: 0,
            frame: 0
        });
    }

    if (constellations.length > 0) {
        activeConstellationIndex = Math.floor(Math.random() * constellations.length);
        constellations[activeConstellationIndex].phase = 'drawing';
    }
}

function spawnShootingStar() {
    const fromLeft = Math.random() > 0.5;
    const x = fromLeft ? 0 : Math.random() * canvas.width;
    const y = fromLeft ? Math.random() * (canvas.height * 0.5) : 0;
    const angle = Math.PI / 4 + (Math.random() * 0.2);

    shootingStar = {
        x,
        y,
        len: Math.random() * 80 + 50,
        speed: Math.random() * 10 + 5,
        angle,
        opacity: 1.0
    };
}

function update() {
    stars.forEach(star => {
        // Add subtle random drift to movement
        star.speedX += (Math.random() - 0.5) * 0.005;
        star.speedY += (Math.random() - 0.5) * 0.005;

        const maxSpeed = 0.35;
        star.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, star.speedX));
        star.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, star.speedY));

        star.x += star.speedX;
        star.y += star.speedY;
        star.twinkleOffset += star.twinkleSpeed;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
    });

    if (!shootingStar && Math.random() < 0.008) {
        spawnShootingStar();
    }

    if (shootingStar) {
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.015;
        if (shootingStar.opacity <= 0 || shootingStar.x > canvas.width || shootingStar.y > canvas.height) {
            shootingStar = null;
        }
    }

    const active = constellations[activeConstellationIndex];
    if (active && active.phase !== 'waiting') {
        active.frame++;
        if (active.phase === 'drawing') {
            active.progress = Math.min(active.frame / 180, 1);
            active.opacity = 1;
            if (active.frame >= 180) {
                active.phase = 'holding';
                active.frame = 0;
            }
        } else if (active.phase === 'holding') {
            if (active.frame >= 150) {
                active.phase = 'fading';
                active.frame = 0;
            }
        } else if (active.phase === 'fading') {
            active.opacity = 1 - Math.min(active.frame / 100, 1);
            if (active.frame >= 100) {
                active.phase = 'waiting';
                active.progress = 0;
                active.frame = 0;

                active.starIndices = getRandomStarIndices();
                activeConstellationIndex = Math.floor(Math.random() * constellations.length);

                setTimeout(() => {
                    if (constellations[activeConstellationIndex]) {
                        constellations[activeConstellationIndex].phase = 'drawing';
                    }
                }, 1500);
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Stars
    stars.forEach(star => {
        const currentOpacity = (star.opacity + Math.sin(star.twinkleOffset) * 0.25);
        const finalOpacity = Math.max(0.05, Math.min(1.0, currentOpacity));
        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // 2. Draw Shooting Star
    if (shootingStar) {
        const s = shootingStar;
        const endX = s.x - Math.cos(s.angle) * s.len;
        const endY = s.y - Math.sin(s.angle) * s.len;

        const grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // 3. Draw Constellations
    constellations.forEach(con => {
        if (con.phase === 'waiting') return;

        const points = con.starIndices.map(idx => stars[idx]);
        const totalSegments = points.length - 1;
        const totalProgress = con.progress * totalSegments;

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * con.opacity})`;
        ctx.lineWidth = 1.0;
        ctx.lineCap = 'round';

        for (let i = 0; i < totalSegments; i++) {
            const segProgress = Math.min(Math.max(totalProgress - i, 0), 1);
            if (segProgress <= 0) continue;

            const start = points[i];
            const end = points[i+1];
            const currentEndX = start.x + (end.x - start.x) * segProgress;
            const currentEndY = start.y + (end.y - start.y) * segProgress;

            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(currentEndX, currentEndY);
            ctx.stroke();

            ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * con.opacity})`;
            ctx.beginPath();
            ctx.arc(start.x, start.y, 2.0, 0, Math.PI * 2);
            ctx.fill();

            if (segProgress >= 1) {
                ctx.beginPath();
                ctx.arc(end.x, end.y, 2.0, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

window.addEventListener('resize', init);
init();
loop();
