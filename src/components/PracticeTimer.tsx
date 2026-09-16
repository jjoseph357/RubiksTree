import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Shuffle } from 'lucide-react';

export const PracticeTimer: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [solves, setSolves] = useState<number[]>(() => {
    const saved = localStorage.getItem('rubiks_sub30_solves');
    return saved ? JSON.parse(saved) : [];
  });
  const [scramble, setScramble] = useState<string>('');

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const holdTimeoutRef = useRef<number | null>(null);

  // Generate random 20-move WCA scramble
  const generateScramble = () => {
    const moves = ['R', 'L', 'U', 'D', 'F', 'B'];
    const modifiers = ['', "'", '2'];
    const scrambleArr: string[] = [];
    let lastMove = '';
    let secondLastMove = '';

    while (scrambleArr.length < 20) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      if (move !== lastMove && move !== secondLastMove) {
        const mod = modifiers[Math.floor(Math.random() * modifiers.length)];
        scrambleArr.push(move + mod);
        secondLastMove = lastMove;
        lastMove = move;
      }
    }
    const newScramble = scrambleArr.join(' ');
    setScramble(newScramble);
    return newScramble;
  };

  useEffect(() => {
    generateScramble();
  }, []);

  // Save solves to localStorage
  useEffect(() => {
    localStorage.setItem('rubiks_sub30_solves', JSON.stringify(solves));
  }, [solves]);

  // Spacebar and touch event listeners for timing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        if (isRunning) {
          stopTimer();
        } else {
          // Prepare to start
          if (!holdTimeoutRef.current) {
            holdTimeoutRef.current = window.setTimeout(() => {
              setIsReady(true);
            }, 300);
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (holdTimeoutRef.current) {
          clearTimeout(holdTimeoutRef.current);
          holdTimeoutRef.current = null;
        }

        if (!isRunning && isReady) {
          startTimer();
        }
        setIsReady(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isRunning, isReady]);

  const startTimer = () => {
    setIsRunning(true);
    startTimeRef.current = performance.now();

    const update = () => {
      setTime(performance.now() - startTimeRef.current);
      timerRef.current = requestAnimationFrame(update);
    };
    timerRef.current = requestAnimationFrame(update);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    const finalTime = (performance.now() - startTimeRef.current) / 1000;
    setTime(performance.now() - startTimeRef.current);

    // Save solve
    setSolves(prev => [finalTime, ...prev.slice(0, 49)]);

    if (finalTime < 30.0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    generateScramble();
  };

  const formatTime = (ms: number) => {
    const totalSec = ms / 1000;
    const minutes = Math.floor(totalSec / 60);
    const seconds = Math.floor(totalSec % 60);
    const hundredths = Math.floor((ms % 1000) / 10);

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
    }
    return `${seconds}.${hundredths.toString().padStart(2, '0')}`;
  };

  // Stats calculation
  const bestTime = solves.length > 0 ? Math.min(...solves) : null;
  const last5 = solves.slice(0, 5);
  const ao5 = last5.length === 5
    ? (() => {
        const sorted = [...last5].sort((a, b) => a - b);
        const trimmed = sorted.slice(1, 4);
        return trimmed.reduce((a, b) => a + b, 0) / 3;
      })()
    : null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-sm text-center">
      {/* Scramble Display */}
      <div className="bg-slate-950/90 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span className="uppercase tracking-wider">WCA Scramble</span>
          <button
            onClick={generateScramble}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>New Scramble</span>
          </button>
        </div>
        <p className="font-mono text-base sm:text-lg font-bold text-slate-200 tracking-wider select-all py-1">
          {scramble}
        </p>
      </div>

      {/* Main Big Timer Display */}
      <div
        onMouseDown={() => {
          if (isRunning) {
            stopTimer();
          } else {
            holdTimeoutRef.current = window.setTimeout(() => setIsReady(true), 300);
          }
        }}
        onMouseUp={() => {
          if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
            holdTimeoutRef.current = null;
          }
          if (!isRunning && isReady) {
            startTimer();
          }
          setIsReady(false);
        }}
        onTouchStart={() => {
          if (isRunning) {
            stopTimer();
          } else {
            holdTimeoutRef.current = window.setTimeout(() => setIsReady(true), 300);
          }
        }}
        onTouchEnd={() => {
          if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
            holdTimeoutRef.current = null;
          }
          if (!isRunning && isReady) {
            startTimer();
          }
          setIsReady(false);
        }}
        className={`py-12 sm:py-16 rounded-2xl border-2 transition-all cursor-pointer select-none ${
          isReady
            ? 'bg-emerald-950/30 border-emerald-500 shadow-lg shadow-emerald-500/20'
            : isRunning
            ? 'bg-slate-950 border-amber-500/50'
            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="space-y-2">
          <div className={`font-mono text-6xl sm:text-8xl font-black tracking-tight ${
            isReady
              ? 'text-emerald-400 scale-105 transition-transform'
              : isRunning
              ? 'text-amber-400'
              : time > 0 && time / 1000 < 30.0
              ? 'text-emerald-400'
              : 'text-slate-100'
          }`}>
            {formatTime(time)}
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-400">
            {isRunning
              ? 'Timing... Press SPACE or CLICK to stop'
              : isReady
              ? 'READY! Release to Start'
              : 'Hold SPACE or CLICK down until green, then release to start'}
          </p>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Best Time</span>
          <span className="text-xl sm:text-2xl font-black text-slate-100 font-mono">
            {bestTime ? `${bestTime.toFixed(2)}s` : '--'}
          </span>
          {bestTime && bestTime < 30.0 && (
            <span className="text-[10px] text-emerald-400 block font-semibold">Sub-30 PB!</span>
          )}
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Current Ao5</span>
          <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
            {ao5 ? `${ao5.toFixed(2)}s` : '--'}
          </span>
          <span className="text-[10px] text-slate-500 block">Average of 5</span>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Sub-30 Target</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            29.99s
          </span>
          <span className="text-[10px] text-slate-400 block">Consistent goal</span>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Solves</span>
          <span className="text-xl sm:text-2xl font-black text-sky-400 font-mono">
            {solves.length}
          </span>
          <button
            onClick={() => setSolves([])}
            className="text-[10px] text-slate-500 hover:text-rose-400 block transition-colors"
          >
            Clear session
          </button>
        </div>
      </div>

      {/* Solves History List */}
      {solves.length > 0 && (
        <div className="space-y-2 text-left pt-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Recent Solves:</span>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
            {solves.map((s, idx) => (
              <span
                key={idx}
                className={`font-mono text-xs px-2.5 py-1 rounded-lg border ${
                  s < 30.0
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold'
                    : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                {s.toFixed(2)}s
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
