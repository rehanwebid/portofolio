/* ============================================================
   PORTOFOLIO — SCRIPT
   ------------------------------------------------------------
   Owner     : Rehan
   Fungsi    : Interaksi halaman (AOS, navbar, filter, form,
               fisika kartu ID, keamanan)
   File      : script.js
   ============================================================ */

'use strict';

/* ============================================================
   KONFIGURASI
   ============================================================ */

const CONFIG = {
    /* ============================================================
       APPS SCRIPT / GOOGLE SHEETS
       Isi dengan URL deployment Apps Script (Script URL).
       Contoh: 'https://script.google.com/macros/s/XXXX/exec'
       Kosongkan ('') jika belum terhubung — website tetap berjalan
       dengan data project statis dari index.html.
       ============================================================ */
    scriptUrl: 'https://script.google.com/macros/s/AKfycbyzBn9Nt5mgI-o73Yle9JkDpl822k-wp9OAByCwynU0i5Lpf1ZzM7OyIaaupoSqFrhx/exec',
    whatsappNumber: '6289684219904',
    siteUrl: 'https://rehan.web.id'
};


/* ============================================================
   APPS SCRIPT — KONEKSI & RENDER DATA PROJECT
   ============================================================ */

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function formatBulanTahun(value) {
    if (!value) return '';
    const parts = value.split('-');
    const bulan = BULAN[parseInt(parts[1], 10) - 1] || '';
    return bulan + ' ' + parts[0];
}

async function apiProject(payload) {
    if (!CONFIG.scriptUrl) return null;

    try {
        const res = await fetch(CONFIG.scriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });
        return await res.json();
    } catch (e) {
        return null;
    }
}

function renderProjectCard(p) {
    const tools = (typeof p.tools === 'string' ? p.tools.split(',') : (p.tools || [])).map((t) => t.trim()).filter(Boolean);
    const toolsHtml = tools.map((t) => '<span class="project-card-tool">' + t + '</span>').join('');
    const dateText = formatBulanTahun(p.date);
    const img = p.image
        ? "style=\"background-image: url('" + p.image + "')\""
        : '';

    return (
        '<div class="project-card aos-init" data-category="' + (p.category || 'experiment') + '">' +
            '<div class="project-card-image" ' + img + '></div>' +
            '<div class="project-card-info">' +
                '<div class="project-card-title">' + (p.title || '') + '</div>' +
                '<div class="project-card-desc">' + (p.description || '') + '</div>' +
                '<div class="project-card-tools">' + toolsHtml + '</div>' +
                '<div class="project-card-date"><i class="fa-regular fa-calendar"></i> ' + dateText + '</div>' +
                '<div class="project-card-footer">' +
                    '<div class="project-card-like"><i class="fa-solid fa-heart"></i><span>0</span></div>' +
                    (p.link ? '<a href="' + p.link + '" class="project-card-cta"><i class="fa-solid fa-arrow-up-right-from-square"></i> View</a>' : '') +
                '</div>' +
            '</div>' +
        '</div>'
    );
}

async function loadProjects() {
    if (!CONFIG.scriptUrl) return;

    const json = await apiProject({ action: 'list' });
    if (!json || json.status !== 'success' || !Array.isArray(json.data)) return;

    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = json.data.map(renderProjectCard).join('');

    initLikeButtons();
    initProjectLinks();
    initProjectFilters();
    initAos();
}


/* ============================================================
   INISIASI
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initAos();
    initLikeButtons();
    initNavbar();
    initFooterYear();
    initProjectFilters();
    initProjectLinks();
    initContactForm();
    initSecurityGuards();
    initIdCardPhysics();
    loadProjects();
});


/* ============================================================
   SCROLL REVEAL (AOS)
   ============================================================ */

function initAos() {
    const elements = document.querySelectorAll('.aos-init');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach((el) => observer.observe(el));
}


/* ============================================================
   TOMBOL LIKE PROJECT
   ============================================================ */

function initLikeButtons() {
    document.querySelectorAll('.project-card-like').forEach((like) => {
        like.addEventListener('click', () => {
            const count = like.querySelector('span');

            if (like.classList.contains('liked')) {
                like.classList.remove('liked');
                count.textContent = '0';
            } else {
                like.classList.add('liked');
                count.textContent = '1';
            }
        });
    });
}


/* ============================================================
   NAVBAR — SCROLLSPY & SMOOTH SCROLL
   ============================================================ */

