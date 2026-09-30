import { DecisionNode, PhaseTimeBudget } from '../types/cube';

export const pllBudget: PhaseTimeBudget = {
  phase: 'pll',
  label: 'Permutation of Last Layer',
  beginnerTarget: 15,
  sub30Target: 3.5, // 2-Look PLL or fast 1-Look PLL
  proTarget: 1.8,    // 1-look full PLL
  description: 'The final step! 2-Look PLL requires only 6 algorithms total (T-perm, Y-perm, Ua, Ub, H, Z). Learning Full PLL (21 algs) will easily push you toward sub-20.',
};

export const pllDecisionTree: DecisionNode[] = [
  // ----------------------------------------------------
  // STEP 1: CORNER PERMUTATION
  // ----------------------------------------------------
  {
    id: 'pll-start',
    phase: 'pll',
    stepNumber: 1,
    totalStepsInPhase: 2,
    title: 'Phase 4: Final Step (Corner Headlights)',
    question: 'Look at the side stickers of the 4 top corners: Do you see matching "Headlights"?',
    helpText: 'Hold White on the BOTTOM. Look around the 4 sides of the top layer. "Headlights" are two corner stickers on the same face that have the EXACT same color (like matching headlights on a car).',
    options: [
      {
        id: 'pll-corners-all-headlights',
        label: 'Headlights on ALL 4 Sides (All corners solved!)',
        subtitle: 'Every side has matching corner colors. You can skip straight to the edge cycle!',
        badge: 'Skip Step 1 (0.0s)',
        diagramConfig: {
          type: 'pll',
          headlights: ['top', 'right', 'bottom', 'left']
        },
        nextNodeId: 'pll-edges-step'
      },
      {
        id: 'pll-corners-one-headlight',
        label: 'Headlights on ONLY 1 Side',
        subtitle: 'Only one face has two matching corner stickers. The other three faces have different corners.',
        badge: 'T-Perm or Aa-Perm',
        diagramConfig: {
          type: 'pll',
          headlights: ['left']
        },
        solution: {
          id: 'pll-sol-headlights-one',
          caseName: 'Headlights on 1 Side (Adjacent Corner Swap)',
          phase: 'pll',
          category: '2-Look PLL Step 1',
          setupMoves: "(R U R' U') (R' F R2 U') (R' U' R U) (R' F')",
          recognitionTip: 'Put the matching headlights on the LEFT side of the cube.',
          sub30Tip: 'Execute T-Perm! The quintessential speedcubing algorithm. Practice until it takes 1.4s.',
          diagramConfig: {
            type: 'pll',
            headlights: ['left']
          },
          algorithms: {
            sub30: {
              id: 'pll-t-perm-sub30',
              name: 'T-Perm (Adjacent Swap)',
              notation: "(R U R' U') (R' F R2 U') (R' U' R U) (R' F')",
              moveCount: 14,
              difficulty: 'sub30',
              timeEstimate: 1.4,
              fingertricks: 'Break into 4 triggers: Sexy move (R U R\' U\') -> Sledge setup (R\' F R2 U\') -> Insert (R\' U\' R U) -> Finish (R\' F\').',
              notes: 'Puts all 4 corners into their solved positions. Then proceed to Step 2 (Edges)!'
            },
            pro: {
              id: 'pll-aa-perm-pro',
              name: 'Aa-Perm (Alternative)',
              notation: "x (R' U R') D2 (R U' R') D2 R2 x'",
              moveCount: 9,
              difficulty: 'pro',
              timeEstimate: 1.1,
              notes: 'Shorter move count, requires left ring finger D2 double flick.'
            }
          }
        }
      },
      {
        id: 'pll-corners-no-headlights',
        label: 'NO Headlights Anywhere',
        subtitle: 'Every side has two different colored corners (Diagonal swap)',
        badge: 'Y-Perm (1.7s)',
        diagramConfig: {
          type: 'pll',
          headlights: []
        },
        solution: {
          id: 'pll-sol-no-headlights',
          caseName: 'No Headlights (Diagonal Corner Swap)',
          phase: 'pll',
          category: '2-Look PLL Step 1',
          setupMoves: "F (R U' R' U') (R U R' F') (R U R' U') (R' F R F')",
          recognitionTip: 'Zero matching corner pairs on any of the 4 faces.',
          sub30Tip: 'Execute Y-Perm from ANY angle. It swaps two diagonal corners. After this, all corners will be solved!',
          diagramConfig: {
            type: 'pll',
            headlights: []
          },
          algorithms: {
            sub30: {
              id: 'pll-y-perm-sub30',
              name: 'Y-Perm (Diagonal Swap)',
              notation: "F (R U' R' U') (R U R' F') (R U R' U') (R' F R F')",
              moveCount: 17,
              difficulty: 'sub30',
              timeEstimate: 1.7,
              fingertricks: 'Notice it is just: Setup -> Sexy variant -> Sledgehammer! Practice the second half (R\' F R F\') until automatic.'
            },
            pro: {
              id: 'pll-v-perm-pro',
              name: 'V-Perm (Direct 1-Look Option)',
              notation: "(R' U R' U') y (R' F' R2 U') (R' U R' F) R F",
              moveCount: 14,
              difficulty: 'pro',
              timeEstimate: 1.3,
              notes: 'Advanced 1-look substitute.'
            }
          }
        }
      }
    ]
  },

  // ----------------------------------------------------
  // STEP 2: EDGE PERMUTATION
  // ----------------------------------------------------
  {
    id: 'pll-edges-step',
    phase: 'pll',
    stepNumber: 2,
    totalStepsInPhase: 2,
    title: 'PLL Step 2: Edge Permutation',
    question: 'All 4 corners are solved. How many FULLY SOLVED BARS do you see?',
    helpText: 'Look at the 4 sides. A "Solved Bar" is a face where all 3 top stickers have identical color (corners + edge). Note: On a solvable 3x3, you can only have 4 bars (solved), 1 bar (U-Perm), or 0 bars (H/Z-Perm). Having exactly 2 sides solved and 2 edges swapped is physically impossible on a 3x3 (physical edge swap parity from a popped piece)!',
    options: [
      {
        id: 'pll-edges-4-bars',
        label: '4 Solved Bars (CUBE IS SOLVED!)',
        subtitle: 'All edges and corners match!',
        badge: 'SOLVED!',
        diagramConfig: {
          type: 'pll',
          headlights: ['top', 'right', 'bottom', 'left']
        },
        solution: {
          id: 'pll-sol-solved',
          caseName: 'Cube is Solved!',
          phase: 'pll',
          category: 'Complete',
          recognitionTip: 'All 6 faces are solid colors.',
          sub30Tip: 'Congratulations! Stop the timer!',
          diagramConfig: {
            type: 'pll',
            headlights: ['top', 'right', 'bottom', 'left']
          },
          algorithms: {
            sub30: {
              id: 'pll-solved-alg',
              name: 'Solved',
              notation: "Done!",
              moveCount: 0,
              difficulty: 'sub30',
              timeEstimate: 0.0,
              notes: 'Keep practicing your transitions to maintain sub-30 consistency!'
            }
          }
        }
      },
      {
        id: 'pll-edges-1-bar',
        label: '1 Solved Bar (Ua or Ub Perm)',
        subtitle: 'One side is completely solved; the other 3 edges need cycling',
        badge: '3-Edge Cycle',
        diagramConfig: {
          type: 'pll',
          headlights: ['top', 'right', 'bottom', 'left']
        },
        nextNodeId: 'pll-u-perms'
      },
      {
        id: 'pll-edges-0-bar-opp',
        label: '0 Solved Bars: Opposite Edges Swap (H-Perm)',
        subtitle: 'Every face has a checkerboard pattern (opposite colors)',
        badge: 'H-Perm (0.9s)',
        diagramConfig: {
          type: 'pll',
          headlights: ['top', 'right', 'bottom', 'left']
        },
        solution: {
          id: 'pll-sol-h-perm',
          caseName: 'H-Perm (Opposite Edge Swap)',
          phase: 'pll',
          category: '2-Look PLL Step 2',
          setupMoves: "M2' U M2' U2 M2' U M2'",
          recognitionTip: 'Opposite edges need to swap: Front swaps with Back, Left swaps with Right.',
          sub30Tip: 'The fastest algorithm in speedcubing! M2 flicks with left ring-middle fingers. Can easily be done in 0.8s!',
          diagramConfig: {
            type: 'pll',
            headlights: ['top', 'right', 'bottom', 'left']
          },
          algorithms: {
            sub30: {
              id: 'pll-h-perm-sub30',
              name: 'H-Perm (M-Slice Turbo)',
              notation: "M2' U M2' U2 M2' U M2'",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 0.8,
              fingertricks: 'Left ring finger pushes middle slice up from the bottom (M2 double flick), right index flicks U, repeat.'
            },
            intuitive: {
              id: 'pll-h-perm-ru',
              name: 'RU Generator (No M-slice)',
              notation: "R2 U2 R U2 R2 U2 R2 U2 R U2 R2",
              moveCount: 11,
              difficulty: 'intuitive',
              timeEstimate: 1.4,
              notes: 'Alternative if your cube middle slice feels stiff.'
            }
          }
        }
      },
      {
        id: 'pll-edges-0-bar-adj',
        label: '0 Solved Bars: Adjacent Edges Swap (Z-Perm)',
        subtitle: 'Front swaps with Right, Back swaps with Left',
        badge: 'Z-Perm (1.3s)',
        diagramConfig: {
          type: 'pll',
          headlights: ['top', 'right', 'bottom', 'left']
        },
        solution: {
          id: 'pll-sol-z-perm',
          caseName: 'Z-Perm (Adjacent Edge Swap)',
          phase: 'pll',
          category: '2-Look PLL Step 2',
          setupMoves: "M2' U M2' U M' U2 M2' U2 M'",
          recognitionTip: 'Two pairs of adjacent edges need to swap (e.g. Front <-> Right, and Back <-> Left).',
          sub30Tip: 'Hold the two swapping edges at FRONT and RIGHT. Execute M2\' U M2\' U M\' U2 M2\' U2 M\'.',
          diagramConfig: {
            type: 'pll',
            headlights: ['top', 'right', 'bottom', 'left']
          },
          algorithms: {
            sub30: {
              id: 'pll-z-perm-sub30',
              name: 'Z-Perm (M-Slice)',
              notation: "M2' U M2' U M' U2 M2' U2 M'",
              moveCount: 9,
              difficulty: 'sub30',
              timeEstimate: 1.2,
              fingertricks: 'Double flick M2, index U, double flick M2, index U, single M\' pull, double flick U2, double M2, double U2, single M\'.'
            }
          }
        }
      }
    ]
  },

  // ----------------------------------------------------
  // U PERMS (1 SOLVED BAR)
  // ----------------------------------------------------
  {
    id: 'pll-u-perms',
    phase: 'pll',
    stepNumber: 2,
    totalStepsInPhase: 2,
    title: '1 Solved Bar: U-Perms (Cycle Direction)',
    question: 'Hold the SOLVED BAR at the BACK. Which direction do the 3 remaining edges cycle?',
    helpText: 'Look at the FRONT edge. Does it need to go to the LEFT side (Clockwise = Ua), or to the RIGHT side (Counter-Clockwise = Ub)?',
    options: [
      {
        id: 'pll-opt-ua',
        label: 'Clockwise Cycle (Ua-Perm)',
        subtitle: 'Front edge moves to the Left slot',
        solution: {
          id: 'pll-sol-ua',
          caseName: 'Ua-Perm (Clockwise Cycle)',
          phase: 'pll',
          category: '2-Look PLL Step 2',
          setupMoves: "R2 U (R U R' U') R' U' (R' U R')",
          recognitionTip: 'Solved bar in BACK. Front edge sticker matches the LEFT face center.',
          sub30Tip: 'RU Ua-Perm: (R U\' R U) R U (R U\' R\' U\') R2 or M2 U M U2 M\' U M2. Sub-1.1s!',
          diagramConfig: {
            type: 'pll',
            headlights: ['top', 'right', 'bottom', 'left']
          },
          algorithms: {
            sub30: {
              id: 'pll-ua-ru-sub30',
              name: 'RU Ua-Perm',
              notation: "(R U' R U) R U (R U' R' U') R2",
              moveCount: 11,
              difficulty: 'sub30',
              timeEstimate: 1.1,
              fingertricks: 'Crisp right-hand turns. Zero regrips.'
            },
            pro: {
              id: 'pll-ua-m-slice',
              name: 'M-Slice Ua-Perm',
              notation: "M2' U M U2 M' U M2'",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.9,
              notes: 'Fewer moves, preferred by high-level speedcubers.'
            }
          }
        }
      },
      {
        id: 'pll-opt-ub',
        label: 'Counter-Clockwise Cycle (Ub-Perm)',
        subtitle: 'Front edge moves to the Right slot',
        solution: {
          id: 'pll-sol-ub',
          caseName: 'Ub-Perm (Counter-Clockwise Cycle)',
          phase: 'pll',
          category: '2-Look PLL Step 2',
          setupMoves: "(R U' R U) R U (R U' R' U') R2",
          recognitionTip: 'Solved bar in BACK. Front edge sticker matches the RIGHT face center.',
          sub30Tip: 'Ub-Perm: R2 U (R U R\' U\') R\' U\' (R\' U R\'). Under 1.1s!',
          diagramConfig: {
            type: 'pll',
            headlights: ['top', 'right', 'bottom', 'left']
          },
          algorithms: {
            sub30: {
              id: 'pll-ub-ru-sub30',
              name: 'RU Ub-Perm',
              notation: "R2 U (R U R' U') R' U' (R' U R')",
              moveCount: 11,
              difficulty: 'sub30',
              timeEstimate: 1.1,
              fingertricks: 'Right wrist R2, index flick U, sexy trigger (R U R\' U\'), then 3-pull finish.'
            },
            pro: {
              id: 'pll-ub-m-slice',
              name: 'M-Slice Ub-Perm',
              notation: "M2' U' M U2 M' U' M2'",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.9,
              notes: 'Mirror of M-slice Ua.'
            }
          }
        }
      }
    ]
  }
];

