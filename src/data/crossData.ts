import { DecisionNode, PhaseTimeBudget } from '../types/cube';

export const crossBudget: PhaseTimeBudget = {
  phase: 'cross',
  label: 'White Cross',
  beginnerTarget: 10,
  sub30Target: 3.5,
  proTarget: 1.8,
  description: 'Solved on bottom (white face down). Fully planned during 15-second inspection without pausing.',
};

export const crossDecisionTree: DecisionNode[] = [
  {
    id: 'cross-start',
    phase: 'cross',
    stepNumber: 1,
    totalStepsInPhase: 2,
    title: 'Phase 1: White Cross on Bottom',
    question: 'Where are the white edges on your cube right now?',
    helpText: 'Hold the cube with the WHITE center facing the FLOOR (Bottom) and the YELLOW center facing the CEILING (Top). Look around your cube for any edges that have a white sticker. Where are they?',
    options: [
      {
        id: 'cross-opt-easy-d',
        label: 'White Edges on the Top Layer (Yellow face)',
        subtitle: 'The edge is up on top; white is either pointing at the ceiling or sideways',
        badge: 'Top Layer',
        diagramConfig: {
          type: 'cross',
          crossDetails: {
            edgePositions: 'Top layer',
            alignment: 'Align with center, double turn F2 or insert'
          }
        },
        nextNodeId: 'cross-u-layer'
      },
      {
        id: 'cross-opt-middle',
        label: 'White Edges in the Middle Layer (Equator)',
        subtitle: 'The edge is trapped in the middle slice between the top and bottom layers',
        badge: '1-Move Drop',
        diagramConfig: {
          type: 'cross',
          crossDetails: {
            edgePositions: 'Equator layer',
            alignment: 'Bring down directly into bottom'
          }
        },
        nextNodeId: 'cross-middle-layer'
      },
      {
        id: 'cross-opt-flipped-bottom',
        label: 'In the Bottom Layer, but Flipped Backwards',
        subtitle: 'The edge is in the bottom cross, but white is facing outwards instead of down',
        badge: 'Flip Fix',
        diagramConfig: {
          type: 'cross',
          crossDetails: {
            edgePositions: 'Bottom layer flipped',
            alignment: 'Needs flip algorithm or 3-move insert'
          }
        },
        nextNodeId: 'cross-flipped-bottom'
      },
      {
        id: 'cross-opt-full-plan',
        label: 'Foolproof 4-Step Cross Strategy',
        subtitle: 'Solve all 4 white edges one by one without getting confused',
        badge: 'Zero Jargon',
        diagramConfig: {
          type: 'cross',
          crossDetails: {
            edgePositions: 'All 4 edges',
            alignment: 'Match side center -> Turn face twice (F2)'
          }
        },
        nextNodeId: 'cross-inspection'
      }
    ]
  },
  {
    id: 'cross-u-layer',
    phase: 'cross',
    stepNumber: 2,
    totalStepsInPhase: 2,
    title: 'Top Layer Cross Edges',
    question: 'Which way is the white sticker of the edge piece facing?',
    options: [
      {
        id: 'cross-u-white-up',
        label: 'White Sticker Facing UP (Yellow face)',
        subtitle: 'Easy 2-turn alignment',
        diagramConfig: {
          type: 'cross',
          crossDetails: {
            edgePositions: 'White pointing UP',
            alignment: 'Turn U to match side color, then F2'
          }
        },
        solution: {
          id: 'cross-sol-white-up',
          caseName: 'White Sticker Facing UP on Top Layer',
          phase: 'cross',
          category: 'Top Layer',
          recognitionTip: 'The white sticker is visible on the yellow top face (pointing up at the ceiling). The side sticker has a color like Green or Red.',
          sub30Tip: 'The easiest case on the cube! Look at the side color (e.g. Green). Turn the top layer until Green lines up with the Green center. Then turn that face twice (180° / F2) to flip the edge down into the white cross!',
          diagramConfig: {
            type: 'cross',
            crossDetails: {
              edgePositions: 'White up',
              alignment: 'Match side center -> Turn face twice (F2)'
            }
          },
          algorithms: {
            intuitive: {
              id: 'cross-alg-u-up-int',
              name: 'Match Center & Turn Twice',
              notation: "U (match side center) F2",
              moveCount: 3,
              difficulty: 'intuitive',
              timeEstimate: 1.0,
              intuitiveSteps: [
                '1. Look at the side color of the white edge (e.g. Green)',
                '2. Turn the top layer (U) until that color sits directly above its matching center',
                '3. Turn that front face twice (F2) to drop the edge down into the white bottom cross'
              ],
              notes: 'Foolproof 2-step solution.'
            },
            sub30: {
              id: 'cross-alg-u-up-sub30',
              name: 'Fast Face Drop',
              notation: "U F2",
              moveCount: 2,
              difficulty: 'sub30',
              timeEstimate: 0.8,
              fingertricks: 'Flick U with index finger, double turn F2 with wrist.',
              notes: 'Connects directly with zero pause.'
            }
          }
        }
      },
      {
        id: 'cross-u-white-side',
        label: 'White Sticker Facing SIDE',
        subtitle: 'Flipped edge in top layer',
        diagramConfig: {
          type: 'cross',
          crossDetails: {
            edgePositions: 'White pointing sideways in U',
            alignment: 'Do not do F2! Requires 3-move insert'
          }
        },
        solution: {
          id: 'cross-sol-white-side',
          caseName: 'White Sticker Facing SIDE on Top Layer',
          phase: 'cross',
          category: 'Top Layer',
          recognitionTip: 'The edge is in the top layer, but the white sticker is on the SIDE (facing you or to the right). The other color is on top. If you turn F2, the white sticker will end up on the side of the bottom layer instead of the bottom floor!',
          sub30Tip: 'Hold the edge in front of you. A simple 4-move trigger slides it into place: U\' R\' F R. This pops the edge into the side slot and lines it up with both the white center and the side center.',
          diagramConfig: {
            type: 'cross',
            crossDetails: {
              edgePositions: 'White side',
              alignment: "U' R' F R"
            }
          },
          algorithms: {
            intuitive: {
              id: 'cross-alg-u-side-int',
              name: '4-Move Slide',
              notation: "U' R' F R",
              moveCount: 4,
              difficulty: 'intuitive',
              timeEstimate: 1.2,
              intuitiveSteps: [
                '1. Hold the edge in front of you directly above its center',
                '2. Turn top to the left: U\'',
                '3. Turn right side down: R\'',
                '4. Turn front face: F',
                '5. Restore right side: R'
              ],
              notes: 'Puts the piece into the cross without disturbing other cross pieces.'
            },
            sub30: {
              id: 'cross-alg-u-side-sub30',
              name: 'Speed Slide Insert',
              notation: "U' R' F R",
              moveCount: 4,
              difficulty: 'sub30',
              timeEstimate: 0.9,
              fingertricks: 'Right thumb on front, flick R\' with index, F with right index push.',
              notes: 'Fluid single-grip execution.'
            }
          }
        }
      }
    ]
  },
  {
    id: 'cross-middle-layer',
    phase: 'cross',
    stepNumber: 2,
    totalStepsInPhase: 2,
    title: 'Middle Layer Cross Edges',
    question: 'How is the edge situated in the middle (equator) layer?',
    options: [
      {
        id: 'cross-mid-white-front',
        label: 'White Sticker on Front/Back',
        subtitle: 'Can be inserted into bottom in 1 single move!',
        solution: {
          id: 'cross-sol-mid-1move',
          caseName: '1-Move Direct Insert from Equator',
          phase: 'cross',
          category: 'Middle Layer',
          recognitionTip: 'White sticker is facing front or back on the middle slice.',
          sub30Tip: 'A single R, R\', L, or L\' move will drop this piece straight into the bottom cross! Align the D face first so it lands in the right spot.',
          diagramConfig: {
            type: 'cross',
            crossDetails: {
              edgePositions: 'Middle equator',
              alignment: 'D-align then single slice drop'
            }
          },
          algorithms: {
            intuitive: {
              id: 'cross-mid-int',
              name: 'Lift to Top & Solve',
              notation: "R U' R' (or L' U L)",
              moveCount: 3,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. Turn side face up (R or L\') to bring white edge to the top layer',
                '2. Turn top face (U\') so the edge is safely out of the way',
                '3. Turn side face back down (R\' or L) to protect other solved cross edges',
                '4. Now solve from top: spin top to match side center, then turn face twice (F2)!'
              ],
              notes: 'Safely lifts piece into the top layer where it is foolproof to solve.'
            },
            sub30: {
              id: 'cross-mid-drop',
              name: 'Aligned Slice Drop',
              notation: "D' R D (or simply R' if slot is ready)",
              moveCount: 3,
              difficulty: 'sub30',
              timeEstimate: 0.7,
              fingertricks: 'Flick D\' with left ring finger, R with right wrist, D back with left pinky/ring.'
            }
          }
        }
      },
      {
        id: 'cross-mid-white-side',
        label: 'White Sticker on Left/Right Side',
        subtitle: 'Needs F or B turn to drop',
        solution: {
          id: 'cross-sol-mid-fmove',
          caseName: 'Side-Facing Equator Edge',
          phase: 'cross',
          category: 'Middle Layer',
          recognitionTip: 'White sticker is facing right or left side on the equator.',
          sub30Tip: 'Turn F or F\' (or push target slot into position) to drop directly into D.',
          diagramConfig: {
            type: 'cross',
            crossDetails: {
              edgePositions: 'Middle equator side',
              alignment: 'F / F\' insert'
            }
          },
          algorithms: {
            intuitive: {
              id: 'cross-mid-f-int',
              name: 'Direct Front Drop',
              notation: "F (or F')",
              moveCount: 1,
              difficulty: 'intuitive',
              timeEstimate: 0.8,
              intuitiveSteps: [
                '1. Check the non-white side of the edge',
                '2. If it is already aligned with its center, turn that front face (F or F\') to drop into the white bottom cross!',
                '3. If not, lift it to the top layer first with F, move top U, and restore.'
              ],
              notes: 'Direct 1-turn drop into the bottom cross.'
            },
            sub30: {
              id: 'cross-mid-f-drop',
              name: 'Front Face Drop',
              notation: "F (or F')",
              moveCount: 1,
              difficulty: 'sub30',
              timeEstimate: 0.4,
              fingertricks: 'Index finger push or drag on the F layer.'
            }
          }
        }
      }
    ]
  },
  {
    id: 'cross-flipped-bottom',
    phase: 'cross',
    stepNumber: 2,
    totalStepsInPhase: 2,
    title: 'Bottom Layer Flipped Edge',
    question: 'How do you fix an edge already in bottom layer but flipped wrong?',
    options: [
      {
        id: 'cross-flip-fix',
        label: 'Flipped in Bottom Slot',
        subtitle: 'Fix without destroying other cross pieces',
        solution: {
          id: 'cross-sol-flip-bot',
          caseName: 'Flipped Cross Edge in D Layer',
          phase: 'cross',
          category: 'Bottom Layer',
          recognitionTip: 'Edge is in the bottom layer, but white is facing forward/sideways instead of down.',
          sub30Tip: 'Do NOT take it to top and re-solve! Eject it into the middle layer and insert in one motion: F\' D R\' D\' or (R\' U\' R) F.',
          diagramConfig: {
            type: 'cross',
            crossDetails: {
              edgePositions: 'Bottom layer flipped',
              alignment: "F' D R' D' or R' D' F D"
            }
          },
          algorithms: {
            intuitive: {
              id: 'cross-flip-int',
              name: 'Eject & Insert',
              notation: "F2 U' R' F R",
              moveCount: 5,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. F2 brings the piece to the top layer',
                '2. U\' moves it away',
                '3. Insert into side slot: R\' F R'
              ]
            },
            sub30: {
              id: 'cross-flip-sub30',
              name: 'Direct Flip Insert',
              notation: "F' D R' D'",
              moveCount: 4,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Fluid 4-move combination that fixes the flip in under 1 second without disturbing other solved cross edges.'
            }
          }
        }
      }
    ]
  },
  {
    id: 'cross-inspection',
    phase: 'cross',
    stepNumber: 2,
    totalStepsInPhase: 2,
    title: 'Foolproof 4-Step Cross Strategy',
    question: 'How to solve all 4 white edges one by one without getting confused',
    options: [
      {
        id: 'cross-rule-foolproof',
        label: 'The One-By-One Center Match Method',
        subtitle: 'Green -> Red -> Blue -> Orange (Direct & Simple)',
        solution: {
          id: 'cross-sol-foolproof',
          caseName: 'Foolproof White Cross Strategy',
          phase: 'cross',
          category: 'Step-by-Step Fundamentals',
          recognitionTip: 'Always hold White on the bottom (facing table) and Yellow on the top (ceiling).',
          sub30Tip: 'Solve edges one at a time. Lift the white edge to the top (yellow) layer, spin top (U) until its side color matches its center, then turn that face twice (F2) to lock it into the white bottom!',
          diagramConfig: {
            type: 'cross',
            crossDetails: {
              edgePositions: 'All 4 edges',
              alignment: 'Match side center -> Turn face twice (F2)'
            }
          },
          algorithms: {
            intuitive: {
              id: 'cross-foolproof-drill',
              name: 'The 4-Step Cross Routine',
              notation: "Bring to Top -> Match Side Center -> Turn Face Twice (F2)",
              moveCount: 4,
              difficulty: 'intuitive',
              timeEstimate: 4.0,
              intuitiveSteps: [
                '1. Look for any edge piece with a white sticker.',
                '2. Bring that edge up to the top (yellow) layer so you can see it easily.',
                '3. Look at its second color (e.g. Green). Turn the top layer until Green sits right above the Green center.',
                '4. Turn that front face twice (F2) 180° so the white sticker drops into the bottom.',
                '5. Repeat for the other 3 white edges (Red, Blue, Orange). Your cross is 100% complete!'
              ],
              notes: 'Never worry about memorizing complicated speedcubing orders when starting out. Building one edge at a time creates a perfect cross every single time.'
            },
            sub30: {
              id: 'cross-sub30-drill',
              name: 'Fast Direct Alignment',
              notation: "Trace all 4 edges in inspection -> Execute directly",
              moveCount: 6,
              difficulty: 'sub30',
              timeEstimate: 2.5,
              notes: 'As you gain confidence, try locating 2 or 3 white edges during your 15-second inspection before making your first turn.'
            }
          }
        }
      }
    ]
  }
];