function initNavbar() {
    const links = document.querySelectorAll('.nav-link');
    const viewportHeight = window.innerHeight;

    const sectionOffsets = {
        home: 0,
        about: 1.35,
        skills: 2.5,
        project: 3.7,
        contact: 5.2
    };

    function setActive(section) {
        links.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === section);
        });
    }

    function updateActiveOnScroll() {
        const y = window.scrollY;

        if (y < viewportHeight * 0.5) setActive('home');
        else if (y < viewportHeight * 2.0) setActive('about');
        else if (y < viewportHeight * 3.2) setActive('skills');
        else if (y < viewportHeight * 4.5) setActive('project');
        else setActive('contact');
    }

    links.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const section = link.dataset.section;
            const top = viewportHeight * (sectionOffsets[section] || 0);

            window.scrollTo({ top, behavior: 'smooth' });
            setActive(section);
        });
    });

    window.addEventListener('scroll', updateActiveOnScroll);
    updateActiveOnScroll();

    document.getElementById('urlBar').addEventListener('click', () => {
        window.open(CONFIG.siteUrl, '_blank');
    });
}


/* ============================================================
   TAHUN COPYRIGHT OTOMATIS
   ============================================================ */

function initFooterYear() {
    document.getElementById('footerYear').textContent = new Date().getFullYear();
}


/* ============================================================
   FILTER PROJECT
   ============================================================ */

function initProjectFilters() {
    const buttons = document.querySelectorAll('.project-filter-btn');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            buttons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            document.querySelectorAll('.project-card').forEach((card) => {
                const show = filter === 'all' || card.dataset.category === filter;
                card.style.display = show ? 'flex' : 'none';
            });
        });
    });
}


/* ============================================================
   LINK PROJECT — GANTI TAB (BUKAN TAB BARU)
   ============================================================ */

function initProjectLinks() {
    document.querySelectorAll('.project-card-cta').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const url = link.getAttribute('href');

            /* Isi href dengan URL project asli — klik akan
               memindahkan tab saat ini ke URL tersebut */
            if (url && url !== '#') {
                window.location.href = url;
            }
        });
    });
}


/* ============================================================
   FORM KONTAK → WHATSAPP
   ============================================================ */

function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('.contact-submit-btn');

    /* Tombol aktif hanya saat semua field terisi */
    function updateSubmitState() {
        let complete = true;

        form.querySelectorAll('.contact-input').forEach((input) => {
            if (!input.value.trim()) complete = false;
        });

        submitButton.disabled = !complete;
    }

    form.querySelectorAll('.contact-input').forEach((input) => {
        input.addEventListener('input', updateSubmitState);
    });
    updateSubmitState();

    /* Kirim pesan langsung ke WhatsApp */
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nama = document.getElementById('contactName').value.trim();
        const pesan = document.getElementById('contactMessage').value.trim();

        const teks = 'Halo Rehan, saya ' + nama + '\n\n' + pesan;
        const url = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(teks);

        window.open(url, '_blank');
    });
}


/* ============================================================
   KEAMANAN — BLOKIR AKSES SOURCE CODE
   ============================================================ */

function initSecurityGuards() {
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12') {
            e.preventDefault();
        }

        const devToolsShortcut = e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'K'].includes(e.key);
        const sourceShortcut = e.ctrlKey && ['u', 'U', 's', 'S', 'p', 'P'].includes(e.key);

        if (devToolsShortcut || sourceShortcut) {
            e.preventDefault();
        }
    });
}


/* ============================================================
   KARTU ID — FISIKA & TALI CANVAS
   ============================================================ */

