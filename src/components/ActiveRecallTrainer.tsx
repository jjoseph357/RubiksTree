import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DecisionSolution } from '../types/cube';
import { ollDecisionTree } from '../data/ollData';
import { pllDecisionTree } from '../data/pllData';
import { f2lDecisionTree } from '../data/f2lData';
import { CubeDiagram } from './CubeDiagram';
import { InteractiveMovePlayer } from './InteractiveMovePlayer';
import { chunkAlgorithm } from '../utils/chunker';
import {
  BrainCircuit,
  Eye,
  Play,
  ArrowRight
} from 'lucide-react';

export const ActiveRecallTrainer: React.FC = () => {
  const [deckType, setDeckType] = useState<'oll' | 'pll' | 'f2l'>('oll');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [mastery, setMastery] = useState<Record<string, 'hard' | 'medium' | 'mastered'>>(() => {
    const saved = localStorage.getItem('rubiks_active_recall_mastery');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedSolution, setSelectedSolution] = useState<DecisionSolution | null>(null);

  // Save mastery to localStorage
  useEffect(() => {
    localStorage.setItem('rubiks_active_recall_mastery', JSON.stringify(mastery));
  }, [mastery]);

  // Extract deck solutions
  const getDeck = (): DecisionSolution[] => {
    const list: DecisionSolution[] = [];
    const tree = deckType === 'oll' ? ollDecisionTree : deckType === 'pll' ? pllDecisionTree : f2lDecisionTree;
    tree.forEach(n => {
      n.options.forEach(opt => {
        if (opt.solution && !list.some(s => s.id === opt.solution!.id)) {
          list.push(opt.solution);
        }
      });
    });
    return list;
  };

  const deck = getDeck();
  const currentCase = deck[currentIdx] || deck[0];

  const handleNext = () => {
    setIsRevealed(false);
    setCurrentIdx((prev) => (prev + 1) % deck.length);
  };

  const handleRate = (rating: 'hard' | 'medium' | 'mastered') => {
    if (!currentCase) return;
    setMastery(prev => ({ ...prev, [currentCase.id]: rating }));

    if (rating === 'mastered') {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 }
      });
    }

    handleNext();
  };

  // Keyboard shortcut: Space or Enter to reveal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!isRevealed) {
          setIsRevealed(true);
        } else {
          handleRate('mastered');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, currentCase]);

  // Compute mastery stats
  const deckMasteredCount = deck.filter(c => mastery[c.id] === 'mastered').length;
  const progressPercent = Math.round((deckMasteredCount / deck.length) * 100);

  const chunks = currentCase ? chunkAlgorithm(currentCase.algorithms.sub30.notation) : [];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Move Player Modal if user wants to step through */}
      {selectedSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <InteractiveMovePlayer
              notation={selectedSolution.algorithms.sub30.notation}
              caseName={selectedSolution.caseName}
              diagramConfig={selectedSolution.diagramConfig}
              setupMoves={selectedSolution.setupMoves}
              fingertricksNotes={selectedSolution.algorithms.sub30.fingertricks}
              onClose={() => setSelectedSolution(null)}
            />
          </div>
        </div>
      )}

      {/* Header & Stats */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4" />
              <span>Active Recall • Retrieval Practice Trainer</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 mt-0.5">
              Rapid Memory Drill
            </h2>
            <p className="text-xs text-slate-400">
              Cognitive science proves that testing your memory builds 300% faster recall than passively reading.
            </p>
          </div>

          {/* Deck Selector */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => { setDeckType('oll'); setCurrentIdx(0); setIsRevealed(false); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                deckType === 'oll' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2-Look OLL ({getDeck().length})
            </button>
            <button
              onClick={() => { setDeckType('pll'); setCurrentIdx(0); setIsRevealed(false); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                deckType === 'pll' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2-Look PLL
            </button>
            <button
              onClick={() => { setDeckType('f2l'); setCurrentIdx(0); setIsRevealed(false); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                deckType === 'f2l' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Essential F2L
            </button>
          </div>
        </div>

        {/* Mastery Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Deck Mastery Progress</span>
            <span className="text-emerald-400 font-bold">{deckMasteredCount} of {deck.length} Mastered ({progressPercent}%)</span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Flashcard */}
      {currentCase && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-sm text-center relative overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Case {currentIdx + 1} of {deck.length}</span>
            {mastery[currentCase.id] && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                mastery[currentCase.id] === 'mastered'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : mastery[currentCase.id] === 'medium'
                  ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              }`}>
                Status: {mastery[currentCase.id]}
              </span>
            )}
          </div>

          {/* Prompt */}
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
                <CubeDiagram config={currentCase.diagramConfig} size={150} />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-100">
              {currentCase.caseName}
            </h3>

            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {!isRevealed
                ? 'Look at this pattern. Try to execute the first trigger or full algorithm on your physical cube!'
                : currentCase.recognitionTip}
            </p>
          </div>

          {/* Hidden vs Revealed Solution Area */}
          {!isRevealed ? (
            <div className="pt-4">
              <button
                onClick={() => setIsRevealed(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mx-auto"
              >
                <Eye className="w-4 h-4" />
                <span>Reveal Algorithm (Space)</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6 pt-2 animate-in fade-in duration-200">
              {/* Chunked Algorithm Display */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span className="text-amber-400">Target Speed: ~{currentCase.algorithms.sub30.timeEstimate}s</span>
                  <span>{currentCase.algorithms.sub30.moveCount} moves</span>
                </div>

                <div className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wide">
                  {currentCase.algorithms.sub30.notation}
                </div>

                {/* Chunks */}
                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  {chunks.map((c, idx) => (
                    <span
                      key={idx}
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-xl border ${c.color}`}
                    >
                      {c.name}: {c.notation}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex justify-center">
                  <button
                    onClick={() => setSelectedSolution(currentCase)}
                    className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-bold transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Open in Interactive Move-by-Move Player</span>
                  </button>
                </div>
              </div>

              {/* Self-Rating Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  How well did you recall it?
                </span>
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => handleRate('hard')}
                    className="py-3 px-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all"
                  >
                    🔴 Forgot / Hard
                  </button>
                  <button
                    onClick={() => handleRate('medium')}
                    className="py-3 px-2 rounded-xl bg-yellow-950/40 hover:bg-yellow-950/70 border border-yellow-500/40 text-yellow-300 text-xs font-bold transition-all"
                  >
                    🟡 Slow Recall
                  </button>
                  <button
                    onClick={() => handleRate('mastered')}
                    className="py-3 px-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all shadow-md shadow-emerald-500/10"
                  >
                    🟢 Mastered!
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-500">
            <button
              onClick={() => {
                if (confirm('Reset all mastery ratings for this deck?')) {
                  const updated = { ...mastery };
                  deck.forEach(c => delete updated[c.id]);
                  setMastery(updated);
                }
              }}
              className="hover:text-slate-400 transition-colors"
            >
              Reset deck progress
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-200 font-bold transition-colors"
            >
              <span>Skip Case</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
