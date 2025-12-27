import { useRef, useState, useEffect } from 'react';
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
  const [numSearches, setNumSearches] = useState('30');
  const [minDelay, setMinDelay] = useState('8000');
  const [maxDelay, setMaxDelay] = useState('10000');
  const [autoClose, setAutoClose] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentQuery, setCurrentQuery] = useState("");
  const [openedWindows, setOpenedWindows] = useState<Set<Window>>(new Set());

  // 🔥 SUBJECT WORDLIST STATE
  const [wordlistSubjects, setWordlistSubjects] = useState<string[]>([]);

  const isSearchingRef = useRef(false);

  // 🔥 LOAD WORDLIST.TXT (TAMBAHAN SAJA)
  useEffect(() => {
    fetch("/wordlist.txt")
      .then(res => res.text())
      .then(text => {
        const list = text
          .split("\n")
          .map(v => v.trim())
          .filter(Boolean);

        if (list.length > 0) {
          setWordlistSubjects(list);
          console.log("✅ Wordlist loaded:", list.length);
        }
      })
      .catch(() => console.warn("⚠️ wordlist.txt tidak ditemukan, pakai subject default"));
  }, []);

  // --- GENERATOR ENGINE ---
  const generateDynamicQuery = () => {

    // ✅ SUBJECT DEFAULT (TIDAK DIHAPUS)
    const defaultSubjects = [
      "Wisata Banyumas","Wisata Purwokerto","roblox","robux","fish it",
      "iPhone 16","Samsung S25 Ultra","Bitcoin","Harga Emas",
      "React JS","Next.js 14","ChatGPT 5","Timnas Indonesia"
    ];

    // ✅ PAKAI WORDLIST JIKA ADA
    const subjects = wordlistSubjects.length > 0 ? wordlistSubjects : defaultSubjects;

    const actions = [
      "Review lengkap","Cara memperbaiki","Harga terbaru",
      "Panduan lengkap","Tips dan trik","Update terbaru"
    ];

    const contexts = [
      "2025","di Indonesia","untuk pemula","hari ini","resmi"
    ];

    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const randomId = Math.floor(Math.random() * 99999);

    const mode = Math.random();

    if (mode < 0.3) {
      return `${pick(actions)} ${pick(subjects)} ${pick(contexts)} #${randomId}`;
    } else if (mode < 0.6) {
      return `${pick(subjects)} ${pick(actions)} ${randomId}`;
    } else if (mode < 0.8) {
      const qWords = ["Apa itu", "Bagaimana cara", "Kenapa"];
      return `${pick(qWords)} ${pick(subjects)}? ${randomId}`;
    } else {
      const s1 = pick(subjects);
      const s2 = pick(subjects);
      return `Perbedaan ${s1} vs ${s2} ${pick(contexts)} ${randomId}`;
    }
  };

  const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

  const startSearches = async () => {
    const total = parseInt(numSearches);
    const minD = parseInt(minDelay);
    const maxD = parseInt(maxDelay);

    isSearchingRef.current = true;
    setProgress(0);
    toast.info(`🚀 Memulai ${total} pencarian...`);

    for (let i = 0; i < total; i++) {
      if (!isSearchingRef.current) break;

      const query = generateDynamicQuery();
      setCurrentQuery(query);

      const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
      const tab = window.open(url, "_blank");

      if (tab && autoClose) {
        setTimeout(() => !tab.closed && tab.close(), minD);
      }

      setProgress(i + 1);
      await wait(Math.floor(Math.random() * (maxD - minD + 1) + minD));
    }

    isSearchingRef.current = false;
    setCurrentQuery("");
    toast.success("🎉 Selesai!");
  };

  const stopSearches = () => isSearchingRef.current = false;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <ToastContainer theme="dark" />
      <Analytics />

      <div className="w-full max-w-lg bg-slate-900 p-6 rounded-xl">
        <h1 className="text-center text-3xl font-bold mb-4">BingBot v2.1</h1>

        <Input label="Target Pencarian" value={numSearches} onChange={(e:any)=>setNumSearches(e.target.value)} />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Input label="Min Delay" value={minDelay} onChange={(e:any)=>setMinDelay(e.target.value)} />
          <Input label="Max Delay" value={maxDelay} onChange={(e:any)=>setMaxDelay(e.target.value)} />
        </div>

        <div className="text-xs text-blue-400 mt-3 text-center">
          {currentQuery ? `🔍 ${currentQuery}` : "Menunggu perintah..."}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button onClick={startSearches}>Start</Button>
          <Button variant="danger" onClick={stopSearches}>Stop</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
