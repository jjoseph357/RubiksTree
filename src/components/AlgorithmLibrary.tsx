import React, { useState } from 'react';
import { fullPLLLibrary } from '../data/pllData';
import { ollDecisionTree } from '../data/ollData';
import { CubeDiagram } from './CubeDiagram';
import { Layers, Copy, Check } from 'lucide-react';
import { DecisionSolution } from '../types/cube';

export const AlgorithmLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'oll' | 'pll' | 'full-pll'>('oll');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract OLL solutions
  const ollSolutions: DecisionSolution[] = [];
  ollDecisionTree.forEach(node => {
    node.options.forEach(opt => {
      if (opt.solution) ollSolutions.push(opt.solution);
    });
  });

  const handleCopy = (notation: string, id: string) => {
    navigator.clipboard.writeText(notation);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Library Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Algorithm Reference</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            CFOP Algorithm Library
          </h2>
        </div>

        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('oll')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'oll'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🟡 2-Look OLL (9 Algs)
          </button>
          <button
            onClick={() => setActiveTab('full-pll')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'full-pll'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏁 Full PLL (21 Algs)
          </button>
        </div>
      </div>

      {/* 2-Look OLL Section */}
      {activeTab === 'oll' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
            <strong className="text-amber-400 font-bold">The Sub-30 Secret for OLL:</strong> Do NOT memorize all 57 OLL algorithms. 2-Look OLL solves the yellow top in 2 quick steps with only 9 algorithms total (3 for Edge Orientation + 7 for Corner Orientation). Total execution time: ~3.0 - 3.5s!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ollSolutions.map((sol) => (
              <div
                key={sol.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 backdrop-blur-sm"
              >
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-wider">
                      {sol.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-100">{sol.caseName}</h3>
                  </div>

                  <div className="flex items-center justify-center p-2.5 bg-slate-950 rounded-xl border border-slate-800 my-1">
                    <CubeDiagram config={sol.diagramConfig} size={150} />
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{sol.recognitionTip}</p>

                  <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                      <span className="text-amber-400">Algorithm:</span>
                      <span>~{sol.algorithms.sub30.timeEstimate}s ({sol.algorithms.sub30.moveCount} moves)</span>
                    </div>
                    <div className="font-mono text-sm font-bold text-slate-100">
                      {sol.algorithms.sub30.notation}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span className="truncate mr-2 font-mono text-[11px]">
                    Setup: {sol.setupMoves}
                  </span>
                  <button
                    onClick={() => handleCopy(sol.algorithms.sub30.notation, sol.id)}
                    className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {copiedId === sol.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === sol.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full PLL Section */}
      {activeTab === 'full-pll' && (
        <div className="space-y-6">
          <div className="bg-purple-950/20 p-4 rounded-xl border border-purple-500/20 text-xs text-slate-300">
            <strong className="text-purple-400 font-bold">Sub-30 & Sub-20 PLL Strategy:</strong> Start by mastering the 6 core PLLs (<strong className="text-amber-300">T, Y, Ua, Ub, H, Z</strong>). Then learn <strong className="text-purple-300">Jb, Ja, Aa, Ab</strong> (super fast 1-second algs). Full PLL has the single highest return on investment in speedcubing!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fullPLLLibrary.map((pll) => (
              <div
                key={pll.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3 backdrop-blur-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        pll.priority === 'Essential (Sub-30)'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}>
                        {pll.priority}
                      </span>
                      <h3 className="text-base font-bold text-slate-100 mt-1">{pll.name} ({pll.type})</h3>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      ~{pll.timeEstimate}s • {pll.moveCount}m
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    <strong className="text-slate-300">Recognition: </strong>{pll.recognition}
                  </p>

                  <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 space-y-1.5">
                    <div className="font-mono text-sm font-bold text-slate-100">
                      {pll.notation}
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      {pll.fingertricks}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => handleCopy(pll.notation, pll.id)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  >
                    {copiedId === pll.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === pll.id ? 'Copied Alg' : 'Copy Alg'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
