/* ============================================================
   script.js — CONTROL CONSOLE (panel admin v2)
   Edit konten → localStorage → cloud Apps Script (action=save).
   ============================================================ */

(function () {
  "use strict";

  var STORAGE_KEY = "portofolio_data_v1";
  var MSG_STORAGE_KEY = "portofolio_messages_v1";

  /* ============================================================
     KONFIGURASI BACKEND (Google Apps Script)
     ============================================================ */
  var BACKEND_URL = "https://script.google.com/macros/s/AKfycbyJIKSYDTRuRczfNZNio5xkrxYZdCMnlSexZ5MwM4Ruk_U1XBE4SyHWqQvWmG9HrXn1Zw/exec";

  /* ---------- Gerbang sandi (sandi TIDAK disimpan di kode) ---------- */
  var AUTH_KEY = "admin_session_key";
  function adminKey() {
    try { return sessionStorage.getItem(AUTH_KEY) || ""; } catch (err) { return ""; }
  }
  function setAdminKey(k) {
    try { sessionStorage.setItem(AUTH_KEY, k); } catch (err) { /* abaikan */ }
  }
  function isAuthed() { return !!adminKey(); }

  /* ---------- Data awal (contoh) ---------- */
  var DEMO_DATA = {
    profile: {
      name: "Rehan",
      typed: ["Network Engineer", "Web Developer"],
      welcome: "— selamat datang di portofolio saya",
      role: "Network Engineer & Web Developer",
      title: "Membangun <span class='highlight'>Infrastruktur</span> Jaringan Yang Handal",
      subtitle: "Network Engineer & Web Developer",
      description:
        "Saya seorang Network Engineer dengan passion di bidang infrastruktur jaringan dan web development. Berpengalaman dalam merancang, mengimplementasikan, dan mengelola solusi jaringan yang aman, efisien, dan scalable untuk kebutuhan bisnis modern.",
      about_photo: "",
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
      { tag: "2023 - Sekarang", title: "Teknik Komputer & Jaringan (TKJ)", place: "SMK Negeri 1 Losarang · Kelas 12", desc: "Mendalami jaringan komputer, troubleshooting hardware, dan administrasi server.", icon: "fa-graduation-cap", full: false },
      { tag: "2024", title: "Website Desa — Proyek Klien", place: "Freelance · Remote", desc: "Membangun website profil desa lengkap dengan sistem informasi warga.", icon: "fa-rocket", full: false },
      { tag: "2023 - Sekarang", title: "Content Creator IT", place: "Personal Branding · Social Media", desc: "Aktif membuat konten edukasi seputar jaringan, teknologi, dan tips IT.", icon: "fa-pen-to-square", full: false },
      { tag: "2022 - Sekarang", title: "Self-Taught Journey (2+ Tahun)", place: "AI-Assisted Learning · Online", desc: "Belajar otodidak dengan bantuan AI sebagai mentor virtual.", icon: "fa-brain", full: false },
      { tag: "2018 - 2023", title: "Riwayat Pendidikan Formal", place: "SDN 3 Karanganyar → SMP Al-Amin → SMK Negeri 1: Losarang", desc: "Perjalanan pendidikan dari tingkat dasar hingga menengah kejuruan.", icon: "fa-school", full: true },
    ],
    contact: {
      email: "rehanwebid@gmail.com",
      phone: "+62 812-3456-7890",
      address: "Indramayu, Jawa Barat, Indonesia",
      whatsapp: "6280000000000",
      cta_title: "Mari <span class='highlight'>Berkolaborasi</span> Mewujudkan Proyek Impian Anda",
      cta_desc: "Saya siap membantu merancang infrastruktur jaringan yang handal, membangun website profesional, atau berkonsultasi tentang kebutuhan teknologi Anda.",
      cta_points: [
        "Konsultasi gratis — tentukan kebutuhan Anda",
        "Pengerjaan transparan & sesuai deadline",
        "Dukungan teknis setelah proyek selesai",
      ],
      note: "Atau Anda juga bisa tanya-tanya dulu secara bebas melalui WhatsApp dengan menekan tombol di kanan bawah.",
      socials: [
        { name: "TikTok", icon: "fa-tiktok", url: "#" },
        { name: "Discord", icon: "fa-discord", url: "#" },
        { name: "Instagram", icon: "fa-instagram", url: "#" },
      ],
    },
  };

  /* ============================================================
     STATE & STORAGE
     ============================================================ */
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.profile) return parsed;
      }
    } catch (err) { /* fallback demo */ }
    return JSON.parse(JSON.stringify(DEMO_DATA));
  }

  var state = load();

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      toast("Gagal menyimpan lokal: " + err);
      return false;
    }
    scheduleCloudSave();
    return true;
  }

  function syncFromCloud() {
    if (!BACKEND_URL) return;
    setCloudStatus("sync");
    fetch(BACKEND_URL + "?action=read")
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.ok && res.data && res.data.profile) {
          var isFresh = !(res.data.projects && res.data.projects.length) &&
            !(res.data.experiences && res.data.experiences.length) &&
            !res.data.profile.about_photo;
          if (isFresh) {
            cloudSave();
            return;
          }
          state = res.data;
          persistLocal();
          renderAll();
          buildObjectFormFields();
          setCloudStatus("ok");
          toast("Data dimuat dari cloud");
        } else {
          setCloudStatus("off");
        }
      })
      .catch(function () { setCloudStatus("off"); });
  }

  function persistLocal() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (err) { /* abaikan */ }
  }

  /* ============================================================
     HELPER
     ============================================================ */
  function $(sel) { return document.querySelector(sel); }
  function $all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function toast(msg) {
    var el = $("#toast");
    el.hidden = false;
    el.textContent = msg.substring(0, 110);
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.hidden = true; }, 2400);
  }

  var LEVELS = {
    expert: "EXPERT", advanced: "ADVANCED",
    intermediate: "INTERMEDIATE", basic: "BASIC",
  };

  /* ============================================================
     KONFIGURASI FORM
     ============================================================ */
  var LIST_CONFIG = {
    stats: {
      key: "stats", title: "Statistik",
      fields: [
        { k: "label", label: "Label", placeholder: "Tahun Pengalaman" },
        { k: "value", label: "Nilai", placeholder: "2+", full: true },
        { k: "icon", label: "Ikon FontAwesome", placeholder: "fa-briefcase", hint: "Tanpa awalan fa-solid." },
      ],
    },
    hard: {
      key: "hard_skills", title: "Hard Skill",
      fields: [
        { k: "name", label: "Nama Skill", placeholder: "Network Configuration" },
        { k: "detail", label: "Detail Singkat", placeholder: "Topologi LAN 50 client", full: true },
        { k: "level", label: "Level", type: "select", options: LEVELS },
      ],
    },
    soft: {
      key: "soft_skills", title: "Soft Skill",
      string: true,
      fields: [{ k: "value", label: "Nama Soft Skill", placeholder: "Komunikasi Efektif" }],
    },
    proyek: {
      key: "projects", title: "Proyek",
      fields: [
        { k: "title", label: "Judul Proyek" },
        { k: "category", label: "Kategori", placeholder: "network / web / experiment" },
        { k: "description", label: "Deskripsi", type: "textarea", full: true },
        { k: "tags", label: "Tag (pisah koma)", placeholder: "Cisco, LAN, Topologi", full: true },
        { k: "date", label: "Tanggal", placeholder: "12 Jul 2025" },
        { k: "link", label: "Tautan", placeholder: "https://..." },
        { k: "image", label: "Gambar Proyek", type: "image", full: true },
      ],
    },
    pengalaman: {
      key: "experiences", title: "Pengalaman",
      fields: [
        { k: "title", label: "Judul", placeholder: "Teknik Komputer & Jaringan" },
        { k: "place", label: "Tempat", placeholder: "SMK Negeri 1 Losarang" },
        { k: "tag", label: "Rentang Waktu", placeholder: "2023 - Sekarang" },
        { k: "desc", label: "Deskripsi", type: "textarea", full: true },
        { k: "icon", label: "Ikon FontAwesome", placeholder: "fa-graduation-cap" },
        { k: "full", label: "Lebar penuh (2 kolom)", type: "checkbox", full: true },
      ],
    },
    sosmed: {
      key: "socials", title: "Media Sosial",
      parent: "contact",
      fields: [
        { k: "name", label: "Nama", placeholder: "TikTok" },
        { k: "icon", label: "Ikon FontAwesome", placeholder: "fa-tiktok" },
        { k: "url", label: "Tautan", placeholder: "https://...", full: true },
      ],
    },
  };

  var HOME_FIELDS = [
    { k: "name", label: "Nama" },
    { k: "role", label: "Peran / Profesi" },
    { k: "typed", label: "Kata-kata Efek Ketik (pisah koma)", placeholder: "Network Engineer, Web Developer", hint: "Muncul bergantian di hero." },
    { k: "welcome", label: "Kata Pembuka", placeholder: "— selamat datang" },
    { k: "description", label: "Deskripsi Singkat", type: "textarea", full: true },
    { k: "photo", label: "Foto Hero (opsional)", type: "image", full: true, hint: "Kosongkan agar bagian foto di hero disembunyikan." },
    { k: "cv_url", label: "Tautan Download CV (opsional)", placeholder: "https://.../cv.pdf", full: true, hint: "Kosongkan untuk menyembunyikan tombol Download CV." },
  ];

  var ABOUT_FIELDS = [
    { k: "title", label: "Judul Tentang", full: true, hint: "Boleh memakai <span class=\"highlight\">...</span>" },
    { k: "subtitle", label: "Subjudul Tentang", full: true },
    { k: "about_photo", label: "Foto Tentang", type: "image", full: true },
  ];

  var CONTACT_FIELDS = [
    { k: "email", label: "Email" },
    { k: "phone", label: "Telepon / WhatsApp" },
    { k: "address", label: "Lokasi" },
    { k: "whatsapp", label: "Nomor WA (tanpa +)", placeholder: "6281234567890" },
    { k: "cta_title", label: "Judul Ajakan", full: true, hint: "Boleh memakai <span class=\"highlight\">...</span>" },
    { k: "cta_desc", label: "Deskripsi Ajakan", type: "textarea", full: true },
    { k: "cta_points", label: "Poin Keunggulan (satu baris per poin)", type: "textarea", full: true },
    { k: "note", label: "Catatan", type: "textarea", full: true },
  ];

  function parseListValue(raw) {
    return String(raw || "").split(",").map(function (t) { return t.trim(); }).filter(Boolean);
  }

  /* ============================================================
     UPLOAD GAMBAR (drag & drop / pilih file → base64 ringkas)
     ============================================================ */
  function makeImageField(field, value) {
    var wrap = document.createElement("div");
    wrap.className = "field" + (field.full ? " full" : "");

    var label = document.createElement("label");
    label.textContent = field.label;
    wrap.appendChild(label);

    var dz = document.createElement("div");
    dz.className = "drop-zone";
    dz.dataset.key = field.k;
    dz.dataset.type = "image";
    dz._value = value || "";

    var icon = document.createElement("i");
    icon.className = "fa-solid fa-cloud-arrow-up";
    var hint = document.createElement("span");
    hint.className = "dz-hint";
    hint.textContent = "Seret gambar ke sini, atau klik untuk memilih (JPG/PNG)";

    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.hidden = true;

    var preview = document.createElement("output");
    preview.className = "drop-preview";
    preview.hidden = !dz._value;

    var clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "drop-clear";
    clearBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    clearBtn.title = "Hapus gambar";
    clearBtn.style.display = dz._value ? "block" : "none";

    dz.appendChild(icon);
    dz.appendChild(hint);
    dz.appendChild(fileInput);
    dz.appendChild(preview);
    dz.appendChild(clearBtn);

    if (dz._value) {
      var img = document.createElement("img");
      img.src = dz._value;
      preview.appendChild(img);
    }

    wrap.appendChild(dz);
    return wrap;
  }

  function showImagePreview(dz, dataUrl) {
    var preview = dz.querySelector(".drop-preview");
    if (!preview) return;
    preview.hidden = false;
    preview.innerHTML = '<img src="' + dataUrl + '">';
    var clear = dz.querySelector(".drop-clear");
    if (clear) clear.style.display = "block";
  }

  function readImageField(dz) {
    return dz && dz._value ? dz._value : "";
  }

  function handleImageFile(file, cb) {
    if (!file) return;
    if (file.type.indexOf("image") !== 0) {
      toast("File harus berupa gambar (JPG/PNG)");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (ev) {
      var image = new Image();
      image.onload = function () {
        var max = 900;
        var w = image.width;
        var h = image.height;
        if (w > max || h > max) {
          var r = Math.min(max / w, max / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, w, h);
        cb(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function autoSaveForm(zone) {
    var form = zone.closest("form");
    if (!form) return;
    if (form.id === "form-home" || form.id === "form-tentang" || form.id === "form-kontak") {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
  }

  document.addEventListener("click", function (e) {
    var clearBtn = e.target.closest(".drop-clear");
    if (clearBtn) {
      e.stopPropagation();
      var zone = clearBtn.closest(".drop-zone");
      zone._value = "";
      var prev = zone.querySelector(".drop-preview");
      if (prev) { prev.hidden = true; prev.innerHTML = ""; }
      clearBtn.style.display = "none";
      toast("Gambar dihapus");
      autoSaveForm(zone);
      return;
    }
    var dz = e.target.closest(".drop-zone");
    if (dz) {
      var inp = dz.querySelector('input[type="file"]');
      if (inp) inp.click();
    }
  });

  document.addEventListener("change", function (e) {
    var inp = e.target;
    if (!inp || inp.type !== "file") return;
    var dz = inp.closest(".drop-zone");
    if (!dz) return;
    handleImageFile(inp.files[0], function (dataUrl) {
      dz._value = dataUrl;
      showImagePreview(dz, dataUrl);
      toast("Gambar dimasukkan — jangan lupa simpan");
    });
  });

  document.addEventListener("dragover", function (e) {
    var dz = e.target.closest ? e.target.closest(".drop-zone") : null;
    if (dz) { e.preventDefault(); dz.classList.add("drag"); }
  });

  document.addEventListener("dragleave", function (e) {
    var dz = e.target.closest ? e.target.closest(".drop-zone") : null;
    if (dz) dz.classList.remove("drag");
  });

  document.addEventListener("drop", function (e) {
    var dz = e.target.closest ? e.target.closest(".drop-zone") : null;
    if (!dz) return;
    e.preventDefault();
    dz.classList.remove("drag");
    var files = e.dataTransfer && e.dataTransfer.files;
    if (!files || files.length === 0) return;
    handleImageFile(files[0], function (dataUrl) {
      dz._value = dataUrl;
      showImagePreview(dz, dataUrl);
      toast("Gambar dimasukkan — jangan lupa simpan");
    });
  });

  /* ============================================================
     BUILDER FORM
     ============================================================ */
  function buildFields(container, fields, values) {
    container.innerHTML = "";
    fields.forEach(function (f) {
      var value = values[f.k];

      if (f.k === "cta_points") value = (value || []).join("\n");
      if (f.k === "typed") value = (value || []).join(", ");

      if (f.type === "image") {
        container.appendChild(makeImageField(f, value));
        return;
      }

      var wrap = document.createElement("div");
      wrap.className = "field" + (f.full ? " full" : "") + (f.type === "checkbox" ? " checkbox-field" : "");

      var label = document.createElement("label");
      label.textContent = f.label;
      wrap.appendChild(label);

      var input;
      if (f.type === "textarea") {
        input = document.createElement("textarea");
        input.rows = 3;
      } else if (f.type === "select") {
        input = document.createElement("select");
        Object.keys(f.options).forEach(function (key) {
          var opt = document.createElement("option");
          opt.value = key;
          opt.textContent = f.options[key];
          input.appendChild(opt);
        });
      } else if (f.type === "checkbox") {
        input = document.createElement("input");
        input.type = "checkbox";
        input.checked = !!value;
      } else {
        input = document.createElement("input");
        input.type = "text";
      }

      input.dataset.key = f.k;
      input.dataset.type = f.type || "text";
      if (f.placeholder) input.placeholder = f.placeholder;
      if (input.type === "text" || input.tagName === "TEXTAREA" || input.tagName === "SELECT") {
        input.value = value == null ? "" : value;
      }
      wrap.appendChild(input);

      if (f.hint) {
        var hint = document.createElement("span");
        hint.className = "hint";
        hint.textContent = f.hint;
        wrap.appendChild(hint);
      }

      container.appendChild(wrap);
    });
  }

  function readFields(container) {
    var out = {};
    container.querySelectorAll("[data-key]").forEach(function (input) {
      var key = input.dataset.key;
      var type = input.dataset.type;
      if (type === "image") {
        out[key] = readImageField(input);
      } else if (type === "checkbox") {
        out[key] = input.checked;
      } else if (key === "cta_points") {
        out[key] = String(input.value).split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
      } else if (key === "typed") {
        out[key] = parseListValue(input.value);
      } else {
        out[key] = input.value.trim();
      }
    });
    return out;
  }

  /* ============================================================
     RENDER DAFTAR
     ============================================================ */
  function rowShell(mainHTML, badge) {
    return (
      '<div class="item-row">' +
      '<div class="item-main">' + mainHTML + "</div>" +
      (badge ? '<span class="item-badge">' + badge + "</span>" : "") +
      '<div class="item-actions">' +
      '<button class="mini-btn edit" data-act="edit" aria-label="Ubah"><i class="fa-solid fa-pen"></i></button>' +
      '<button class="mini-btn del" data-act="del" aria-label="Hapus"><i class="fa-solid fa-trash"></i></button>' +
      "</div></div>"
    );
  }

  function renderList(key) {
    var cfg = LIST_CONFIG[key];
    var listEl = $("#list-" + key);
    if (!listEl) return;

    var items = cfg.parent ? (state[cfg.parent][cfg.key] || []) : (state[cfg.key] || []);
    var countEl = $("#count-" + key);
    if (countEl) countEl.textContent = String(items.length).padStart(2, "0");

    if (!items.length) {
      listEl.innerHTML = '<li class="empty-hint">— kosong — Klik "Tambah" untuk membuat data.</li>';
      return;
    }

    if (key === "soft") {
      listEl.innerHTML = items.map(function (item, idx) {
        return (
          '<li class="tag-item" data-index="' + idx + '">' + esc(item) +
          '<button type="button" class="del" title="Hapus"><i class="fa-solid fa-xmark"></i></button></li>'
        );
      }).join("");
      return;
    }

    listEl.innerHTML = items.map(function (item, idx) {
      var main = "", badge = "";

      switch (key) {
        case "stats":
          main = "<span class='item-title'>" + esc(item.value) + "</span><span class='item-sub'>" + esc(item.label) + "</span>";
          break;
        case "hard":
          main = "<span class='item-title'>" + esc(item.name) + "</span><span class='item-sub'>" + esc(item.detail || "") + "</span>";
          badge = LEVELS[item.level] || "EXPERT";
          break;
        case "proyek":
          main = "<span class='item-title'>" + esc(item.title) + "</span><span class='item-sub'>" + esc(item.category) + " · " + esc(item.date || "") + "</span>";
          badge = String(idx + 1).padStart(2, "0");
          break;
        case "pengalaman":
          main = "<span class='item-title'>" + esc(item.title) + "</span><span class='item-sub'>" + esc(item.place || "") + " · " + esc(item.tag || "") + "</span>";
          break;
        case "sosmed":
          main = "<span class='item-title'>" + esc(item.name) + "</span><span class='item-sub'>" + esc(item.url || "") + "</span>";
          badge = '<i class="fa-brands ' + esc(item.icon || "fa-brands") + '"></i>';
          break;
      }

      return "<li data-index='" + idx + "'>" + rowShell(main, badge) + "</li>";
    }).join("");
  }

  function renderAll() {
    Object.keys(LIST_CONFIG).forEach(renderList);
  }

  /* ============================================================
     MODAL EDIT
     ============================================================ */
  var modal = $("#modal");
  var modalForm = $("#modal-form");
  var modalFields = $("#modal-fields");
  var modalState = null;

  function openModal(key, index) {
    var cfg = LIST_CONFIG[key];
    var items = cfg.parent ? (state[cfg.parent][cfg.key] || []) : (state[cfg.key] || []);
    var values = {};

    if (index != null && items[index] != null) {
      var src = items[index];
      if (cfg.string) {
        values.value = src;
      } else {
        Object.keys(src).forEach(function (k) { values[k] = src[k]; });
      }
    }

    modalState = { key: key, index: index };
    $("#modal-title").textContent = (index != null ? "UBAH " : "TAMBAH ") + cfg.title.toUpperCase();
    buildFields(modalFields, cfg.fields, values);
    modal.hidden = false;
  }

  function closeModal() {
    modal.hidden = true;
    modalState = null;
  }

  modalForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!modalState) return;

    var cfg = LIST_CONFIG[modalState.key];
    var items = cfg.parent ? (state[cfg.parent][cfg.key] || []) : (state[cfg.key] || []);
    var raw = readFields(modalFields);
    var item;

    if (cfg.string) {
      item = raw.value;
    } else {
      item = {};
      cfg.fields.forEach(function (f) {
        if (f.k === "tags") {
          item[f.k] = parseListValue(raw[f.k]);
        } else {
          item[f.k] = raw[f.k];
        }
      });
    }

    if (modalState.index != null) {
      items[modalState.index] = item;
    } else {
      items.push(item);
    }

    if (cfg.parent) state[cfg.parent][cfg.key] = items;
    else state[cfg.key] = items;

    save();
    renderAll();
    closeModal();
    toast("Tersimpan: " + cfg.title);
  });

  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-cancel").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- Aksi tambah / edit / hapus (delegasi) ---------- */
  document.addEventListener("click", function (e) {
    var addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      openModal(addBtn.getAttribute("data-add"));
      return;
    }

    var editBtn = e.target.closest(".mini-btn.edit");
    var delBtn = e.target.closest(".mini-btn.del, .tag-item .del");
    if (!editBtn && !delBtn) return;

    var row = e.target.closest("[data-index]");
    if (!row) return;
    var idx = Number(row.getAttribute("data-index"));
    var key = row.parentElement.id.replace("list-", "");
    var cfg = LIST_CONFIG[key];

    var items = cfg.parent ? (state[cfg.parent][cfg.key] || []) : (state[cfg.key] || []);

    if (delBtn) {
      items.splice(idx, 1);
      if (cfg.parent) state[cfg.parent][cfg.key] = items;
      else state[cfg.key] = items;
      save();
      renderAll();
      toast("Dihapus: " + cfg.title);
      return;
    }

    if (editBtn) {
      openModal(key, idx);
    }
  });

  /* ============================================================
     FORM OBJEK TUNGGAL (Home / Tentang / Kontak) — MERGE
     ============================================================ */
  function buildObjectFormFields() {
    buildFields($("#form-home .form-grid"), HOME_FIELDS, state.profile);
    buildFields($("#form-tentang .form-grid"), ABOUT_FIELDS, state.profile);
    buildFields($("#form-kontak .form-grid"), CONTACT_FIELDS, state.contact);
  }

  function deepMerge(base, patch) {
    var out = JSON.parse(JSON.stringify(base || {}));
    Object.keys(patch).forEach(function (k) { out[k] = patch[k]; });
    return out;
  }

  function showHint(id, msg) {
    var hint = $("#" + id);
    hint.classList.add("show");
    hint.textContent = msg || "Tersimpan ✓";
    setTimeout(function () { hint.classList.remove("show"); }, 1800);
  }

  function bindObjectForms() {
    $("#form-home").addEventListener("submit", function (e) {
      e.preventDefault();
      state.profile = deepMerge(state.profile, readFields(this.querySelector(".form-grid")));
      if (save()) { toast("Home diperbarui"); showHint("hint-home"); }
    });
    $("#form-tentang").addEventListener("submit", function (e) {
      e.preventDefault();
      state.profile = deepMerge(state.profile, readFields(this.querySelector(".form-grid")));
      if (save()) { toast("Tentang diperbarui"); showHint("hint-tentang"); }
    });
    $("#form-kontak").addEventListener("submit", function (e) {
      e.preventDefault();
      state.contact = deepMerge(state.contact, readFields(this.querySelector(".form-grid")));
      renderList("sosmed");
      if (save()) { toast("Kontak diperbarui"); showHint("hint-kontak"); }
    });
  }

  /* ============================================================
     NAVIGASI TAB
     ============================================================ */
  var TAB_TITLES = {
    home: "HOME", tentang: "TENTANG", skill: "SKILL",
    proyek: "PROYEK", pengalaman: "PENGALAMAN", kontak: "KONTAK",
    pesan: "PESAN MASUK",
  };

  function switchTab(name) {
    $all(".nav-item[data-tab]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-tab") === name);
    });
    $all(".panel").forEach(function (panel) {
      panel.classList.toggle("is-active", panel.id === "tab-" + name);
    });
    $("#page-title").textContent = TAB_TITLES[name] || name.toUpperCase();
    closeSidebar();
  }

  $all(".nav-item[data-tab]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      switchTab(btn.getAttribute("data-tab"));
    });
  });

  /* ---------- Sidebar mobile ---------- */
  var sidebar = $("#sidebar");
  var backdrop = $("#sidebarBackdrop");

  function openSidebar() {
    sidebar.classList.add("is-open");
    backdrop.classList.add("is-visible");
  }
  function closeSidebar() {
    sidebar.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
  }

  $("#hamburger").addEventListener("click", function () {
    sidebar.classList.contains("is-open") ? closeSidebar() : openSidebar();
  });
  backdrop.addEventListener("click", closeSidebar);

  /* ============================================================
     STATUS CLOUD
     ============================================================ */
  function setCloudStatus(mode) {
    var note = $("#storage-note");
    var badge = $("#sync-label");
    var dot = $("#statusDot");
    var publish = $("#publishBtn");
    if (!badge && !dot) return;

    if (mode === "ok") {
      if (note) note.innerHTML = "<i class='fa-solid fa-cloud'></i><span>Tersimpan di cloud</span>";
      if (badge) badge.textContent = "Cloud aktif";
      if (dot) { dot.className = "sync-dot ok"; }
      if (publish) { publish.disabled = false; }
    } else if (mode === "sync") {
      if (note) note.innerHTML = "<i class='fa-solid fa-rotate'></i><span>Menghubungkan cloud…</span>";
      if (badge) badge.textContent = "Menyimpan…";
      if (dot) { dot.className = "sync-dot sync"; }
      if (publish) { publish.disabled = true; }
    } else {
      if (note) note.innerHTML = "<i class='fa-solid fa-hard-drive'></i><span>Penyimpanan lokal (browser)</span>";
      if (badge) badge.textContent = "Cloud di luar jangkauan";
      if (dot) { dot.className = "sync-dot off"; }
      if (publish) { publish.disabled = false; }
    }
  }

  /* ============================================================
     SAVE KE CLOUD
     ============================================================ */
  function cloudSave() {
    if (!BACKEND_URL) return Promise.resolve(null);
    var key = adminKey();
    if (!key) { openLoginGate(); return Promise.resolve(null); }
    setCloudStatus("sync");
    return fetch(BACKEND_URL + "?action=save&key=" + encodeURIComponent(key), {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "save", key: key, data: state }),
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.ok) { setCloudStatus("ok"); toast("Terbit — data tersimpan di cloud"); }
        else { setCloudStatus("off"); toast("Cloud: " + (res.error || "gagal")); }
        return res;
      })
      .catch(function () {
        setCloudStatus("off");
        toast("Cloud tidak terjangkau — tersimpan lokal");
        return null;
      });
  }

  var cloudSaveTask = false;
  function scheduleCloudSave() {
    if (cloudSaveTask) return;
    cloudSaveTask = true;
    setTimeout(function () {
      cloudSaveTask = false;
      if (adminKey()) cloudSave();
      else setCloudStatus("off");
    }, 400);
  }

  function publishNow() {
    if (!isAuthed()) { openLoginGate(); return; }
    setCloudStatus("sync");
    cloudSave().then(function (res) {
      if (res && res.ok) {
        toast("Terbit — versi live web sudah sinkron");
        fetchMessages();
      }
    });
  }

  /* ============================================================
     AKSI SAMPING (publish)
     ============================================================ */
  $("#publishBtn").addEventListener("click", publishNow);

  /* ============================================================
     GERBANG SANDI — keamanan ketat
     (pembatasan percobaan login + kunci otomatis saat idle)
     ============================================================ */
  var LOGIN_MAX_ATTEMPTS = 5;
  var IDLE_TIMEOUT = 15 * 60 * 1000;
  var failCount = 0;
  var lockUntil = 0;
  var idleTimer = null;

  function openLoginGate(message) {
    var gate = $("#loginGate");
    if (!gate) return;
    gate.hidden = false;
    var hint = $("#login-hint");
    if (message && hint) hint.textContent = message;
    setTimeout(function () {
      var inp = $("#login-key");
      if (inp && typeof inp.focus === "function") inp.focus();
    }, 50);
  }

  function closeLoginGate() {
    var gate = $("#loginGate");
    if (gate) gate.hidden = true;
  }

  /** Kunci otomatis bila admin tidak aktif selama IDLE_TIMEOUT. */
  function armIdleTimer() {
    if (!isAuthed()) return;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      if (!isAuthed()) return;
      setAdminKey("");
      toast("Panel dikunci — tidak ada aktivitas");
      openLoginGate("Sesi berakhir karena tidak ada aktivitas. Masukkan sandi lagi.");
    }, IDLE_TIMEOUT);
  }

  ["mousemove", "keydown", "click", "touchstart", "scroll"].forEach(function (ev) {
    document.addEventListener(ev, armIdleTimer, { passive: true });
  });

  document.addEventListener("DOMContentLoaded", function () {
    var loginForm = $("#login-form");
    if (!loginForm) return;
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var now = Date.now();
      var hint = $("#login-hint");
      if (!hint) return;

      if (now < lockUntil) {
        hint.textContent = "Terlalu banyak percobaan. Coba lagi dalam " + Math.ceil((lockUntil - now) / 1000) + " detik.";
        return;
      }

      var k = $("#login-key").value.trim();
      if (!k) {
        hint.textContent = "Sandi harus diisi dulu.";
        return;
      }

      hint.textContent = "Memeriksa…";
      setAdminKey(k);
      cloudSave().then(function (res) {
        if (res && res.ok) {
          failCount = 0;
          lockUntil = 0;
          closeLoginGate();
          $("#login-key").value = "";
          toast("Panel dibuka — selamat bekerja");
          syncFromCloud();
          fetchMessages();
          armIdleTimer();
        } else {
          setAdminKey("");
          failCount++;
          if (failCount >= LOGIN_MAX_ATTEMPTS) {
            var wait = Math.min(30 * failCount, 300);
            lockUntil = Date.now() + wait * 1000;
            hint.textContent = "Sandi salah. Terkunci " + wait + " detik karena terlalu banyak percobaan.";
          } else {
            hint.textContent = "Sandi salah atau cloud tidak terjangkau.";
          }
        }
      });
    });
  });

  /* ============================================================
     PESAN MASUK (tombol "Send Data" di web utama)
     ============================================================ */
  var messages = [];
  var msgCloud = false;

  function loadLocalMsgs() {
    try {
      var list = JSON.parse(localStorage.getItem(MSG_STORAGE_KEY));
      return Array.isArray(list) ? list : [];
    } catch (err) { return []; }
  }
  function persistMsgs() {
    try { localStorage.setItem(MSG_STORAGE_KEY, JSON.stringify(messages)); } catch (err) { /* abaikan */ }
  }

  function fetchMessages() {
    if (!BACKEND_URL || !adminKey()) {
      messages = loadLocalMsgs();
      msgCloud = false;
      renderMessages();
      return;
    }
    fetch(BACKEND_URL + "?action=read_messages&key=" + encodeURIComponent(adminKey()))
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok && Array.isArray(res.messages)) {
          var local = loadLocalMsgs();
          if (!res.messages.length && local.length) {
            messages = local;
            msgCloud = false;
            toast("Cloud kosong — menampilkan pesan lokal yang belum terkirim");
          } else {
            messages = res.messages;
            msgCloud = true;
          }
          persistMsgs();
          renderMessages();
        } else {
          messages = loadLocalMsgs();
          msgCloud = false;
          renderMessages();
        }
      })
      .catch(function () {
        messages = loadLocalMsgs();
        msgCloud = false;
        renderMessages();
      });
  }

  function cloudMsgOp(payload) {
    if (!BACKEND_URL || !adminKey()) return Promise.resolve(null);
    return fetch(BACKEND_URL + "?action=" + payload.action + "&key=" + encodeURIComponent(adminKey()), {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    })
      .then(function (r) { return r.json(); })
      .catch(function () { return null; });
  }

  function renderMessages() {
    var listEl = $("#list-pesan");
    if (!listEl) return;
    var countEl = $("#count-pesan");
    var badgeEl = $("#nav-pesan-count");
    var items = messages || [];

    if (countEl) countEl.textContent = String(items.length).padStart(2, "0");
    var unread = items.filter(function (m) { return !m.read; }).length;
    if (badgeEl) {
      badgeEl.textContent = unread ? String(unread) : "";
      badgeEl.classList.toggle("show", unread > 0);
    }

    if (!items.length) {
      listEl.innerHTML = '<li class="empty-hint">— kosong — belum ada pesan dari pengunjung.</li>';
      return;
    }

    listEl.innerHTML = items.map(function (m) {
      var d = new Date(m.at || Date.now());
      var time = isNaN(d.getTime()) ? "" : d.toLocaleString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
      return (
        '<li class="msg-row' + (m.read ? "" : " unread") + '" data-id="' + esc(m.id) + '">' +
        '<div class="msg-main">' +
        '<span class="msg-name">' + esc(m.name) + ' <span class="msg-num">' + esc(m.number || "") + "</span></span>" +
        '<span class="msg-body">' + esc(m.msg || "") + "</span>" +
        '<span class="msg-time mono">' + esc(time) +
        (msgCloud ? "" : ' · <span class="msg-unread-tag">LOKAL</span>') +
        (m.read ? "" : ' · <span class="msg-unread-tag">BELUM DIBACA</span>') +
        "</span>" +
        "</div>" +
        '<div class="item-actions">' +
        '<button class="mini-btn" data-msgact="read" title="' + (m.read ? "Tandai belum dibaca" : "Tandai dibaca") + '"><i class="fa-solid ' + (m.read ? "fa-eye-slash" : "fa-eye") + '"></i></button>' +
        '<button class="mini-btn del" data-msgact="del" title="Hapus"><i class="fa-solid fa-trash"></i></button>' +
        "</div></li>"
      );
    }).join("");
  }

  $("#refreshMsgBtn").addEventListener("click", fetchMessages);

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-msgact]");
    if (!btn) return;
    var row = e.target.closest("[data-id]");
    if (!row) return;
    var id = row.getAttribute("data-id");
    var act = btn.getAttribute("data-msgact");

    if (act === "del") {
      cloudMsgOp({ action: "delete_message", id: id }).then(function (res) {
        var idx = messages.findIndex(function (m) { return m.id === id; });
        if (idx > -1) { messages.splice(idx, 1); persistMsgs(); renderMessages(); }
        if (res && res.ok) toast("Pesan dihapus");
        else toast("Dihapus lokal (cloud tidak terjangkau)");
      });
      return;
    }

    if (act === "read") {
      var msg = messages.find(function (m) { return m.id === id; });
      if (!msg) return;
      var next = !msg.read;
      msg.read = next;
      persistMsgs();
      renderMessages();
      cloudMsgOp({ action: "mark_message_read", id: id, read: next });
    }
  });

  /* ============================================================
     START
     ============================================================ */
  document.addEventListener("DOMContentLoaded", function () {
    buildObjectFormFields();
    bindObjectForms();
    renderAll();
    syncFromCloud();
    fetchMessages();
    if (!isAuthed()) openLoginGate();
  });
})();