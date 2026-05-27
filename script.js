const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');

let width  = canvas.width  = window.innerWidth;
let height = canvas.height = window.innerHeight;

const mouse = { x: width / 2, y: height / 2, active: false };

const PARTICLE_COUNT = Math.min(90, Math.floor((width * height) / 18000));

class Particle {
    constructor() {
        this.reset(true);
    }

    reset(randomY = false) {
        this.x = Math.random() * width;
        this.y = randomY ? Math.random() * height : height + Math.random() * 40;
        this.size = Math.random() * 1.6 + 0.4;
        this.speedY = Math.random() * 0.4 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.5 + 0.15;
        this.hue = Math.random() > 0.7 ? 260 : 230;
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;

        if (mouse.active) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 120;

            if (dist < maxDist && dist > 0) {
                const force = (1 - dist / maxDist) * 1.2;
                this.x += (dx / dist) * force;
                this.y += (dy / dist) * force;
            }
        }

        if (this.y < -10 || this.x < -20 || this.x > width + 20) {
            this.reset(false);
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 75%, ${this.opacity})`;
        ctx.fill();
    }
}

const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
        p.update();
        p.draw();
    });

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(124, 92, 255, ${0.08 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const card = document.querySelector('.card');

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;

    document.body.style.setProperty('--mx', `${e.clientX}px`);
    document.body.style.setProperty('--my', `${e.clientY}px`);

    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;

    const maxAngle = 4;
    const ry = Math.max(-maxAngle, Math.min(maxAngle, dx * 6));
    const rx = Math.max(-maxAngle, Math.min(maxAngle, -dy * 6));

    card.style.setProperty('--ry', `${ry}deg`);
    card.style.setProperty('--rx', `${rx}deg`);
});

document.addEventListener('mouseleave', () => {
    mouse.active = false;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
});

const form     = document.getElementById('loginForm');
const email    = document.getElementById('email');
const password = document.getElementById('password');
const message  = document.getElementById('message');

function animar(elemento, animacao) {
    return new Promise((resolve) => {
        const prefixo = 'animate__';
        const classes = [`${prefixo}animated`, `${prefixo}${animacao}`];

        elemento.classList.add(...classes);

        elemento.addEventListener('animationend', function fim(e) {
            e.stopPropagation();
            elemento.classList.remove(...classes);
            elemento.removeEventListener('animationend', fim);
            resolve();
        });
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailOk = email.value.includes('@') && email.value.length > 4;
    const senhaOk = password.value.length >= 6;

    if (!emailOk || !senhaOk) {
        message.textContent = 'Verifique seus dados e tente novamente.';
        message.className = 'message error';
        await animar(card, 'headShake');
        return;
    }

    message.textContent = 'Tudo certo! Entrando...';
    message.className = 'message success';

    await animar(card, 'fadeOut');

    setTimeout(() => {
        form.reset();
        message.textContent = '';
        message.className = 'message';
        animar(card, 'fadeIn');
    }, 1500);
});

document.querySelectorAll('.field input').forEach((input) => {
    input.addEventListener('focus', () => {
        const label = input.closest('.field').querySelector('label');
        animar(label, 'pulse');
    });
});
