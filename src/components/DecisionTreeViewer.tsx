import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Phase, DifficultyLevel, DecisionNode, DecisionOption, DecisionSolution } from '../types/cube';
import { crossDecisionTree } from '../data/crossData';
import { f2lDecisionTree } from '../data/f2lData';
import { ollDecisionTree } from '../data/ollData';
import { pllDecisionTree } from '../data/pllData';
import { CubeDiagram } from './CubeDiagram';
import { AlgorithmCard } from './AlgorithmCard';
import { CubeLocatorModal } from './CubeLocatorModal';
import { ArrowLeft, RotateCcw, ChevronRight, Sparkles, HelpCircle, Compass, CheckCircle2, GraduationCap } from 'lucide-react';

interface DecisionTreeViewerProps {
  currentDifficulty: DifficultyLevel;
  onDifficultyChange: (level: DifficultyLevel) => void;
  activePhase?: Phase;
  onPhaseChange?: (phase: Phase) => void;
  onOpenAcademy?: (lessonIdx: number) => void;
}

interface HistoryEntry {
  node: DecisionNode;
  selectedOption: DecisionOption;
}

export const DecisionTreeViewer: React.FC<DecisionTreeViewerProps> = ({
  currentDifficulty,
  onDifficultyChange,
  activePhase: propPhase,
  onPhaseChange,
  onOpenAcademy
}) => {
  const [phase, setPhase] = useState<Phase>(propPhase || 'cross'); // Default to Cross (Step 1)
  const [currentNodeId, setCurrentNodeId] = useState<string>('cross-start');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeSolution, setActiveSolution] = useState<DecisionSolution | null>(null);
  const [isLocatorOpen, setIsLocatorOpen] = useState<boolean>(false);

  const phaseToLessonIdx: Record<Phase, number> = {
    cross: 1, // Lesson 2: Cross
    f2l: 2,   // Lesson 3: F2L
    oll: 3,   // Lesson 4: Yellow Face
    pll: 4    // Lesson 5: Permutation
  };

  // Sync propPhase if changed from outside
  useEffect(() => {
    if (propPhase && propPhase !== phase) {
      handlePhaseSwitch(propPhase);
    }
  }, [propPhase]);

  // Get nodes for current phase
  const getPhaseTree = (p: Phase): DecisionNode[] => {
    switch (p) {
      case 'cross': return crossDecisionTree;
      case 'f2l': return f2lDecisionTree;
      case 'oll': return ollDecisionTree;
      case 'pll': return pllDecisionTree;
    }
  };

  const currentTree = getPhaseTree(phase);
  const currentNode = currentTree.find(n => n.id === currentNodeId) || currentTree[0];

  const handlePhaseSwitch = (newPhase: Phase) => {
    setPhase(newPhase);
    if (onPhaseChange) onPhaseChange(newPhase);
    setHistory([]);
    setActiveSolution(null);
    const firstNode = getPhaseTree(newPhase)[0];
    setCurrentNodeId(firstNode ? firstNode.id : '');
  };

  const handleOptionSelect = (option: DecisionOption) => {
    // If option has a direct solution
    if (option.solution) {
      setHistory(prev => [...prev, { node: currentNode, selectedOption: option }]);
      setActiveSolution(option.solution);

      if (option.solution.phase === 'pll' && option.solution.caseName.includes('Solved')) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      return;
    }

    // If option points to next node
    if (option.nextNodeId) {
      setHistory(prev => [...prev, { node: currentNode, selectedOption: option }]);
      setCurrentNodeId(option.nextNodeId);
      setActiveSolution(null);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentNodeId(last.node.id);
    setActiveSolution(null);
  };

  const handleResetPhase = () => {
    setHistory([]);
    setActiveSolution(null);
    setCurrentNodeId(currentTree[0].id);
  };

  const handleNextPhase = () => {
    const phases: Phase[] = ['cross', 'f2l', 'oll', 'pll'];
    const nextIdx = (phases.indexOf(phase) + 1) % phases.length;
    handlePhaseSwitch(phases[nextIdx]);
  };

  // Phase badges config
  const phasesMeta: { id: Phase; name: string; targetTime: string; icon: string }[] = [
    { id: 'cross', name: '1. Cross', targetTime: '~3s', icon: '➕' },
    { id: 'f2l', name: '2. F2L Pairs', targetTime: '~15s', icon: '🧩' },
    { id: 'oll', name: '3. OLL', targetTime: '~3.5s', icon: '🟡' },
    { id: 'pll', name: '4. PLL', targetTime: '~3.5s', icon: '🏁' },
  ];

  return (
    <div className="space-y-6">
      {/* Locator Modal */}
      <CubeLocatorModal
        isOpen={isLocatorOpen}
        onClose={() => setIsLocatorOpen(false)}
        onSelectPhase={handlePhaseSwitch}
      />

      {/* Top Phase Navigation Tabs & Step Finder */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {phasesMeta.map((p) => {
            const isActive = phase === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePhaseSwitch(p.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-102'
                    : 'bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                  isActive ? 'bg-black/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {p.targetTime}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step Finder & Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {onOpenAcademy && (
            <button
              onClick={() => onOpenAcademy(phaseToLessonIdx[phase])}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 text-amber-300 transition-all shadow-sm"
              title="Open teacher walkthrough for this phase"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>🎓 Teacher Mode</span>
            </button>
          )}

          <button
            onClick={() => setIsLocatorOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>🧭 Find My Step</span>
          </button>

          {history.length > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors"
              title="Go back one step"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          <button
            onClick={handleResetPhase}
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Reset this phase tree"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb Trail */}
      {history.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs text-slate-400">
          <span className="font-semibold text-slate-500">Path:</span>
          {history.map((step, idx) => (
            <React.Fragment key={idx}>
              <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300 whitespace-nowrap">
                {step.selectedOption.label}
              </span>
              <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            </React.Fragment>
          ))}
          {activeSolution && (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-md font-semibold whitespace-nowrap">
              {activeSolution.caseName}
            </span>
          )}
        </div>
      )}

      {/* Main Decision Content Area */}
      {!activeSolution ? (
        /* Question & Branching Options View */
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
          {/* How to Hold Your Cube Guidance Banner */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-base shrink-0">
                🧊
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block">
                  How to Hold Your Cube Right Now
                </span>
                <p className="text-slate-300">
                  {phase === 'cross' && (
                    <>⬇️ <strong>White Center on BOTTOM</strong> • ⬆️ <strong>Yellow Center on TOP</strong> • Look for the 4 white edge pieces.</>
                  )}
                  {phase === 'f2l' && (
                    <>⬇️ <strong>Keep White Cross on BOTTOM</strong> • ⬆️ <strong>Yellow on TOP</strong> • Pick 1 corner with WHITE on it (e.g. White-Red-Green) and locate its matching edge.</>
                  )}
                  {phase === 'oll' && (
                    <>⬇️ <strong>White on BOTTOM</strong> • ⬆️ <strong>Look down at the YELLOW face</strong> • Ignore sides; look at the 9 yellow facelets.</>
                  )}
                  {phase === 'pll' && (
                    <>⬇️ <strong>White on BOTTOM</strong> • ⬆️ <strong>Yellow is SOLVED</strong> • Look around the side stickers of the top layer for matching pairs.</>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-12 sm:ml-0">
              {onOpenAcademy && (
                <button
                  onClick={() => onOpenAcademy(phaseToLessonIdx[phase])}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 font-bold flex items-center gap-1 transition-all"
                  title="Need a patient, step-by-step teacher walkthrough?"
                >
                  <GraduationCap className="w-3 h-3 text-amber-400" />
                  <span>Explain Like I'm a Beginner</span>
                </button>
              )}
              <button
                onClick={() => setIsLocatorOpen(true)}
                className="text-[11px] text-slate-400 hover:text-slate-300 font-semibold underline underline-offset-2"
              >
                Where am I?
              </button>
            </div>
          </div>

          <div className="space-y-2 border-b border-slate-800 pb-5">
            <div className="flex items-center justify-between text-xs text-amber-400 font-semibold tracking-wider uppercase">
              <span>Step {currentNode.stepNumber} of {currentNode.totalStepsInPhase}</span>
              <span className="text-slate-400 font-normal">{currentNode.title}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              {currentNode.question}
            </h2>
            {currentNode.helpText && (
              <p className="text-sm text-slate-300 leading-relaxed flex items-start gap-2 pt-1">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{currentNode.helpText}</span>
              </p>
            )}
          </div>

          {/* Interactive Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {currentNode.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-850 hover:border-amber-500/50 transition-all text-left group relative shadow-md hover:shadow-amber-500/5"
              >
                {/* Visual Diagram Thumbnail if available */}
                {option.diagramConfig && (
                  <div className="shrink-0 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800/80 group-hover:border-amber-500/30 transition-colors">
                    <CubeDiagram config={option.diagramConfig} size={110} />
                  </div>
                )}

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-100 group-hover:text-amber-400 text-base transition-colors">
                      {option.label}
                    </span>
                    {option.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                        {option.badge}
                      </span>
                    )}
                  </div>

                  {option.subtitle && (
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {option.subtitle}
                    </p>
                  )}

                  <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-amber-500/80 group-hover:text-amber-400 transition-colors">
                    <span>{option.solution ? 'View Solution' : 'Next Step'}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Solved Terminal State View */
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 sm:p-7 backdrop-blur-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Case Identified</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{activeSolution.category || activeSolution.phase.toUpperCase()}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
                  {activeSolution.caseName}
                </h2>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetPhase}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Another Case</span>
                </button>
                <button
                  onClick={handleNextPhase}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <span>Next Phase</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Case + Algorithm Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Cube State Visual & Recognition */}
              <div className="lg:col-span-4 bg-slate-950/90 rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Cube State</span>
                  <CubeDiagram config={activeSolution.diagramConfig} size={160} />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Recognition Clue
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeSolution.recognitionTip}
                  </p>
                </div>
              </div>

              {/* Right Column: Interactive Algorithm Card */}
              <div className="lg:col-span-8">
                {(() => {
                  // Pick appropriate algorithm based on difficulty
                  const alg = (currentDifficulty === 'intuitive' && activeSolution.algorithms.intuitive)
                    ? activeSolution.algorithms.intuitive
                    : (currentDifficulty === 'pro' && activeSolution.algorithms.pro)
                    ? activeSolution.algorithms.pro
                    : activeSolution.algorithms.sub30;

                  return (
                    <AlgorithmCard
                      algorithm={alg}
                      allAlgorithms={activeSolution.algorithms}
                      currentDifficulty={currentDifficulty}
                      onSelectDifficulty={onDifficultyChange}
                      setupMoves={activeSolution.setupMoves}
                      sub30Tip={activeSolution.sub30Tip}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
