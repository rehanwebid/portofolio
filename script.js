/* ============================================ */
/* SPLASH SCREEN - PARTICLE GENERATOR */
/* ============================================ */
(function initSplash() {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Hide splash screen after animation completes
    window.addEventListener('load', () => {
        setTimeout(() => {
            const splash = document.getElementById('splashScreen');
            if (splash) {
                splash.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        }, 2800);
    });
})();

/* ============================================ */
/* SECURITY LAYER - ANTI DEVTOOLS & INSPECT */
/* ============================================ */
document.addEventListener('keydown', function(e) {
    // Blokir F12, Ctrl+Shift+I/J, Ctrl+U, Ctrl+S, Ctrl+Shift+C
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || 
        (e.ctrlKey && e.key === 'U') || 
        (e.ctrlKey && e.key === 'S') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C')) {
        e.preventDefault();
        return false;
    }
});

// Blokir klik kanan
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Blokir drag gambar
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
});

// Deteksi DevTools terbuka
(function() {
    const devtools = { open: false };
    const threshold = 160;
    const checkDevTools = setInterval(function() {
        if (window.outerWidth - window.innerWidth > threshold || 
            window.outerHeight - window.innerHeight > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#010508;color:#a0d8ef;font-family:Poppins,sans-serif;font-size:20px;">Akses developer tools terdeteksi. Halaman ditutup demi keamanan.</div>';
                clearInterval(checkDevTools);
            }
        }
    }, 1000);
})();

// Proteksi iframe
(function() {
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
})();

/* ============================================ */
/* CUSTOM CURSOR (Desktop Only) */
/* ============================================ */
const isMobile = window.innerWidth <= 768;
if (!isMobile) {
    const cur = document.getElementById('cursor');
    const curDot = document.getElementById('cursorDot');
    const curGlow = document.getElementById('cursorGlow');
    
    document.addEventListener('mousemove', e => {
        cur.style.left = e.clientX + 'px';
        cur.style.top = e.clientY + 'px';
        curDot.style.left = e.clientX + 'px';
        curDot.style.top = e.clientY + 'px';
        curGlow.style.left = e.clientX + 'px';
        curGlow.style.top = e.clientY + 'px';
    });
} else {
    // Sembunyikan cursor custom di mobile
    const cursorEls = document.querySelectorAll('.cursor, .cursor-dot, .cursor-glow');
    cursorEls.forEach(el => el.style.display = 'none');
    document.body.style.cursor = 'auto';
}

/* ============================================ */
/* MOBILE SIDEBAR TOGGLE */
/* ============================================ */
const hamburger = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const closeBtn = document.getElementById('closeSidebar');

hamburger.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Tutup sidebar saat link diklik
document.querySelectorAll('.sidebar ul li a').forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});

/* ============================================ */
/* TYPING EFFECT - HERO SECTION */
/* ============================================ */
const typedEl = document.getElementById('typed');
const words = ['Network engineer', 'Web developer'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (!isDeleting) {
        // Mengetik
        typedEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentWord.length) {
            // Selesai mengetik, jeda lalu hapus
            isDeleting = true;
            setTimeout(typeEffect, 5000);
            return;
        }
        setTimeout(typeEffect, 100);
    } else {
        // Menghapus
        typedEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
            // Selesai menghapus, ganti kata
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeEffect, 300);
            return;
        }
        setTimeout(typeEffect, 50);
    }
}

// Mulai typing effect setelah splash screen selesai
setTimeout(typeEffect, 3000);

/* ============================================ */
/* FAQ ACCORDION */
/* ============================================ */
document.querySelectorAll('.faq-item').forEach(item => {
    const header = item.querySelector('.faq-header');
    const btn = item.querySelector('.plus-btn');
    
    header.addEventListener('click', () => {
        // Tutup semua FAQ lain
        document.querySelectorAll('.faq-item').forEach(other => {
            if (other !== item && other.classList.contains('active')) {
                other.classList.remove('active');
                other.querySelector('.plus-btn').textContent = '+';
            }
        });
        
        // Toggle FAQ yang diklik
        item.classList.toggle('active');
        btn.textContent = item.classList.contains('active') ? '−' : '+';
    });
});

/* ============================================ */
/* ACTIVE NAV LINK ON SCROLL */
/* ============================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let currentSection = 'home';
    
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-section') === currentSection);
    });
});

/* ============================================ */
/* PROJECT FILTER TABS */
/* ============================================ */
const projectTabs = document.querySelectorAll('.project-tab');
const projectCards = document.querySelectorAll('.project-card');

projectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab
        projectTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const filter = tab.getAttribute('data-filter');
        
        // Filter cards
        projectCards.forEach(card => {
            if (filter === 'all') {
                card.classList.remove('hidden');
            } else {
                card.classList.toggle('hidden', card.getAttribute('data-category') !== filter);
            }
        });
    });
});

