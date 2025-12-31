let currentSlide = 0;
let canvas, ctx;
let fireworks = [];

/* Screen navigation */
function goTo(num) {
  document.querySelectorAll('.screen').forEach(s =>
    s.classList.remove('active')
  );
  document.getElementById(screen${num}).classList.add('active');

  if (num === 3) {
    setTimeout(() => goTo(4), 1500);
  }

  if (num === 4) {
    document.getElementById("music").play().catch(() => {});
    startSlideshow();
    initFireworks();
  }
}

/* Slideshow */
function startSlideshow() {
  const slides = document.querySelectorAll(".slide");
  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 3000);
}

/* 🎆 Fireworks */
function initFireworks() {
  canvas = document.getElementById("fireworks");
  if (!canvas) return;

  ctx = canvas.getContext("2d");
  resize();
  window.addEventListener("resize", resize);
  startFireworks();
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function Firework() {
  this.x = Math.random() * canvas.width;
  this.y = canvas.height;
  this.targetY = Math.random() * canvas.height / 2;
  this.exploded = false;
  this.particles = [];
}

Firework.prototype.update = function () {
  if (!this.exploded) {
    this.y -= 7;
    if (this.y <= this.targetY) {
      this.exploded = true;
      for (let i = 0; i < 30; i++) {
        this.particles.push({
          x: this.x,
          y: this.y,
          vx: Math.cos(i) * Math.random() * 3,
          vy: Math.sin(i) * Math.random() * 3,
          life: 60
        });
      }
    }
  }
};

Firework.prototype.draw = function () {
  if (!this.exploded) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, 2, 2);
  } else {
    this.particles.forEach(p => {
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fillRect(p.x, p.y, 2, 2);
    });
  }
};

function startFireworks() {
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.05) {
      fireworks.push(new Firework());
    }

    fireworks.forEach((f, i) => {
      f.update();
      f.draw();

      if (f.exploded) {
        f.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
        });
        f.particles = f.particles.filter(p => p.life > 0);
        if (f.particles.length === 0) fireworks.splice(i, 1);
      }
    });

    requestAnimationFrame(animate);
  }
  animate();
}