/* ============================================================
   script.js — PORTOFOLIO (desain asli)
   - Semua efek asli dipertahankan: splash, cursor, typing,
     pacman, FAQ, scrollspy, filter proyek, tombol CS.
   - Isi konten dari data admin:
     cloud (Apps Script) > localStorage > DEMO (teks asli).
   - Tombol "Send Data" MENYIMPAN pesan ke backend (sheet pesan)
     dengan fallback lokal — BUKAN ke WhatsApp.
   - Tombol CS/WhatsApp memakai nomor dari data admin.
   ============================================================ */

(function () {
  "use strict";

  var STORAGE_KEY = "portofolio_data_v1";
  var MSG_KEY = "portofolio_messages_v1";

  var BACKEND_URL = "https://script.google.com/macros/s/AKfycbyJIKSYDTRuRczfNZNio5xkrxYZdCMnlSexZ5MwM4Ruk_U1XBE4SyHWqQvWmG9HrXn1Zw/exec";

  /* ---------- Data contoh = teks asli web portofolio ---------- */
  var DEMO_DATA = {
    profile: {
      name: "REHAN",
      typed: ["Network engineer", "Web developer"],
      welcome: "Welcome ...",
      role: "Network Engineer & Web Developer",
      title: "Membangun <span class='highlight'>Infrastruktur</span> Jaringan Yang Handal",
      subtitle: "Network Engineer & Web Developer",
      description:
        "Network engineer berpengalaman dalam membangun dan mengelola infrastruktur jaringan yang handal dan aman.",
      photo: "",
      about_photo: "",
      cv_url: "",
    },
    stats: [
      { label: "Tahun Pengalaman", value: "2+", icon: "fa-briefcase" },
      { label: "Project Selesai", value: "10+", icon: "fa-diagram-project" },
      { label: "Klien Puas", value: "1", icon: "fa-star" },
    ],
    tools: ["Word", "PowerPoint", "Excel", "Visio", "VS Code", "GitHub"],
    hard_skills: [
      { name: "Network Configuration", detail: "Topologi LAN 50 client", level: "expert" },
      { name: "Troubleshooting Jaringan", detail: "30+ kasus downtime", level: "advanced" },
      { name: "Network Security", detail: "Sertifikasi CCNA (on progress)", level: "advanced" },
      { name: "Web Development", detail: "Sistem Inventory Laravel", level: "intermediate" },
      { name: "Microsoft Office Suite", detail: "Macro Excel 10k+ data", level: "expert" },
    ],
    soft_skills: [
      "Komunikasi Efektif", "Problem Solving", "Kerja Sama Tim",
      "Manajemen Waktu", "Analisis Kritis", "Ketelitian",
      "Inisiatif", "Belajar Mandiri", "Kreativitas", "Empati",
    ],
    projects: [
      { title: "Topologi Jaringan Sekolah", description: "Desain & implementasi infrastruktur jaringan untuk lab komputer sekolah dengan 50 client.", tags: ["Cisco", "LAN", "Topologi"], category: "network", date: "12 Jul 2025", link: "https://example.com", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop" },
      { title: "Konfigurasi VLAN Perusahaan", description: "Segmentasi jaringan menggunakan VLAN untuk meningkatkan keamanan & performa jaringan kantor.", tags: ["VLAN", "Switch", "Security"], category: "network", date: "28 Jun 2025", link: "https://example.com", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=200&fit=crop" },
      { title: "Setup Server & Hosting", description: "Konfigurasi VPS, domain, SSL, dan optimasi server untuk aplikasi web produksi.", tags: ["VPS", "Nginx", "SSL"], category: "network", date: "15 Mei 2025", link: "https://example.com", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop" },
      { title: "Sistem Inventory Laravel", description: "Aplikasi web manajemen inventaris barang berbasis Laravel dengan fitur CRUD lengkap.", tags: ["Laravel", "PHP", "MySQL"], category: "web", date: "03 Apr 2025", link: "https://example.com", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop" },
      { title: "Dashboard Monitoring Jaringan", description: "Dashboard real-time untuk monitoring traffic & status perangkat jaringan berbasis web.", tags: ["HTML", "CSS", "JS"], category: "web", date: "20 Mar 2025", link: "https://example.com", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop" },
      { title: "Landing Page UMKM", description: "Website landing page responsif untuk promosi produk UMKM dengan form kontak.", tags: ["HTML", "CSS", "Responsive"], category: "web", date: "08 Feb 2025", link: "https://example.com", image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=200&fit=crop" },
      { title: "Sistem Pelaporan Excel Macro", description: "Template Excel dengan VBA Macro untuk otomatisasi laporan 10k+ data.", tags: ["Excel", "VBA", "Macro"], category: "experiment", date: "25 Jan 2025", link: "https://example.com", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop" },
      { title: "Chatbot AI Sederhana", description: "Eksperimen chatbot berbasis AI untuk menjawab FAQ pelanggan secara otomatis.", tags: ["Python", "AI", "API"], category: "experiment", date: "10 Des 2024", link: "https://example.com", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=200&fit=crop" },
      { title: "IoT Monitoring Suhu", description: "Prototype alat monitoring suhu ruangan berbasis IoT dengan notifikasi Telegram.", tags: ["IoT", "Arduino", "Sensor"], category: "experiment", date: "22 Nov 2024", link: "https://example.com", image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&h=200&fit=crop" },
    ],
    experiences: [
      { tag: "2023 - Sekarang", title: "Teknik Komputer & Jaringan (TKJ)", place: "SMK Negeri 1 Losarang · Kelas 12", desc: "Mendalami jaringan komputer, troubleshooting hardware, dan administrasi server. Praktik langsung dengan perangkat Cisco & MikroTik di lab sekolah.", icon: "fa-graduation-cap", full: false },
      { tag: "2024", title: "Website Desa — Proyek Klien", place: "Freelance · Remote", desc: "Membangun website profil desa lengkap dengan sistem informasi warga. Bukti nyata kemampuan web development yang dipelajari secara mandiri.", icon: "fa-rocket", full: false },
      { tag: "2023 - Sekarang", title: "Content Creator IT", place: "Personal Branding · Social Media", desc: "Aktif membuat konten edukasi seputar jaringan, teknologi, dan tips IT. Mengasah komunikasi, kreativitas, dan membangun personal brand.", icon: "fa-pen-to-square", full: false },
      { tag: "2022 - Sekarang", title: "Self-Taught Journey (2+ Tahun)", place: "AI-Assisted Learning · Online", desc: "Belajar otodidak dengan bantuan AI sebagai mentor virtual. Menguasai networking, web dev, dan Microsoft Office tanpa kursus formal.", icon: "fa-brain", full: false },
      { tag: "2018 - 2023", title: "Riwayat Pendidikan Formal", place: "SDN 3 Karanganyar → SMP Al-Amin → SMK Negeri 1 Losarang", desc: "Perjalanan pendidikan dari tingkat dasar hingga menengah kejuruan. Lingkungan sekolah yang mendukung minat di bidang teknologi sejak dini.", icon: "fa-school", full: true },
    ],
    contact: {
      email: "rehanwebid@gmail.com",
      phone: "+62 812-3456-7890",
      address: "Indramayu, Jawa Barat, Indonesia",
      whatsapp: "6280000000000",
      cta_title: "Mari <span class='highlight'>Berkolaborasi</span> Untuk Mewujudkan Proyek Impian Anda",
      cta_desc: "Saya siap membantu merancang infrastruktur jaringan yang handal, membangun website profesional, atau berkonsultasi tentang kebutuhan teknologi untuk bisnis dan personal Anda. Jangan ragu untuk menghubungi saya kapan saja.",
      cta_points: [
        "Konsultasi gratis — tentukan kebutuhan Anda",
        "Pengerjaan transparan & sesuai deadline",
        "Dukungan teknis setelah proyek selesai",
      ],
      note: "Atau Anda juga bisa <span class='highlight-text'>tanya-tanya dulu secara bebas</span> melalui CS kami dengan menekan tombol yang berada di <span class='highlight-text'>kanan bawah</span>.",
      socials: [
        { name: "TikTok", icon: "fa-tiktok", url: "#" },
        { name: "Discord", icon: "fa-discord", url: "#" },
        { name: "Instagram", icon: "fa-instagram", url: "#" },
      ],
    },
  };

  /* ============================================================
     DATA: loading & storage
     ============================================================ */
  function getData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.profile) return parsed;
      }
    } catch (err) { /* abaikan */ }
    return JSON.parse(JSON.stringify(DEMO_DATA));
  }

  var DATA = getData();
  var typedWords = (DATA.profile && Array.isArray(DATA.profile.typed) && DATA.profile.typed.length)
    ? DATA.profile.typed.slice()
    : ["Network Engineer", "Web Developer"];

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function $(id) { return document.getElementById(id); }
  function setText(id, text) {
    var node = $(id);
    if (node) node.textContent = String(text == null ? "" : text);
  }
  function setHtml(id, html) {
    var node = $(id);
    if (node) node.innerHTML = html == null ? "" : String(html);
  }

  /* ============================================================
     RENDER — HERO
     ============================================================ */
  function renderHero() {
    var p = DATA.profile || {};

    setText("hero-welcome", p.welcome || DEMO_DATA.profile.welcome);
    setText("hero-name", p.name || DEMO_DATA.profile.name);
    setText("hero-desc", p.description || DEMO_DATA.profile.description);

    var splashRole = $("splash-role");
    if (splashRole) setText("splash-role", p.role || DEMO_DATA.profile.role);

    document.title = (p.name || "Portfolio") + " — Portfolio";

    var imgBox = $("hero-image");
    if (p.photo) {
      imgBox.innerHTML = '<img src="' + esc(p.photo) + '" alt="Foto ' + esc(p.name) + '">';
      imgBox.style.display = "";
    } else {
      imgBox.innerHTML = "";
      imgBox.style.display = "none";
    }

    var cvBtn = $("btn-cv");
    if (cvBtn) {
      if (p.cv_url) {
        cvBtn.href = esc(p.cv_url);
        cvBtn.style.display = "";
      } else {
        cvBtn.style.display = "none";
      }
    }

    var pj = (DATA.profile && DATA.profile.typed && DATA.profile.typed.length)
      ? DATA.profile.typed : DEMO_DATA.profile.typed;
    typedWords = pj.slice();
  }

  /* ============================================================
     RENDER — ABOUT
     ============================================================ */
  function renderAbout() {
    var p = DATA.profile || {};

    setHtml("about-title", p.title || DEMO_DATA.profile.title);
    setText("about-subtitle", p.subtitle || DEMO_DATA.profile.subtitle);
    setText("about-desc", p.description || DEMO_DATA.profile.description);

    var imgWrap = $("about-image");
    var imgCol = imgWrap ? imgWrap.closest(".about-image") : null;
    if (p.about_photo) {
      imgWrap.innerHTML = '<img src="' + esc(p.about_photo) + '" alt="Tentang ' + esc(p.name) + '">';
      if (imgCol) imgCol.style.display = "";
    } else {
      imgWrap.innerHTML = "";
      if (imgCol) imgCol.style.display = "none";
    }

    var stats = (DATA.stats && DATA.stats.length) ? DATA.stats : DEMO_DATA.stats;
    setHtml("about-stats", stats.map(function (s) {
      return (
        '<div class="stat-item">' +
        '<div class="stat-icon"><i class="fa-solid ' + esc(s.icon || "fa-star") + '"></i></div>' +
        '<div class="stat-number">' + esc(s.value) + "</div>" +
        '<div class="stat-label">' + esc(s.label) + "</div>" +
        "</div>"
      );
    }).join(""));
  }

  /* ============================================================
     RENDER — TOOLS MARQUEE
     ============================================================ */
  var TOOL_ICONS = {
    "Word": "microsoft-word-2019",
    "PowerPoint": "microsoft-powerpoint-2019",
    "Excel": "microsoft-excel-2019",
    "Visio": "microsoft-visio-2019",
    "VS Code": "visual-studio-code-2019",
    "Visual Studio Code": "visual-studio-code-2019",
    "VSCode": "visual-studio-code-2019",
    "GitHub": "github",
  };

  function renderTools() {
    var tools = (DATA.tools && DATA.tools.length) ? DATA.tools : DEMO_DATA.tools;
    var track = $("tools-track");
    var sponsor = track ? track.closest(".sponsor-section") : null;

    if (!tools.length) {
      if (sponsor) sponsor.style.display = "none";
      return;
    }
    if (sponsor) sponsor.style.display = "";

    var items = tools.map(function (t) {
      var key = TOOL_ICONS[t] || "source-code";
      return '<span class="sponsor-item"><img src="https://img.icons8.com/color/48/' + key + '.png" alt="' + esc(t) + '"> ' + esc(t) + "</span>";
    });
    track.innerHTML = items.join("") + items.join("");
  }

  /* ============================================================
     RENDER — SKILLS
     ============================================================ */
  var BADGE_LEVELS = { expert: "EXPERT", advanced: "ADVANCED", intermediate: "INTERMEDIATE", basic: "BASIC" };

  function renderSkills() {
    var hard = (DATA.hard_skills && DATA.hard_skills.length) ? DATA.hard_skills : DEMO_DATA.hard_skills;
    setHtml("hard-skills-box", hard.map(function (s) {
      var lvl = s.level || "expert";
      return (
        '<div class="hard-skill-card">' +
        '<div class="skill-left">' +
        '<span class="skill-name">' + esc(s.name) + "</span>" +
        '<span class="skill-detail">' + esc(s.detail || "") + "</span>" +
        "</div>" +
        '<span class="skill-badge badge-' + esc(lvl) + '">' + (BADGE_LEVELS[lvl] || "EXPERT") + "</span>" +
        "</div>"
      );
    }).join(""));

    var soft = (DATA.soft_skills && DATA.soft_skills.length) ? DATA.soft_skills : DEMO_DATA.soft_skills;
    setHtml("soft-tags", soft.map(function (t) {
      return '<span class="skill-tag">' + esc(t) + "</span>";
    }).join(""));
  }

  /* ============================================================
     RENDER — PROJECTS
     ============================================================ */
  function renderProjects() {
    var projects = (DATA.projects && DATA.projects.length) ? DATA.projects : DEMO_DATA.projects;
    var grid = $("projectGrid");
    var tabs = $("projectTabs");
    var empty = $("projects-empty");

    var cats = {};
    projects.forEach(function (p) {
      cats[p.category || "other"] = (cats[p.category || "other"] || 0) + 1;
    });

    var labels = {
      all: "All",
      network: "Network Engineer",
      web: "Web Developer",
      experiment: "Experiment Tech",
      other: "Lainnya",
    };
    var filterList = [{ key: "all", count: projects.length, label: labels.all }];
    Object.keys(cats).forEach(function (k) {
      filterList.push({ key: k, count: cats[k], label: labels[k] || k });
    });

    tabs.innerHTML = filterList.map(function (f, i) {
      return (
        '<button class="project-tab' + (i === 0 ? " active" : "") + '" data-filter="' + esc(f.key) + '">' +
        esc(f.label) + "</button>"
      );
    }).join("");

    grid.innerHTML = projects.map(function (p) {
      var media = p.image
        ? '<div class="card-image"><img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy"></div>'
        : '<div class="card-image card-image-empty"><i class="fa-solid fa-diagram-project"></i><span>NO PREVIEW</span></div>';
      var link = p.link
        ? '<a href="' + esc(p.link) + '" target="_blank" rel="noopener" class="card-btn-open"><i class="fa-solid fa-arrow-right"></i> Open</a>'
        : "";
      return (
        '<div class="project-card" data-category="' + esc(p.category || "other") + '">' +
        media +
        '<div class="card-body">' +
        '<div class="card-title">' + esc(p.title) + "</div>" +
        '<div class="card-desc">' + esc(p.description || "") + "</div>" +
        '<div class="card-tags">' + (p.tags || []).map(function (t) {
          return "<span>" + esc(t) + "</span>";
        }).join("") + "</div>" +
        '<div class="card-footer">' +
        '<span class="card-date">' + esc(p.date || "") + "</span>" +
        link +
        "</div>" +
        "</div></div>"
      );
    }).join("");

    if (empty) empty.hidden = projects.length > 0;
  }

  /* ============================================================
     RENDER — EXPERIENCE
     ============================================================ */
  function renderExperience() {
    var list = (DATA.experiences && DATA.experiences.length) ? DATA.experiences : DEMO_DATA.experiences;
    var variants = {
      "fa-graduation-cap": "school", "fa-rocket": "project",
      "fa-pen-to-square": "brand", "fa-brain": "self", "fa-school": "edu",
    };
    setHtml("expGrid", list.map(function (x) {
      var icon = x.icon || "fa-graduation-cap";
      return (
        '<div class="exp-card' + (x.full ? " full-width" : "") + '">' +
        '<div class="exp-icon ' + (variants[icon] || "school") + '"><i class="fa-solid ' + esc(icon) + '"></i></div>' +
        '<span class="exp-tag">' + esc(x.tag || "") + "</span>" +
        '<div class="exp-title">' + esc(x.title) + "</div>" +
        '<div class="exp-place">' + esc(x.place || "") + "</div>" +
        '<div class="exp-line"></div>' +
        '<div class="exp-desc">' + esc(x.desc || "") + "</div>" +
        "</div>"
      );
    }).join(""));
  }

  /* ============================================================
     RENDER — CONTACT
     ============================================================ */
  function renderContact() {
    var c = DATA.contact || {};

    var wa = c.whatsapp ? "https://wa.me/" + c.whatsapp : "https://wa.me/";
    var btn = $("csFloatBtn");
    if (btn && !btn._waBound) {
      btn._waBound = true;
      btn.addEventListener("click", function () {
        window.open(wa, "_blank");
      });
    }

    setHtml("cta-title", c.cta_title || DEMO_DATA.contact.cta_title);
    setText("cta-desc", c.cta_desc || DEMO_DATA.contact.cta_desc);
    setHtml("cta-note", c.note || DEMO_DATA.contact.note);

    var points = (c.cta_points && c.cta_points.length) ? c.cta_points : DEMO_DATA.contact.cta_points;
    setHtml("cta-list", points.map(function (pt) {
      return '<div class="cta-list-item"><i class="fa-solid fa-circle-check"></i><span>' + esc(pt) + "</span></div>";
    }).join(""));

    var socials = (c.socials && c.socials.length) ? c.socials : DEMO_DATA.contact.socials;
    setHtml("footer-social", socials.map(function (s) {
      return '<a href="' + esc(s.url || "#") + '" class="social-icon" title="' + esc(s.name) + '" target="_blank" rel="noopener"><i class="fa-brands ' + esc(s.icon || "fa-brands") + '"></i></a>';
    }).join(""));

    var phoneInp = $("form-number");
    if (phoneInp && c.phone) phoneInp.placeholder = c.phone;

    setText("footer-year", String(new Date().getFullYear()));
  }

  function renderAll() {
    var renders = [renderHero, renderAbout, renderTools, renderSkills, renderProjects, renderExperience, renderContact];
    renders.forEach(function (fn) {
      try { fn(); } catch (err) { console.warn("[render] " + (fn.name || "section") + ": ", err); }
    });
  }

  /* ============================================================
     SYSTEM MESSAGES — "Send Data"
     ============================================================ */
  function localMessages() {
    try {
      var list = JSON.parse(localStorage.getItem(MSG_KEY));
      return Array.isArray(list) ? list : [];
    } catch (err) { return []; }
  }
  function saveLocalMessages(list) {
    try { localStorage.setItem(MSG_KEY, JSON.stringify(list)); } catch (err) { /* abaikan */ }
  }

  function tryCloudAddMessage(item) {
    if (!BACKEND_URL) return Promise.resolve(false);
    return fetch(BACKEND_URL + "?action=add_message", {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "add_message",
        name: item.name, number: item.number, msg: item.msg, at: item.at,
      }),
    })
      .then(function (r) { return r.json(); })
      .then(function (res) { return !!(res && res.ok); })
      .catch(function () { return false; });
  }

  function flushLocalMessages() {
    var list = localMessages();
    if (!list.length || !BACKEND_URL) return;
    list.forEach(function (item) {
      tryCloudAddMessage(item).then(function (ok) {
        if (!ok) return;
        var rest = localMessages();
        var idx = rest.findIndex(function (x) { return x.id === item.id; });
        if (idx > -1) { rest.splice(idx, 1); saveLocalMessages(rest); }
      });
    });
  }

  function showFormStatus(msg, type) {
    var el = $("form-status");
    if (!el) return;
    el.hidden = false;
    el.className = "form-status " + (type || "ok");
    el.textContent = msg;
  }
  function clearFormStatus() {
    var el = $("form-status");
    if (el) el.hidden = true;
  }

  function bindContactForm() {
    var form = $("contactForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = ($("form-name") && $("form-name").value.trim()) || "";
      var number = ($("form-number") && $("form-number").value.trim()) || "";
      var msg = ($("form-message") && $("form-message").value.trim()) || "";

      if (!name || !number || !msg) {
        showFormStatus("Mohon lengkapi nama, nomor, dan pesan dulu.", "error");
        return;
      }

      var item = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        name: name, number: number, msg: msg,
        at: new Date().toISOString(), read: false,
      };

      showFormStatus("Mengirim pesan…", "info");
      tryCloudAddMessage(item).then(function (ok) {
        if (ok) {
          form.reset();
          clearFormStatus();
          showFormStatus("Pesan terkirim! Terima kasih, akan segera saya balas.", "ok");
        } else {
          var list = localMessages();
          list.push(item);
          saveLocalMessages(list);
          form.reset();
          showFormStatus("Pesan tersimpan di perangkat (mode offline). Terkirim otomatis saat online.", "warn");
        }
      });
    });
  }

  /* ============================================================
     DATA DARI CLOUD
     ============================================================ */
  function syncFromCloud() {
    if (!BACKEND_URL) return;
    fetch(BACKEND_URL + "?action=read")
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.ok && res.data && res.data.profile) {
          DATA = res.data;
          renderAll();
          if (DATA.profile && Array.isArray(DATA.profile.typed) && DATA.profile.typed.length) {
            typedWords = DATA.profile.typed.slice();
          }
          startTyped(150);
          flushLocalMessages();
        }
      })
      .catch(function () { /* tetap pakai data lokal/demo */ });
  }

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
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'E' || e.key === 'U')) ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 'S')) {
      e.preventDefault();
      return false;
    }
  });

  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });

  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
  });

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

  if (hamburger) hamburger.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
  });
  if (closeBtn) closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  });
  if (overlay) overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  });

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
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeTimer = null;

  function startTyped(delay) {
    clearTimeout(typeTimer);
    wordIndex = 0;
    charIndex = 0;
    isDeleting = false;
    typeTimer = setTimeout(typeTick, delay || 100);
  }

  function typeTick() {
    const currentWord = typedWords[wordIndex] || "";

    if (!isDeleting) {
      typedEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentWord.length) {
        isDeleting = true;
        typeTimer = setTimeout(typeTick, 5000);
        return;
      }
      typeTimer = setTimeout(typeTick, 100);
    } else {
      typedEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % typedWords.length;
        typeTimer = setTimeout(typeTick, 300);
        return;
      }
      typeTimer = setTimeout(typeTick, 50);
    }
  }

  /* ============================================ */
  /* FAQ ACCORDION */
  /* ============================================ */
  document.querySelectorAll('.faq-item').forEach(item => {
    const header = item.querySelector('.faq-header');
    const btn = item.querySelector('.plus-btn');

    header.addEventListener('click', () => {
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          other.querySelector('.plus-btn').textContent = '+';
        }
      });
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
  /* PROJECT FILTER TABS (delegasi) */
  /* ============================================ */
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('.project-tab');
    if (!tab) return;

    document.querySelectorAll('.project-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.getAttribute('data-filter');
    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all') {
        card.classList.remove('hidden');
      } else {
        card.classList.toggle('hidden', card.getAttribute('data-category') !== filter);
      }
    });
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

    const buildings = [];
    for (let i = 0; i < 15; i++) {
      buildings.push({
        x: i * 45 + Math.random() * 15,
        w: 30 + Math.random() * 50,
        h: 50 + Math.random() * 90
      });
    }

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

    function drawPacman(x, y, mouth) {
      ctx.fillStyle = '#a0d8ef';
      ctx.beginPath();
      const sa = mouth * 0.25 * Math.PI;
      const ea = 2 * Math.PI - mouth * 0.25 * Math.PI;
      ctx.arc(x, y, 18, sa, ea);
      ctx.lineTo(x, y);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(x + 3, y - 9, 4, 0, Math.PI * 2);
      ctx.fill();
    }

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

      ctx.fillStyle = '#010508';
      ctx.beginPath();
      ctx.arc(x - 6, y - 6, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 8, y - 6, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#a0d8ef';
      ctx.beginPath();
      ctx.arc(x - 4, y - 7, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 9, y - 7, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawCoin3D(x, y) {
      const r = 8;
      ctx.fillStyle = '#0a1520';
      ctx.beginPath();
      ctx.ellipse(x, y + 4, r, r * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

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

      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(x - 2, y - 3, r * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#4a9ab5';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#010508';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawGround() {
      ctx.fillStyle = '#a0d8ef10';
      ctx.fillRect(0, GY, W, 3);
      for (let i = 0; i < W; i += 40) {
        ctx.fillStyle = '#a0d8ef08';
        ctx.fillRect(i + (frame * speed % 40), GY + 6, 20, 2);
      }
    }

    function resetGhost() {
      ghostX = W + Math.random() * 200 + 80;
    }

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

    spawnCoinBatch();

    function gameLoop() {
      ctx.clearRect(0, 0, W, H);
      frame++;

      if (jumpCooldown > 0) jumpCooldown--;

      cityOffset += 0.35;
      drawCity();
      drawGround();

      batchTimer++;
      if (batchTimer >= batchGap) {
        spawnCoinBatch();
        batchTimer = 0;
      }

      ghostX -= speed * 0.8;
      if (ghostX < -80) resetGhost();

      coins.forEach(c => {
        if (!c.collected) drawCoin3D(c.x, c.y);
      });

      drawGhost(ghostX, ghostY);

      if (mouthOpen) {
        mouthAngle += 0.08;
        if (mouthAngle >= 1) mouthOpen = false;
      } else {
        mouthAngle -= 0.08;
        if (mouthAngle <= 0.1) mouthOpen = true;
      }

      drawPacman(pacX, pacY, mouthAngle);

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

      coins.forEach(c => c.x -= speed);
      coins.forEach(c => {
        if (!c.collected && c.x > pacX - 16 && c.x < pacX + 28 && Math.abs(c.y - pacY) < 22) {
          c.collected = true;
          score++;
        }
      });

      coins = coins.filter(c => c.x > -50 || !c.collected);
      if (coins.length > 20) coins = coins.slice(-20);

      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  })();

  /* ============================================================
     START
     ============================================================ */
  document.addEventListener("DOMContentLoaded", function () {
    renderAll();
    bindContactForm();
    syncFromCloud();
    setTimeout(function () { startTyped(100); }, 3000);
  });
})();