/* ============================================ */
/* FLOATING CS BUTTON - WHATSAPP */
/* ============================================ */
document.querySelector('.cs-float-btn').addEventListener('click', () => {
    // Ganti nomor WhatsApp sesuai kebutuhan
    window.open('https://wa.me/6280000000000', '_blank');
});

/* ============================================ */
/* AOS - ANIMATE ON SCROLL OBSERVER */
/* ============================================ */
const aosElements = document.querySelectorAll('.aos-hidden');
const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-show');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

aosElements.forEach(el => aosObserver.observe(el));

/* ============================================ */
/* PACMAN GAME - SKILLS SECTION */
/* ============================================ */
(function initPacmanGame() {
    const canvas = document.getElementById('pacmanCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const GY = H - 28;
    const GROUND_Y = GY - 22;
    const JUMP_HEIGHT = 60;
    const JUMP_DURATION = 55;
    const JUMP_COOLDOWN = 75;
    const DETECT_DISTANCE = 60;
    
    let pacX = 55;
    let pacY = GROUND_Y;
    let pacJump = false;
    let jumpFrame = 0;
    let jumpCooldown = 0;
    let mouthAngle = 0;
    let mouthOpen = true;
    let ghostX = W + 100;
    let ghostY = GROUND_Y;
    let speed = 2.5;
    let frame = 0;
    let score = 0;
    let coins = [];
    let batchTimer = 0;
    let batchGap = 90;
    let cityOffset = 0;
    
    // Generate buildings for city background
    const buildings = [];
    for (let i = 0; i < 15; i++) {
        buildings.push({
            x: i * 45 + Math.random() * 15,
            w: 30 + Math.random() * 50,
            h: 50 + Math.random() * 90
        });
    }
    
    // Draw city background
    function drawCity() {
        const offset = cityOffset % (W + 120);
        ctx.fillStyle = '#a0d8ef06';
        
        buildings.forEach(b => {
            let bx = b.x - offset;
            if (bx < -b.w) bx += W + 120;
            if (bx > W) bx -= W + 120;
            ctx.fillRect(bx, GY - b.h, b.w, b.h);
            
            ctx.fillStyle = '#a0d8ef04';
            for (let wy = GY - b.h + 10; wy < GY - 6; wy += 16) {
                for (let wx = bx + 8; wx < bx + b.w - 8; wx += 14) {
                    if (Math.random() > 0.4) ctx.fillRect(wx, wy, 6, 7);
                }
            }
            ctx.fillStyle = '#a0d8ef06';
        });
        
        ctx.fillStyle = '#a0d8ef03';
        const offset2 = (cityOffset * 0.5) % (W + 120);
        buildings.forEach(b => {
            let bx = b.x + 30 - offset2;
            if (bx < -b.w) bx += W + 120;
            if (bx > W) bx -= W + 120;
            ctx.fillRect(bx, GY - b.h - 22, b.w - 12, b.h + 14);
        });
    }
    
    // Draw Pacman
    function drawPacman(x, y, mouth) {
        ctx.fillStyle = '#a0d8ef';
        ctx.beginPath();
        const sa = mouth * 0.25 * Math.PI;
        const ea = 2 * Math.PI - mouth * 0.25 * Math.PI;
        ctx.arc(x, y, 18, sa, ea);
        ctx.lineTo(x, y);
        ctx.fill();
        
        // Eye
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(x + 3, y - 9, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw Ghost
    function drawGhost(x, y) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y - 3, 15, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(x - 15, y - 3, 30, 18);
        
        const wave = Math.sin(frame * 0.3) * 5;
        ctx.fillRect(x - 15, y + 13, 8, 8);
        ctx.fillRect(x - 5, y + 10 + wave, 8, 8);
        ctx.fillRect(x + 5, y + 10 - wave, 8, 8);
        ctx.fillRect(x + 10, y + 13, 8, 8);
        
        // Eyes
        ctx.fillStyle = '#010508';
        ctx.beginPath();
        ctx.arc(x - 6, y - 6, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 8, y - 6, 4.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = '#a0d8ef';
        ctx.beginPath();
        ctx.arc(x - 4, y - 7, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 9, y - 7, 1.8, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw 3D Coin
    function drawCoin3D(x, y) {
        const r = 8;
        
        // Shadow
        ctx.fillStyle = '#0a1520';
        ctx.beginPath();
        ctx.ellipse(x, y + 4, r, r * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Coin body with gradient
        const grad = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
        grad.addColorStop(0, '#c5e8f5');
        grad.addColorStop(0.3, '#a0d8ef');
        grad.addColorStop(0.5, '#8cccdd');
        grad.addColorStop(0.7, '#a0d8ef');
        grad.addColorStop(1, '#6db3c9');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(x - 2, y - 3, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#4a9ab5';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
        
        // Center hole
        ctx.fillStyle = '#010508';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw ground line
    function drawGround() {
        ctx.fillStyle = '#a0d8ef10';
        ctx.fillRect(0, GY, W, 3);
        for (let i = 0; i < W; i += 40) {
            ctx.fillStyle = '#a0d8ef08';
            ctx.fillRect(i + (frame * speed % 40), GY + 6, 20, 2);
        }
    }
    
    // Reset ghost position
    function resetGhost() {
        ghostX = W + Math.random() * 200 + 80;
    }
    
    // Spawn coin batch
    function spawnCoinBatch() {
        const count = Math.floor(Math.random() * 5) + 1;
        const startX = W + 50;
        for (let i = 0; i < count; i++) {
            coins.push({
                x: startX + i * 38,
                y: GROUND_Y,
                collected: false
            });
        }
        batchGap = Math.floor(Math.random() * 60) + 60;
    }
    
    // Initialize first batch
    spawnCoinBatch();
    
    // Main game loop
    function gameLoop() {
        ctx.clearRect(0, 0, W, H);
        frame++;
        
        if (jumpCooldown > 0) jumpCooldown--;
        
        cityOffset += 0.35;
        drawCity();
        drawGround();
        
        // Coin spawning
        batchTimer++;
        if (batchTimer >= batchGap) {
            spawnCoinBatch();
            batchTimer = 0;
        }
        
        // Ghost movement
        ghostX -= speed * 0.8;
        if (ghostX < -80) resetGhost();
        
        // Draw coins
        coins.forEach(c => {
            if (!c.collected) drawCoin3D(c.x, c.y);
        });
        
        // Draw ghost
        drawGhost(ghostX, ghostY);
        
        // Pacman mouth animation
        if (mouthOpen) {
            mouthAngle += 0.08;
            if (mouthAngle >= 1) mouthOpen = false;
        } else {
            mouthAngle -= 0.08;
            if (mouthAngle <= 0.1) mouthOpen = true;
        }
        
        // Draw pacman
        drawPacman(pacX, pacY, mouthAngle);
        
        // Pacman jump logic
        if (!pacJump && jumpCooldown <= 0 && ghostX > pacX - 20 && ghostX < pacX + DETECT_DISTANCE) {
            pacJump = true;
            jumpFrame = 0;
            jumpCooldown = JUMP_COOLDOWN;
        }
        
        if (pacJump) {
            jumpFrame++;
            pacY = GROUND_Y - Math.sin(jumpFrame / JUMP_DURATION * Math.PI) * JUMP_HEIGHT;
            if (jumpFrame >= JUMP_DURATION) {
                pacY = GROUND_Y;
                pacJump = false;
                jumpFrame = 0;
            }
        }
        
        // Coin collection
        coins.forEach(c => c.x -= speed);
        coins.forEach(c => {
            if (!c.collected && c.x > pacX - 16 && c.x < pacX + 28 && Math.abs(c.y - pacY) < 22) {
                c.collected = true;
                score++;
            }
        });
        
        // Cleanup off-screen coins
        coins = coins.filter(c => c.x > -50 || !c.collected);
        if (coins.length > 20) coins = coins.slice(-20);
        
        requestAnimationFrame(gameLoop);
    }
    
    // Start game loop
    gameLoop();
})();

// Double-tap 'c' untuk scroll linear pelan sampai bawah
let lastTapTime = 0;

document.addEventListener('keydown', function(e) {
  if (e.key === 'c' || e.key === 'C') {
    const currentTime = new Date().getTime();
    const tapGap = currentTime - lastTapTime;
    
    if (tapGap < 500 && tapGap > 0) {
      e.preventDefault();
      startSmoothScroll();
      lastTapTime = 0;
    } else {
      lastTapTime = currentTime;
    }
  }
});

function startSmoothScroll() {
  const target = document.documentElement.scrollHeight - window.innerHeight;
  
  // ⬇️⬇️⬇️ ATUR KECEPATAN DI SINI ⬇️⬇️⬇️
  const speed = 4; // <<<< GANTI ANGKA INI (pixel per frame)
  // ⬆️⬆️⬆️ ATUR KECEPATAN DI SINI ⬆️⬆️⬆️
  // 1 = pelan banget, 2 = pelan, 5 = sedang, 10 = cepat
  // Scroll akan jalan terus sampai mentok di bawah
  
  function scroll() {
    window.scrollBy(0, speed);
    
    if (window.pageYOffset < target) {
      requestAnimationFrame(scroll);
    }
  }
  
  scroll();
}