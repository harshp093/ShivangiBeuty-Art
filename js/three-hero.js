/**
 * Three.js Hero Canvas Animation
 * Shivangi's Beauty Art & Hair
 * Floating petals + sparkle particles — 2D canvas overlay
 */

(function() {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Use basic Canvas2D for maximum performance — no Three.js overhead needed
  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  let animId;

  /* ---- Color palette ---- */
  const COLORS = {
    petal: ['rgba(249,220,220,','rgba(253,246,240,','rgba(242,212,208,','rgba(245,230,200,'],
    spark: ['rgba(201,169,110,','rgba(201,132,122,','rgba(184,134,11,'],
  };

  /* ===== PETAL CLASS ===== */
  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : -60;
      this.size = 10 + Math.random() * 22;
      this.speedY = 0.4 + Math.random() * 0.8;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.025;
      this.opacity  = 0.4 + Math.random() * 0.4;
      this.sway     = Math.random() * Math.PI * 2;
      this.swayAmp  = 0.5 + Math.random() * 1.2;
      this.colorSet = COLORS.petal[Math.floor(Math.random() * COLORS.petal.length)];
    }

    update(t) {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.sway + t * 0.001) * this.swayAmp * 0.05;
      this.rotation += this.rotSpeed;
      if (this.y > H + 60) this.reset();
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      // Ellipse petal shape
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
      const g = ctx.createRadialGradient(0, -this.size * 0.2, 0, 0, 0, this.size);
      g.addColorStop(0, this.colorSet + '1)');
      g.addColorStop(1, this.colorSet + '0)');
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    }
  }

  /* ===== SPARKLE CLASS ===== */
  class Sparkle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 20;
      this.size = 2 + Math.random() * 4;
      this.speedY  = -(0.3 + Math.random() * 0.7);
      this.speedX  = (Math.random() - 0.5) * 0.5;
      this.opacity = 0.5 + Math.random() * 0.5;
      this.life    = 0;
      this.maxLife = 120 + Math.random() * 200;
      this.colorSet = COLORS.spark[Math.floor(Math.random() * COLORS.spark.length)];
      this.twinkle  = Math.random() * Math.PI * 2;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.life++;
      this.twinkle += 0.08;
      if (this.life >= this.maxLife || this.y < -20) this.reset();
    }

    draw() {
      const fade  = Math.sin((this.life / this.maxLife) * Math.PI);
      const twink = 0.6 + Math.sin(this.twinkle) * 0.4;
      ctx.save();
      ctx.globalAlpha = this.opacity * fade * twink;
      ctx.translate(this.x, this.y);

      // 4-pointed star
      ctx.beginPath();
      const s = this.size;
      for (let i = 0; i < 4; i++) {
        const angle  = (i * Math.PI) / 2;
        const innerA = angle + Math.PI / 4;
        if (i === 0) ctx.moveTo(Math.cos(angle) * s, Math.sin(angle) * s);
        else         ctx.lineTo(Math.cos(angle) * s, Math.sin(angle) * s);
        ctx.lineTo(Math.cos(innerA) * s * 0.35, Math.sin(innerA) * s * 0.35);
      }
      ctx.closePath();
      ctx.fillStyle = this.colorSet + (this.opacity * fade) + ')';
      ctx.fill();
      ctx.restore();
    }
  }

  /* ===== FLOATING ORBS ===== */
  class Orb {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 80;
      this.r    = 40 + Math.random() * 80;
      this.speedY = -(0.1 + Math.random() * 0.25);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = 0.03 + Math.random() * 0.06;
      this.colorSet = COLORS.petal[Math.floor(Math.random() * COLORS.petal.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.y < -this.r * 2) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, this.colorSet + '1)');
      g.addColorStop(1, this.colorSet + '0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    }
  }

  /* ===== INIT PARTICLES ===== */
  const NUM_PETALS  = 40;
  const NUM_SPARKS  = 60;
  const NUM_ORBS    = 8;

  const petals  = Array.from({ length: NUM_PETALS  }, () => new Petal());
  const sparks  = Array.from({ length: NUM_SPARKS  }, () => new Sparkle());
  const orbs    = Array.from({ length: NUM_ORBS    }, () => new Orb());

  /* ===== ANIMATION LOOP ===== */
  function animate(t) {
    ctx.clearRect(0, 0, W, H);

    // Orbs (background layer)
    orbs.forEach(o => { o.update(); o.draw(); });

    // Petals
    petals.forEach(p => { p.update(t); p.draw(); });

    // Sparkles (top layer)
    sparks.forEach(s => { s.update(); s.draw(); });

    animId = requestAnimationFrame(animate);
  }

  animate(0);

  /* ===== RESIZE HANDLER ===== */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }, 150);
  });

  /* ===== CLEANUP ON PAGE HIDDEN ===== */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animate(0);
    }
  });

})();
