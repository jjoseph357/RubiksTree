import React, { useState } from 'react';
import { Algorithm, DifficultyLevel } from '../types/cube';
import { Copy, Check, Zap, Sparkles, Clock, Layers, HelpCircle, Play } from 'lucide-react';
import { chunkAlgorithm } from '../utils/chunker';
import { InteractiveMovePlayer } from './InteractiveMovePlayer';

interface AlgorithmCardProps {
  algorithm: Algorithm;
  allAlgorithms?: {
    intuitive?: Algorithm;
    sub30: Algorithm;
    pro?: Algorithm;
  };
  currentDifficulty: DifficultyLevel;
  onSelectDifficulty?: (level: DifficultyLevel) => void;
  setupMoves?: string;
  sub30Tip?: string;
}

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({
  algorithm,
  allAlgorithms,
  currentDifficulty,
  onSelectDifficulty,
  setupMoves,
  sub30Tip,
}) => {
  const [copiedNotation, setCopiedNotation] = useState(false);
  const [copiedSetup, setCopiedSetup] = useState(false);
  const [selectedAltIdx, setSelectedAltIdx] = useState<number | null>(null);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);

  const activeAlg = selectedAltIdx !== null && algorithm.alternativeAlgs?.[selectedAltIdx]
    ? {
        ...algorithm,
        notation: algorithm.alternativeAlgs[selectedAltIdx].notation,
        timeEstimate: algorithm.alternativeAlgs[selectedAltIdx].timeEstimate,
        notes: algorithm.alternativeAlgs[selectedAltIdx].note
      }
    : algorithm;

  const handleCopy = (text: string, isSetup = false) => {
    navigator.clipboard.writeText(text);
    if (isSetup) {
      setCopiedSetup(true);
      setTimeout(() => setCopiedSetup(false), 2000);
    } else {
      setCopiedNotation(true);
      setTimeout(() => setCopiedNotation(false), 2000);
    }
  };

  // Helper to format notation with trigger highlights
  const renderFormattedNotation = (notation: string) => {
    const parts = notation.split(/(\([^)]+\))/g);
    return (
      <span className="font-mono text-xl sm:text-2xl font-bold tracking-wide">
        {parts.map((part, idx) => {
          if (part.startsWith('(') && part.endsWith(')')) {
            return (
              <span key={idx} className="text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30 inline-block mx-0.5 my-1">
                {part}
              </span>
            );
          }
          return <span key={idx} className="text-slate-100">{part}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-5">
      {/* Header: Difficulty Selector Tabs (if multiple available) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Recommended Solution</span>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            {activeAlg.name}
          </h3>
        </div>

        {allAlgorithms && onSelectDifficulty && (
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
            {allAlgorithms.intuitive && (
              <button
                onClick={() => { setSelectedAltIdx(null); onSelectDifficulty('intuitive'); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  currentDifficulty === 'intuitive'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🌱 Intuitive
              </button>
            )}
            <button
              onClick={() => { setSelectedAltIdx(null); onSelectDifficulty('sub30'); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentDifficulty === 'sub30'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚡ Sub-30 Target
            </button>
            {allAlgorithms.pro && (
              <button
                onClick={() => { setSelectedAltIdx(null); onSelectDifficulty('pro'); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  currentDifficulty === 'pro'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔥 Speedcuber Pro
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Algorithm Display */}
      <div className="bg-slate-950/80 rounded-xl p-4 sm:p-5 border border-slate-800/80 space-y-3 relative group">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Execution Moves
          </span>
          <button
            onClick={() => handleCopy(activeAlg.notation)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            title="Copy Algorithm"
          >
            {copiedNotation ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Alg</span>
              </>
            )}
          </button>
        </div>

        <div className="py-1 overflow-x-auto">
          {renderFormattedNotation(activeAlg.notation)}
        </div>

        {/* Cognitive Chunked Formula */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Cognitive Chunking (Memorize by Trigger):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {chunkAlgorithm(activeAlg.notation).map((c, idx) => (
              <span
                key={idx}
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${c.color}`}
              >
                {c.name}: {c.notation}
              </span>
            ))}
          </div>
        </div>

        {/* Badges: Move count, Target execution time & Step Player Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs font-medium">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeAlg.moveCount} moves (HTM)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Sub-30: ~{activeAlg.timeEstimate.toFixed(1)}s</span>
            </div>
          </div>

          <button
            onClick={() => setShowPlayer(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Interactive Move Player</span>
          </button>
        </div>
      </div>

      {/* Step Player Modal */}
      {showPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <InteractiveMovePlayer
              notation={activeAlg.notation}
              caseName={activeAlg.name}
              setupMoves={setupMoves}
              fingertricksNotes={activeAlg.fingertricks}
              onClose={() => setShowPlayer(false)}
            />
          </div>
        </div>
      )}

      {/* Alternative Algorithms Switcher (if any) */}
      {algorithm.alternativeAlgs && algorithm.alternativeAlgs.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-400 block">Alternative Variations:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedAltIdx(null)}
              className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                selectedAltIdx === null
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              Primary (~{algorithm.timeEstimate}s)
            </button>
            {algorithm.alternativeAlgs.map((alt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedAltIdx(idx)}
                className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                  selectedAltIdx === idx
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {alt.note} (~{alt.timeEstimate}s)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Intuitive Steps Breakdown (if available) */}
      {activeAlg.intuitiveSteps && activeAlg.intuitiveSteps.length > 0 && (
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Intuitive Logic (How to remember without memorizing)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300 pl-1">
            {activeAlg.intuitiveSteps.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fingertricks & Execution Tips */}
      {activeAlg.fingertricks && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Fingertrick & Ergonomics</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeAlg.fingertricks}
          </p>
        </div>
      )}

      {/* Sub-30 Pro Tip */}
      {sub30Tip && (
        <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sub-30 Advice</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {sub30Tip}
          </p>
        </div>
      )}

      {/* Setup Scramble Moves (Practice on your Cube!) */}
      {setupMoves && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 overflow-hidden">
            <span className="text-[11px] font-semibold text-slate-400 block flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-sky-400" />
              Practice Setup (Do on a solved cube):
            </span>
            <span className="font-mono text-slate-200 block truncate select-all font-semibold">
              {setupMoves}
            </span>
          </div>
          <button
            onClick={() => handleCopy(setupMoves, true)}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {copiedSetup ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSetup ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
