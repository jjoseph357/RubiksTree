import React, { useState, useEffect, useRef } from 'react';
import { DiagramConfig } from '../types/cube';
import { CubeDiagram } from './CubeDiagram';
import { parseIndividualMoves, chunkAlgorithm, mirrorAlgToLeftSlot } from '../utils/chunker';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Zap,
  HelpCircle,
  Keyboard,
  Sparkles,
  Compass
} from 'lucide-react';

interface InteractiveMovePlayerProps {
  notation: string;
  caseName: string;
  diagramConfig?: DiagramConfig;
  howToHold?: string;
  setupMoves?: string;
  fingertricksNotes?: string;
  onClose?: () => void;
}

export const InteractiveMovePlayer: React.FC<InteractiveMovePlayerProps> = ({
  notation,
  caseName,
  diagramConfig,
  howToHold,
  setupMoves,
  fingertricksNotes,
  onClose,
}) => {
  const [isLeftSlot, setIsLeftSlot] = useState<boolean>(false);

  const activeNotation = isLeftSlot ? mirrorAlgToLeftSlot(notation) : notation;
  const activeSetupMoves = setupMoves ? (isLeftSlot ? mirrorAlgToLeftSlot(setupMoves) : setupMoves) : undefined;
  const moves = parseIndividualMoves(activeNotation);
  const chunks = chunkAlgorithm(activeNotation);

  const adaptHowToHoldForLeft = (text?: string): string | undefined => {
    if (!text) return text;
    return text
      .replace(/Front-Right \(FR\)/g, 'Front-Left (FL)')
      .replace(/Front-Right/g, 'Front-Left')
      .replace(/FRONT-RIGHT/g, 'FRONT-LEFT')
      .replace(/UFR/g, 'UFL')
      .replace(/right hand \(Right\)/g, 'left hand (Left)')
      .replace(/to your right hand/g, 'to your left hand')
      .replace(/Right center on right/g, 'Left center on left')
      .replace(/on your right hand/g, 'on your left hand')
      .replace(/White facing RIGHT/g, 'White facing LEFT');
  };
  const activeHowToHold = isLeftSlot ? adaptHowToHoldForLeft(howToHold) : howToHold;

  const adaptFingertricksForLeft = (text?: string): string | undefined => {
    if (!text) return text;
    const mirroredAlgs = text.replace(/\(([^)]+)\)/g, (_m, inner) => `(${mirrorAlgToLeftSlot(inner)})`);
    return mirroredAlgs.replace(/\b(right|left|Right|Left)\b/g, (m) => {
      switch (m) {
        case 'right': return 'left';
        case 'left': return 'right';
        case 'Right': return 'Left';
        case 'Left': return 'Right';
        default: return m;
      }
    });
  };
  const activeFingertricksNotes = isLeftSlot ? adaptFingertricksForLeft(fingertricksNotes) : fingertricksNotes;

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // 1.0s per move
  const [copiedSetup, setCopiedSetup] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);


  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      } else if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, moves.length]);

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setTimeout(() => {
        if (currentIdx < moves.length - 1) {
          setCurrentIdx(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIdx, playbackSpeed, moves.length]);

  const handleNext = () => {
    if (currentIdx < moves.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Loop back to start if at end
      setCurrentIdx(0);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIdx(0);
  };

  const togglePlay = () => {
    if (!isPlaying && currentIdx === moves.length - 1) {
      setCurrentIdx(0);
    }
    setIsPlaying(prev => !prev);
  };

  const handleCopySetup = () => {
    if (!activeSetupMoves) return;
    navigator.clipboard.writeText(activeSetupMoves);
    setCopiedSetup(true);
    setTimeout(() => setCopiedSetup(false), 2000);
  };

  const activeMove = moves[currentIdx] || moves[0];
  const progressPercent = moves.length > 1 ? (currentIdx / (moves.length - 1)) * 100 : 100;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md space-y-6 max-w-2xl mx-auto">
      {/* Header: Title & Close */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Move-by-Move Player</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 mt-0.5">
            {caseName}
          </h2>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-colors"
          >
            ✕ Close
          </button>
        )}
      </div>

      {/* Target Slot & Hand Mode Selector (Right Slot FR vs Left Slot FL Mirrored) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Target Slot & Hand:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setIsLeftSlot(false); setCurrentIdx(0); setIsPlaying(false); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                !isLeftSlot
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>✋</span>
              <span>Right Slot (FR)</span>
            </button>
            <button
              onClick={() => { setIsLeftSlot(true); setCurrentIdx(0); setIsPlaying(false); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                isLeftSlot
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>🤚</span>
              <span>Left Slot (FL) Mirrored</span>
            </button>
          </div>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          {isLeftSlot ? '🔄 Mirrored (R ↔ L\', U ↔ U\') for Left-Slot insert' : 'Standard Front-Right execution'}
        </span>
      </div>

      {/* Cognitive Chunking Badges: Shows the 2-3 named triggers */}
      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span className="flex items-center gap-1.5 text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Memory Formula (Chunked in Triggers):</span>
          </span>
          <span className="text-[11px] text-slate-500">Memorize the chunks, not individual letters!</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {chunks.map((chunk, idx) => (
            <div
              key={idx}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${chunk.color}`}
            >
              <span>{chunk.name}:</span>
              <span className="font-mono text-sm tracking-wide">{chunk.notation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Starting Orientation Callout */}
      {activeHowToHold && (
        <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-3.5 flex items-start gap-3 shadow-inner">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              🧭 HOW TO HOLD (Physical Orientation):
            </span>
            <p className="text-xs font-semibold text-emerald-200 mt-0.5 leading-relaxed">
              {activeHowToHold}
            </p>
          </div>
        </div>
      )}


      {/* Main Focus Stage: Active Move Display & Fingertrick Gesture */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-slate-950 rounded-2xl p-5 sm:p-6 border border-slate-800 relative overflow-hidden">
        {/* Left: Diagram */}
        {diagramConfig && (
          <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-slate-900/70 rounded-2xl border border-slate-800 shadow-inner">
            <CubeDiagram config={diagramConfig} size={180} />
            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Starting Position</span>
          </div>
        )}

        {/* Right: Big Active Move & Finger Motion */}
        <div className={`${diagramConfig ? 'sm:col-span-7' : 'sm:col-span-12'} space-y-3`}>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="bg-slate-800 px-2.5 py-1 rounded-md text-slate-300">
              Move {currentIdx + 1} of {moves.length}
            </span>
            <span className="text-amber-400 font-bold">
              {Math.round(progressPercent)}% Done
            </span>
          </div>

          {/* Huge Animated Move Badge */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-mono font-black text-4xl sm:text-5xl shadow-lg shadow-amber-500/20 shrink-0 select-none">
              {activeMove.move}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <span className="text-base">{activeMove.icon}</span>
                <span>{activeMove.finger}</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
                {activeMove.action}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Move Scrubber Bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {moves.map((m, idx) => {
            const isCurrent = idx === currentIdx;
            const isPast = idx < currentIdx;
            return (
              <button
                key={idx}
                onClick={() => { setIsPlaying(false); setCurrentIdx(idx); }}
                className={`font-mono text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 scale-110 shadow-md shadow-amber-500/30'
                    : isPast
                    ? 'bg-slate-800 text-slate-400 border border-slate-700'
                    : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300'
                }`}
              >
                {m.move}
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-amber-500 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Playback Controls & Speed */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors"
            title="Previous Move (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <button
            onClick={togglePlay}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-colors shadow-md shadow-amber-500/20"
            title="Next Move (Right Arrow or Space)"
          >
            <span>{currentIdx === moves.length - 1 ? 'Start Over' : 'Next Move'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset (R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs text-slate-400">
          <span className="px-2 text-[11px] font-semibold text-slate-500">Speed:</span>
          {[
            { label: '0.6s', speed: 600 },
            { label: '1.0s', speed: 1000 },
            { label: '1.5s', speed: 1500 },
          ].map((s) => (
            <button
              key={s.speed}
              onClick={() => setPlaybackSpeed(s.speed)}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
                playbackSpeed === s.speed
                  ? 'bg-slate-800 text-amber-400'
                  : 'hover:text-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
        <span className="flex items-center gap-1.5">
          <Keyboard className="w-3.5 h-3.5 text-slate-400" />
          <span>Keyboard: Press <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">Right Arrow</kbd> or <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">Space</kbd> for next move, <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">Left Arrow</kbd> for back.</span>
        </span>
      </div>

      {/* Physical Setup Scramble */}
      {activeSetupMoves && (
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="overflow-hidden">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-sky-400" />
              Practice Setup (Do on a solved cube):
            </span>
            <span className="font-mono text-slate-300 block truncate select-all font-semibold pt-0.5">
              {activeSetupMoves}
            </span>
          </div>
          <button
            onClick={handleCopySetup}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {copiedSetup ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedSetup ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      )}

      {activeFingertricksNotes && (
        <p className="text-xs text-slate-400 italic">
          💡 {activeFingertricksNotes}
        </p>
      )}

    </div>
  );
};
