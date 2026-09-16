import React, { useState } from 'react';
import { DifficultyLevel, Phase } from './types/cube';
import { InteractiveTeacher } from './components/InteractiveTeacher';
import { DecisionTreeViewer } from './components/DecisionTreeViewer';
import { VisualPatternBoard } from './components/VisualPatternBoard';
import { ChunkingGuide } from './components/ChunkingGuide';
import { ActiveRecallTrainer } from './components/ActiveRecallTrainer';
import { F2LCheatSheet } from './components/F2LCheatSheet';
import { TimeBudgetBar } from './components/TimeBudgetBar';
import { PracticeTimer } from './components/PracticeTimer';
import { AlgorithmLibrary } from './components/AlgorithmLibrary';
import { NotationGuide } from './components/NotationGuide';
import {
  GraduationCap,
  Grid,
  BrainCircuit,
  Sparkles,
  GitBranch,
  Puzzle,
  Clock,
  Timer,
  BookOpen,
  Zap,
  Trophy
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'academy' | 'patterns' | 'chunking' | 'recall' | 'tree' | 'f2l-lab' | 'budget' | 'timer' | 'library' | 'notation'>('academy');
  const [academyLessonIdx, setAcademyLessonIdx] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('sub30');
  const [treePhase, setTreePhase] = useState<Phase>('cross');

  const openTreeToPhase = (phase: Phase) => {
    setTreePhase(phase);
    setActiveTab('tree');
  };

  const openAcademyLesson = (lessonIdx: number) => {
    setAcademyLessonIdx(lessonIdx);
    setActiveTab('academy');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('tree')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl">🧊</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-100 tracking-tight">
                  Rubik's Sub-30
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Decision Tree
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Speedcubing CFOP Roadmap for Novice & Returning Solvers
              </p>
            </div>
          </div>

          {/* Difficulty Level Global Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 hidden md:inline">Mode:</span>
            <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                onClick={() => setDifficulty('intuitive')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  difficulty === 'intuitive'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Minimal memorization, easy conceptual rules (~40-60s)"
              >
                🌱 Intuitive
              </button>
              <button
                onClick={() => setDifficulty('sub30')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  difficulty === 'sub30'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="2-Look OLL, Essential PLLs & Direct F2L (~24-29s)"
              >
                ⚡ Sub-30 Target
              </button>
              <button
                onClick={() => setDifficulty('pro')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  difficulty === 'pro'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Full PLL, Rotationless F2L (<20s)"
              >
                🔥 Speedcuber Pro
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-900">
          <button
            onClick={() => setActiveTab('academy')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab === 'academy'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-amber-500/20'
                : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-400/10 border border-amber-400/30'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>🎓 Cube Academy (Teacher Mode)</span>
          </button>

          <button
            onClick={() => setActiveTab('patterns')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'patterns'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>⚡ Visual Pattern Matrix (1-Click)</span>
          </button>

          <button
            onClick={() => setActiveTab('chunking')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'chunking'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Cognitive Chunking (Core 4)</span>
          </button>

          <button
            onClick={() => setActiveTab('recall')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'recall'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Recall Drill</span>
          </button>

          <button
            onClick={() => setActiveTab('tree')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'tree'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Guided Flow Tree</span>
          </button>

          <button
            onClick={() => setActiveTab('f2l-lab')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'f2l-lab'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>F2L Recovery Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('timer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'timer'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Practice Timer</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'budget'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Sub-30 Split Budget</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'library'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>CFOP Library</span>
          </button>

          <button
            onClick={() => setActiveTab('notation')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'notation'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Notation & Triggers</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-8">
        {/* Quick Phase Shortcut Bar (When in Tree View) */}
        {activeTab === 'tree' && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Your Sub-30 Roadmap
                </span>
                <p className="text-xs text-slate-300">
                  Cross (&lt;3.5s) → F2L 4 Pairs (&lt;15s) → 2-Look OLL (&lt;3.5s) → 2-Look/Full PLL (&lt;3.5s) = <strong>~25s Total</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold hidden sm:inline">Jump to Phase:</span>
              <button
                onClick={() => openTreeToPhase('cross')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                1. Cross
              </button>
              <button
                onClick={() => openTreeToPhase('f2l')}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
              >
                2. F2L
              </button>
              <button
                onClick={() => openTreeToPhase('oll')}
                className="px-2.5 py-1 rounded-lg bg-yellow-500/20 text-yellow-300 font-semibold border border-yellow-500/30"
              >
                3. OLL
              </button>
              <button
                onClick={() => openTreeToPhase('pll')}
                className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 font-semibold border border-red-500/30"
              >
                4. PLL
              </button>
            </div>
          </div>
        )}

        {/* Tab Content Panes */}
        {activeTab === 'academy' && (
          <InteractiveTeacher
            initialLessonIdx={academyLessonIdx}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'patterns' && <VisualPatternBoard onOpenAcademy={openAcademyLesson} />}

        {activeTab === 'chunking' && <ChunkingGuide />}

        {activeTab === 'recall' && <ActiveRecallTrainer />}

        {activeTab === 'tree' && (
          <DecisionTreeViewer
            currentDifficulty={difficulty}
            onDifficultyChange={setDifficulty}
            activePhase={treePhase}
            onPhaseChange={setTreePhase}
            onOpenAcademy={openAcademyLesson}
          />
        )}

        {activeTab === 'f2l-lab' && <F2LCheatSheet />}

        {activeTab === 'timer' && <PracticeTimer />}

        {activeTab === 'budget' && <TimeBudgetBar />}

        {activeTab === 'library' && <AlgorithmLibrary />}

        {activeTab === 'notation' && <NotationGuide />}
      </main>

      {/* Footer & Sub-30 Checklist */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 border-b border-slate-900">
            <div>
              <span className="font-bold text-slate-300 uppercase tracking-wider block mb-1">White Cross</span>
              <p>Solve with White on bottom. Match each side color to its center, then turn that face twice (F2).</p>
            </div>
            <div>
              <span className="font-bold text-slate-300 uppercase tracking-wider block mb-1">F2L Sub-30</span>
              <p>Turn at smooth 2 TPS without pausing. Keep cube rotations under 2 per solve.</p>
            </div>
            <div>
              <span className="font-bold text-slate-300 uppercase tracking-wider block mb-1">2-Look OLL</span>
              <p>Only 9 algorithms total! Edge Orientation (Line/Angle/Dot) into 7 Corner Cases.</p>
            </div>
            <div>
              <span className="font-bold text-slate-300 uppercase tracking-wider block mb-1">PLL Sub-30</span>
              <p>Start with T, Y, Ua, Ub, H, Z. High-ROI upgrade to Full PLL for sub-20 speed.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <span>Rubik's Sub-30 Interactive Decision Tree • Designed for Novice & Returning Solvers</span>
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              <span>Target: Sub-30 Seconds Consistently</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
