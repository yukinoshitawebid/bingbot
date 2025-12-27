import { useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Modern Components ---
const Button = ({ onClick, disabled, children, variant = 'primary', className = "" }: any) => {
  const baseStyle = "relative px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  const variants: any = {
    primary: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-blue-500/50",
    danger: "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-red-500/50",
    secondary: "bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-white hover:shadow-slate-500/30 border border-slate-600",
  };
  return <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>{children}</button>;
};

const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-slate-300 text-sm font-medium tracking-wide ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-25 group-focus-within:opacity-75 transition duration-500"></div>
      <input className="relative w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500 transition-all" {...props} />
    </div>
  </div>
);

// --- Main App ---
function App() {
  const [numSearches, setNumSearches] = useState<string>('30');
  const [minDelay, setMinDelay] = useState<string>('8000');
  const [maxDelay, setMaxDelay] = useState<string>('10000');
  const [autoClose, setAutoClose] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [currentQuery, setCurrentQuery] = useState<string>(""); // Untuk menampilkan apa yang sedang dicari
  const [openedWindows, setOpenedWindows] = useState<Set<Window>>(new Set());
  
  const isSearchingRef = useRef<boolean>(false);

  // --- UNLIMITED GENERATOR ENGINE ---
  // Fungsi ini dipanggil setiap kali loop berjalan, menghasilkan kalimat baru terus menerus.
  const generateDynamicQuery = () => {
    // 1. Subject (Topik Utama) - Bisa ditambah ribuan kata di sini
    const subjects = [
  // Wisata & Lokal
  "Wisata Banyumas","Wisata Purwokerto","Wisata Baturraden","Menara Pandang","Menara Pandang Pwt",
  "Wisata Pantai","Wisata Pantai Selatan","Wisata Bali","Wisata Jogja","Wisata Bandung",
  "Wisata Jakarta","Wisata Semarang","Wisata Malang","Wisata Lombok","Wisata Raja Ampat",
  "Tempat Wisata Murah","Wisata Keluarga","Wisata Alam","Wisata Gunung","Wisata Air Terjun",
  "Rekomendasi Tempat Liburan","Tiket Pesawat Murah","Hotel di Jakarta","Hotel Murah Purwokerto",
  "Penginapan Murah","Villa untuk Liburan",

  // Game & Roblox
  "roblox","robux","top up robux","harga robux terbaru","cara dapat robux gratis",
  "game roblox populer","map roblox terbaik","game galau roblox","roblox music playlist",
  "fish it","fish it roblox","fish it rng","fish it secret fish",
  "Mobile Legends","Build ML Terbaik","Hero ML Terkuat",
  "Free Fire","Skin FF Gratis",
  "Game GTA VI","Game PC Terbaru","Game Android Terbaik",

  // Teknologi & Gadget
  "iPhone 16","Samsung S25 Ultra","MacBook M3","Laptop Gaming Terbaik",
  "NVIDIA RTX 5090","AMD Ryzen Terbaru","PC Gaming Murah",
  "HP Android Terbaik","HP Murah Spek Tinggi","Perbandingan iPhone dan Android",
  "Review Smartphone","Harga HP Terbaru",
  "Tesla Model Y","Mobil Listrik Terbaik","Motor Listrik Indonesia",

  // Finansial & Bisnis
  "Bitcoin","Ethereum","Harga Crypto Hari Ini","Crypto Bull Run",
  "Saham BBCA","Saham BBRI","Cara Main Saham","Investasi Saham Pemula",
  "Harga Emas","Harga Emas Hari Ini","Investasi Emas",
  "Kurs Rupiah","Dollar ke Rupiah",
  "Ide Bisnis Online","Bisnis Tanpa Modal","Usaha Sampingan",
  "Cara Menabung","Aplikasi Keuangan",

  // Kuliner & Kesehatan
  "Resep Nasi Goreng","Resep Ayam Geprek","Resep Masakan Rumahan",
  "Makanan Viral","Jajanan Kekinian",
  "Cara Diet Sehat","Diet Pemula","Tips Hidup Sehat",
  "Olahraga di Rumah","Cara Menurunkan Berat Badan",

  // Programming & IT
  "React JS","Next.js 14","Vercel Deployment","Deploy Website di Vercel",
  "JavaScript Dasar","Belajar JavaScript","Belajar Coding Pemula",
  "Python AI","Python Machine Learning","Python untuk Pemula",
  "ChatGPT 5","AI Terbaru","Tools AI Gratis",
  "Termux Android","Install Package Termux","Linux di Android",
  "VS Code Extension","Framework Web Terbaik",

  // Hiburan & Media
  "Film Marvel Terbaru","Film Action Terbaik","Film Indonesia Terbaru",
  "Anime One Piece","Anime Terbaru","Rekomendasi Anime",
  "Lagu Viral TikTok","Musik Galau","Playlist Lagu Sedih",
  "Drama Korea Terbaru","Series Netflix",

  // Olahraga
  "Timnas Indonesia","Liga Inggris","Liga Champions",
  "MotoGP","F1 Racing","Badminton Indonesia",
  "Sepak Bola Dunia","Jadwal Bola Hari Ini",

  // Edukasi & Umum
  "Berita Teknologi","Berita Viral Hari Ini",
  "Tips Produktivitas","Cara Mengatur Waktu",
  "Motivasi Hidup","Quotes Inspiratif"
];


  // 2. Action (Kata Kerja / Frasa Depan)
const actions = [
  // Umum & Informasi
  "Review lengkap","Spesifikasi","Harga terbaru","Harga pasaran","Daftar harga",
  "Kelebihan dan kekurangan","Perbandingan","Perbandingan lengkap","Komparasi",
  "Kenapa","Apa itu","Fungsi","Manfaat","Kegunaan","Penjelasan lengkap",
  "Sejarah","Fakta menarik","Alasan memilih","Rekomendasi","Kesimpulan",

  // Tutorial & Panduan
  "Cara memperbaiki","Cara menggunakan","Cara memasang","Cara install",
  "Cara update","Cara downgrade","Cara reset","Cara setting",
  "Tutorial menggunakan","Tutorial lengkap","Panduan lengkap","Panduan pemula",
  "Langkah-langkah","Tips dan trik","Tips pemula","Tips lanjutan",
  "Solusi masalah","Cara mengatasi","Troubleshooting",

  // Update & Berita
  "Berita terkini","Update terbaru","Kabar terbaru","Info resmi",
  "Rumor rilis","Bocoran","Prediksi","Jadwal rilis",
  "Perkembangan terbaru","Analisa","Analisis mendalam",

  // Media & Konten
  "Unboxing","Hands-on","Preview","First impression",
  "Wallpaper HD","Wallpaper terbaru","Background HD",
  "Screenshot","Gambar asli","Video review",

  // Download & File
  "Download","Download resmi","Download driver","Link download",
  "File terbaru","Firmware terbaru","Update firmware",
  "ISO resmi","APK terbaru",

  // Teknis & Detail
  "Spesifikasi lengkap","Detail teknis","Benchmark",
  "Uji performa","Tes kecepatan","Performa harian",
  "Konsumsi daya","Daya tahan","Stabilitas sistem",

  // Komunitas & Opini
  "Forum diskusi","Pendapat pengguna","Review pengguna",
  "Testimoni","Pengalaman pengguna","Diskusi lengkap",

  // Edukasi & Insight
  "Penjelasan sederhana","Penjelasan untuk pemula",
  "Hal yang perlu diketahui","Yang wajib diketahui",
  "Kesalahan umum","Masalah umum","Mitos dan fakta",

  // Keputusan & Rekomendasi
  "Layak dibeli","Masih worth it","Cocok untuk siapa",
  "Alternatif terbaik","Pilihan terbaik",
  "Lebih baik mana","Perlu beli atau tidak"
];

    // 3. Context (Pelengkap / Belakang)
const contexts = [
  // Waktu
  "2024","2025","2026",
  "hari ini","kemarin","minggu ini","bulan ini","tahun ini",
  "update terbaru","versi terbaru","rilis terbaru",

  // Lokasi & Bahasa
  "di Indonesia","bahasa Indonesia","resmi Indonesia",
  "Amerika","India","Rusia","Jerman","China","Korea","Jepang",
  "Asia","Eropa","global",

  // Target Pengguna
  "untuk pemula","untuk profesional","untuk pelajar",
  "untuk mahasiswa","untuk pekerja","untuk konten kreator",
  "untuk gaming","untuk kerja","untuk belajar","untuk sehari-hari",

  // Kualitas & Status
  "resmi","legal","terpercaya","aman","original",
  "paling murah","termurah","harga terjangkau",
  "kualitas terbaik","rekomendasi","paling laris",

  // Perbandingan & Tren
  "vs kompetitor","vs versi lama","dibandingkan pesaing",
  "yang viral","paling dicari","trending",
  "populer saat ini","naik daun",

  // Kondisi & Penilaian
  "terbaik","paling bagus","paling worth it",
  "layak dibeli","tidak direkomendasikan",
  "masih relevan","sudah usang",

  // Teknis & Detail
  "tanpa ribet","mudah digunakan","praktis",
  "tanpa biaya","gratis","free","versi premium",
  "tanpa iklan","full fitur",

  // Edukasi & Kejelasan
  "lengkap dan jelas","step by step",
  "disertai gambar","dengan contoh",
  "penjelasan sederhana","bahasan mendalam",

  // Legal & Keamanan
  "tanpa risiko","aman digunakan",
  "sesuai aturan","tanpa pelanggaran"
];

    // Random Pick Function
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const randomId = Math.floor(Math.random() * 99999); // ID Unik agar tidak dianggap duplikat oleh Bing

    // Logic Mix & Match
    const mode = Math.random();
    
    if (mode < 0.3) {
      // Pola 1: Action + Subject + Context
      return `${pick(actions)} ${pick(subjects)} ${pick(contexts)} #${randomId}`;
    } else if (mode < 0.6) {
      // Pola 2: Subject + Action + ID
      return `${pick(subjects)} ${pick(actions)} ${randomId}`;
    } else if (mode < 0.8) {
      // Pola 3: Pertanyaan (5W1H)
      const qWords = ["Apa itu", "Dimana beli", "Kapan rilis", "Siapa pembuat", "Bagaimana cara"];
      return `${pick(qWords)} ${pick(subjects)}? ref=${randomId}`;
    } else {
      // Pola 4: Versus (Perbandingan)
      const s1 = pick(subjects);
      const s2 = pick(subjects);
      return `Perbedaan ${s1} vs ${s2} ${pick(contexts)} [${randomId}]`;
    }
  };

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const startSearches = async () => {
    if (!numSearches) return toast.error('Masukkan jumlah pencarian!');
    
    const totalSearches = parseInt(numSearches, 10);
    const minD = parseInt(minDelay, 10) || 2000;
    const maxD = parseInt(maxDelay, 10) || 5000;

    isSearchingRef.current = true;
    setProgress(0);
    toast.info(`🚀 Memulai ${totalSearches} pencarian Unlimited...`);

    for (let i = 0; i < totalSearches; i++) {
      if (!isSearchingRef.current) {
        toast.warn('⛔ Pencarian dihentikan user.');
        break;
      }

      // Generate Query BARU di sini (Real-time generation)
      const query = generateDynamicQuery();
      setCurrentQuery(query); // Update UI agar user lihat apa yang dicari

      const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&form=QBLH&sp=-1&ghc=1`;
      
      const newTab = window.open(searchUrl, '_blank');

      if (newTab) {
        setOpenedWindows((prev) => new Set(prev).add(newTab));
        if (autoClose) {
           setTimeout(() => { if (!newTab.closed) newTab.close(); }, minD); 
        }
      } else {
        toast.error("⚠️ Pop-up diblokir! Izinkan pop-up di browser.");
        isSearchingRef.current = false;
        break;
      }

      setProgress(i + 1);
      const randomDelay = Math.floor(Math.random() * (maxD - minD + 1) + minD);
      await wait(randomDelay);
    }

    isSearchingRef.current = false;
    setCurrentQuery("");
    if (progress === totalSearches) toast.success('🎉 Selesai!');
  };

  const stopSearches = () => { isSearchingRef.current = false; };

  const closeAllOpenedTabs = () => {
    let count = 0;
    openedWindows.forEach((tab) => { 
      if (!tab.closed) {
        tab.close();
        count++;
      }
    });
    setOpenedWindows(new Set());
    if(count > 0) toast.success(`🗑️ ${count} tab berhasil ditutup.`);
    else toast.info("Tidak ada tab yang perlu ditutup.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

      <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
      <Analytics />

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl ring-1 ring-white/10">
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-2">
              BingBot <span className="text-white text-base font-mono align-top opacity-50">v2.1</span>
            </h1>
            <p className="text-slate-400 text-sm">Auto Search Bing Otomatis.</p>
          </div>

          <div className="space-y-6">
            <Input label="Target Pencarian" type="number" value={numSearches} min={1} max={1000} onChange={(e: any) => setNumSearches(e.target.value)} />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Min Delay (ms)" type="number" value={minDelay} onChange={(e: any) => setMinDelay(e.target.value)} />
              <Input label="Max Delay (ms)" type="number" value={maxDelay} onChange={(e: any) => setMaxDelay(e.target.value)} />
            </div>

            <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <label htmlFor="autoClose" className="text-slate-300 text-sm font-medium cursor-pointer select-none">🚀 Auto-close Tabs</label>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="autoClose" id="autoClose" checked={autoClose} onChange={(e) => setAutoClose(e.target.checked)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-300 ease-in-out checked:translate-x-full checked:border-blue-500"/>
                <label htmlFor="autoClose" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${autoClose ? 'bg-blue-600' : 'bg-slate-700'}`}></label>
              </div>
            </div>

            {/* LIVE QUERY MONITOR */}
            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 text-center h-16 flex items-center justify-center">
                {currentQuery ? (
                    <p className="text-xs text-blue-300 font-mono animate-pulse">🔍 Searching: "{currentQuery}"</p>
                ) : (
                    <p className="text-xs text-slate-600 font-mono">Menunggu perintah...</p>
                )}
            </div>

            {isSearchingRef.current && (
              <div className="space-y-2">
                 <div className="flex justify-between text-xs text-blue-300 font-mono"><span>Progress</span><span>{Math.round((progress / parseInt(numSearches || '1')) * 100)}%</span></div>
                 <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                    <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${(progress / parseInt(numSearches || '1')) * 100}%` }}></div>
                 </div>
                 <p className="text-center text-xs text-slate-500 mt-1">Running: {progress} / {numSearches}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button onClick={startSearches} disabled={isSearchingRef.current} variant="primary" className="w-full">{isSearchingRef.current ? 'Running...' : 'Start Bot'}</Button>
              <Button onClick={stopSearches} variant="danger" className="w-full">Stop</Button>
            </div>
            <Button onClick={closeAllOpenedTabs} variant="secondary" className="w-full mt-2 text-sm">🧹 Tutup Semua Tab</Button>
          </div>
        </div>
        <footer className="mt-8 text-center"><p className="text-slate-500 text-xs">DomathID &copy; 2025</p></footer>
      </div>
    </div>
  );
}

export default App; 
