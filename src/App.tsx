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

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-slate-300 text-sm font-medium tracking-wide ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-25 group-focus-within:opacity-75 transition duration-500"></div>
      <input
        className="relative w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500 transition-all"
        {...props}
      />
    </div>
  </div>
);

// --- Main App ---

function App() {
  const [numSearches, setNumSearches] = useState<string>('30');
  const [minDelay, setMinDelay] = useState<string>('2000');
  const [maxDelay, setMaxDelay] = useState<string>('5000');
  const [autoClose, setAutoClose] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [openedWindows, setOpenedWindows] = useState<Set<Window>>(new Set());
  
  const isSearchingRef = useRef<boolean>(false);

  // DATA LOCAL
  // --- HUMANIZER ENGINE ---
  const generateQueries = () => {
    // 1. Database Kata (Bisa ditambah sendiri)
    const tech = ["Asus x302la", "Vivo y21", "Vivo Gaming Phone", "iPhone 16", "Samsung S24", "MacBook Air", "RTX 4090", "PS5 Pro", "Xiaomi 14", "Windows 11", "Tesla Cybertruck", "AI Robot", "Mechanical Keyboard"];
    const coding = ["React JS", "Python tutorial", "Vercel hosting", "Tailwind CSS", "Docker container", "Next.js routing", "TypeScript types", "Github actions", "VS Code themes", "API integration"];
    const finance = ["Bitcoin price", "IHSG hari ini", "Harga Emas Antam", "Saham BBCA", "Cara investasi", "Reksa dana bibit", "Kurs Dollar Rupiah", "Crypto market cap"];
    const daily = ["Yukinoshita web id", "Rendang", "Cuaca Banyumas", "Nasi Padang", "Nasi Kucing", "Nasi Tiwul", "Nasi Kecap", "Sambel ijo", "Nasi rendang", "Masak Nasi", Resep nasi goreng", "Jadwal bioskop", "Cuaca Jakarta", "Wisata Bali", "Tiket kereta api", "Lagu viral tiktok", "Outfit kondangan", "Menu diet sehat"];
    
    // 2. Pola Kalimat Manusia (Templates)
    const templates = [
      (w: string) => `Review jujur ${w} indonesia`,
      (w: string) => `Harga terbaru ${w} 2024`,
      (w: string) => `Cara memperbaiki ${w} error`,
      (w: string) => `Tutorial ${w} untuk pemula`,
      (w: string) => `Kelebihan dan kekurangan ${w}`,
      (w: string) => `Berita ${w} terkini`,
      (w: string) => `Spesifikasi lengkap ${w}`,
      (w: string) => `Download driver ${w}`,
      (w: string) => `Wallpaper ${w} HD 4k`,
      (w: string) => `Forum diskusi ${w}`,
      (w: string) => `Alternatif selain ${w}`,
      (w: string) => `Kenapa ${w} sangat populer?`
    ];

    const allWords = [...tech, ...coding, ...finance, ...daily];
    const queries: string[] = [];

    // 3. Generate 100 Kalimat Unik
    for (let i = 0; i < 150; i++) {
      // Ambil topik acak
      const word = allWords[Math.floor(Math.random() * allWords.length)];
      // Ambil template acak
      const template = templates[Math.floor(Math.random() * templates.length)];
      
      // Buat kalimat
      queries.push(template(word));
    }

    // Tambahkan variasi pencarian "Vs" (Perbandingan)
    for (let i = 0; i < 50; i++) {
        const w1 = tech[Math.floor(Math.random() * tech.length)];
        const w2 = tech[Math.floor(Math.random() * tech.length)];
        if (w1 !== w2) {
            queries.push(`Bedingan ${w1} vs ${w2}`);
        }
    }

    // Shuffle array (Acak urutan agar tidak monoton)
    return queries.sort(() => Math.random() - 0.5);
  };

  const [data] = useState<string[]>(generateQueries());

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  function getRandomSearchQuery(): string {
    return data[Math.floor(Math.random() * data.length)];
  }

  const startSearches = async () => {
    if (!numSearches) return toast.error('Masukkan jumlah pencarian!');
    
    const totalSearches = parseInt(numSearches, 10);
    const minD = parseInt(minDelay, 10) || 2000;
    const maxD = parseInt(maxDelay, 10) || 5000;

    isSearchingRef.current = true;
    setProgress(0);
    toast.info(`🚀 Memulai ${totalSearches} pencarian...`);

    for (let i = 0; i < totalSearches; i++) {
      if (!isSearchingRef.current) {
        toast.warn('⛔ Pencarian dihentikan user.');
        break;
      }

      const query = getRandomSearchQuery();
      const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&form=QBLH&sp=-1&ghc=1`;
      
      const newTab = window.open(searchUrl, '_blank');

      if (newTab) {
        setOpenedWindows((prev) => new Set(prev).add(newTab));
        
        if (autoClose) {
           setTimeout(() => { 
             if (!newTab.closed) newTab.close(); 
           }, minD); 
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
    if (progress === totalSearches) toast.success('🎉 Semua pencarian selesai!');
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
            <p className="text-slate-400 text-sm">Automasi pencarian rewards dengan gaya.</p>
          </div>

          <div className="space-y-6">
            <Input label="Target Pencarian" type="number" placeholder="Contoh: 30" value={numSearches} min={1} max={100} onChange={(e: any) => setNumSearches(e.target.value)} />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Min Delay (ms)" type="number" value={minDelay} onChange={(e: any) => setMinDelay(e.target.value)} />
              <Input label="Max Delay (ms)" type="number" value={maxDelay} onChange={(e: any) => setMaxDelay(e.target.value)} />
            </div>

            <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <label htmlFor="autoClose" className="text-slate-300 text-sm font-medium cursor-pointer select-none">🚀 Auto-close Tabs (Hemat RAM)</label>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="autoClose" id="autoClose" checked={autoClose} onChange={(e) => setAutoClose(e.target.checked)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-300 ease-in-out checked:translate-x-full checked:border-blue-500"/>
                <label htmlFor="autoClose" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${autoClose ? 'bg-blue-600' : 'bg-slate-700'}`}></label>
              </div>
            </div>

            {isSearchingRef.current && (
              <div className="space-y-2">
                 <div className="flex justify-between text-xs text-blue-300 font-mono"><span>Progress</span><span>{Math.round((progress / parseInt(numSearches || '1')) * 100)}%</span></div>
                 <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                    <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${(progress / parseInt(numSearches || '1')) * 100}%` }}></div>
                 </div>
                 <p className="text-center text-xs text-slate-500 mt-1 animate-pulse">Running: {progress} / {numSearches} queries</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button onClick={startSearches} disabled={isSearchingRef.current} variant="primary" className="w-full">{isSearchingRef.current ? 'Running...' : 'Start Bot'}</Button>
              <Button onClick={stopSearches} variant="danger" className="w-full">Stop</Button>
            </div>
            <Button onClick={closeAllOpenedTabs} variant="secondary" className="w-full mt-2 text-sm">🧹 Tutup Semua Tab (Force Close)</Button>
          </div>
        </div>
        <footer className="mt-8 text-center"><p className="text-slate-500 text-xs">Dibuat dengan ❤️ By DomathID untuk pemburu poin.</p></footer>
      </div>
    </div>
  );
}

export default App;
