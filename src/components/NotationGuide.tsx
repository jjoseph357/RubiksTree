import React, { useState } from 'react';
import { BookOpen, Zap, Sparkles, Check, Copy } from 'lucide-react';

export const NotationGuide: React.FC = () => {
  const [copiedNotation, setCopiedNotation] = useState<string | null>(null);

  const handleCopy = (notation: string) => {
    navigator.clipboard.writeText(notation);
    setCopiedNotation(notation);
    setTimeout(() => setCopiedNotation(null), 2000);
  };

  const coreMoves = [
    { move: 'R', desc: 'Right face clockwise (upward turn)', color: 'text-amber-400' },
    { move: "R'", desc: 'Right face counter-clockwise (downward turn)', color: 'text-amber-400' },
    { move: 'R2', desc: 'Right face 180° double turn', color: 'text-amber-400' },
    { move: 'U', desc: 'Up (top) face clockwise (leftward flick)', color: 'text-yellow-400' },
    { move: "U'", desc: 'Up (top) face counter-clockwise (rightward flick)', color: 'text-yellow-400' },
    { move: 'U2', desc: 'Up face 180° double flick (index + middle finger)', color: 'text-yellow-400' },
    { move: 'F', desc: 'Front face clockwise (right index push down)', color: 'text-green-400' },
    { move: "F'", desc: 'Front face counter-clockwise (right thumb push up)', color: 'text-green-400' },
    { move: 'L', desc: 'Left face clockwise (downward turn)', color: 'text-orange-400' },
    { move: "L'", desc: 'Left face counter-clockwise (upward turn)', color: 'text-orange-400' },
    { move: 'D', desc: 'Down (bottom) face clockwise (left ring flick)', color: 'text-blue-400' },
    { move: "D'", desc: 'Down (bottom) face counter-clockwise (left ring push)', color: 'text-blue-400' },
    { move: 'M', desc: 'Middle slice downward (same direction as L)', color: 'text-sky-400' },
    { move: "M'", desc: 'Middle slice upward (ring finger bottom push)', color: 'text-sky-400' },
    { move: 'M2', desc: 'Middle slice 180° double flick (ring then middle)', color: 'text-sky-400' },
    { move: 'r', desc: 'Wide right: turn both R and M together clockwise', color: 'text-purple-400' },
    { move: 'f', desc: 'Wide front: turn both F and S together clockwise', color: 'text-purple-400' },
  ];

  const coreTriggers = [
    {
      name: 'Sexy Move',
      notation: "R U R' U'",
      desc: 'The most fundamental muscle memory trigger in cubing. Used in OLL, PLL, and F2L.',
      targetSpeed: '0.4s'
    },
    {
      name: 'Inverse Sexy',
      notation: "U R U' R'",
      desc: 'Reversed flow. Often used to prepare or insert F2L pairs into the right slot.',
      targetSpeed: '0.4s'
    },
    {
      name: 'Sledgehammer',
      notation: "R' F R F'",
      desc: 'Changes top layer edge orientation while inserting. Essential for advanced OLL control.',
      targetSpeed: '0.5s'
    },
    {
      name: 'Hedgeslammer',
      notation: "F R' F' R",
      desc: 'Inverse of the sledgehammer. Great for left hand or front-oriented pairs.',
      targetSpeed: '0.5s'
    },
    {
      name: 'Sune Trigger',
      notation: "R U R' U R U2' R'",
      desc: 'The core corner-twisting sequence. Used in 2-Look OLL and beginner solves alike.',
      targetSpeed: '0.8s'
    },
    {
      name: 'T-Perm Setup',
      notation: "(R' F R2 U') (R' U' R U) (R' F')",
      desc: 'The second half of T-perm. Fluid single-grip flow.',
      targetSpeed: '0.9s'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Intro card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Speedcubing Language</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            WCA Notation & Ergonomic Triggers
          </h2>
          <p className="text-xs text-slate-400">
            A letter by itself means <strong className="text-slate-200">clockwise 90°</strong>. An apostrophe (<strong className="text-amber-400">'</strong>) means <strong className="text-slate-200">counter-clockwise (prime) 90°</strong>. A number <strong className="text-slate-200">2</strong> means a <strong className="text-slate-200">180° double turn</strong>.
          </p>
        </div>
      </div>

      {/* Core Triggers (The Sub-30 Building Blocks) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Essential Muscle Memory Triggers</span>
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Drill these until automatic</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreTriggers.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-3 backdrop-blur-sm flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 text-sm">{t.name}</span>
                  <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Target: ≤ {t.targetSpeed}
                  </span>
                </div>
                <div className="font-mono text-base font-bold text-amber-300 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
                  {t.notation}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {t.desc}
                </p>
              </div>

              <button
                onClick={() => handleCopy(t.notation)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors mt-2"
              >
                {copiedNotation === t.notation ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Trigger</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Notation Reference Matrix */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Move Notation Cheat Sheet</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {coreMoves.map((m, idx) => (
            <div
              key={idx}
              className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3.5"
            >
              <div className={`font-mono text-xl font-black w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800 shrink-0 ${m.color}`}>
                {m.move}
              </div>
              <div className="text-xs text-slate-300 leading-snug">
                {m.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
