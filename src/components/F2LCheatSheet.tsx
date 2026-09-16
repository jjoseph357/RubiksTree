import React, { useState } from 'react';
import { CubeDiagram } from './CubeDiagram';
import { Brain, Check, Copy, Zap } from 'lucide-react';
import { f2lDecisionTree } from '../data/f2lData';
import { DecisionSolution } from '../types/cube';

export const F2LCheatSheet: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'connected' | 'white-up' | 'same-color' | 'diff-color' | 'in-slot'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract all solutions from F2L tree
  const solutions: DecisionSolution[] = [];
  f2lDecisionTree.forEach(node => {
    node.options.forEach(opt => {
      if (opt.solution) {
        solutions.push(opt.solution);
      }
    });
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSolutions = solutions.filter(sol => {
    if (filter === 'all') return true;
    if (filter === 'connected') return sol.category === 'Connected Pair';
    if (filter === 'white-up') return sol.category === 'White Up';
    if (filter === 'same-color') return sol.category === 'Colors Match';
    if (filter === 'diff-color') return sol.category === 'Colors Differ';
    if (filter === 'in-slot') return sol.category?.includes('Slot');
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header & The 3 F2L Intuitive Principles */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xl backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>F2L Memory Recovery Lab</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100">
            Re-learning F2L in 3 Simple Mental Rules
          </h2>
          <p className="text-xs text-slate-400">
            You don't need to memorize 41 algorithms! Every single F2L case boils down to setting up one of these 3 base states:
          </p>
        </div>

        {/* 3 Core Principles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Rule 1: Connected Pair (3-Move Insert)
            </span>
            <div className="font-mono text-sm font-bold text-slate-100 bg-slate-900 px-2 py-1 rounded">
              U (R U' R')
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When the corner and edge are already touching and matching, rotate the top layer away from the slot, open the slot with <code className="text-emerald-400">R</code>, push the pair in with <code className="text-emerald-400">U'</code>, and close with <code className="text-emerald-400">R'</code>.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Rule 2: White Side + Same Top Color
            </span>
            <div className="font-mono text-sm font-bold text-slate-100 bg-slate-900 px-2 py-1 rounded">
              "Hide Corner, Move Edge, Unhide"
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If both top stickers are the same color: hide the corner into the slot (<code className="text-amber-400">R'</code>), move the edge into the adjacent spot (<code className="text-amber-400">U2</code>), then bring the corner back (<code className="text-amber-400">R</code>). They bond together!
            </p>
          </div>

          <div className="bg-slate-950/80 border border-sky-500/30 rounded-xl p-4 space-y-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
              Rule 3: White Facing UP
            </span>
            <div className="font-mono text-sm font-bold text-slate-100 bg-slate-900 px-2 py-1 rounded">
              "Match Edge, Hide Edge, Bring Corner"
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When white is on top: match the edge to its side center color. Turn that face AWAY to hide the edge in the bottom layer, turn U2 to bring the corner on top, then unhide the edge.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-500 mr-2">Filter by Case:</span>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap ${
            filter === 'all'
              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          All Key Cases ({solutions.length})
        </button>
        <button
          onClick={() => setFilter('connected')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap ${
            filter === 'connected'
              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          Instant Inserts
        </button>
        <button
          onClick={() => setFilter('same-color')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap ${
            filter === 'same-color'
              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          Same Top Color (Hide Corner)
        </button>
        <button
          onClick={() => setFilter('diff-color')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap ${
            filter === 'diff-color'
              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          Diff Top Colors (3-Move)
        </button>
        <button
          onClick={() => setFilter('white-up')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap ${
            filter === 'white-up'
              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          White Facing UP
        </button>
        <button
          onClick={() => setFilter('in-slot')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap ${
            filter === 'in-slot'
              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          Piece Stuck in Slot
        </button>
      </div>

      {/* Case Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSolutions.map((sol) => (
          <div
            key={sol.id}
            className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 backdrop-blur-sm transition-all shadow-md"
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {sol.category}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">
                  {sol.caseName}
                </h3>
              </div>

              <div className="flex items-center justify-center p-2.5 bg-slate-950 rounded-xl border border-slate-800 my-1">
                <CubeDiagram config={sol.diagramConfig} size={150} />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {sol.recognitionTip}
              </p>

              {/* Sub-30 Speed Alg */}
              <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Zap className="w-3 h-3" /> Sub-30 Algorithm:
                  </span>
                  <span className="font-mono text-slate-300">
                    ~{sol.algorithms.sub30.timeEstimate}s ({sol.algorithms.sub30.moveCount} moves)
                  </span>
                </div>
                <div className="font-mono text-sm font-bold text-slate-100 tracking-wide">
                  {sol.algorithms.sub30.notation}
                </div>
                {sol.algorithms.sub30.fingertricks && (
                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                    {sol.algorithms.sub30.fingertricks}
                  </p>
                )}
              </div>
            </div>

            {/* Practice Scramble footer */}
            {sol.setupMoves && (
              <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
                <span className="truncate mr-2 font-mono text-[11px]">
                  Setup: <span className="text-slate-300">{sol.setupMoves}</span>
                </span>
                <button
                  onClick={() => handleCopy(sol.setupMoves || '', sol.id)}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                >
                  {copiedId === sol.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === sol.id ? 'Copied' : 'Scramble'}</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
