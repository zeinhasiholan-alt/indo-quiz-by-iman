const ALL = [
    { cat: 'umum', q: 'Ibu kota negara Indonesia adalah...', opts: ['Jakarta', 'Surabaya', 'Bandung', 'Medan'], ans: 0, hint: 'Kota ini di Pulau Jawa bagian barat laut.' },
    { cat: 'umum', q: 'Apa warna bendera Indonesia?', opts: ['Merah Putih', 'Biru Putih', 'Merah Biru', 'Merah Hijau'], ans: 0, hint: 'Sama seperti bendera Monaco.' },
    { cat: 'umum', q: 'Berapa jumlah planet di tata surya kita?', opts: ['7', '8', '9', '10'], ans: 1, hint: 'Pluto tidak dihitung sejak 2006.' },
    { cat: 'sains', q: 'Gas paling banyak di atmosfer Bumi adalah...', opts: ['Oksigen', 'Karbon dioksida', 'Nitrogen', 'Argon'], ans: 2, hint: 'Sekitar 78% dari udara yang kita hirup.' },
    { cat: 'sains', q: 'Apa rumus kimia air?', opts: ['CO₂', 'H₂O', 'NaCl', 'O₂'], ans: 1, hint: '2 atom hidrogen + 1 atom oksigen.' },
    { cat: 'sains', q: 'Organ yang memompa darah ke seluruh tubuh...', opts: ['Paru-paru', 'Ginjal', 'Jantung', 'Hati'], ans: 2, hint: 'Berdetak 60–100 kali per menit.' },
    { cat: 'sains', q: 'Kecepatan cahaya kira-kira...', opts: ['300.000 km/s', '150.000 km/s', '500.000 km/s', '1 juta km/s'], ans: 0, hint: 'Tidak ada yang bisa melampaui ini.' },
    { cat: 'sejarah', q: 'Indonesia merdeka pada tahun...', opts: ['1942', '1945', '1949', '1950'], ans: 1, hint: 'Tepat setelah Jepang menyerah kepada Sekutu.' },
    { cat: 'sejarah', q: 'Presiden pertama Indonesia adalah...', opts: ['Soeharto', 'Soekarno', 'Habibie', 'Wahid'], ans: 1, hint: 'Beliau membacakan teks proklamasi kemederkaan.' },
    { cat: 'sejarah', q: 'Perang Dunia II berakhir pada tahun...', opts: ['1943', '1944', '1945', '1946'], ans: 2, hint: 'Amerika menjatuhkan bom atom di Jepang tahun ini.' },
    { cat: 'bahasa', q: 'Antonim dari kata "besar" adalah...', opts: ['Tinggi', 'Kecil', 'Jauh', 'Berat'], ans: 1, hint: 'Lawan kata sifat ukuran dominan.' },
    { cat: 'bahasa', q: 'Kata "apel" dalam bahasa Inggris adalah...', opts: ['Orange', 'Mango', 'Apple', 'Grape'], ans: 2, hint: 'Berkaitan dengan legenda Isaac Newton.' },
    { cat: 'bahasa', q: 'Sinonim dari kata "bijaksana" adalah...', opts: ['Pintar', 'Arif', 'Cantik', 'Kuat'], ans: 1, hint: 'Sering disandangkan dengan kata "bestari".' },
    { cat: 'budaya', q: 'Tari Kecak berasal dari daerah...', opts: ['Jawa', 'Sumatera', 'Bali', 'Kalimantan'], ans: 2, hint: 'Tarian ini menggambarkan kisah Ramayana.' },
    { cat: 'budaya', q: 'Batik diakui UNESCO pada tahun...', opts: ['2005', '2007', '2009', '2011'], ans: 2, hint: 'Membuat 2 Oktober menjadi Hari Batik Nasional.' },
    { cat: 'budaya', q: 'Alat musik angklung berasal dari...', opts: ['Jawa Tengah', 'Jawa Barat', 'Sumatera Barat', 'Sulawesi'], ans: 1, hint: 'Terbuat dari bambu, dimainkan dengan digoyangkan.' },
];

const L = ['A', 'B', 'C', 'D'];
let qs = [], idx = 0, score = 0, cor = 0, wrg = 0, answered = false, tmr, tLeft = 20, selCat = 'semua';

function setCat(c, el) {
    selCat = c;
    document.querySelectorAll('.chip').forEach(b => b.classList.remove('on'));
    el.classList.add('on');
    restart();
}

function shuffle(a) { return [...a].sort(() => Math.random() - .5); }

