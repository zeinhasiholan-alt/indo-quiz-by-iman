// Konfigurasi API xAI
const XAI_API_KEY = "xai-dij2ynvlPYNSTxI92pHELeboHu4BOMHyinQVuoSQc1vhjNoGiGcFXyO0Ooc5alXm4YC4wdVwo9P4uOrR";

const L = ['A','B','C','D'];
let qs = [], idx = 0, score = 0, cor = 0, wrg = 0, answered = false, tmr, tLeft = 20, selCat = 'semua';

// Fungsi utama untuk memanggil AI
async function fetchAIQuestions() {
    const qText = document.getElementById('q-text');
    const og = document.getElementById('opts');
    
    qText.textContent = "🤖 AI sedang mencari ide pertanyaan baru...";
    og.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--t3);">Menghubungkan ke otak digital...</div>';
    
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
                        content: `Kamu adalah mesin pembuat kuis profesional. 
                        TUGAS: Berikan 5 soal pilihan ganda yang UNIK, KREATIF, dan BELUM PERNAH diberikan sebelumnya.
                        TOPIK: ${selCat}.
                        FORMAT WAJIB: JSON murni (array of objects). 
                        STRUKTUR: [{"cat": "${selCat}", "q": "pertanyaan", "opts": ["A", "B", "C", "D"], "ans": 0, "hint": "petunjuk singkat"}].
                        PANTANGAN: Jangan berikan teks pembuka atau penutup. Hanya JSON.`
                    }
                ],
                temperature: 0.9 // Meningkatkan kreativitas agar pertanyaan selalu baru
            })
        });

        const data = await response.json();
        
        // Membersihkan data dari karakter aneh (Markdown)
        let rawContent = data.choices[0].message.content;
        rawContent = rawContent.replace(/```json|```/g, "").trim();
        
        const aiData = JSON.parse(rawContent);
        
        // Pastikan kita mendapatkan array soal
        qs = Array.isArray(aiData) ? aiData : (aiData.questions || aiData.soal);
        
        idx = 0;
        load();
        
    } catch (e) {
        console.error("AI Error:", e);
        qText.textContent = "❌ AI sedang sibuk atau API Key bermasalah. Klik 'Main Lagi' untuk mencoba ulang.";
        og.innerHTML = "";
    }
}

// Logika Game (Tetap mempertahankan fungsi asli Anda)
function setCat(c, el) {
    selCat = c;
    document.querySelectorAll('.chip').forEach(b => b.classList.remove('on'));
    el.classList.add('on');
    restart();
}

function start() {
    score = 0; cor = 0; wrg = 0; upd();
    document.getElementById('result').classList.remove('show');
    document.getElementById('gcard').classList.remove('gone');
    fetchAIQuestions(); 
}

function load() {
    if (!qs || idx >= qs.length) return;
    answered = false;
    const q = qs[idx];
    
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
        btns[i].classList.add('wrong'); 
        btns[q.ans].classList.add('correct'); 
        wrg++;
        setFb(false, `❌ Salah!`);
    }
    upd(); document.getElementById('btn-next').disabled = false;
}

function setFb(ok, msg) { 
    const fb = document.getElementById('fb'); 
    fb.className = 'fb ' + (ok ? 'ok' : 'bad'); 
    document.getElementById('fb-txt').textContent = msg; 
}

function showHint() { document.getElementById('hint-box').classList.toggle('show'); }
function next() { idx++; if(idx < qs.length) { load(); } else { showResult(); } }
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
    const h = document.documentElement, dark = h.getAttribute('data-theme') === 'dark';
    h.setAttribute('data-theme', dark ? 'light' : 'dark');
    document.getElementById('tlabel').textContent = dark ? '🌙 Gelap' : '☀️ Terang';
}

// Inisialisasi awal
start();
