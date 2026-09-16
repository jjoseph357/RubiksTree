import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface LessonStep {
  title: string;
  subtitle: string;
  explanation: string[];
  actionInstructions: string;
  visualCue: {
    title: string;
    cubeColor: string;
    diagramType?: 'cross' | 'f2l' | 'oll' | 'pll';
    badge: string;
    moves?: string;
  };
  checkpoint: string;
  tip?: string;
}

interface Lesson {
  id: string;
  lessonNumber: number;
  title: string;
  concept: string;
  steps: LessonStep[];
}

const LESSONS: Lesson[] = [
  // -----------------------------------------------------------
  // LESSON 1: CUBE ANATOMY & SECRETS
  // -----------------------------------------------------------
  {
    id: 'lesson-1-anatomy',
    lessonNumber: 1,
    title: 'The Secrets of the Cube',
    concept: 'Before turning anything, understand how the cube pieces work. There are only 3 types of pieces!',
    steps: [
      {
        title: 'Secret #1: Centers NEVER Move',
        subtitle: 'Centers are the anchors that tell you the color of the face.',
        explanation: [
          'Look at the 6 center pieces (the single square in the middle of each face).',
          'No matter how much you turn the cube, the centers NEVER change positions relative to each other!',
          'White is ALWAYS opposite Yellow.',
          'Green is ALWAYS opposite Blue.',
          'Red is ALWAYS opposite Orange.'
        ],
        actionInstructions: 'Find the WHITE center. Place it on the BOTTOM (facing the table or floor). Now look at the top: it will always be YELLOW.',
        visualCue: {
          title: 'Hold Position: White Down, Yellow Up',
          cubeColor: 'bg-amber-500/20 text-amber-300',
          badge: 'Golden Rule'
        },
        checkpoint: 'Can you see the Yellow center on top and feel the White center on the bottom?',
        tip: 'Whenever you get lost, find the White center and place it facing the floor!'
      },
      {
        title: 'Secret #2: Edges Have 2 Colors, Corners Have 3',
        subtitle: 'You cannot move a single sticker; you move whole physical pieces.',
        explanation: [
          'There are only 3 types of pieces on a Rubik\'s Cube:',
          '1. Centers (6 pieces): Have 1 sticker. They never move.',
          '2. Edges (12 pieces): Have 2 stickers. They sit between centers.',
          '3. Corners (8 pieces): Have 3 stickers. They sit on the corners of the cube.',
          'An edge piece can NEVER become a corner piece, and a corner can NEVER become an edge!'
        ],
        actionInstructions: 'Touch any edge piece with your fingers. Notice it has 2 colors (e.g. White and Green). That piece belongs between the White center and Green center.',
        visualCue: {
          title: 'Edges = 2 Stickers • Corners = 3 Stickers',
          cubeColor: 'bg-sky-500/20 text-sky-300',
          badge: 'Cube Anatomy'
        },
        checkpoint: 'Notice how the White-Green edge has two sides: one white, one green.'
      }
    ]
  },

  // -----------------------------------------------------------
  // LESSON 2: PHASE 1 — THE WHITE CROSS
  // -----------------------------------------------------------
  {
    id: 'lesson-2-cross',
    lessonNumber: 2,
    title: 'Phase 1: The White Cross (Foolproof Method)',
    concept: 'Build a white plus-sign on the bottom where every white edge also matches its side center color.',
    steps: [
      {
        title: 'What a Completed Cross Looks Like',
        subtitle: 'Matching centers is the key mistake beginners make.',
        explanation: [
          'Many beginners just get 4 white stickers on the bottom and think they are done.',
          'BUT each white edge has a second color! That second color MUST line up with its side center.',
          'Example: The White-Green edge must connect the White center on the bottom with the Green center on the front.'
        ],
        actionInstructions: 'We will solve 1 edge at a time. Let\'s start by finding the White-Green edge on your cube.',
        visualCue: {
          title: 'Goal: White on bottom + Green matches Green center',
          cubeColor: 'bg-emerald-500/20 text-emerald-300',
          badge: 'The Goal'
        },
        checkpoint: 'Find the White-Green edge anywhere on your cube right now.'
      },
      {
        title: 'Situation A (Easiest): White Facing UP on Top',
        subtitle: 'When the white sticker is visible on the yellow top face.',
        explanation: [
          'Look at the White-Green edge in the top layer.',
          'If the WHITE sticker is facing UP at the ceiling, look at its side color (Green).',
          'Turn the top layer (U) until Green matches the Green center.',
          'Now, turn the Green face twice (F2)! The piece will flip 180° straight into the bottom cross!'
        ],
        actionInstructions: 'Turn the top until the side color matches its center, then turn that face twice (180°). It is now solved in the cross!',
        visualCue: {
          title: 'Match Side Color → Turn Face Twice (F2)',
          cubeColor: 'bg-emerald-500/20 text-emerald-300',
          badge: 'Situation A',
          moves: 'U (match center) → F2'
        },
        checkpoint: 'Look at the bottom: White is connected to White center, and Green is connected to Green center!'
      },
      {
        title: 'Situation B: White Facing the SIDE on Top',
        subtitle: 'When the edge is in the top layer, but the white sticker is on the side.',
        explanation: [
          'What if the White sticker is facing you or to the side, and the other color is on top?',
          'If you turn F2, the white sticker will end up on the side of the bottom layer instead of the bottom floor!',
          'Here is the simple 3-move fix:',
          '1. Turn the top so the edge is directly in front of you.',
          '2. Turn the top layer to the left: U\'',
          '3. Turn the right side down: R\'',
          '4. Turn the front face: F',
          'The white edge slides cleanly into the bottom cross!'
        ],
        actionInstructions: 'Hold the edge in front of you and execute: U\' R\' F R. It drops directly into the bottom white cross.',
        visualCue: {
          title: 'The 3-Move Slide: U\' R\' F R',
          cubeColor: 'bg-amber-500/20 text-amber-300',
          badge: 'Situation B',
          moves: "U' R' F R"
        },
        checkpoint: 'Is the white edge now on the bottom matching both centers?'
      },
      {
        title: 'Situation C: Edge Trapped in Middle Layer',
        subtitle: 'When the edge is stuck in the equator slice between top and bottom.',
        explanation: [
          'If the edge is in the middle layer, you don\'t need any algorithms!',
          'Simply turn that side face (R or R\' or L) to pop the piece up to the top layer.',
          'Now it is on the top layer, so you can solve it using Situation A or B above!',
          'If moving the side face disturbed another cross piece, just turn it back after moving the top layer.'
        ],
        actionInstructions: 'Turn the side face to bring the piece to the top layer, turn the top layer to save it, then restore the side.',
        visualCue: {
          title: 'Lift to Top Layer → Solve as Top Edge',
          cubeColor: 'bg-sky-500/20 text-sky-300',
          badge: 'Situation C',
          moves: "R U R'"
        },
        checkpoint: 'Repeat this for all 4 edges: White-Green, White-Red, White-Blue, White-Orange. You now have a complete White Cross!'
      }
    ]
  },

  // -----------------------------------------------------------
  // LESSON 3: PHASE 2 — FIRST TWO LAYERS (F2L)
  // -----------------------------------------------------------
  {
    id: 'lesson-3-f2l',
    lessonNumber: 3,
    title: 'Phase 2: First Two Layers (The "Hide & Seek" Method)',
    concept: 'Instead of solving corners then edges separately, we bond a corner and edge together on top and slide them into their "garage slot" at the same time!',
    steps: [
      {
        title: 'The Concept: The "Garage" (Slot)',
        subtitle: 'Understanding what we are trying to do.',
        explanation: [
          'Look at the bottom two layers. There are 4 vertical "corners" (like garages).',
          'For example: between the Red center and Green center, there is a slot for the White-Red-Green corner and the Red-Green edge.',
          'Instead of memorizing 41 formulas, F2L is just a simple story:',
          '1. Bring both pieces to the top layer.',
          '2. Pair them up so they touch and match.',
          '3. Slide them down into the garage together!'
        ],
        actionInstructions: 'Look at the top layer for any corner with WHITE on it. For example, find the White-Red-Green corner.',
        visualCue: {
          title: 'Target: White-Red-Green Corner + Red-Green Edge',
          cubeColor: 'bg-indigo-500/20 text-indigo-300',
          badge: 'F2L Foundation'
        },
        checkpoint: 'Can you spot the matching corner and edge for one slot?'
      },
      {
        title: 'The "Hide & Seek" Pairing Technique',
        subtitle: 'How to connect pieces without breaking your white cross.',
        explanation: [
          'If both pieces are in the top layer, but separated:',
          'How do you move one piece closer to the other without messing up your solved cross?',
          'The Secret: "HIDE & SEEK"',
          '1. Put the corner above its open garage slot.',
          '2. HIDE: Turn the right face down (R\') to temporarily hide the corner in the basement.',
          '3. MOVE: Turn the top layer (U2) to slide the edge next to the corner.',
          '4. UNHIDE: Turn the right face back up (R) to bring the corner back.',
          'Boom! They are now bonded into a connected pair!'
        ],
        actionInstructions: 'Hide the corner down into an open slot (R\'), rotate the edge to meet it (U2), then restore (R).',
        visualCue: {
          title: 'Hide Corner (R\') → Move Edge (U2) → Unhide (R)',
          cubeColor: 'bg-emerald-500/20 text-emerald-300',
          badge: 'The Secret',
          moves: "(R' U2 R)"
        },
        checkpoint: 'Notice how the corner and edge are now touching with matching colors!'
      },
      {
        title: 'The 3-Move Garage Insert',
        subtitle: 'Putting the connected pair into the bottom slot.',
        explanation: [
          'Once your pair is connected together in the top layer, putting it in the slot takes only 3 moves:',
          '1. OPEN THE GARAGE: Turn the right face up (R).',
          '2. DRIVE THE CAR IN: Turn the top layer to push the pair in (U\').',
          '3. CLOSE THE GARAGE: Turn the right face down (R\').',
          'That corner and edge are now permanently solved in the first two layers!'
        ],
        actionInstructions: 'Hold the slot in front-right and do: U (R U\' R\'). The pair slides right in.',
        visualCue: {
          title: 'Open (R) → Drive In (U\') → Close (R\')',
          cubeColor: 'bg-amber-500/20 text-amber-300',
          badge: '3-Move Insert',
          moves: "U (R U' R')"
        },
        checkpoint: 'Look at the front-right slot: both layers are completely solid and matching!'
      },
      {
        title: 'Special Case: Corner White Sticker Facing UP',
        subtitle: 'Solving the White-Up puzzle for ANY of the 4 color pairs',
        explanation: [
          'What if your corner has WHITE facing straight up at the ceiling?',
          'The 4 Possible Slots (Always keep White on BOTTOM):',
          '• Blue & Orange pair: Hold BLUE in FRONT, ORANGE on RIGHT.',
          '• Green & Red pair: Hold GREEN in FRONT, RED on RIGHT.',
          '• Red & Blue pair: Hold RED in FRONT, BLUE on RIGHT.',
          '• Orange & Green pair: Hold ORANGE in FRONT, GREEN on RIGHT.',
          'THE CRITICAL "STEP 0" (Pre-Alignment):',
          'Before executing ANY formula, turn ONLY the top layer (U, U\', or U2) until:',
          '1. The White-up corner is at FRONT-RIGHT (directly above the open slot).',
          '2. The matching edge is at the RIGHT face (with its side sticker matching the right center).',
          'Then execute the 3-step sequence:',
          '1. TWIST CORNER: Turn (R U2\' R\'). Swinging the corner 180° flips White from the ceiling onto the front face!',
          '2. CONNECT: Turn U\' to slide the corner over to the edge, forming a bonded pair on the right side.',
          '3. INSERT: Turn (R U R\') to open the slot, slide the pair in, and close it!'
        ],
        actionInstructions: 'Hold your slot at Front-Right. Turn top layer (U) so corner is at Front-Right and edge is at Right. Execute: (R U2\' R\') U\' (R U R\').',
        visualCue: {
          title: 'Setup at Front-Right → (R U2\' R\') → U\' (R U R\')',
          cubeColor: 'bg-sky-500/20 text-sky-300',
          badge: 'White-Up Mastered',
          moves: "(R U2' R') U' (R U R')"
        },
        checkpoint: 'Check your cube: The target slot is now 100% solved! The white cross and first two layers are solid!',
        tip: 'Remember the 4-pair rule: Orange is right of Blue, Red is right of Green, Blue is right of Red, Green is right of Orange. Keep your slot at Front-Right!'
      }
    ]
  },

  // -----------------------------------------------------------
  // LESSON 4: PHASE 3 — THE YELLOW FACE (2-LOOK OLL)
  // -----------------------------------------------------------
  {
    id: 'lesson-4-oll',
    lessonNumber: 4,
    title: 'Phase 3: The Yellow Face (Only 2 Simple Triggers)',
    concept: 'Make the entire top face solid yellow. You only need to learn 2 easy movement patterns!',
    steps: [
      {
        title: 'Step 1: Make the Yellow Cross (The 3 Edge Cases)',
        subtitle: 'Look only at the 4 edges and center. Here is the algorithm for each case:',
        explanation: [
          'Ignore the 4 corners for now. The yellow edges will always form one of these 3 cases:',
          '1. The "L" / 90° Angle (2 adjacent edges): Hold the edges at BACK & LEFT (12 & 9 o\'clock). Alg: f (R U R\' U\') f\'',
          '2. The Line (2 opposite edges): Hold horizontally (left-to-right). Alg: F (R U R\' U\') F\'',
          '3. The Dot (0 edges yellow): Do the Line alg: F (R U R\' U\') F\', then U2, then the L alg: f (R U R\' U\') f\'',
          '4. Cross Already Formed (all 4 edges yellow): Skip directly to Step 2!'
        ],
        actionInstructions: 'Identify your edge case above, hold in the correct position, and execute its algorithm to form the Yellow Cross.',
        visualCue: {
          title: 'L: f (R U R\' U\') f\'  •  Line: F (R U R\' U\') F\'',
          cubeColor: 'bg-yellow-500/20 text-yellow-300',
          badge: 'Yellow Cross',
          moves: "f (R U R' U') f'"
        },
        checkpoint: 'All 4 edges are now yellow, forming a clean yellow cross on top!'
      },
      {
        title: 'Step 2: Complete the Yellow Face (Corner Cases)',
        subtitle: 'Once you have the cross, here is the algorithm for each corner case:',
        explanation: [
          'Now look at the corners. Match your pattern to one of the standard cases:',
          '1. Sune (1 corner yellow, "Fish" facing front-left): R U R\' U R U2\' R\'',
          '2. Anti-Sune (1 corner yellow, front-right sticker faces right): R U2 R\' U\' R U\' R\'',
          '3. Car (0 corners yellow, headlights in front & back): F (R U R\' U\')3 F\'',
          '4. Blinker (0 corners yellow, headlights on left): (R U2 R\') (U\' R U R\') (U\' R U\' R\')',
          '5. Headlights (2 corners yellow in back, 2 headlights in front): R2 D (R\' U2 R) D\' (R\' U2 R\')',
          '6. Chameleon (2 corners yellow, headlights facing side): r U R\' U\' r\' F R F\'',
          '7. Bowtie (2 diagonal corners yellow): F\' (r U R\' U\') (r\' F R)',
          'Note for Beginners: Executing the standard Sune (R U R\' U R U2\' R\') will solve or cycle ANY corner case into the Fish shape!'
        ],
        actionInstructions: 'Position your cube to match the case above, or use the universal Sune algorithm: R U R\' U R U2\' R\'.',
        visualCue: {
          title: 'Universal Sune: R U R\' U R U2\' R\'',
          cubeColor: 'bg-amber-500/20 text-amber-300',
          badge: 'Yellow Face Solved',
          moves: "R U R' U R U2' R'"
        },
        checkpoint: 'Check your physical cube: The entire top face is now 100% solid yellow!'
      }
    ]
  },

  // -----------------------------------------------------------
  // LESSON 5: PHASE 4 — FINISHING THE CUBE (PLL)
  // -----------------------------------------------------------
  {
    id: 'lesson-5-pll',
    lessonNumber: 5,
    title: 'Phase 4: Finishing the Cube (2-Look PLL)',
    concept: 'All faces are solved except the side colors of the top layer. Slide corners and edges into home!',
    steps: [
      {
        title: 'Step 1: Look for "Headlights" (Matching Corners)',
        subtitle: 'Headlights are two corners on the same face with matching color.',
        explanation: [
          'Look around the 4 sides of the top layer.',
          'Do you see any face with two corners of the SAME color? (Like two green headlights on a car).',
          'If YES: Put those headlights on the LEFT side of the cube, and do the T-Perm.',
          'If NO: Do the Y-Perm from any angle to create headlights.'
        ],
        actionInstructions: 'Put headlights on the LEFT side and execute T-Perm.',
        visualCue: {
          title: 'T-Perm (Corners to Home)',
          cubeColor: 'bg-purple-500/20 text-purple-300',
          badge: 'Headlights',
          moves: "(R U R' U') (R' F R2 U') (R' U' R U) (R' F')"
        },
        checkpoint: 'All 4 corners around the cube now match their sides!'
      },
      {
        title: 'Step 2: The Final Edge Cycle (Cube Solved!)',
        subtitle: 'The last 3 edges slide into place.',
        explanation: [
          'Look around the sides. One face will now be completely solid (all 3 stickers match).',
          'Put that fully solved face at the BACK of the cube.',
          'The remaining 3 edges just need to rotate into place using the U-Perm (Ua or Ub).',
          'Once you finish this sequence, the entire Rubik\'s cube is 100% SOLVED!'
        ],
        actionInstructions: 'Hold the solved bar in the back and execute Ua-Perm: (R U\' R U) R U (R U\' R\' U\') R2.',
        visualCue: {
          title: 'U-Perm: (R U\' R U) R U (R U\' R\' U\') R2',
          cubeColor: 'bg-emerald-500/20 text-emerald-300',
          badge: 'SOLVED!',
          moves: "(R U' R U) R U (R U' R' U') R2"
        },
        checkpoint: 'CONGRATULATIONS! You have completely solved the Rubik\'s Cube!',
        tip: '⚠️ Troubleshooting: If you see 2 sides fully solved and only 2 middle edges swapped, that is an impossible state on a 3x3 (physical edge swap parity). On a solvable 3x3, edges only cycle in 3s (U-Perm) or 4s (H/Z-Perm). If only 2 edges are swapped, gently pop those two edge pieces out and swap them by hand!'
      }
    ]
  }
];