function initIdCardPhysics() {
    const card = document.getElementById('kartuId');
    const canvas = document.getElementById('taliCanvas');
    const ctx = canvas.getContext('2d');
    const home = document.getElementById('homeSection');

    const config = {
        gravity: 1.5,            /* gravitasi */
        damping: 0.88,           /* redam kecepatan */
        rotationDamping: 0.88,   /* redam rotasi */
        ropeTension: 0.35,       /* tarikan tali */
        ropeLength: 300,         /* panjang tali */
        edgeMargin: 50,          /* jarak aman dari tepi */
        snapStrength: 0.07,      /* kekuatan snap ke sudut */
        snapDelay: 500           /* jeda sebelum snap (ms) */
    };

    let anchor = { x: 0, y: 0 };                 /* titik tali di atas */
    let cardX = 0, cardY = 0;                    /* posisi kartu */
    let velX = 0, velY = 0;                      /* kecepatan kartu */
    let rotation = 0, velRotation = 0;           /* rotasi kartu */
    let lastRelease = 0, isSnapping = false;     /* state snap */
    let isDragging = false;                      /* state drag */
    let dragOffsetX = 0, dragOffsetY = 0;        /* offset genggaman */
    let lastPointer = { x: 0, y: 0 };            /* posisi pointer */
    let pointerDelta = { x: 0, y: 0 };           /* delta pointer */

    /* --- Canvas --- */

    function resizeCanvas() {
        canvas.width = home.offsetWidth;
        canvas.height = home.offsetHeight;

        anchor.x = home.offsetWidth / 2;
        anchor.y = 0;

        if (cardX === 0 && cardY === 0) {
            cardX = anchor.x;
            cardY = anchor.y + config.ropeLength;
        }
    }

    /* --- Geometri --- */

    function getRopePoint() {
        const halfHeight = card.offsetHeight / 2;
        const offsetY = -halfHeight + 12;
        const rad = rotation * Math.PI / 180;

        return {
            x: cardX - offsetY * Math.sin(rad),
            y: cardY + offsetY * Math.cos(rad)
        };
    }

    function bezierPoint(t, x1, y1, cx, cy, x2, y2) {
        const inv = 1 - t;

        return {
            x: inv * inv * x1 + 2 * inv * t * cx + t * t * x2,
            y: inv * inv * y1 + 2 * inv * t * cy + t * t * y2
        };
    }

    function bezierDerivative(t, x1, y1, cx, cy, x2, y2) {
        const inv = 1 - t;

        return {
            dx: 2 * inv * (cx - x1) + 2 * t * (x2 - cx),
            dy: 2 * inv * (cy - y1) + 2 * t * (y2 - cy)
        };
    }

    /* --- Gambar tali --- */

    function strokeRope(x1, y1, cx, cy, x2, y2, color, width) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cx, cy, x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'butt';
        ctx.stroke();
    }

    function drawTextOnRope(characters, x1, y1, cx, cy, x2, y2, startOffset) {
        const count = characters.length;

        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < count; i++) {
            const progress = startOffset + (i / (count - 1)) * 0.12;
            const clamped = Math.max(0, Math.min(1, progress));
            const pos = bezierPoint(clamped, x1, y1, cx, cy, x2, y2);
            const der = bezierDerivative(clamped, x1, y1, cx, cy, x2, y2);
            const angle = Math.atan2(der.dy, der.dx);

            ctx.save();
            ctx.translate(pos.x, pos.y);
            ctx.rotate(angle);

            /* outline teks */
            ctx.fillStyle = '#1a1a1a';
            ctx.fillText(characters[i], 0, 2);
            ctx.fillText(characters[i], 0, -2);
            ctx.fillText(characters[i], 2, 0);
            ctx.fillText(characters[i], -2, 0);

            /* isi teks */
            ctx.fillStyle = '#888';
            ctx.fillText(characters[i], 0, 0);

            ctx.restore();
        }
    }

    function drawRope() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const ropePoint = getRopePoint();
        const dx = ropePoint.x - anchor.x;
        const dy = ropePoint.y - anchor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let bend = 0;
        if (distance < config.ropeLength && distance > 0) {
            bend = Math.min((config.ropeLength - distance) * 0.8, 120);
        }

        const midX = (anchor.x + ropePoint.x) / 2;
        const midY = (anchor.y + ropePoint.y) / 2;

        let offsetX = 0, offsetY = 0;
        if (distance > 0) {
            offsetX = -dy / distance;
            offsetY = dx / distance;
        }

        const controlX = midX + offsetX * bend;
        const controlY = midY + offsetY * bend;

        /* tali luar (biru) + tali dalam (hitam) */
        strokeRope(anchor.x, anchor.y, controlX, controlY, ropePoint.x, ropePoint.y, '#0066cc', 22);
        strokeRope(anchor.x, anchor.y, controlX, controlY, ropePoint.x, ropePoint.y, '#000', 18);

        /* teks "REHAN." berjalan di sepanjang tali */
        const passes = 3;
        const passStep = 0.7;

        for (let i = 0; i < passes; i++) {
            const startOffset = 0.1 + (i * passStep / passes);
            drawTextOnRope('REHAN.', anchor.x, anchor.y, controlX, controlY, ropePoint.x, ropePoint.y, startOffset);
        }
    }

    /* --- Fisika --- */

    function normalizeAngle(angle) {
        let n = angle % 360;

        if (n > 180) n -= 360;
        if (n < -180) n += 360;

        return n;
    }

    function updateFrame() {
        if (!isDragging) {
            const ropePoint = getRopePoint();
            const dx = ropePoint.x - anchor.x;
            const dy = ropePoint.y - anchor.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            /* tarikan tali jika melebihi panjang */
            if (distance > config.ropeLength) {
                const slack = distance - config.ropeLength;
                velX -= (dx / distance) * slack * config.ropeTension;
                velY -= (dy / distance) * slack * config.ropeTension;
            }

            /* gravitasi & redaman */
            velY += config.gravity;
            velX *= config.damping;
            velY *= config.damping;

            cardX += velX;
            cardY += velY;

            /* snap rotasi ke sudut terdekat */
            const elapsed = Date.now() - lastRelease;
            if (elapsed >= config.snapDelay) isSnapping = true;

            if (isSnapping) {
                const angleDiff = normalizeAngle(rotation);

                velRotation -= angleDiff * config.snapStrength;
                velRotation *= 0.85;
                rotation += velRotation;
                rotation -= angleDiff * 0.15;

                if (Math.abs(angleDiff) < 0.5) {
                    rotation = Math.round(rotation / 360) * 360;
                    velRotation = 0;
                    isSnapping = false;
                }
            } else {
                velRotation *= config.rotationDamping;

                const angleDiff = normalizeAngle(rotation);
                velRotation -= angleDiff * config.snapStrength * 0.6;
                rotation += velRotation * 0.6;
            }

            /* batas tepi layar */
            const halfWidth = card.offsetWidth / 2;
            const halfHeight = card.offsetHeight / 2;

            if (cardX < halfWidth) {
                cardX = halfWidth;
                velX = Math.abs(velX) * 0.15;
            }

            if (cardX > home.offsetWidth - halfWidth) {
                cardX = home.offsetWidth - halfWidth;
                velX = -Math.abs(velX) * 0.15;
            }

            if (cardY < halfHeight + config.edgeMargin) {
                cardY = halfHeight + config.edgeMargin;
                velY = Math.abs(velY) * 0.15;
            }

            if (cardY > home.offsetHeight - halfHeight) {
                cardY = home.offsetHeight - halfHeight;
                velY = -Math.abs(velY) * 0.15;
            }

            if (Math.abs(velX) < 0.01) velX = 0;
            if (Math.abs(velY) < 0.01) velY = 0;
            if (Math.abs(velRotation) < 0.001) velRotation = 0;
        }

        card.style.left = cardX + 'px';
        card.style.top = cardY + 'px';
        card.style.transform = 'translate(-50%,-50%) rotateZ(' + rotation + 'deg)';

        drawRope();
        requestAnimationFrame(updateFrame);
    }

    /* --- Interaksi mouse --- */

    card.addEventListener('mousedown', (e) => {
        isDragging = true;
        isSnapping = false;

        const rect = card.getBoundingClientRect();
        dragOffsetX = e.clientX - (rect.left + card.offsetWidth / 2);
        dragOffsetY = e.clientY - (rect.top + card.offsetHeight / 2);

        lastPointer = { x: e.clientX, y: e.clientY };
        velX = 0;
        velY = 0;
        velRotation = 0;

        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const homeRect = home.getBoundingClientRect();
        pointerDelta = { x: e.clientX - lastPointer.x, y: e.clientY - lastPointer.y };
        lastPointer = { x: e.clientX, y: e.clientY };

        cardX = e.clientX - homeRect.left - dragOffsetX;
        cardY = e.clientY - homeRect.top - dragOffsetY;

        const halfWidth = card.offsetWidth / 2;
        const halfHeight = card.offsetHeight / 2;

        cardX = Math.max(halfWidth, Math.min(home.offsetWidth - halfWidth, cardX));
        cardY = Math.max(halfHeight + config.edgeMargin, Math.min(home.offsetHeight - halfHeight, cardY));
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;

        isDragging = false;

        velX = pointerDelta.x * 0.5;
        velY = pointerDelta.y * 0.5;
        velRotation = (Math.random() - 0.5) * 5;

        lastRelease = Date.now();
        isSnapping = false;
    });

    /* --- Interaksi sentuh (HP/tablet) --- */

    card.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        card.dispatchEvent(new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        }));
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        e.preventDefault();
        const touch = e.touches[0];
        document.dispatchEvent(new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        }));
    }, { passive: false });

    document.addEventListener('touchend', () => {
        document.dispatchEvent(new MouseEvent('mouseup'));
    });

    /* --- Mulai --- */

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    updateFrame();
}