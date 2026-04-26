/**
 * Proyek: Indo Quiz AI
 * Developer: Iman Firman
 * Fitur: 10 Soal, Database Lokal (Indonesia), No API Key Needed
 */

// Database Soal Internal (Bisa kamu tambahkan terus ke bawah)
const DB_SOAL = [
    {cat:'umum', q:'Apa ibu kota Indonesia sebelum pindah ke IKN?', opts:['Bandung','Jakarta','Surabaya','Medan'], ans:1, hint:'Kota ini terletak di pulau Jawa.'},
    {cat:'sains', q:'Planet manakah yang dijuluki sebagai Planet Merah?', opts:['Venus','Mars','Jupiter','Saturnus'], ans:1, hint:'Planet ini memiliki banyak oksida besi.'},
    {cat:'sejarah', q:'Siapakah proklamator kemerdekaan Indonesia?', opts:['Soeharto','Hatta & Soekarno','Ki Hajar Dewantara','Gajah Mada'], ans:1, hint:'Dua tokoh ini ada di uang pecahan 100rb.'},
    {cat:'geografi', q:'Gunung tertinggi di dunia adalah...', opts:['Semeru','Fuji','Everest','Kilimanjaro'], ans:2, hint:'Terletak di pegunungan Himalaya.'},
    {cat:'teknologi', q:'Siapa penemu sistem operasi Windows?', opts:['Steve Jobs','Mark Zuckerberg','Bill Gates','Elon Musk'], ans:2, hint:'Perusahaannya bernama Microsoft.'},
    {cat:'budaya', q:'Alat musik angklung berasal dari daerah...', opts:['Jawa Tengah','Jawa Barat','Sumatera','Bali'], ans:1, hint:'Terbuat dari bambu.'},
    {cat:'sains', q:'Zat hijau daun pada tumbuhan disebut...', opts:['Oksigen','Klorofil','Stomata','Karbon'], ans:1, hint:'Berfungsi untuk fotosintesis.'},
    {cat:'umum', q:'Mata uang negara Jepang adalah...', opts:['Won','Dollar','Yen','Baht'], ans:2, hint:'Huruf depannya Y.'},
    {cat:'sejarah', q:'Tahun berapakah Indonesia merdeka?', opts:['1942','1945','1950','1998'], ans:1, hint:'Dua angka terakhirnya adalah 45.'},
    {cat:'teknologi', q:'Apa kepanjangan dari WWW?', opts:['World Wide Web','Web Web Web','Word Wide Web','World Web Wide'], ans:0, hint:'Digunakan di awal alamat website.'},
    {cat:'umum', q:'Siapa pencipta lagu Indonesia Raya?', opts:['Ismail Marzuki','WR Supratman','Ibu Sud','Kusbini'], ans:1, hint:'Namanya sering disingkat WR.'},
    {cat:'geografi', q:'Danau terbesar di Indonesia adalah...', opts:['Danau Toba','Danau Singkarak','Danau Poso','Danau Sentani'], ans:0, hint:'Terletak di Sumatera Utara.'},
    {cat:'sains', q:'Mamalia air yang dikenal sangat cerdas adalah...', opts:['Hiu','Paus','Lumba-lumba','Anjing Laut'], ans:2, hint:'Sering menolong manusia.'},
    {cat:'olahraga', q:'Berapa jumlah pemain dalam satu tim sepak bola?', opts:['5','12','11','10'], ans:2, hint:'Kesebelasan.'},
    {cat:'bahasa', q:'Lawan kata (antonim) dari "Rajin" adalah...', opts:['Pintar','Malas','Cerdas','Giat'], ans:1, hint:'Orang yang tidak mau bekerja.'}
];

const L = ['A', 'B', 'C', 'D'];
let qs = [], idx = 0, score = 0, cor = 0, wrg = 0, answered = false, tmr, tLeft = 20, selCat = 'semua';

// Fungsi Memilih & Mengacak Soal
function fetchAIQuestions() {
    const qText = document.getElementById('q-text');
    qText.textContent = "🔍 Menyiapkan 10 soal untukmu...";
    
    // Memfilter soal berdasarkan kategori (jika bukan 'semua')
    let filtered = DB_SOAL;
    if(selCat !== 'semua') {
        filtered = DB_SOAL.filter(s => s.cat === selCat);
    }

    // Mengacak soal (Shuffle)
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    
    // Mengambil maksimal 10 soal
    qs = shuffled.slice(0, 10);
    
    // Jika soal kurang dari 10 (karena kategori sepi), ambil dari kategori lain
    if(qs.length < 10) {
        qs = shuffled.slice(0, 10); 
    }

    idx = 0;
    setTimeout(load, 800); // Memberi efek loading singkat
}

function start() {
    score = 0; cor = 0; wrg = 0; upd();
    document.getElementById('result').classList.remove('show');
    document.getElementById('gcard').classList.remove('gone');
    fetchAIQuestions(); 
}

function load() {
    if (!qs || qs.length === 0 || idx >= qs.length) { showResult(); return; }
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
        const bonus = Math.max(10, tLeft * 5); score += bonus; cor++;
        setFb(true, `✅ Benar! +${bonus} Poin`);
    } else {
        btns[i].classList.add('wrong'); btns[q.ans].classList.add('correct'); wrg++;
        setFb(false, `❌ Salah!`);
    }
    upd(); document.getElementById('btn-next').disabled = false;
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
    
    // Penilaian berdasarkan akurasi
    let rTitle = "BOLEH JUGA!";
    if(acc >= 90) rTitle = "LUAR BIASA! 👑";
    else if(acc >= 70) rTitle = "HEBAT! 🔥";
    else if(acc < 50) rTitle = "COBA LAGI, MAN! 📚";

    document.getElementById('r-title').textContent = rTitle;
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

// Inisialisasi
document.addEventListener('DOMContentLoaded', start);
