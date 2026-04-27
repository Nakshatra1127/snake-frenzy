import { useState, useEffect, useRef } from 'react';

const TRACKS = [
  { id: 1, title: 'CYBER_DAWN.WAV', artist: 'AI:://001', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'PROTOCOL_BREACH.WAV', artist: 'AI:://889', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'NN_DESYNC.WAV', artist: 'SYS:://ERR', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.log('Audio error:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => { setCurrentTrackIndex((p) => (p + 1) % TRACKS.length); setIsPlaying(true); };
  const prevTrack = () => { setCurrentTrackIndex((p) => (p - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  return (
    <div className="w-full bg-black border-4 border-cyan-500 p-6 flex flex-col font-mono text-cyan-400 relative overflow-hidden group">
      {/* Glitch artifacts */}
      <div className="absolute top-2 right-2 w-8 h-2 bg-fuchsia-500 animate-pulse"></div>
      <div className="absolute bottom-10 left-0 w-full h-1 bg-cyan-700 opacity-50 screen-tear"></div>

      <audio ref={audioRef} src={currentTrack.url} onEnded={nextTrack} />
      
      <div className="mb-2 border-b-2 border-fuchsia-500 pb-2">
        <h2 className="text-xl md:text-2xl font-bold glitch-text glitch-text-anim uppercase tracking-tighter">
          AUDIO_DECODER //
        </h2>
      </div>

      <div className="flex flex-col space-y-6 mt-4">
        {/* Track Display */}
        <div className="bg-cyan-950/30 p-4 border border-cyan-500 relative">
          <div className="absolute -top-2 left-2 bg-black px-2 text-[10px] text-fuchsia-500">NOW_PLAYING</div>
          <div className="text-lg md:text-xl font-bold text-white glitch-text tracking-wider truncate">
            {currentTrack.title}
          </div>
          <div className="text-fuchsia-400 text-sm mt-1">{currentTrack.artist}</div>
        </div>

        {/* Fake Visualizer */}
        <div className="flex items-end justify-between h-12 w-full px-1 gap-1">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className={`w-full ${i % 3 === 0 ? 'bg-fuchsia-500' : 'bg-cyan-400'}`}
              style={{
                height: isPlaying ? `${Math.random() * 100}%` : '5%',
                transition: 'height 0.1s ease',
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-2">
          <button onClick={prevTrack} className="border-2 border-cyan-500 bg-black hover:bg-cyan-500 hover:text-black py-2 text-center transition-colors">
            {'<<'} REV
          </button>
          
          <button onClick={togglePlay} className="border-2 border-fuchsia-500 bg-black text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black py-2 text-center font-bold glitch-text-anim transition-colors">
            {isPlaying ? '|| HALT' : '>> EXEC'}
          </button>
          
          <button onClick={nextTrack} className="border-2 border-cyan-500 bg-black hover:bg-cyan-500 hover:text-black py-2 text-center transition-colors">
            FWD {'>>'}
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-4 border-2 border-cyan-700 p-2">
          <button onClick={() => setIsMuted(!isMuted)} className="text-fuchsia-500 flex-shrink-0 w-8 text-center hover:bg-fuchsia-500/20 text-xs">
            {isMuted || volume === 0 ? 'MUTE' : 'VOL'}
          </button>
          <div className="flex-1 h-4 relative bg-cyan-950 cursor-pointer border border-cyan-800" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setVolume(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
            if (isMuted) setIsMuted(false);
          }}>
            <div 
              className="absolute left-0 top-0 h-full bg-cyan-500 transition-all duration-75"
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
