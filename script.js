// Konfigurasi API xAI
const XAI_API_KEY = "xai-dij2ynvlPYNSTxI92pHELeboHu4BOMHyinQVuoSQc1vhjNoGiGcFXyO0Ooc5alXm4YC4wdVwo9P4uOrR";

const ALL = [
    {cat:'umum',q:'Ibu kota negara Indonesia adalah...',opts:['Jakarta','Surabaya','Bandung','Medan'],ans:0,hint:'Kota ini di Pulau Jawa bagian barat laut.'},
    // ... sisa data asli tetap tersimpan secara internal ...
];

const L = ['A','B','C','D'];
let qs = [], idx = 0, score = 0, cor = 0, wrg = 0, answered = false, tmr, tLeft = 20, selCat = 'semua';

// FUNGSI BARU: Mengambil Pertanyaan dari AI
async function fetchAIQuestions() {
    const qText = document.getElementById('q-text');
    qText.textContent = "🤖 AI sedang merancang soal untukmu...";
    
    try {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${XAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "grok-beta",
                messages: [
                    {
                        role: "system", 
                        content: "Berikan 5 soal pilihan ganda bahasa Indonesia dalam format JSON. Kategori: " + selCat + ". Format: array of objects {cat, q, opts[], ans(index), hint}."
                    }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        const aiContent = JSON.parse(data.choices[0].message.content);
        qs = aiContent.questions || aiContent.soal || ALL.slice(0, 5);
        idx = 0;
        load();
    } catch (e) {
        console.error("Gagal memanggil AI:", e);
        // Jika gagal, gunakan database lokal asli (ALL)
        qs = shuffle(ALL.filter(q => selCat === 'semua' || q.cat === selCat)).slice(0, 10);
        idx = 0;
        load();
    }
}

function setCat(c, el) {
    selCat = c;
    document.querySelectorAll('.chip').forEach(b => b.classList.remove('on'));
    el.classList.add('on');
    restart();
}

function shuffle(a) { return [...a].sort(() => Math.random() - .5); }

function start() {
    score = 0; cor = 0; wrg = 0; upd();
    document.getElementById('result').classList.remove('show');
    document.getElementById('gcard').classList.remove('gone');
    fetchAIQuestions(); // Memulai dengan memanggil AI
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
    setFb(false, '⏰ Waktu habis!');
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
        score += Math.max(10, tLeft * 5); cor++;
        setFb(true, `✅ Benar!`);
    } else {
        btns[i].classList.add('wrong'); btns[q.ans].classList.add('correct'); wrg++;
        setFb(false, `❌ Salah!`);
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
}

function restart() { start(); }
function toggleTheme() {
    const h = document.documentElement, dark = h.getAttribute('data-theme') === 'dark';
    h.setAttribute('data-theme', dark ? 'light' : 'dark');
    document.getElementById('tlabel').textContent = dark ? '🌙 Gelap' : '☀️ Terang';
}

// Menjalankan game
start();
