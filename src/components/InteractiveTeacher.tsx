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
    title: 'Phase 2: First Two Layers (The 2-Piece Hunt & Garage Method)',
    concept: 'Instead of solving 4 corners then 4 edges separately (8 slow steps), we pair each corner with its matching edge in the top layer and slide them into their "garage slot" together in just 4 pairs!',
    steps: [
      {
        title: 'Step 1: The Objective & The 4 "Garages" (Slots)',
        subtitle: 'What is F2L trying to do on the cube?',
        explanation: [
          'Before F2L: You have solved the White Cross on the bottom.',
          'The Goal: Fill the 4 vertical corners (called "slots" or "garages") between the side centers and the white cross.',
          'When F2L is finished: The entire bottom TWO layers will be 100% solid color! Only the yellow top layer will remain.',
          'Each slot needs exactly TWO pieces to be solved:',
          '1. A Corner piece with WHITE and two side colors (e.g., White-Orange-Blue).',
          '2. The matching Edge piece with those same two side colors (e.g., Orange-Blue).'
        ],
        actionInstructions: 'Look at the 4 vertical gaps between your side centers. Those are the 4 slots you will fill.',
        visualCue: {
          title: 'Goal: Solve All 4 Vertical Slots (Bottom 2 Layers Solid)',
          cubeColor: 'bg-emerald-500/20 text-emerald-300',
          badge: 'The Objective'
        },
        checkpoint: 'Notice how solving 4 pairs solves both the bottom corners and the middle layer simultaneously!'
      },
      {
        title: 'Step 2: The Eye-Tracking Scan (What to Look at First)',
        subtitle: 'Never stare at the whole cube! Follow this exact 3-step hunt.',
        explanation: [
          'When looking at your scrambled cube during F2L, don\'t panic. Follow this simple scanning routine:',
          '1. LOOK AT THE TOP LAYER: Find ANY corner piece that has a WHITE sticker.',
          '2. NOTE ITS TWO SIDE COLORS: For example, Orange and Blue.',
          '   (This instantly tells you your target: you are solving the Orange-Blue slot!)',
          '3. HUNT FOR ITS TWIN EDGE: Scan the cube for the Orange-Blue edge (it has only 2 colors: Orange and Blue — NO White, NO Yellow).',
          '4. IGNORE EVERYTHING ELSE: Your entire universe is now just those TWO pieces and that ONE slot!'
        ],
        actionInstructions: 'Find one White corner in the top layer. Find its matching 2-color edge. Focus only on them.',
        visualCue: {
          title: 'Find 1 White Corner → Find Matching Edge → Ignore Rest',
          cubeColor: 'bg-indigo-500/20 text-indigo-300',
          badge: 'The Visual Scan'
        },
        checkpoint: 'Can you hold your cube and point with your fingers to the corner, the edge, and the slot where they belong?'
      },
      {
        title: 'Step 3: The Universal "Eviction" Move (R U R\')',
        subtitle: 'What if a corner or edge is trapped in a slot down below?',
        explanation: [
          'Often, the piece you need is not in the top layer — it is stuck down in a middle or bottom slot.',
          'Don\'t worry! You don\'t need any complicated algorithms to free it:',
          '1. Rotate the cube so the stuck piece is at your FRONT-RIGHT.',
          '2. Execute the 3-move Eviction: (R U R\').',
          '3. That piece instantly pops up into the top layer safely!',
          '4. Your white cross remains 100% intact.'
        ],
        actionInstructions: 'Put any stuck piece at Front-Right and do: R U R\'. It pops straight to the top layer.',
        visualCue: {
          title: 'Stuck in Slot? Do (R U R\') to Eject to Top Layer',
          cubeColor: 'bg-rose-500/20 text-rose-300',
          badge: 'Universal Eviction',
          moves: "(R U R')"
        },
        checkpoint: 'Both your corner and edge are now safely in the top layer, ready to be paired!'
      },
      {
        title: 'Step 4: The 3 Base Situations (All 41 Cases Reduce to These!)',
        subtitle: 'You do NOT need to memorize 41 algorithms. Master these 3 rules:',
        explanation: [
          'Once both pieces are in the top layer, look at their top stickers:',
          '• SITUATION 1: Already Connected Pair (Stickers match)',
          '  Align pair opposite slot, open garage, drive in, close: U (R U\' R\').',
          '• SITUATION 2: Top Colors are DIFFERENT (e.g. Orange vs Blue)',
          '  Place edge at 90° to corner. One move pairs them up: (R U R\')!',
          '• SITUATION 3: Top Colors are the SAME (Both have Orange on top)',
          '  The "Hide & Seek" move: Hide corner in basement (R\'), slide edge over (U2), bring corner back (R). They bond together! Then insert.'
        ],
        actionInstructions: 'Look at the top of your corner and edge. Are they already paired, different top colors, or same top color?',
        visualCue: {
          title: 'Connected → (R U\' R\') • Different → (R U R\') • Same → (R\' U2 R)',
          cubeColor: 'bg-amber-500/20 text-amber-300',
          badge: 'The 3 Golden Rules'
        },
        checkpoint: 'Can you see how every F2L case is just getting pieces into one of these 3 states?'
      },
      {
        title: 'Step 5: Special Case — Corner White Facing UP',
        subtitle: 'What to do when White is pointing straight at the ceiling.',
        explanation: [
          'If the corner has White on top, it cannot directly bond to the edge yet because White must face the side.',
          'Here is the foolproof 3-step solution:',
          '1. MATCH EDGE TO CENTER: Turn the top layer until the edge\'s side sticker matches its center color.',
          '2. TWIST CORNER: Turn (R U2\' R\') — this swings the corner 180° and flips White from the ceiling onto the front face!',
          '3. CONNECT & INSERT: Turn U\' to slide the corner over to the edge, then insert with (R U R\')!'
        ],
        actionInstructions: 'Match edge side to center. Do (R U2\' R\') to flip White to side, U\' to pair, (R U R\') to insert.',
        visualCue: {
          title: 'Match Edge → Twist Corner (R U2\' R\') → Connect U\' → Insert (R U R\')',
          cubeColor: 'bg-sky-500/20 text-sky-300',
          badge: 'White-Up Solved',
          moves: "(R U2' R') U' (R U R')"
        },
        checkpoint: 'Notice how White flipped from the top to the side and the slot solved perfectly!'
      },
      {
        title: 'Step 6: Physical Cube Holding (Clockwise Color Guide)',
        subtitle: 'Never hold your cube backwards again!',
        explanation: [
          'Always keep WHITE on the BOTTOM and YELLOW on the TOP.',
          'Looking down at the Yellow face from above, the 4 side faces go clockwise:',
          'Blue ➔ Red ➔ Green ➔ Orange ➔ Blue',
          '',
          'To solve each slot at your FRONT-RIGHT (FR):',
          '• Orange-Blue Slot: Hold ORANGE in Front, BLUE on Right.',
          '• Blue-Red Slot: Hold BLUE in Front, RED on Right.',
          '• Red-Green Slot: Hold RED in Front, GREEN on Right.',
          '• Green-Orange Slot: Hold GREEN in Front, ORANGE on Right.',
          '',
          'Repeat Steps 2 through 4 for all 4 slots. When done, your first two layers are 100% complete!'
        ],
        actionInstructions: 'Rotate your cube to put your target slot at Front-Right and match the centers table above.',
        visualCue: {
          title: 'Blue ➔ Red ➔ Green ➔ Orange ➔ Blue (Clockwise)',
          cubeColor: 'bg-emerald-500/20 text-emerald-300',
          badge: 'Holding Anchor'
        },
        checkpoint: 'When all 4 slots are solved, you are ready for Phase 3: The Yellow Face (OLL)!'
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
          '1. The "L" / 90° Angle (2 adjacent edges): Hold edges at FRONT & RIGHT (6 & 3 o\'clock) and do f (R U R\' U\') f\'. (Or hold at BACK & LEFT and do F (U R U\' R\') F\')',
          '2. The Line (2 opposite edges): Hold horizontally (left-to-right). Alg: F (R U R\' U\') F\'',
          '3. The Dot (0 edges yellow): Do F (R U R\' U\') F\' immediately followed by f (R U R\' U\') f\' with NO U-turn in between!',
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
          '5. Headlights (2 corners yellow in back, 2 headlights in front): R2 D (R\' U2 R) D\' (R\' U2 R\') — 💡 Direction Tip: D slides bottom layer RIGHT; D\' slides it back LEFT! (Or use Sune: R U R\' U R U2\' R\' to cycle into the Fish)',
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