function start() {
    let pool = selCat === 'semua' ? ALL : ALL.filter(q => q.cat === selCat);
    qs = shuffle(pool).slice(0, Math.min(10, pool.length));
    idx = 0; score = 0; cor = 0; wrg = 0; upd();
    document.getElementById('result').classList.remove('show');
    document.getElementById('gcard').classList.remove('gone');
    load();
}

function load() {
    if (idx >= qs.length) { showResult(); return; }
    answered = false;
    const q = qs[idx];
    document.getElementById('q-num').textContent = `SOAL ${String(idx + 1).padStart(2, '0')}`;
    document.getElementById('q-text').textContent = q.q;
    document.getElementById('hint-box').textContent = '💡 ' + q.hint;
    document.getElementById('hint-box').classList.remove('show');
    document.getElementById('cat-badge').textContent = q.cat.toUpperCase();
    document.getElementById('prog-txt').textContent = `${idx + 1}/${qs.length}`;
    document.getElementById('prog').style.width = `${((idx + 1) / qs.length) * 100}%`;
    document.getElementById('btn-next').disabled = true;
    document.getElementById('fb').className = 'fb';

    const og = document.getElementById('opts');
    og.innerHTML = '';
    q.opts.forEach((o, i) => {
        const b = document.createElement('button');
        b.className = 'opt';
        b.innerHTML = `<span class="opt-ltr">${L[i]}</span>${o}`;
        b.onclick = () => pick(i);
        og.appendChild(b);
    });
    startTimer();
}

function startTimer() {
    clearInterval(tmr); tLeft = 20;
    const bar = document.getElementById('tbar'); bar.style.width = '100%';
    tmr = setInterval(() => {
        tLeft--; bar.style.width = `${(tLeft / 20) * 100}%`;
        if (tLeft <= 0) { clearInterval(tmr); if (!answered) timeUp(); }
    }, 1000);
}

function timeUp() {
    answered = true;
    document.querySelectorAll('.opt').forEach((b, i) => { b.disabled = true; if (i === qs[idx].ans) b.classList.add('correct'); });
    setFb(false, '⏰ Waktu habis! Jawaban benar sudah ditandai.');
    wrg++; upd(); document.getElementById('btn-next').disabled = false;
}

function pick(i) {
    if (answered) return;
    answered = true; clearInterval(tmr);
    const q = qs[idx];
    const btns = document.querySelectorAll('.opt');
    btns.forEach(b => b.disabled = true);
    if (i === q.ans) {
        btns[i].classList.add('correct');
        const pts = Math.max(10, tLeft * 5); score += pts; cor++;
        setFb(true, `✅ Benar! +${pts} poin`);
    } else {
        btns[i].classList.add('wrong'); btns[q.ans].classList.add('correct'); wrg++;
        setFb(false, `❌ Salah! Jawaban: ${q.opts[q.ans]}`);
    }
    upd(); document.getElementById('btn-next').disabled = false;
}

function setFb(ok, msg) { const fb = document.getElementById('fb'); fb.className = 'fb ' + (ok ? 'ok' : 'bad'); document.getElementById('fb-txt').textContent = msg; }
function showHint() { document.getElementById('hint-box').classList.toggle('show'); }
function next() { idx++; load(); }
function upd() { document.getElementById('sv-score').textContent = score; document.getElementById('sv-cor').textContent = cor; document.getElementById('sv-wrg').textContent = wrg; }

function showResult() {
    clearInterval(tmr);
    document.getElementById('gcard').classList.add('gone');
    document.getElementById('result').classList.add('show');
    const acc = qs.length ? Math.round((cor / qs.length) * 100) : 0;
    document.getElementById('r-score').textContent = score;
    document.getElementById('rv-c').textContent = cor;
    document.getElementById('rv-w').textContent = wrg;
    document.getElementById('rv-a').textContent = acc + '%';
    let e = '😅', t = 'LUMAYAN!', s = 'Terus berlatih ya!';
    if (acc >= 90) { e = '🏆'; t = 'LUAR BIASA!'; s = 'Kamu jenius!'; }
    else if (acc >= 70) { e = '🎯'; t = 'BAGUS SEKALI!'; s = 'Hampir sempurna!'; }
    else if (acc >= 50) { e = '👍'; t = 'CUKUP BAIK!'; s = 'Bisa ditingkatkan!'; }
    document.getElementById('r-emoji').textContent = e;
    document.getElementById('r-title').textContent = t;
    document.getElementById('r-sub').textContent = s;
}

function restart() { start(); }
function toggleTheme() {
    const h = document.documentElement, dark = h.getAttribute('data-theme') === 'dark';
    h.setAttribute('data-theme', dark ? 'light' : 'dark');
    document.getElementById('tlabel').textContent = dark ? '🌙 Gelap' : '☀️ Terang';
}

start();