// Full PLL reference library for quick lookup & sub-20 roadmap
export const fullPLLLibrary: {
  id: string;
  name: string;
  type: string;
  notation: string;
  moveCount: number;
  timeEstimate: number;
  recognition: string;
  fingertricks: string;
  priority: 'Essential (Sub-30)' | 'High ROI' | 'Complete Set';
}[] = [
  {
    id: 'pll-t',
    name: 'T-Perm',
    type: 'Adjacent Corners',
    notation: "(R U R' U') (R' F R2 U') (R' U' R U) (R' F')",
    moveCount: 14,
    timeEstimate: 1.3,
    recognition: 'Headlights on Left, two 1x2 blocks on Front and Back.',
    fingertricks: 'Standard 4-trigger execution.',
    priority: 'Essential (Sub-30)'
  },
  {
    id: 'pll-ua',
    name: 'Ua-Perm',
    type: 'Edges Only',
    notation: "(R U' R U) R U (R U' R' U') R2",
    moveCount: 11,
    timeEstimate: 1.1,
    recognition: '1 Solved bar in back; Front edge needs to go to Left (Clockwise).',
    fingertricks: 'Zero regrip RU sequence.',
    priority: 'Essential (Sub-30)'
  },
  {
    id: 'pll-ub',
    name: 'Ub-Perm',
    type: 'Edges Only',
    notation: "R2 U (R U R' U') R' U' (R' U R')",
    moveCount: 11,
    timeEstimate: 1.1,
    recognition: '1 Solved bar in back; Front edge needs to go to Right (Counter-Clockwise).',
    fingertricks: 'Begins with R2 U into sexy move.',
    priority: 'Essential (Sub-30)'
  },
  {
    id: 'pll-h',
    name: 'H-Perm',
    type: 'Edges Only',
    notation: "M2' U M2' U2 M2' U M2'",
    moveCount: 7,
    timeEstimate: 0.8,
    recognition: 'Checkerboard on all 4 faces. Opposite edges swap.',
    fingertricks: 'Left ring-middle M2 double flick.',
    priority: 'Essential (Sub-30)'
  },
  {
    id: 'pll-z',
    name: 'Z-Perm',
    type: 'Edges Only',
    notation: "M2' U M2' U M' U2 M2' U2 M'",
    moveCount: 9,
    timeEstimate: 1.2,
    recognition: 'No solved bars. Adjacent edges swap (F-R, B-L).',
    fingertricks: 'M2 double flicks interspersed with single M\'.',
    priority: 'Essential (Sub-30)'
  },
  {
    id: 'pll-y',
    name: 'Y-Perm',
    type: 'Diagonal Corners',
    notation: "F (R U' R' U') (R U R' F') (R U R' U') (R' F R F')",
    moveCount: 17,
    timeEstimate: 1.6,
    recognition: 'No headlights anywhere. Swaps front-left and back-right corners.',
    fingertricks: 'F-setup -> Sexy combo -> Sledgehammer.',
    priority: 'Essential (Sub-30)'
  },
  {
    id: 'pll-ja',
    name: 'Ja-Perm',
    type: 'Adjacent Corners + Edges',
    notation: "(R' U L' U2) (R U' R' U2) (L R)",
    moveCount: 10,
    timeEstimate: 1.2,
    recognition: 'Solved 1x3 bar on Left side, headlights on Front.',
    fingertricks: 'Very fast 10-move flow.',
    priority: 'High ROI'
  },
  {
    id: 'pll-jb',
    name: 'Jb-Perm',
    type: 'Adjacent Corners + Edges',
    notation: "(R U R' F') (R U R' U') (R' F R2 U' R')",
    moveCount: 11,
    timeEstimate: 1.0,
    recognition: 'Solved 1x3 bar on Right side, headlights on Front. One of the fastest PLLs!',
    fingertricks: 'Similar to T-perm beginning.',
    priority: 'High ROI'
  },
  {
    id: 'pll-aa',
    name: 'Aa-Perm',
    type: 'Adjacent Corners',
    notation: "x (R' U R') D2 (R U' R') D2 R2 x'",
    moveCount: 9,
    timeEstimate: 1.1,
    recognition: 'Headlights in back, 1x2 block in front-left.',
    fingertricks: 'D2 double flick with left ring-pinky.',
    priority: 'High ROI'
  },
  {
    id: 'pll-ab',
    name: 'Ab-Perm',
    type: 'Adjacent Corners',
    notation: "x R2 D2 (R U R') D2 (R U' R) x'",
    moveCount: 9,
    timeEstimate: 1.1,
    recognition: 'Headlights in back, 1x2 block in front-right.',
    fingertricks: 'Mirror of Aa-Perm.',
    priority: 'High ROI'
  },
  {
    id: 'pll-e',
    name: 'E-Perm',
    type: 'Diagonal Corners',
    notation: "x' (R U' R' D) (R U R' D') (R U R' D) (R U' R' D') x",
    moveCount: 16,
    timeEstimate: 1.5,
    recognition: 'Headlights on all 4 sides, but no edges match.',
    fingertricks: 'Rhythmic R-U-D cycles.',
    priority: 'Complete Set'
  },
  {
    id: 'pll-f',
    name: 'F-Perm',
    type: 'Adjacent Corners + Edges',
    notation: "(R' U' F') (R U R' U') (R' F R2 U') (R' U' R U) (R' U R)",
    moveCount: 18,
    timeEstimate: 1.7,
    recognition: '1x3 solved bar on Front, matching headlights on Back.',
    fingertricks: 'T-perm setup variation.',
    priority: 'Complete Set'
  },
  {
    id: 'pll-ra',
    name: 'Ra-Perm',
    type: 'Adjacent Corners + Edges',
    notation: "(R U R' F') (R U2' R' U2') (R' F R U) (R U2' R')",
    moveCount: 15,
    timeEstimate: 1.5,
    recognition: 'Headlights on Left, 1x2 block on front-right.',
    fingertricks: 'Double flick U2s.',
    priority: 'High ROI'
  },
  {
    id: 'pll-rb',
    name: 'Rb-Perm',
    type: 'Adjacent Corners + Edges',
    notation: "(R' U2 R' D') (R U' R' D) (R U R U') (R' U' R)",
    moveCount: 14,
    timeEstimate: 1.5,
    recognition: 'Headlights on Front, 1x2 block on left.',
    fingertricks: 'D-layer bottom flick.',
    priority: 'High ROI'
  }
];
