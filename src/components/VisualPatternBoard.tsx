import React, { useState } from 'react';
import { Phase, DecisionSolution } from '../types/cube';
import { crossDecisionTree } from '../data/crossData';
import { f2lDecisionTree } from '../data/f2lData';
import { ollDecisionTree } from '../data/ollData';
import { pllDecisionTree } from '../data/pllData';
import { CubeDiagram } from './CubeDiagram';
import { InteractiveMovePlayer } from './InteractiveMovePlayer';
import { chunkAlgorithm } from '../utils/chunker';
import { F2L_SLOT_PAIRS, F2LSlotPair, adaptF2LSolution, CUBE_FACE_COLORS, createSlotPair } from '../utils/f2lSlotHelper';
import {
  Grid,
  Zap,
  Play,
  Copy,
  Check,
  Search,
  Layers,
  GraduationCap,
  Compass,
  RotateCcw,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface VisualPatternBoardProps {
  onOpenAcademy?: (lessonIdx: number) => void;
}

export const VisualPatternBoard: React.FC<VisualPatternBoardProps> = ({ onOpenAcademy }) => {
  const [activePhase, setActivePhase] = useState<Phase>('f2l'); // Default to F2L or OLL
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSolution, setSelectedSolution] = useState<DecisionSolution | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Diagram Display Size ('normal' = 155px, 'large' = 195px)
  const [diagramSize, setDiagramSize] = useState<'normal' | 'large'>('large');

  // Active F2L Slot Selection (Default to Orange & Green: Orange Front, Green Right)
  const [selectedSlot, setSelectedSlot] = useState<F2LSlotPair>(F2L_SLOT_PAIRS[0]);

  const handleSetCustomColor = (face: 'front' | 'right', colorId: string) => {
    if (face === 'front') {
      setSelectedSlot(createSlotPair(colorId, selectedSlot.rightColor));
    } else {
      setSelectedSlot(createSlotPair(selectedSlot.frontColor, colorId));
    }
  };

  // F2L At-A-Glance Visual Selector State ('all' | 'white-up' | 'white-side' | 'connected' | 'slot')
  const [f2lVisualFilter, setF2lVisualFilter] = useState<string>('all');
  const [f2lSubFilter, setF2lSubFilter] = useState<string>('all'); // 'all' | 'same' | 'diff'

  // Interactive OLL Tap-to-Identify Scanner State (Default to L-shape + 2 corners: W-shape)
  const [scannerGrid, setScannerGrid] = useState<boolean[]>([
    true,  true,  false,
    true,  true,  false,
    false, false, true
  ]);

  const phaseToLessonIdx: Record<Phase, number> = {
    cross: 1, // Lesson 2
    f2l: 2,   // Lesson 3
    oll: 3,   // Lesson 4
    pll: 4    // Lesson 5
  };

  // Collect solutions per phase
  const getSolutionsForPhase = (p: Phase): DecisionSolution[] => {
    const list: DecisionSolution[] = [];
    const tree =
      p === 'cross'
        ? crossDecisionTree
        : p === 'f2l'
        ? f2lDecisionTree
        : p === 'oll'
        ? ollDecisionTree
        : pllDecisionTree;

    tree.forEach(node => {
      node.options.forEach(opt => {
        if (opt.solution && !list.some(s => s.id === opt.solution!.id)) {
          list.push(opt.solution);
        }
      });
    });
    return list;
  };

  const currentSolutions = getSolutionsForPhase(activePhase);

  // Dynamic counts for F2L categories
  const f2lAllCount = currentSolutions.length;
  const f2lWhiteUpCount = currentSolutions.filter(s => s.category === 'White Up').length;
  const f2lWhiteSideCount = currentSolutions.filter(s => ['Colors Match', 'Colors Differ'].includes(s.category || '')).length;
  const f2lConnectedCount = currentSolutions.filter(s => s.category === 'Connected Pair').length;
  const f2lSlotCount = currentSolutions.filter(s => ['Corner in Slot', 'Edge in Slot', 'Both in Slot'].includes(s.category || '')).length;
  const f2lSameCount = currentSolutions.filter(s => s.category === 'Colors Match').length;
  const f2lDiffCount = currentSolutions.filter(s => s.category === 'Colors Differ').length;

  // Extract categories for filter chips
  const categories = Array.from(new Set(currentSolutions.map(s => s.category || 'General')));

  // Filter solutions
  const filteredSolutions = currentSolutions.filter(sol => {
    // If activePhase is f2l and visual filter is not 'all':
    if (activePhase === 'f2l' && f2lVisualFilter !== 'all') {
      if (f2lVisualFilter === 'white-up' && sol.category !== 'White Up') return false;
      if (f2lVisualFilter === 'connected' && sol.category !== 'Connected Pair') return false;
      if (f2lVisualFilter === 'slot' && !['Corner in Slot', 'Edge in Slot', 'Both in Slot'].includes(sol.category || '')) return false;
      if (f2lVisualFilter === 'white-side') {
        if (!['Colors Match', 'Colors Differ'].includes(sol.category || '')) return false;
        if (f2lSubFilter === 'same' && sol.category !== 'Colors Match') return false;
        if (f2lSubFilter === 'diff' && sol.category !== 'Colors Differ') return false;
      }
    }

    const matchesFilter = activeFilter === 'all' || sol.category === activeFilter;
    const matchesSearch =
      sol.caseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sol.recognitionTip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sol.algorithms.sub30.notation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopy = (notation: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(notation);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const phasesMeta: { id: Phase; name: string; count: number; icon: string }[] = [
    { id: 'cross', name: '1. Cross', count: getSolutionsForPhase('cross').length, icon: '➕' },
    { id: 'f2l', name: '2. F2L Pairs', count: getSolutionsForPhase('f2l').length, icon: '🧩' },
    { id: 'oll', name: '3. 2-Look OLL', count: getSolutionsForPhase('oll').length, icon: '🟡' },
    { id: 'pll', name: '4. 2-Look PLL', count: getSolutionsForPhase('pll').length, icon: '🏁' },
  ];

  // Helper to diagnose OLL from 3x3 scanner grid
  const diagnoseOLL = (grid: boolean[]) => {
    // 0: BL, 1: Back Edge, 2: BR, 3: Left Edge, 4: Center, 5: Right Edge, 6: FL, 7: Front Edge, 8: FR
    const edgeIndices = [1, 3, 5, 7];
    const cornerIndices = [0, 2, 6, 8];
    const yellowEdgeCount = edgeIndices.filter((i) => grid[i]).length;
    const yellowCornerCount = cornerIndices.filter((i) => grid[i]).length;

    let stepTitle = '';
    let caseTitle = '';
    let explanation = '';
    let holdingGuide = '';
    let recommendedAlg = '';
    let targetSolutionId: string | null = null;

    if (yellowEdgeCount === 4) {
      stepTitle = 'Step 2: Yellow Corners (Cross already solved!)';
      if (yellowCornerCount === 4) {
        caseTitle = '🎉 Top Yellow Face Solved!';
        explanation = 'All 4 edges and 4 corners are facing up.';
        holdingGuide = 'You are ready for Phase 4: 2-Look PLL to finish the cube!';
      } else if (yellowCornerCount === 1) {
        caseTitle = '1 Corner Yellow ("Fish" Shape)';
        explanation = 'Only one corner is yellow on top. This is either Sune or Anti-Sune.';
        if (grid[6]) {
          holdingGuide = 'Fish-head is at FRONT-LEFT! Look at FRONT-RIGHT corner: If yellow faces FRONT (at you) -> Sune. If yellow faces RIGHT -> Anti-Sune.';
        } else {
          holdingGuide = 'Rotate top layer (U) so the single solved yellow corner is in FRONT-LEFT (bottom-left).';
        }
        recommendedAlg = "Sune: R U R' U R U2' R'  •  Anti-Sune: R U2' R' U' R U' R'";
        targetSolutionId = 'oll-sol-sune';
      } else if (yellowCornerCount === 0) {
        caseTitle = '0 Corners Yellow (Pure Cross)';
        explanation = 'Car / H (headlights front & back) or Blinker / Pi (headlights on left).';
        holdingGuide = 'If 2 headlights face front and 2 face back: Car. If 2 headlights are on the LEFT side: Blinker.';
        recommendedAlg = "Car: F (R U R' U')3 F'  •  Blinker: R U2' (R2' U' R2 U') (R2' U2' R)";
        targetSolutionId = 'oll-sol-h';
      } else if (yellowCornerCount === 2) {
        const isDiagonal = (grid[0] && grid[8]) || (grid[2] && grid[6]);
        if (isDiagonal) {
          caseTitle = 'Bowtie / L Case (2 Diagonal Corners)';
          explanation = 'Two diagonal corners have yellow on top.';
          holdingGuide = 'Hold so the front-left unsolved corner has its yellow sticker facing FRONT (at you).';
          recommendedAlg = "F' (r U R' U') (r' F R)";
          targetSolutionId = 'oll-sol-l';
        } else {
          caseTitle = '2 Adjacent Corners Yellow';
          explanation = 'Headlights (U) if unsolved corners face same direction; Chameleon (T) if they face opposite.';
          holdingGuide = 'Headlights: hold headlights facing FRONT. Chameleon: hold 2 solved corners on RIGHT.';
          recommendedAlg = "Headlights: R2 D (R' U2 R) D' (R' U2 R')  •  Chameleon: (r U R' U') (r' F R F')";
          targetSolutionId = 'oll-sol-u';
        }
      } else if (yellowCornerCount === 3) {
        caseTitle = '⚠️ Physical Corner Twist (1 Corner Missing)';
        explanation = 'A standard Rubik\'s Cube can NEVER have exactly 3 yellow corners facing up (only 0, 1, 2, or 4). This means that one corner was physically twisted by accident (very common on modern speedcubes during fast turns or drops). No algorithm can solve this state!';
        holdingGuide = 'Gently grip the single non-yellow corner between your thumb and index finger, and manually twist it in place until the yellow sticker faces UP. Once twisted, your yellow face will be completely solved!';
      }
    } else if (yellowEdgeCount === 2) {
      stepTitle = 'Step 1: Edge Orientation (Making the Yellow Cross)';
      const hasBack = grid[1];
      const hasLeft = grid[3];
      const hasRight = grid[5];
      const hasFront = grid[7];

      const isLine = (hasBack && hasFront) || (hasLeft && hasRight);
      if (isLine) {
        caseTitle = 'Straight Line / Bar Case';
        if (yellowCornerCount > 0) {
          explanation = `You have ${yellowCornerCount} yellow corner(s) on top too. IGNORE the corners in Step 1! The edges form a straight Line.`;
        } else {
          explanation = 'Two opposite edges are yellow, forming a straight line.';
        }
        if (hasLeft && hasRight) {
          holdingGuide = 'PERFECT ANGLE: The bar is already HORIZONTAL (Left-to-Right). Either face where the bar runs across can face you!';
        } else {
          holdingGuide = 'ROTATE CUBE / TOP LAYER: Turn top layer 90° (U or U\') so the bar runs HORIZONTALLY (Left-to-Right). Do NOT hold it vertically!';
        }
        recommendedAlg = "F (R U R' U') F'";
        targetSolutionId = 'oll-sol-bar';
      } else {
        caseTitle = 'Small "L" / 90° Angle Case';
        if (yellowCornerCount > 0) {
          explanation = `You have ${yellowCornerCount} yellow corner(s) on top (creating a "W", "gun", or "arrow" shape). IGNORE THE CORNERS! In Step 1, look ONLY at the 4 edges. Your edges form an "L".`;
        } else {
          explanation = 'Two adjacent edges form a 90° angle.';
        }

        if (hasFront && hasRight) {
          holdingGuide = 'PERFECT ANGLE FOR WIDE-f! Yellow edges point to FRONT (6 o\'clock) and RIGHT (3 o\'clock). Alg: f (R U R\' U\') f\'';
          recommendedAlg = "f (R U R' U') f' (wide front turn)";
        } else if (hasBack && hasLeft) {
          holdingGuide = 'PERFECT ANGLE FOR REGULAR-F! Yellow edges point to BACK (12 o\'clock) and LEFT (9 o\'clock). Alg: F (U R U\' R\') F\' (or turn U2 for wide-f)';
          recommendedAlg = "F (U R U' R') F' (or U2 + f (R U R' U') f')";
        } else if (hasBack && hasRight) {
          holdingGuide = 'ROTATE TOP: Turn U (clockwise) to put edges at Front & Right for wide-f, or U\' for Back & Left.';
          recommendedAlg = "f (R U R' U') f' (after U turn)";
        } else if (hasFront && hasLeft) {
          holdingGuide = 'ROTATE TOP: Turn U\' (counter-clockwise) to put edges at Front & Right for wide-f, or U for Back & Left.';
          recommendedAlg = "f (R U R' U') f' (after U' turn)";
        }
        targetSolutionId = 'oll-sol-angle';
      }
    } else if (yellowEdgeCount === 0) {
      stepTitle = 'Step 1: Edge Orientation (Making the Yellow Cross)';
      caseTitle = 'Dot Case (No Yellow Edges)';
      explanation = yellowCornerCount > 0
        ? `Center is yellow with ${yellowCornerCount} corner(s). Ignore corners! With 0 edges yellow, this is the Dot case.`
        : 'Only the yellow center sticker is facing up.';
      holdingGuide = 'Hold any face towards you (White on bottom). Executing the alg will transform it into an L-Shape!';
      recommendedAlg = "F (R U R' U') F' then f (R U R' U') f'";
      targetSolutionId = 'oll-sol-dot';
    } else {
      stepTitle = 'Step 1: Edge Orientation';
      caseTitle = 'Odd Edge Count (1 or 3)';
      explanation = 'On a standard 3x3 Rubik\'s Cube, an odd number of yellow edges (1 or 3) is physically impossible without a flipped edge piece.';
      holdingGuide = 'Double-check if one edge has white or yellow, or if your cube was previously taken apart.';
    }

    return {
      stepTitle,
      caseTitle,
      explanation,
      holdingGuide,
      recommendedAlg,
      targetSolutionId,
      yellowEdgeCount,
      yellowCornerCount,
    };
  };

  const diagnosis = diagnoseOLL(scannerGrid);

  return (
    <div className="space-y-6">
      {/* Modal: Interactive Move Player when a case is selected */}
      {selectedSolution && (() => {
        const modalSol = selectedSolution.phase === 'f2l'
          ? adaptF2LSolution(selectedSolution, selectedSlot)
          : selectedSolution;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <InteractiveMovePlayer
                notation={modalSol.algorithms.sub30.notation}
                caseName={modalSol.caseName}
                diagramConfig={modalSol.diagramConfig}
                howToHold={modalSol.howToHold || modalSol.recognitionTip}
                setupMoves={modalSol.setupMoves}
                fingertricksNotes={modalSol.algorithms.sub30.fingertricks}
                onClose={() => setSelectedSolution(null)}
              />
            </div>
          </div>
        );
      })()}

      {/* Header & HCI Principle Callout */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Grid className="w-4 h-4" />
              <span>Instant Visual Case Finder (Zero Nesting)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 mt-0.5">
              Visual Pattern Matrix
            </h2>
            <p className="text-xs text-slate-400 pt-1">
              Look at your cube, spot the matching pattern below, and click once to open the interactive move player.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            {/* Diagram Size Zoom Toggle */}
            <button
              onClick={() => setDiagramSize(prev => prev === 'large' ? 'normal' : 'large')}
              className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all shrink-0 ${
                diagramSize === 'large'
                  ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
              title="Toggle diagram size between Large (195px) and Normal (155px)"
            >
              <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{diagramSize === 'large' ? '🔍 Large Diagrams (195px)' : '🔎 Compact Diagrams (155px)'}</span>
            </button>

            {onOpenAcademy && (
              <button
                onClick={() => onOpenAcademy(phaseToLessonIdx[activePhase])}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 text-amber-300 transition-all shrink-0 shadow-sm"
                title="Don't understand the algorithms? Open Teacher Mode"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>🎓 Learn {phasesMeta.find(p => p.id === activePhase)?.name} from Scratch</span>
              </button>
            )}

            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name or alg..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Phase Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800/80">
          {phasesMeta.map((p) => {
            const isActive = activePhase === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActivePhase(p.id);
                  setActiveFilter('all');
                  setF2lVisualFilter('all');
                  setF2lSubFilter('all');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-102'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-semibold ${
                  isActive ? 'bg-black/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {p.count} cases
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Chips per Phase (for non-F2L phases) */}
        {categories.length > 1 && activePhase !== 'f2l' && (
          <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs">
            <span className="text-slate-500 font-semibold text-[11px] mr-1">Filter:</span>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg border transition-all whitespace-nowrap text-xs font-semibold ${
                activeFilter === 'all'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'
              }`}
            >
              All ({currentSolutions.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1 rounded-lg border transition-all whitespace-nowrap text-xs font-semibold ${
                  activeFilter === cat
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interactive F2L At-A-Glance Visual Case Finder */}
      {activePhase === 'f2l' && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/30 border border-blue-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>At-A-Glance Visual Case Finder</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-100 mt-0.5">
                Identify Your F2L Pair in 1 Glance
              </h3>
              <p className="text-xs text-slate-400">
                Pick where the WHITE sticker on your corner is pointing. The list below instantly filters to your exact case!
              </p>
            </div>

            {/* Active Pair Indicator Badge */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs shadow-inner shrink-0">
              <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-[11px] font-black flex items-center gap-1.5">
                <span style={{ color: selectedSlot.frontHex }}>⬇️ FRONT: {selectedSlot.frontLabel}</span>
                <span className="text-slate-500">•</span>
                <span style={{ color: selectedSlot.rightHex }}>👉 RIGHT: {selectedSlot.rightLabel}</span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-400">🎯 FR Slot</span>
              </div>
            </div>
          </div>

          {/* Interactive Pair Selector & Physical Face Customizer */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                <span>🔄</span> 1-Click Standard Pair Presets:
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Standard Clockwise Order (Yellow on top, White on bottom): Blue → Red → Green → Orange → Blue
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {F2L_SLOT_PAIRS.map(slot => {
                const isSelected = selectedSlot.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-600/30 border-blue-400 shadow-md shadow-blue-500/20 ring-1 ring-blue-400/60'
                        : 'bg-slate-950/90 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="text-base shrink-0">{slot.icon}</span>
                    <div className="min-w-0">
                      <div className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {slot.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        F: {slot.frontLabel} • R: {slot.rightLabel}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Direct Physical Cube Face Selectors */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/90 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Or tap the exact 2 center colors on your cube right now:</span>
                </span>
                <span className="text-[10px] text-amber-300/90 font-medium">
                  💡 With Yellow on top & White on bottom: When Blue faces you, Red is on your Right! (Clockwise: Blue → Red → Green → Orange)
                </span>
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                {/* Front Face Chooser */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10.5px] font-black text-slate-400 uppercase mr-1">
                    Front Center (at your chest):
                  </span>
                  {CUBE_FACE_COLORS.map(c => {
                    const isPicked = selectedSlot.frontColor === c.id;
                    return (
                      <button
                        key={`front-${c.id}`}
                        onClick={() => handleSetCustomColor('front', c.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all ${
                          isPicked
                            ? 'ring-2 ring-white shadow-md text-white scale-105'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                        style={{ backgroundColor: isPicked ? c.hex : undefined }}
                      >
                        <span>{c.icon}</span>
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right Face Chooser */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10.5px] font-black text-slate-400 uppercase mr-1">
                    Right Center (right hand):
                  </span>
                  {CUBE_FACE_COLORS.map(c => {
                    const isPicked = selectedSlot.rightColor === c.id;
                    return (
                      <button
                        key={`right-${c.id}`}
                        onClick={() => handleSetCustomColor('right', c.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all ${
                          isPicked
                            ? 'ring-2 ring-white shadow-md text-white scale-105'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                        style={{ backgroundColor: isPicked ? c.hex : undefined }}
                      >
                        <span>{c.icon}</span>
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Prominent Active Slot Physical Guide */}
          <div className="p-3.5 bg-blue-950/40 border border-blue-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs shadow-inner">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 block">
                🧭 Physical Orientation for Your Selected Pair:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                Hold <strong className="text-white font-black">White on BOTTOM</strong>. Point <strong className="font-black px-1 rounded" style={{ color: selectedSlot.frontHex }}>{selectedSlot.frontLabel} center directly at your chest (Front)</strong> and <strong className="font-black px-1 rounded" style={{ color: selectedSlot.rightHex }}>{selectedSlot.rightLabel} center to your right hand (Right)</strong>. The target slot is at <strong className="text-amber-300 font-black">Front-Right (FR)</strong>!
              </p>
            </div>
            <div className="text-[10px] text-emerald-300 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-semibold shrink-0">
              ✅ All diagrams below match {selectedSlot.name}
            </div>
          </div>

          {/* Question 1: Where is White? */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
              Question 1: Where is the WHITE sticker on your corner piece?
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <button
                onClick={() => { setF2lVisualFilter('all'); setF2lSubFilter('all'); }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  f2lVisualFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-black scale-102'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800 font-bold'
                }`}
              >
                <span className="text-lg">🌟</span>
                <span className="text-xs mt-1 font-bold">Show All</span>
                <span className="text-[10px] opacity-75">{f2lAllCount} Cases</span>
              </button>

              <button
                onClick={() => { setF2lVisualFilter('white-up'); setF2lSubFilter('all'); }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  f2lVisualFilter === 'white-up'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-black scale-102'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800 font-bold'
                }`}
              >
                <span className="text-lg">⚪</span>
                <span className="text-xs mt-1 font-bold">White on TOP</span>
                <span className="text-[10px] opacity-75">Ceiling ({f2lWhiteUpCount} Cases)</span>
              </button>

              <button
                onClick={() => { setF2lVisualFilter('white-side'); }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  f2lVisualFilter === 'white-side'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-black scale-102'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800 font-bold'
                }`}
              >
                <span className="text-lg">🧭</span>
                <span className="text-xs mt-1 font-bold">White on SIDE</span>
                <span className="text-[10px] opacity-75">Facing / Perp ({f2lWhiteSideCount} Cases)</span>
              </button>

              <button
                onClick={() => { setF2lVisualFilter('connected'); setF2lSubFilter('all'); }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  f2lVisualFilter === 'connected'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-black scale-102'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800 font-bold'
                }`}
              >
                <span className="text-lg">🔗</span>
                <span className="text-xs mt-1 font-bold">Connected Pair</span>
                <span className="text-[10px] opacity-75">Touching in Top ({f2lConnectedCount} Cases)</span>
              </button>

              <button
                onClick={() => { setF2lVisualFilter('slot'); setF2lSubFilter('all'); }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  f2lVisualFilter === 'slot'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-black scale-102'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800 font-bold'
                }`}
              >
                <span className="text-lg">📥</span>
                <span className="text-xs mt-1 font-bold">Stuck in Slot</span>
                <span className="text-[10px] opacity-75">Equator / Bottom ({f2lSlotCount} Cases)</span>
              </button>
            </div>
          </div>

          {/* Sub-Filter if White is on Side */}
          {f2lVisualFilter === 'white-side' && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 animate-in fade-in duration-150 shadow-inner">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Question 2: Look down at the TOP stickers of the Corner and Edge:
              </span>
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => setF2lSubFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    f2lSubFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  All Side White ({f2lWhiteSideCount})
                </button>
                <button
                  onClick={() => setF2lSubFilter('same')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    f2lSubFilter === 'same'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>🟢🟢 Same Top Color ({f2lSameCount})</span>
                  <span className="text-[10px] opacity-80">— Both Orange OR Both Blue</span>
                </button>
                <button
                  onClick={() => setF2lSubFilter('diff')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    f2lSubFilter === 'diff'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>🟢🔴 Different Top Colors ({f2lDiffCount})</span>
                  <span className="text-[10px] opacity-80">— One Orange, One Blue</span>
                </button>
              </div>

              {/* Educational Callout: 2 Top Colors on Corner & Recognition Rule */}
              <div className="p-3.5 bg-blue-950/40 border border-blue-500/30 rounded-xl space-y-2 shadow-inner">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                  <span>💡</span> Why might your top sticker be a different color than the diagrams?
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  When White is on the side, your corner piece has <strong className="text-white">two possible top colors</strong> depending on which side White points to:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="font-bold text-slate-200">1. White faces FRONT (at your chest):</span>
                    <div className="text-slate-400 mt-0.5">
                      Top of corner is <strong style={{ color: selectedSlot.frontHex }}>{selectedSlot.frontLabel}</strong> (Front center color).
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="font-bold text-slate-200">2. White faces RIGHT (away to your right):</span>
                    <div className="text-slate-400 mt-0.5">
                      Top of corner is <strong style={{ color: selectedSlot.rightHex }}>{selectedSlot.rightLabel}</strong> (Right center color).
                    </div>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-200">
                  <strong>The Golden F2L Recognition Rule:</strong> Don't look for an exact sticker color! Only look at the <strong>relationship between the two top stickers</strong>:
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-slate-300">
                    <li>Both pieces have the <strong>SAME</strong> top color (both {selectedSlot.frontLabel} OR both {selectedSlot.rightLabel}) ➔ Look under <strong>"Same Top Color"</strong> (F2L 5–10)</li>
                    <li>The two pieces have <strong>DIFFERENT</strong> top colors (one {selectedSlot.frontLabel}, one {selectedSlot.rightLabel}) ➔ Look under <strong>"Different Top Colors"</strong> (F2L 11–18)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Interactive 3x3 OLL Tap-to-Identify Scanner */}
      {activePhase === 'oll' && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Diagnostic Scanner & Case Finder</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-100 mt-0.5">
                Tap Your Physical Cube's Top Face
              </h3>
              <p className="text-xs text-slate-400">
                Tap the squares below to match whatever yellow stickers are on top of your cube (even if corners create a "W", gun, or zigzag). The scanner instantly diagnoses your true case and tells you which side to face towards you!
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Presets:</span>
              <button
                onClick={() => setScannerGrid([true, true, false, true, true, false, false, false, true])}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-colors"
                title="L-Shape with 2 corners (often looks like a 'W')"
              >
                "W" Shape
              </button>
              <button
                onClick={() => setScannerGrid([false, true, false, true, true, false, false, false, false])}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                Pure "L"
              </button>
              <button
                onClick={() => setScannerGrid([false, false, false, true, true, true, false, false, false])}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                Line / Bar
              </button>
              <button
                onClick={() => setScannerGrid([false, true, false, true, true, true, true, true, false])}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                Fish (Sune)
              </button>
              <button
                onClick={() => setScannerGrid([false, false, false, false, true, false, false, false, false])}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                Dot
              </button>
              <button
                onClick={() => setScannerGrid([false, false, false, false, true, false, false, false, false])}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 transition-colors"
                title="Reset grid"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Tap Stage & Diagnosis Panel */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: 3x3 Tap Grid with compass labels */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                ⬆️ BACK
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">L</span>
                <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-900 rounded-xl border border-slate-800 shadow-inner">
                  {scannerGrid.map((isYellow, idx) => {
                    const isCenter = idx === 4;
                    return (
                      <button
                        key={idx}
                        disabled={isCenter}
                        onClick={() => {
                          if (isCenter) return;
                          setScannerGrid(prev => {
                            const next = [...prev];
                            next[idx] = !next[idx];
                            return next;
                          });
                        }}
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex flex-col items-center justify-center text-[10px] font-black transition-all ${
                          isCenter
                            ? 'bg-amber-400 text-slate-950 border-2 border-amber-300 cursor-default shadow-md shadow-amber-500/20'
                            : isYellow
                            ? 'bg-amber-400 text-slate-950 border-2 border-amber-300 shadow-md shadow-amber-500/30 hover:bg-amber-300 scale-102'
                            : 'bg-slate-800/90 text-slate-500 border-2 border-slate-700/80 hover:border-slate-500 hover:bg-slate-700/80'
                        }`}
                        title={isCenter ? 'Center (Always Yellow)' : `Tap to toggle (Square ${idx + 1})`}
                      >
                        {isCenter ? (
                          <span>CENTER</span>
                        ) : (
                          <span className={isYellow ? 'text-slate-950' : 'text-slate-400'}>
                            {isYellow ? 'YELLOW' : 'GRAY'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">R</span>
              </div>

              {/* Front orientation badge below grid */}
              <div className="mt-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center gap-1 text-[10px] font-black text-emerald-400">
                <span>⬇️ FRONT (Faces You / Towards Chest)</span>
              </div>
            </div>

            {/* Right: Real-time Diagnosis Output */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {diagnosis.stepTitle}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  {diagnosis.yellowEdgeCount} edges yellow • {diagnosis.yellowCornerCount} corners yellow
                </span>
              </div>

              <h4 className="text-lg font-black text-slate-100 flex items-center gap-2">
                <span>{diagnosis.caseTitle}</span>
              </h4>

              {/* Plain English explanation */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {diagnosis.explanation}
              </p>

              {/* Crucial How to Hold Instruction */}
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 flex items-start gap-2.5 shadow-inner">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                    🧭 Physical Cube Orientation:
                  </span>
                  <p className="text-xs font-bold text-emerald-200 leading-snug">
                    {diagnosis.holdingGuide}
                  </p>
                </div>
              </div>

              {/* Recommended Alg & Action Button */}
              {diagnosis.recommendedAlg && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Algorithm:</span>
                    <span className="font-mono text-xs sm:text-sm font-black text-amber-400 tracking-wide">
                      {diagnosis.recommendedAlg}
                    </span>
                  </div>

                  {diagnosis.targetSolutionId && (
                    <button
                      onClick={() => {
                        const sol = currentSolutions.find(s => s.id === diagnosis.targetSolutionId);
                        if (sol) setSelectedSolution(sol);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 shrink-0"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Step Through in Player</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pattern Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredSolutions.map((rawSol) => {
          const sol = activePhase === 'f2l' ? adaptF2LSolution(rawSol, selectedSlot) : rawSol;
          const chunks = chunkAlgorithm(sol.algorithms.sub30.notation);
          return (
            <div
              key={sol.id}
              onClick={() => setSelectedSolution(sol)}
              className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 backdrop-blur-sm cursor-pointer group transition-all shadow-md hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                {/* Card Header: Category & Slot Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      {sol.category || activePhase.toUpperCase()}
                    </span>
                    {activePhase === 'f2l' && (
                      <span className="text-[9.5px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                        🎯 Slot: Front-Right
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    ~{sol.algorithms.sub30.timeEstimate}s
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-100 group-hover:text-amber-400 transition-colors">
                  {sol.caseName}
                </h3>

                {/* PROMINENT DIAGRAM SHOWCASE (Large, High-Resolution Display) */}
                <div className="flex flex-col items-center justify-center p-3 bg-slate-950/95 rounded-2xl border border-slate-800/90 group-hover:border-amber-500/40 transition-all shadow-inner my-1">
                  <CubeDiagram
                    config={sol.diagramConfig}
                    size={diagramSize === 'large' ? 195 : 155}
                  />
                  <span className="text-[9.5px] font-bold text-slate-500 mt-1.5 uppercase tracking-wider">
                    Click to Open 3D Step Player
                  </span>
                </div>

                {/* F2L Holding Color Badges */}
                {activePhase === 'f2l' && (
                  <div className="flex items-center justify-between text-[10.5px] px-2.5 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800">
                    <div className="flex items-center gap-2 font-black">
                      <span style={{ color: selectedSlot.frontHex }}>⬇️ FRONT: {selectedSlot.frontLabel}</span>
                      <span className="text-slate-600 font-bold">•</span>
                      <span style={{ color: selectedSlot.rightHex }}>👉 RIGHT: {selectedSlot.rightLabel}</span>
                    </div>
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase">White on Bottom</span>
                  </div>
                )}

                {/* Step 0: Starting Setup Box (Corner position, Edge position, Pre-turn setup action) */}
                {activePhase === 'f2l' && sol.startingSetup && (
                  <div className="bg-amber-950/25 border border-amber-500/30 rounded-xl p-2.5 space-y-1.5 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <span>🚦</span> Step 0: Starting Setup (Before Turning)
                      </span>
                      <span className="text-[9px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
                        Crucial Alignment
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-300">
                      <div>
                        <span className="text-slate-400 font-bold">Corner: </span>
                        <span className="text-slate-200">{sol.startingSetup.cornerPosition}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold">Edge: </span>
                        <span className="text-slate-200">{sol.startingSetup.edgePosition}</span>
                      </div>
                    </div>
                    <div className="text-[10.5px] text-amber-200 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-amber-500/20 font-medium">
                      <strong className="text-amber-300 font-black">Pre-turn: </strong>
                      {sol.startingSetup.setupAction}
                    </div>
                  </div>
                )}

                {/* Recognition clue */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {sol.recognitionTip}
                </p>

                {/* How to Hold Callout */}
                {(sol.howToHold || sol.phase === 'oll' || sol.phase === 'f2l') && (
                  <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 flex items-start gap-2 shadow-inner">
                    <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-snug">
                      <span className="font-black text-emerald-400 uppercase tracking-wider text-[9px] block">
                        🧭 How to Hold:
                      </span>
                      <span className="text-emerald-200 font-medium">
                        {sol.howToHold || sol.recognitionTip}
                      </span>
                    </div>
                  </div>
                )}

                {/* Cognitive Chunked Formula */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span className="text-amber-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Chunked Triggers:
                    </span>
                    <span>~{sol.algorithms.sub30.timeEstimate}s</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {chunks.map((c, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${c.color}`}
                      >
                        {c.notation}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-500 flex items-center gap-1 font-semibold text-[11px]">
                  <Layers className="w-3 h-3" />
                  {sol.algorithms.sub30.moveCount} moves
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleCopy(sol.algorithms.sub30.notation, sol.id, e)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Copy Algorithm"
                  >
                    {copiedId === sol.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-sm shadow-amber-500/20">
                    <Play className="w-3 h-3 fill-current" />
                    <span>Step Player</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
