import React, { useState } from 'react';
import { Target, AlertCircle } from 'lucide-react';

export const TimeBudgetBar: React.FC = () => {
  // Configurable splits for interactive breakdown
  const [crossTime, setCrossTime] = useState(3.5);
  const [f2lTime, setF2lTime] = useState(15.0);
  const [ollTime, setOllTime] = useState(3.5);
  const [pllTime, setPllTime] = useState(3.5);
  const [pauseTime, setPauseTime] = useState(2.5);

  const totalTime = crossTime + f2lTime + ollTime + pllTime + pauseTime;
  const isSub30 = totalTime < 30.0;

  const presets = {
    novice: { cross: 9.0, f2l: 34.0, oll: 9.0, pll: 11.0, pause: 8.0, label: 'Past PR (~1 Min / Novice)' },
    sub30: { cross: 3.5, f2l: 15.0, oll: 3.5, pll: 3.5, pause: 2.5, label: 'Sub-30 Target (Balanced)' },
    sub20: { cross: 2.0, f2l: 10.0, oll: 2.0, pll: 2.0, pause: 1.5, label: 'Sub-20 Speedcuber' },
  };

  const applyPreset = (preset: typeof presets.sub30) => {
    setCrossTime(preset.cross);
    setF2lTime(preset.f2l);
    setOllTime(preset.oll);
    setPllTime(preset.pll);
    setPauseTime(preset.pause);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl backdrop-blur-sm">
      {/* Title and Preset Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>The Sub-30 Split Formula</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            Phase Time Budget & Bottleneck Simulator
          </h2>
          <p className="text-xs text-slate-400 pt-1">
            Solve time is just the sum of your 4 phase splits. Use this simulator to find where your time leaks occur.
          </p>
        </div>

        {/* Preset switchers */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => applyPreset(presets.novice)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          >
            Past ~1m Solve
          </button>
          <button
            onClick={() => applyPreset(presets.sub30)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm"
          >
            ⚡ Sub-30 Target
          </button>
          <button
            onClick={() => applyPreset(presets.sub20)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-purple-400 hover:text-purple-200 transition-colors"
          >
            🔥 Sub-20 Pro
          </button>
        </div>
      </div>

      {/* Big Time Display & Target Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border ${
          isSub30 ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'
        }`}>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Estimated Total Time</span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className={`text-3xl sm:text-4xl font-black ${isSub30 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalTime.toFixed(1)}s
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {isSub30 ? '🎉 Sub-30 achieved!' : `+${(totalTime - 30.0).toFixed(1)}s over 30s target`}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">F2L Portion (% of solve)</span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl sm:text-4xl font-black text-amber-400">
              {((f2lTime / totalTime) * 100).toFixed(0)}%
            </span>
            <span className="text-xs text-slate-400">
              (~{(f2lTime / 4).toFixed(1)}s per pair)
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Target Turn Speed (TPS)</span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl sm:text-4xl font-black text-sky-400">
              {(55 / totalTime).toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">
              turns per second (~55 moves total)
            </span>
          </div>
        </div>
      </div>

      {/* Visual Stacked Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Split Distribution</span>
          <span>Target: 30.0s</span>
        </div>

        <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-950 border border-slate-800 p-0.5">
          <div
            style={{ width: `${(crossTime / totalTime) * 100}%` }}
            className="bg-blue-500 hover:brightness-110 transition-all rounded-l"
            title={`Cross: ${crossTime}s`}
          />
          <div
            style={{ width: `${(f2lTime / totalTime) * 100}%` }}
            className="bg-emerald-500 hover:brightness-110 transition-all"
            title={`F2L: ${f2lTime}s`}
          />
          <div
            style={{ width: `${(ollTime / totalTime) * 100}%` }}
            className="bg-yellow-500 hover:brightness-110 transition-all"
            title={`OLL: ${ollTime}s`}
          />
          <div
            style={{ width: `${(pllTime / totalTime) * 100}%` }}
            className="bg-red-500 hover:brightness-110 transition-all"
            title={`PLL: ${pllTime}s`}
          />
          <div
            style={{ width: `${(pauseTime / totalTime) * 100}%` }}
            className="bg-slate-600 hover:brightness-110 transition-all rounded-r"
            title={`Pauses/Recognition: ${pauseTime}s`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300 pt-1">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Cross ({crossTime}s)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> F2L ({f2lTime}s)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> OLL ({ollTime}s)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> PLL ({pllTime}s)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Pauses ({pauseTime}s)</span>
        </div>
      </div>

      {/* Interactive Sliders for Custom Fine-Tuning */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-blue-400">1. Cross</span>
            <span className="font-mono font-bold">{crossTime.toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={crossTime}
            onChange={(e) => setCrossTime(parseFloat(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block">Sub-30 target: ≤ 3.5s</span>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-emerald-400">2. F2L (4 Pairs)</span>
            <span className="font-mono font-bold">{f2lTime.toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="5"
            max="45"
            step="0.5"
            value={f2lTime}
            onChange={(e) => setF2lTime(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block">Sub-30 target: ≤ 15.0s</span>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-yellow-400">3. OLL</span>
            <span className="font-mono font-bold">{ollTime.toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={ollTime}
            onChange={(e) => setOllTime(parseFloat(e.target.value))}
            className="w-full accent-yellow-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block">Sub-30 target: ≤ 3.5s (2-Look)</span>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-red-400">4. PLL</span>
            <span className="font-mono font-bold">{pllTime.toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="0.5"
            value={pllTime}
            onChange={(e) => setPllTime(parseFloat(e.target.value))}
            className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block">Sub-30 target: ≤ 3.5s</span>
        </div>

        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-400">5. Pauses</span>
            <span className="font-mono font-bold">{pauseTime.toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="15"
            step="0.5"
            value={pauseTime}
            onChange={(e) => setPauseTime(parseFloat(e.target.value))}
            className="w-full accent-slate-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block">Sub-30 target: ≤ 2.5s</span>
        </div>
      </div>

      {/* The 3 Biggest Time Wasters for Returning 1-Minute Solvers */}
      <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4 space-y-2">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          Where 1-Minute Solvers Waste 30+ Seconds:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="font-bold text-slate-100 block mb-1">1. Rotating the Cube during F2L</span>
            <p className="text-slate-400">
              Novices rotate the entire cube (y/y') 6 to 10 times per solve (~10 seconds lost!). Sub-30 solvers rotate maximum 1-2 times by inserting into back/side slots.
            </p>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="font-bold text-slate-100 block mb-1">2. Searching for F2L Pieces</span>
            <p className="text-slate-400">
              Pausing 3-4 seconds between every pair to look around. Cure: turn at 2 turns/sec smoothly without stopping to keep eyes tracking the next pair (Lookahead).
            </p>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="font-bold text-slate-100 block mb-1">3. The Daisy Method</span>
            <p className="text-slate-400">
              Building white flower around yellow center then flipping takes 10+ seconds. Building bottom cross directly saves 7 full seconds on every single solve!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
