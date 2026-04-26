/**
 * Indo Quiz AI - Offline Master Edition
 * Created with Passion by Iman Firman
 */

const questions = [
    {
        q: "Siapakah pendiri utama perusahaan teknologi Microsoft?",
        a: ["Steve Jobs", "Elon Musk", "Bill Gates", "Jeff Bezos"],
        c: 2,
        h: "Ia adalah salah satu orang terkaya di dunia yang fokus pada filantropi sekarang."
    },
    {
        q: "Apa nama mesin pencari yang paling populer saat ini?",
        a: ["Yahoo", "Bing", "Google", "DuckDuckGo"],
        c: 2,
        h: "Namanya berasal dari istilah matematika 'Googol'."
    },
    {
        q: "Dalam dunia coding, apa kepanjangan dari HTML?",
        a: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyper Tool Multi Logic", "Home Tool Markup Link"],
        c: 0,
        h: "Bahasa standar untuk membuat struktur halaman web."
    },
    {
        q: "Manakah bahasa pemrograman yang sering digunakan untuk AI dan Data Science?",
        a: ["PHP", "JavaScript", "Python", "C++"],
        c: 2,
        h: "Namanya mirip dengan spesies ular besar."
    },
    {
        q: "Tahun berapa Indonesia merdeka?",
        a: ["1944", "1945", "1946", "1942"],
        c: 1,
        h: "Bulan Agustus, tanggal tujuh belas."
    },
    {
        q: "Platform cloud hosting mana yang logonya berbentuk segitiga putih?",
        a: ["Vercel", "Netlify", "GitHub", "AWS"],
        c: 0,
        h: "Platform yang sangat populer untuk mendeploy aplikasi React dan Next.js."
    },
    {
        q: "Siapa penemu lampu pijar?",
        a: ["Albert Einstein", "Thomas Alva Edison", "Nikola Tesla", "Isaac Newton"],
        c: 1,
        h: "Ia melakukan ribuan percobaan sebelum berhasil."
    },
    {
        q: "Gunung tertinggi di dunia adalah...",
        a: ["Gunung Merapi", "Gunung Fuji", "Gunung Everest", "Gunung Kilimanjaro"],
        c: 2,
        h: "Terletak di pegunungan Himalaya."
    },
    {
        q: "Apa singkatan dari AI?",
        a: ["Advanced Integration", "Artificial Intelligence", "Automatic Internet", "Applied Information"],
        c: 1,
        h: "Kecerdasan buatan."
    },
    {
        q: "Media sosial yang logonya burung biru (sekarang berganti jadi X) adalah...",
        a: ["Instagram", "Facebook", "Twitter", "TikTok"],
        c: 2,
        h: "Tempat favorit untuk microblogging."
    }
];

let idx = 0;
let score = 0;
let corrects = 0;
let timer;
let timeLeft = 20;

function init() {
    idx = 0;
    score = 0;
    corrects = 0;
    render();
}

function render() {
    if (idx >= questions.length) {
        finish();
        return;
    }

    const q = questions[idx];
    document.getElementById('q-text').textContent = q.q;
    document.getElementById('current-q').textContent = idx + 1;
    document.getElementById('fill').style.width = `${((idx + 1) / questions.length) * 100}%`;
    document.getElementById('next-btn').disabled = true;
    
    const container = document.getElementById('options');
    container.innerHTML = '';

    q.a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.textContent = opt;
        btn.onclick = () => check(i, btn);
        container.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 20;
    const stroke = document.getElementById('timer-stroke');
    const text = document.getElementById('seconds');
    
    timer = setInterval(() => {
        timeLeft--;
        text.textContent = timeLeft;
        const offset = (timeLeft / 20) * 100;
        stroke.style.strokeDasharray = `${offset}, 100`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            autoWrong();
        }
    }, 1000);
}

function check(selected, btn) {
    clearInterval(timer);
    const q = questions[idx];
    const btns = document.querySelectorAll('.opt-btn');
    btns.forEach(b => b.disabled = true);

    if (selected === q.c) {
        btn.classList.add('correct');
        score += (timeLeft * 10) + 100;
        corrects++;
    } else {
        btn.classList.add('wrong');
        btns[q.c].classList.add('correct');
    }

    updateStats();
    document.getElementById('next-btn').disabled = false;
}

function autoWrong() {
    const q = questions[idx];
    const btns = document.querySelectorAll('.opt-btn');
    btns.forEach(b => b.disabled = true);
    btns[q.c].classList.add('correct');
    document.getElementById('next-btn').disabled = false;
}

function updateStats() {
    document.getElementById('top-score').textContent = score;
    const acc = Math.round((corrects / (idx + 1)) * 100);
    document.getElementById('accuracy').textContent = acc + '%';
}

function nextQuestion() {
    idx++;
    render();
}

function showHint() {
    alert("PETUNJUK: " + questions[idx].h);
}

function finish() {
    document.getElementById('game-ui').style.display = 'none';
    document.getElementById('result-ui').style.display = 'block';
    document.getElementById('res-correct').textContent = corrects;
    document.getElementById('res-score').textContent = score;
}

// Modal Logic
function openDev() { document.getElementById('dev-modal').style.display = 'grid'; }
function closeDev() { document.getElementById('dev-modal').style.display = 'none'; }
function home() { location.reload(); }

// Start the game
init();
