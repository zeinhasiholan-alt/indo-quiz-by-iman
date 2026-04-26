/**
 * Indo Quiz AI - Core Logic
 * Developer: Iman Firman
 * API: Groq Cloud Llama 3
 */

const GROQ_KEY = "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";

let questions = [];
let currentIndex = 0;
let score = 0;
let corrects = 0;
let timeLeft = 20;
let timer;

// -- 1. Ambil Soal dari AI Groq --
async function fetchQuestions() {
    const qText = document.getElementById('q-text');
    const optsGrid = document.getElementById('opts-grid');
    
    qText.innerHTML = `<span style="color:var(--accent)">🤖 Groq AI sedang merancang soal untukmu...</span>`;
    optsGrid.innerHTML = '';
    document.getElementById('cat-badge').textContent = "AI GENERATING";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [{
                    role: "system",
                    content: `Buat 10 soal kuis pilihan ganda Indonesia bertema Umum/Teknologi. 
                    HANYA berikan JSON array: [{"q":"soal","a":["p1","p2","p3","p4"],"c":index_benar,"h":"petunjuk"}]`
                }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Membersihkan string jika AI memberikan teks tambahan di luar JSON
        const cleanJson = content.substring(content.indexOf("["), content.lastIndexOf("]") + 1);
        questions = JSON.parse(cleanJson);

        currentIndex = 0;
        loadQuestion();

    } catch (err) {
        console.error(err);
        qText.innerHTML = "❌ Gagal memuat AI. Klik 'Main Lagi' untuk mencoba ulang.";
    }
}

// -- 2. Tampilkan Soal --
function loadQuestion() {
    if (currentIndex >= questions.length) {
        showResults();
        return;
    }

    const q = questions[currentIndex];
    const optsGrid = document.getElementById('opts-grid');
    const btnNext = document.getElementById('btn-next');
    const fb = document.getElementById('fb-toast');

    // UI Reset
    fb.textContent = "";
    btnNext.disabled = true;
    document.getElementById('hint-msg').style.display = 'none';
    document.getElementById('q-text').textContent = q.q;
    document.getElementById('cat-badge').textContent = "GROQ AI LIVE";
    document.getElementById('prog-text').textContent = `${currentIndex + 1}/${questions.length}`;
    document.getElementById('prog-fill').style.width = `${((currentIndex + 1) / questions.length) * 100}%`;

    optsGrid.innerHTML = '';
    q.a.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(index, btn);
        optsGrid.appendChild(btn);
    });

    startTimer();
}

// -- 3. Logika Timer --
function startTimer() {
    clearInterval(timer);
    timeLeft = 20;
    const line = document.getElementById('t-line');
    line.style.width = '100%';
    line.style.transition = 'none';

    setTimeout(() => {
        line.style.transition = 'width 20s linear';
        line.style.width = '0%';
    }, 50);

    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

// -- 4. Cek Jawaban --
function checkAnswer(idx, btn) {
    clearInterval(timer);
    const q = questions[currentIndex];
    const btns = document.querySelectorAll('.opt-btn');
    const fb = document.getElementById('fb-toast');

    btns.forEach(b => b.disabled = true);

    if (idx === q.c) {
        btn.classList.add('correct');
        const bonus = 10 + timeLeft;
        score += bonus;
        corrects++;
        fb.innerHTML = `<span style="color:var(--success)">✨ BENAR! +${bonus}</span>`;
    } else {
        btn.classList.add('wrong');
        btns[q.c].classList.add('correct');
        fb.innerHTML = `<span style="color:var(--error)">❌ SALAH</span>`;
    }

    updateStats();
    document.getElementById('btn-next').disabled = false;
}

function handleTimeout() {
    const q = questions[currentIndex];
    const btns = document.querySelectorAll('.opt-btn');
    btns.forEach(b => b.disabled = true);
    btns[q.c].classList.add('correct');
    document.getElementById('fb-toast').innerHTML = `<span style="color:var(--error)">⏰ WAKTU HABIS</span>`;
    document.getElementById('btn-next').disabled = false;
}

// -- 5. Helpers --
function updateStats() {
    document.getElementById('sv-score').textContent = score;
    const acc = Math.round((corrects / (currentIndex + 1)) * 100);
    document.getElementById('sv-acc').textContent = acc + '%';
}

function nextQuestion() {
    currentIndex++;
    loadQuestion();
}

function toggleHint() {
    const hint = document.getElementById('hint-msg');
    hint.textContent = questions[currentIndex].h;
    hint.style.display = hint.style.display === 'none' ? 'block' : 'none';
}

function showResults() {
    document.getElementById('quiz-box').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('rv-cor').textContent = corrects;
    document.getElementById('rv-wrg').textContent = 10 - corrects;
    document.getElementById('rv-score').textContent = score;
}

function restartGame() {
    score = 0; corrects = 0; currentIndex = 0;
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('quiz-box').style.display = 'block';
    updateStats();
    fetchQuestions();
}

function openDevModal() { document.getElementById('dev-modal').style.display = 'grid'; }
function closeDevModal() { document.getElementById('dev-modal').style.display = 'none'; }
function toggleTheme() {
    const html = document.documentElement;
    html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

// Jalankan saat startup
document.addEventListener('DOMContentLoaded', fetchQuestions);
