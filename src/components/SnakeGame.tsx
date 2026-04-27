import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
      const isOnSnake = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      if (e.key === ' ' && !isGameOver) { setIsPaused((prev) => !prev); return; }

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': if (currentDir.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': case 's': case 'S': if (currentDir.y !== -1) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': case 'a': case 'A': if (currentDir.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': case 'd': case 'D': if (currentDir.x !== -1) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { x: head.x + directionRef.current.x, y: head.y + directionRef.current.y };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true); return prevSnake;
        }
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true); return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 13); // Irregular scoring for glitch feel
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };

    const speed = Math.max(40, 120 - Math.floor(score / 50) * 12);
    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [food, isGameOver, isPaused, generateFood, score]);

  return (
    <div className="w-full bg-black border-4 border-fuchsia-500 p-4 md:p-6 flex flex-col items-center justify-center font-mono relative overflow-hidden group">
      {/* Glitch artifacts */}
      <div className="absolute bottom-2 left-2 w-16 h-4 bg-cyan-500 opacity-60 animate-pulse"></div>
      <div className="absolute top-1/2 right-0 w-2 h-20 bg-fuchsia-500 screen-tear"></div>

      <div className="flex justify-between w-full mb-4 border-b-2 border-cyan-500 pb-2">
        <h2 className="text-xl md:text-2xl font-bold text-fuchsia-500 glitch-text uppercase tracking-widest">
          SNAKE.EXE
        </h2>
        <div className="text-xl font-bold text-cyan-400 bg-cyan-950 px-2 border border-cyan-500">
          [{String(score).padStart(5, '0')}]
        </div>
      </div>

      {/* Game Board container */}
      <div className="relative border-4 border-cyan-500 bg-black w-full max-w-[300px] aspect-square mx-auto">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{
             backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)',
             backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
          }}
        />

        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className="absolute bg-cyan-400"
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              border: index === 0 ? '2px solid #fff' : '1px solid #000',
              opacity: index === 0 ? 1 : 0.8,
            }}
          />
        ))}

        <div
          className="absolute bg-fuchsia-500 animate-pulse"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            border: '2px solid #fff'
          }}
        />

        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm border-2 border-fuchsia-500 m-2">
            {isGameOver ? (
              <>
                <h3 className="text-2xl md:text-3xl font-bold text-fuchsia-500 glitch-text glitch-text-anim mb-4 text-center">FATAL_ERR</h3>
                <p className="text-cyan-400 mb-6 font-bold text-center">PC: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-cyan-500 text-black font-bold uppercase hover:bg-fuchsia-500 hover:text-white transition-colors border-2 border-white"
                >
                  REBOOT //
                </button>
              </>
            ) : (
              <h3 className="text-2xl font-bold text-cyan-400 animate-pulse bg-cyan-900 border border-cyan-400 px-4 py-2">
                SYS_PAUSED
              </h3>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center text-cyan-700 text-[10px] md:text-sm flex flex-col space-y-2 w-full">
         <div className="border border-cyan-900 p-1 bg-cyan-950/20">INPUT: [ARROWS] | [W,A,S,D]</div>
         <div className="border border-cyan-900 p-1 bg-cyan-950/20">CTRL: [SPACE] TO HALT</div>
      </div>
    </div>
  );
}
