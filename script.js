/**
 * Proyek: Indo Quiz AI
 * Developer: Iman Firman
 * Fitur: Auto-Update Questions via OpenTDB API (Gratis & Tanpa API Key)
 */

const L = ['A', 'B', 'C', 'D'];
let qs = [], idx = 0, score = 0, cor = 0, wrg = 0, answered = false, tmr, tLeft = 20, selCat = 'semua';

// 1. Fungsi Mengambil Soal dari Database Global (OpenTDB)
async function fetchAIQuestions() {
    const qText = document.getElementById('q-text');
    const og = document.getElementById('opts');
    
    qText.textContent = "🌐 Mengambil soal terbaru untukmu...";
    og.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--t3); padding: 20px;">Menghubungkan ke pusat data...</div>';
    
    // Pemetaan kategori ke ID OpenTDB
    const catMap = {
        'umum': 9,      // General Knowledge
        'sains': 17,    // Science & Nature
        'sejarah': 23,  // History
        'geografi': 22, // Geography
        'budaya': 24,   // Politics/Art
        'bahasa': 10    // Entertainment: Books/Language
    };
    
    const catId = catMap[selCat] || 9;

    try {
        // Mengambil 5 soal acak
        const response = await fetch(`https://opentdb.com/api.php?amount=5&category=${catId}&type=multiple`);
        const data = await response.json();

        if (data.response_code !== 0) throw new Error("Server sibuk");

        // Format data agar sesuai dengan struktur game kamu
        qs = data.results.map(item => {
            const allOpts = [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5);
            const correctIdx = allOpts.indexOf(item.correct_answer);

            return {
                cat: selCat,
                q: decodeHTML(item.question), 
                opts: allOpts.map(o => decodeHTML(o)),
                ans: correctIdx,
                hint: "Ini adalah soal pengetahuan umum tingkat global."
            };
        });

        idx = 0;
        load();
        
    } catch (e) {
        console.error("Fetch Error:", e);
        qText.textContent = "❌ Gagal memuat soal. Pastikan internet aktif dan coba lagi.";
        og.innerHTML = '<button class="btn-restart" onclick="restart()">Coba Lagi</button>';
    }
}

// 2. Fungsi Menjalankan Game
function start() {
    score = 0; cor = 0; wrg = 0; upd();
    document.getElementById('result').classList.remove('show');
    document.getElementById('gcard').classList.remove('gone');
    fetchAIQuestions(); 
}

function load() {
    if (!qs || idx >= qs.length) { showResult(); return; }
    answered = false;
    const q = qs[idx];
    
    // Update UI
    document.getElementById('q-num').textContent = `SOAL ${String(idx + 1).padStart(2, '0')}`;
    document.getElementById('q-text').textContent = q.q;
    document.getElementById('hint-box').textContent = '💡 ' + q.hint;
    document.getElementById('hint-box').classList.remove('show');
    document.getElementById('cat-badge').textContent = (q.cat || selCat).toUpperCase();
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

// 3. Sistem Timer
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
    document.querySelectorAll('.opt').forEach((b, i) => { 
        b.disabled = true; 
        if (i === qs[idx].ans) b.classList.add('correct'); 
    });
    setFb(false, '⏰ Waktu habis!');
    wrg++; upd(); 
    document.getElementById('btn-next').disabled = false;
}

// 4. Logika Jawaban
function pick(i) {
    if (answered) return;
    answered = true; clearInterval(tmr);
    const q = qs[idx];
    const btns = document.querySelectorAll('.opt');
    btns.forEach(b => b.disabled = true);

    if (i === q.ans) {
        btns[i].classList.add('correct');
        const bonus = Math.max(10, tLeft * 5); 
        score += bonus; cor++;
        setFb(true, `✅ Benar! +${bonus} Poin`);
    } else {
        btns[i].classList.add('wrong'); 
        btns[q.ans].classList.add('correct'); 
        wrg++;
        setFb(false, `❌ Salah!`);
    }
    upd(); 
    document.getElementById('btn-next').disabled = false;
}

// 5. Utility & UI Helper
function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function setCat(c, el) {
    selCat = c;
    document.querySelectorAll('.chip').forEach(b => b.classList.remove('on'));
    el.classList.add('on');
    restart();
}

function setFb(ok, msg) { 
    const fb = document.getElementById('fb'); 
    fb.className = 'fb ' + (ok ? 'ok' : 'bad'); 
    document.getElementById('fb-txt').textContent = msg; 
}

function showHint() { document.getElementById('hint-box').classList.toggle('show'); }
function next() { idx++; load(); }
function upd() { 
    document.getElementById('sv-score').textContent = score; 
    document.getElementById('sv-cor').textContent = cor; 
    document.getElementById('sv-wrg').textContent = wrg; 
}

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
    const h = document.documentElement;
    const isDark = h.getAttribute('data-theme') === 'dark';
    h.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('tlabel').textContent = isDark ? '🌙 Gelap' : '☀️ Terang';
}

// Jalankan aplikasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', start);
