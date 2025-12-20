import { useEffect, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllSearchQueries } from './data/client'; 

const Button = ({ onClick, disabled, children, className = "" }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${className}`}
  >
    {children}
  </button>
);

const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-1 w-full max-w-xs">
    <label className="text-gray-700 font-semibold text-sm">{label}</label>
    <input
      className="border border-gray-300 rounded p-2 focus:outline-none focus:border-orange-500"
      {...props}
    />
  </div>
);

function App() {
  const [numSearches, setNumSearches] = useState<string>('30');
  const [minDelay, setMinDelay] = useState<string>('2000');
  const [maxDelay, setMaxDelay] = useState<string>('5000');
  const [autoClose, setAutoClose] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [data, setData] = useState<string[]>([]);
  const [openedWindows, setOpenedWindows] = useState<Set<Window>>(new Set());
  const isSearchingRef = useRef<boolean>(false);

  // Fallback words
  const fallbackWords = ["tech", "news", "weather", "finance", "sport", "ai", "coding", "vercel", "react", "bing", "microsoft", "rewards", "game", "movie", "music", "crypto", "java", "python", "tesla", "space"];

  async function fetchSearchQueries() {
    try {
      const searchQueriesObject = await getAllSearchQueries();
      if (searchQueriesObject && Array.isArray(searchQueriesObject) && searchQueriesObject.length > 0) {
        const queries = searchQueriesObject.map((q: any) => q.search_query);
        setData(queries);
      } else {
        throw new Error("Data empty");
      }
    } catch (error) {
      const localData = [];
      for(let i=0; i<100; i++) {
         localData.push(`${fallbackWords[Math.floor(Math.random()*fallbackWords.length)]} ${Math.floor(Math.random()*10000)}`);
      }
      setData(localData);
    }
  }

  useEffect(() => { fetchSearchQueries(); }, []);

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  function getRandomSearchQuery(): string {
    const listToUse = data.length > 0 ? data : fallbackWords;
    const randomIndex = Math.floor(Math.random() * listToUse.length);
    return listToUse[randomIndex];
  }

  const startSearches = async () => {
    if (!numSearches) return toast.error('Masukkan jumlah pencarian!');
    const totalSearches = parseInt(numSearches, 10);
    const minD = parseInt(minDelay, 10) || 2000;
    const maxD = parseInt(maxDelay, 10) || 5000;

    isSearchingRef.current = true;
    setProgress(0);
    toast.info(`Memulai ${totalSearches} pencarian...`);

    for (let i = 0; i < totalSearches; i++) {
      if (!isSearchingRef.current) {
        toast.warning('Pencarian dihentikan.');
        break;
      }
      const query = getRandomSearchQuery();
      // Gunakan sp=-1 dan ghc=1 untuk variasi parameter
      const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&form=QBLH&sp=-1&ghc=1`;
      
      const newTab = window.open(searchUrl, '_blank');

      if (newTab) {
        setOpenedWindows((prev) => new Set(prev).add(newTab));
        if (autoClose) {
           setTimeout(() => { if (!newTab.closed) newTab.close(); }, minD); 
        }
      } else {
        toast.error("Pop-up diblokir! Izinkan pop-up browser.");
        isSearchingRef.current = false;
        break;
      }

      setProgress(i + 1);
      const randomDelay = Math.floor(Math.random() * (maxD - minD + 1) + minD);
      await wait(randomDelay);
    }
    isSearchingRef.current = false;
    if (progress === totalSearches) toast.success('Selesai!');
  };

  const stopSearches = () => { isSearchingRef.current = false; };

  const closeAllOpenedTabs = () => {
    openedWindows.forEach((tab) => { if (!tab.closed) tab.close(); });
    setOpenedWindows(new Set());
    toast.success(`Semua tab ditutup.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <Analytics />
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-center text-3xl font-bold text-orange-500 mb-6">Bing Bot v2 🤖</h1>
        <div className="flex flex-col gap-4">
          <Input label="Jumlah Search:" type="number" value={numSearches} onChange={(e: any) => setNumSearches(e.target.value)} />
          <div className="flex gap-2">
            <Input label="Min Delay (ms):" type="number" value={minDelay} onChange={(e: any) => setMinDelay(e.target.value)} />
            <Input label="Max Delay (ms):" type="number" value={maxDelay} onChange={(e: any) => setMaxDelay(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="autoClose" checked={autoClose} onChange={(e) => setAutoClose(e.target.checked)} className="w-5 h-5 text-orange-500 rounded" />
            <label htmlFor="autoClose" className="text-gray-700 text-sm cursor-pointer">Auto-close tab (Hemat RAM)</label>
          </div>
          {isSearchingRef.current && (
             <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(progress / parseInt(numSearches || '1')) * 100}%` }}></div>
                <p className="text-xs text-center mt-1 text-gray-500">{progress} / {numSearches}</p>
             </div>
          )}
          <div className="flex gap-2 mt-4">
            <Button onClick={startSearches} disabled={isSearchingRef.current} className="flex-1 font-bold">{isSearchingRef.current ? 'Jalan...' : 'Mulai'}</Button>
            <Button onClick={stopSearches} className="bg-red-500 hover:bg-red-600 text-white">Stop</Button>
          </div>
          <Button onClick={closeAllOpenedTabs} className="w-full bg-gray-700 hover:bg-gray-800 mt-2">Tutup Semua Tab</Button>
        </div>
      </div>
    </div>
  );
}
export default App;
