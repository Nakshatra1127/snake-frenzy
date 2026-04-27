import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-sans uppercase overflow-hidden">
      <div className="fixed inset-0 scanlines pointer-events-none z-50"></div>
      
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center justify-center gap-8">
        
        <header className="w-full border-b-8 border-cyan-500 pb-2 mb-2 screen-tear flex flex-col sm:flex-row justify-between items-start sm:items-end">
          <h1 className="text-4xl md:text-5xl font-mono glitch-text glitch-text-anim tracking-tighter">
            SYS.OP.CORE
          </h1>
          <span className="text-xl md:text-2xl text-fuchsia-500 glitch-text font-bold">
            v.ERR_404
          </span>
        </header>

        <div className="w-full text-center mb-4 bg-fuchsia-600/20 py-2 border-y-2 border-fuchsia-500">
          <p className="font-mono text-cyan-400 text-sm md:text-base animate-pulse shadow-cyan-400/50 drop-shadow-md">
            WARNING: NEURAL LINK UNSTABLE // REBOOT IMMINENT
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full">
          <div className="col-span-1 screen-tear">
            <SnakeGame />
          </div>

          <div className="col-span-1 screen-tear" style={{ animationDelay: '1.5s' }}>
            <MusicPlayer />
          </div>
        </div>
        
        <footer className="w-full border-t-8 border-fuchsia-500 pt-4 mt-4 flex font-mono justify-between text-[10px] md:text-xs text-cyan-400">
          <span className="animate-pulse">CONNECTION: CORRUPT</span>
          <span>DATA STREAM: INCOMPLETE</span>
        </footer>
      </div>
    </div>
  );
}