interface InteractiveTeacherProps {
  initialLessonIdx?: number;
  onNavigateTab?: (tab: 'academy' | 'patterns' | 'chunking' | 'recall' | 'tree' | 'f2l-lab' | 'budget' | 'timer' | 'library' | 'notation') => void;
}

export const InteractiveTeacher: React.FC<InteractiveTeacherProps> = ({
  initialLessonIdx = 0,
  onNavigateTab
}) => {
  const [currentLessonIdx, setCurrentLessonIdx] = useState<number>(initialLessonIdx);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  useEffect(() => {
    if (initialLessonIdx !== undefined && initialLessonIdx >= 0 && initialLessonIdx < LESSONS.length) {
      setCurrentLessonIdx(initialLessonIdx);
      setCurrentStepIdx(0);
    }
  }, [initialLessonIdx]);

  const lesson = LESSONS[currentLessonIdx];
  const step = lesson.steps[currentStepIdx];

  const handleNextStep = () => {
    if (currentStepIdx < lesson.steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else if (currentLessonIdx < LESSONS.length - 1) {
      setCurrentLessonIdx(prev => prev + 1);
      setCurrentStepIdx(0);
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 }
      });
    } else {
      // Completed all lessons!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    } else if (currentLessonIdx > 0) {
      setCurrentLessonIdx(prev => prev - 1);
      setCurrentStepIdx(LESSONS[currentLessonIdx - 1].steps.length - 1);
    }
  };

  const isLastStepOfAll =
    currentLessonIdx === LESSONS.length - 1 &&
    currentStepIdx === lesson.steps.length - 1;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Banner: Teacher Persona */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Interactive Cube Academy • Beginner Teacher</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              Learning to Solve from Scratch
            </h2>
            <p className="text-xs text-slate-400">
              Zero speedcubing jargon. Patient, step-by-step guidance that explains <strong>why</strong> pieces move.
            </p>
          </div>

          {/* Lesson Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-950 rounded-2xl border border-slate-800 shrink-0">
            {LESSONS.map((l, idx) => (
              <button
                key={l.id}
                onClick={() => { setCurrentLessonIdx(idx); setCurrentStepIdx(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  currentLessonIdx === idx
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Lesson {l.lessonNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Lesson Progress & Concept Callout */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <span className="font-bold text-amber-400 text-sm">
            {lesson.title}
          </span>
          <span className="text-slate-500 font-semibold">
            Step {currentStepIdx + 1} of {lesson.steps.length} in this lesson
          </span>
        </div>
        <p className="text-xs text-slate-300 italic">
          "{lesson.concept}"
        </p>
      </div>

      {/* Main Interactive Lesson Card */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        {/* Step Title */}
        <div className="space-y-1.5 border-b border-slate-800 pb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            Step {currentStepIdx + 1} of {lesson.steps.length}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-100">
            {step.title}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            {step.subtitle}
          </p>
        </div>

        {/* Teacher Explanation Points */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            Teacher's Explanation:
          </span>
          <div className="space-y-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
            {step.explanation.map((line, idx) => (
              <p key={idx} className="text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-2">
                <span className="text-amber-400 font-bold mt-0.5">•</span>
                <span>{line}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Visual Cue & Moves Box */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Physical Action on Your Cube:
            </span>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${step.visualCue.cubeColor}`}>
              {step.visualCue.badge}
            </span>
          </div>

          <p className="text-sm font-bold text-slate-100 leading-snug">
            👉 {step.actionInstructions}
          </p>

          {step.visualCue.moves && (
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Turn Sequence:</span>
                <span className="font-mono text-base font-black text-amber-300 tracking-wider select-all">
                  {step.visualCue.moves}
                </span>
              </div>
              <span className="text-xs text-slate-400">Do this smoothly</span>
            </div>
          )}
        </div>

        {/* Checkpoint Question: Reassurance */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Checkpoint: Check Your Physical Cube
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-200">
              {step.checkpoint}
            </p>
            {step.tip && (
              <p className="text-xs text-slate-400 pt-1">
                💡 <strong>Tip:</strong> {step.tip}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handlePrevStep}
            disabled={currentLessonIdx === 0 && currentStepIdx === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            onClick={handleNextStep}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs sm:text-sm transition-all shadow-lg ${
              isLastStepOfAll
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
            }`}
          >
            <span>
              {isLastStepOfAll
                ? '🎉 Completed Academy!'
                : currentStepIdx === lesson.steps.length - 1
                ? `Next: Lesson ${lesson.lessonNumber + 1}`
                : 'Next Step'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {isLastStepOfAll && onNavigateTab && (
          <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 space-y-3 mt-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              🚀 Ready to Speed Up? Recommended Next Steps:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => onNavigateTab('patterns')}
                className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 text-left space-y-1 transition-colors"
              >
                <span className="font-bold text-amber-400 block">⚡ Visual Matrix (0-Click)</span>
                <span className="text-[11px] text-slate-400">See all patterns flat on one screen.</span>
              </button>
              <button
                onClick={() => onNavigateTab('chunking')}
                className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 text-left space-y-1 transition-colors"
              >
                <span className="font-bold text-emerald-400 block">🧩 Core 4 Triggers</span>
                <span className="text-[11px] text-slate-400">Lock in the 4 universal speedcubing reflexes.</span>
              </button>
              <button
                onClick={() => onNavigateTab('recall')}
                className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 text-left space-y-1 transition-colors"
              >
                <span className="font-bold text-sky-400 block">🧠 Active Recall Drill</span>
                <span className="text-[11px] text-slate-400">Spaced flashcard trainer for muscle memory.</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
