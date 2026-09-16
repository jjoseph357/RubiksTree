import React, { useState } from 'react';
import { Phase } from '../types/cube';
import { Compass, X, ArrowRight } from 'lucide-react';

interface CubeLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhase: (phase: Phase) => void;
}

export const CubeLocatorModal: React.FC<CubeLocatorModalProps> = ({
  isOpen,
  onClose,
  onSelectPhase,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  if (!isOpen) return null;

  const handleReset = () => {
    setStep(1);
  };

  const handleRoute = (phase: Phase) => {
    onSelectPhase(phase);
    onClose();
    handleReset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 bg-slate-800 hover:bg-slate-750 p-2 rounded-full transition-colors"
          title="Close guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Where Am I? • Step Finder</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100">
            Let's Check Your Cube Together
          </h2>
          <p className="text-xs text-slate-400">
            Pick up your cube and answer these 3 quick visual questions to find your exact step.
          </p>
        </div>

        {/* Orientation Note */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center text-sm font-bold shrink-0">
            👋
          </div>
          <div>
            <strong className="text-amber-400 font-bold block">First, Hold Your Cube Like This:</strong>
            <span>Keep the <strong>WHITE</strong> center on the <strong>BOTTOM</strong> (facing the table) and the <strong>YELLOW</strong> center on the <strong>TOP</strong> (facing the ceiling).</span>
          </div>
        </div>

        {/* Step 1: Cross Check */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                Question 1 of 3: The Bottom Cross
              </span>
              <h3 className="text-base font-bold text-slate-100">
                Look at the BOTTOM (White face). Is there a completed White Cross?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A completed cross means 4 white edges surround the white center, and their side stickers match the red, green, orange, and blue side centers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleRoute('cross')}
                className="p-4 rounded-2xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 text-left space-y-1 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-300 text-sm">❌ No, not yet</span>
                  <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400">
                  My cube is scrambled or the white cross is missing pieces.
                </p>
                <div className="pt-2 text-xs font-bold text-rose-400">
                  → Start at Phase 1: White Cross
                </div>
              </button>

              <button
                onClick={() => setStep(2)}
                className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-950/40 text-left space-y-1 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300 text-sm">✅ Yes, White Cross is done!</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400">
                  All 4 white cross edges are solved and match their side centers.
                </p>
                <div className="pt-2 text-xs font-bold text-emerald-400">
                  Check Next Step →
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: F2L Check */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Question 2 of 3: First Two Layers (F2L)
              </span>
              <h3 className="text-base font-bold text-slate-100">
                Look at the BOTTOM TWO LAYERS. Are all 4 vertical corner-edge slots filled with solid matching colors?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When F2L is finished, the entire bottom white face is complete AND the first two layers around all 4 sides are solid blocks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleRoute('f2l')}
                className="p-4 rounded-2xl border border-amber-500/40 bg-amber-950/20 hover:bg-amber-950/40 text-left space-y-1 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 text-sm">❌ No, I have missing slots</span>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400">
                  I have 0, 1, 2, or 3 pairs solved. I need to solve corner-edge pairs!
                </p>
                <div className="pt-2 text-xs font-bold text-amber-400">
                  → Start at Phase 2: F2L Pairs
                </div>
              </button>

              <button
                onClick={() => setStep(3)}
                className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-950/40 text-left space-y-1 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300 text-sm">✅ Yes, both bottom layers are solid!</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400">
                  All 4 F2L pairs are solved. Only the top yellow layer remains.
                </p>
                <div className="pt-2 text-xs font-bold text-emerald-400">
                  Check Top Layer →
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Top Layer OLL vs PLL */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block">
                Question 3 of 3: Top Yellow Face
              </span>
              <h3 className="text-base font-bold text-slate-100">
                Look at the TOP FACE (Yellow). Are ALL 9 stickers solid YELLOW?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If some stickers on top are not yellow, you need OLL (orienting the yellow face). If all 9 are yellow, you are on PLL (the very last step!).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleRoute('oll')}
                className="p-4 rounded-2xl border border-yellow-500/40 bg-yellow-950/20 hover:bg-yellow-950/40 text-left space-y-1 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-yellow-300 text-sm">❌ No, top face has other colors</span>
                  <ArrowRight className="w-4 h-4 text-yellow-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400">
                  I need to make the entire top face yellow!
                </p>
                <div className="pt-2 text-xs font-bold text-yellow-400">
                  → Start at Phase 3: OLL
                </div>
              </button>

              <button
                onClick={() => handleRoute('pll')}
                className="p-4 rounded-2xl border border-purple-500/40 bg-purple-950/20 hover:bg-purple-950/40 text-left space-y-1 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 text-sm">✅ Yes, entire top face is YELLOW!</span>
                  <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Top is completely yellow, I just need to arrange the side stickers to finish the cube!
                </p>
                <div className="pt-2 text-xs font-bold text-purple-400">
                  → Start at Phase 4: PLL (Last Step)
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Back / Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              ← Back to previous question
            </button>
          ) : (
            <span className="text-slate-500">Step 1 of 3</span>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            I know where I am (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
