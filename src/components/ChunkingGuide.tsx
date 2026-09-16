import React, { useState } from 'react';
import { Brain, Zap, Check, Copy } from 'lucide-react';

export const ChunkingGuide: React.FC = () => {
  const [copiedNotation, setCopiedNotation] = useState<string | null>(null);

  const handleCopy = (notation: string) => {
    navigator.clipboard.writeText(notation);
    setCopiedNotation(notation);
    setTimeout(() => setCopiedNotation(null), 2000);
  };

  const coreTriggers = [
    {
      id: 'sexy',
      name: '1. The Sexy Move',
      notation: "R U R' U'",
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
      tag: 'Used in 60% of all algorithms',
      why: 'Four turns that cycle pieces smoothly without regripping: Up, Push Left, Down, Push Right.',
      fingerSequence: [
        'R: Right wrist rotates UP',
        'U: Right index finger flicks LEFT',
        "R': Right wrist rotates DOWN",
        "U': Left index finger flicks RIGHT"
      ],
      whereUsed: ['OLL 2-Look Bar: F (R U R\' U\') F\'', 'OLL 2-Look Angle: f (R U R\' U\') f\'', 'T-Perm first trigger', 'Y-Perm setup']
    },
    {
      id: 'sledge',
      name: '2. The Sledgehammer',
      notation: "R' F R F'",
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
      tag: 'Orient edges while inserting',
      why: 'Turns down the right slot, pushes front face, restores right slot, pushes front face back.',
      fingerSequence: [
        "R': Right wrist rotates DOWN",
        'F: Right index pushes front face DOWN',
        'R: Right wrist rotates UP',
        "F': Right thumb pushes front face UP"
      ],
      whereUsed: ['Chameleon/T OLL: wide sexy + Sledgehammer', 'Y-Perm finish', 'F2L rotationless inserts']
    },
    {
      id: 'sune',
      name: '3. The Sune Trigger',
      notation: "R U R' U R U2' R'",
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
      tag: 'The #1 Corner Twister',
      why: 'Rhythmic up-and-flick sequence ending with a double flick.',
      fingerSequence: [
        'R U R\' U: Up, flick, down, flick',
        'R: Up once more',
        'U2\': Right index then middle double flick',
        "R': Right wrist restores down"
      ],
      whereUsed: ['OLL Fish Case (Sune & Anti-Sune)', 'Beginner last layer', 'Corner orientation']
    },
    {
      id: 'insert',
      name: '4. The 3-Move Insert',
      notation: "R U' R' (or R U R')",
      color: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
      tag: 'F2L Foundation',
      why: 'Open slot, push piece inside, close slot. The absolute fastest way to store a pair.',
      fingerSequence: [
        'R: Lift the front-right slot',
        "U': Push pair into the open space",
        "R': Pull slot down to lock it into the bottom"
      ],
      whereUsed: ['Connected F2L pairs', 'Free pair inserts', 'Equator setups']
    }
  ];

  return (
    <div className="space-y-8">
      {/* HCI Intro Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>HCI Cognitive Science • Miller's Law</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100">
            Cognitive Chunking: Why You Don't Need to Memorize Letters
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
            Human working memory cannot comfortably hold more than 7 disconnected items. When you see a 14-letter algorithm like <code className="text-amber-400 font-mono font-bold">R U R' U' R' F R2 U' R' U' R U R' F'</code>, your brain experiences cognitive overload. <strong>Chunking</strong> converts that long string into just <strong>3 physical motor words</strong>.
          </p>
        </div>

        {/* Visual Proof / Demonstration */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
            Real Example: The Famous T-Perm Dismantled
          </span>
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-bold">
              1. (R U R' U')
              <span className="block text-[10px] font-normal text-slate-400">Sexy Move</span>
            </div>
            <span className="text-slate-500 font-bold">+</span>
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono font-bold">
              2. (R' F R2 U')
              <span className="block text-[10px] font-normal text-slate-400">Sledge Prep</span>
            </div>
            <span className="text-slate-500 font-bold">+</span>
            <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono font-bold">
              3. (R' U' R U R' F')
              <span className="block text-[10px] font-normal text-slate-400">Insert & Restore</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Instead of 14 letters, you only remember: <strong>Sexy Move $\rightarrow$ Sledge Prep $\rightarrow$ Insert</strong>. Your fingers remember the rhythm!
          </p>
        </div>
      </div>

      {/* The Core 4 Triggers Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>The "Core 4" Speedcubing Finger Triggers</span>
          </h3>
          <span className="text-xs text-slate-500 font-semibold">Master these 4 motor gestures</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {coreTriggers.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 backdrop-blur-sm shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-base font-bold text-slate-100">{t.name}</h4>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${t.color}`}>
                    {t.tag}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="font-mono text-xl font-black text-amber-400 tracking-wide select-all">
                    {t.notation}
                  </span>
                  <button
                    onClick={() => handleCopy(t.notation)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  >
                    {copiedNotation === t.notation ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNotation === t.notation ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.why}
                </p>

                {/* Finger motion sequence */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                    Finger Execution Sequence:
                  </span>
                  {t.fingerSequence.map((seq, idx) => (
                    <div key={idx} className="text-slate-300 text-[11px] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{seq}</span>
                    </div>
                  ))}
                </div>

                {/* Where used */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                    Found Inside These Algorithms:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {t.whereUsed.map((use, idx) => (
                      <span key={idx} className="text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                        {use}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
