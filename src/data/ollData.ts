import { DecisionNode, PhaseTimeBudget } from '../types/cube';

export const ollBudget: PhaseTimeBudget = {
  phase: 'oll',
  label: 'Orientation of Last Layer',
  beginnerTarget: 10,
  sub30Target: 3.5, // 1.5s EO + 2.0s CO
  proTarget: 1.5,    // 1-look full OLL
  description: '2-Look OLL is the fastest path to Sub-30: Step 1 (Edge Cross, 3 cases) + Step 2 (Corners, 7 cases). Only 9 algorithms total!',
};

export const ollDecisionTree: DecisionNode[] = [
  // ----------------------------------------------------
  // STEP 1: EDGE ORIENTATION (EO)
  // ----------------------------------------------------
  {
    id: 'oll-start',
    phase: 'oll',
    stepNumber: 1,
    totalStepsInPhase: 2,
    title: 'Phase 3: Yellow Face (Edge Cross)',
    question: 'Look down at the YELLOW face on top: What shape do the yellow edges form?',
    helpText: 'Hold White on the BOTTOM. In Step 1, look ONLY at the 4 edges and center (+), ignoring the 4 corners for now. Which shape do the yellow edges make?',
    options: [
      {
        id: 'oll-opt-cross',
        label: 'Yellow Cross is Already Formed! (All 4 edges yellow)',
        subtitle: 'All 4 edges have yellow on top. You can skip directly to orienting the corners!',
        badge: 'Skip Step 1 (0.0s)',
        diagramConfig: {
          type: 'oll',
          topGrid: [
            false, true, false,
            true,  true, true,
            false, true, false
          ]
        },
        nextNodeId: 'oll-corners-step'
      },
      {
        id: 'oll-opt-bar',
        label: 'A Straight Line / Bar',
        subtitle: 'Two opposite edges are yellow, forming a straight line across the center',
        badge: 'Line Case',
        diagramConfig: {
          type: 'oll',
          topGrid: [
            false, false, false,
            true,  true,  true,
            false, false, false
          ],
          wings: {
            top: [false, true, false],
            bottom: [false, true, false]
          }
        },
        solution: {
          id: 'oll-sol-bar',
          caseName: 'Line / Bar (Edge Orientation)',
          phase: 'oll',
          category: '2-Look OLL Step 1',
          setupMoves: "F (R U R' U') F'",
          recognitionTip: 'Two opposite edges are yellow. Hold the bar HORIZONTALLY (left to right).',
          howToHold: 'Hold the yellow bar HORIZONTALLY (Left to Right, 9 & 3 o\'clock). Either face where the bar runs across can face you.',
          sub30Tip: 'Hold the bar horizontally. One single sexy move inside F triggers: F (R U R\' U\') F\'. Takes 0.9 seconds!',
          diagramConfig: {
            type: 'oll',
            topGrid: [
              false, false, false,
              true,  true,  true,
              false, false, false
            ],
            wings: {
              top: [false, true, false],
              bottom: [false, true, false]
            }
          },
          algorithms: {
            sub30: {
              id: 'oll-bar-sub30',
              name: 'F (Sexy Move) F\'',
              notation: "F (R U R' U') F'",
              moveCount: 6,
              difficulty: 'sub30',
              timeEstimate: 0.9,
              fingertricks: 'Right index pushes F, right hand executes (R U R\') with index flick U\', right thumb restores F\'.',
              notes: 'Once finished, proceed to Step 2 (Corners) below!'
            }
          }
        }
      },
      {
        id: 'oll-opt-angle',
        label: 'Small "L" / 90° Angle Shape',
        subtitle: 'Two adjacent edges form a backwards 9 o\'clock / 12 o\'clock angle',
        badge: 'L-Shape (1.0s)',
        diagramConfig: {
          type: 'oll',
          topGrid: [
            false, true,  false,
            true,  true,  false,
            false, false, false
          ],
          wings: {
            right: [false, true, false],
            bottom: [false, true, false]
          }
        },
        solution: {
          id: 'oll-sol-angle',
          caseName: 'Small "L" / Angle (Edge Orientation)',
          phase: 'oll',
          category: '2-Look OLL Step 1',
          setupMoves: "f (R U R' U') f'",
          recognitionTip: 'Two adjacent edges are yellow (ignore any yellow corners). Hold the two yellow edges at BACK and LEFT (12 o\'clock and 9 o\'clock).',
          howToHold: 'Rotate U layer until the 2 yellow edges point BACK (12 o\'clock) and LEFT (9 o\'clock). IGNORE any yellow corners! The face with no yellow edge pointing at you is FRONT.',
          sub30Tip: 'Wide f move: f (R U R\' U\') f\'. Turning both front layers (f) solves the L-shape in just 6 moves!',
          diagramConfig: {
            type: 'oll',
            topGrid: [
              false, true,  false,
              true,  true,  false,
              false, false, false
            ],
            wings: {
              right: [false, true, false],
              bottom: [false, true, false]
            }
          },
          algorithms: {
            intuitive: {
              id: 'oll-angle-int',
              name: 'Wide Front + Sexy Move',
              notation: "f (R U R' U') f'",
              moveCount: 6,
              difficulty: 'intuitive',
              timeEstimate: 1.2,
              intuitiveSteps: [
                '1. Look only at the edges: notice the "L" shape formed by the 2 yellow edges and center.',
                '2. Turn the top layer (U) so the two yellow edges point to BACK (12 o\'clock) and LEFT (9 o\'clock).',
                '3. Push BOTH front layers down: f (wide front turn).',
                '4. Do the Sexy Move: (R U R\' U\').',
                '5. Push BOTH front layers back up: f\'.',
                '6. All 4 edges are now yellow, forming the Yellow Cross!'
              ],
              notes: 'Alternative without wide turns: hold L at front-right and do F (R U R\' U\') (R U R\' U\') F\'!'
            },
            sub30: {
              id: 'oll-angle-sub30',
              name: 'f (Sexy Move) f\'',
              notation: "f (R U R' U') f'",
              moveCount: 6,
              difficulty: 'sub30',
              timeEstimate: 0.9,
              fingertricks: 'Right index pushes both front layers down (f), sexy move (R U R\' U\'), right thumb restores f\'.'
            },
            pro: {
              id: 'oll-angle-alt',
              name: 'Inverse Sexy F-trigger',
              notation: "F (U R U' R') F'",
              moveCount: 6,
              difficulty: 'pro',
              timeEstimate: 0.9,
              notes: 'Alternative if you prefer regular F over wide f.'
            }
          }
        }
      },
      {
        id: 'oll-opt-dot',
        label: 'Dot Case (No Edges Yellow)',
        subtitle: 'Only the yellow center sticker is facing up',
        badge: 'Combined Alg (1.8s)',
        diagramConfig: {
          type: 'oll',
          topGrid: [
            false, false, false,
            false, true,  false,
            false, false, false
          ],
          wings: {
            top: [false, true, false],
            right: [false, true, false],
            bottom: [false, true, false],
            left: [false, true, false]
          }
        },
        solution: {
          id: 'oll-sol-dot',
          caseName: 'Dot Case (No Yellow Edges)',
          phase: 'oll',
          category: '2-Look OLL Step 1',
          setupMoves: "F (R U R' U') F' f (R U R' U') f'",
          recognitionTip: 'Zero edges have yellow on top. Only the center is yellow.',
          howToHold: 'Any face can face you (White on bottom). Doing F (R U R\' U\') F\' produces an L-shape!',
          sub30Tip: 'Execute Line alg + Angle alg back-to-back: F (R U R\' U\') F\' then f (R U R\' U\') f\'. Takes ~1.8s.',
          diagramConfig: {
            type: 'oll',
            topGrid: [
              false, false, false,
              false, true,  false,
              false, false, false
            ],
            wings: {
              top: [false, true, false],
              right: [false, true, false],
              bottom: [false, true, false],
              left: [false, true, false]
            }
          },
          algorithms: {
            sub30: {
              id: 'oll-dot-sub30',
              name: 'Line + Angle Combo',
              notation: "F (R U R' U') F' f (R U R' U') f'",
              moveCount: 12,
              difficulty: 'sub30',
              timeEstimate: 1.8,
              fingertricks: 'Seamless transition: finish the first F\' and directly roll right index into wide f.'
            }
          }
        }
      }
    ]
  },

  // ----------------------------------------------------
  // STEP 2: CORNER ORIENTATION (CO) - THE 7 CROSS CASES
  // ----------------------------------------------------
  {
    id: 'oll-corners-step',
    phase: 'oll',
    stepNumber: 2,
    totalStepsInPhase: 2,
    title: 'OLL Step 2: Yellow Corners (7 Cases)',
    question: 'How many YELLOW CORNERS are facing UP on top?',
    helpText: 'All 4 edges are yellow now (Yellow Cross). Now look at the 4 corners. How many have yellow on top?',
    options: [
      {
        id: 'oll-corners-1',
        label: '1 Corner Yellow ("Fish" shape)',
        subtitle: 'Sune or Anti-Sune',
        badge: 'Most Common',
        diagramConfig: {
          type: 'oll',
          topGrid: [
            false, true, false,
            true,  true, true,
            true,  true, false
          ]
        },
        nextNodeId: 'oll-fish-cases'
      },
      {
        id: 'oll-corners-0',
        label: '0 Corners Yellow (Pure Cross)',
        subtitle: 'Car (H) or Blinker (Pi)',
        badge: '2 Cases',
        diagramConfig: {
          type: 'oll',
          topGrid: [
            false, true, false,
            true,  true, true,
            false, true, false
          ]
        },
        nextNodeId: 'oll-zero-corners-cases'
      },
      {
        id: 'oll-corners-2',
        label: '2 Corners Yellow',
        subtitle: 'Headlights (U), Chameleon (T), or Bowtie (L)',
        badge: '3 Cases',
        diagramConfig: {
          type: 'oll',
          topGrid: [
            false, true, false,
            true,  true, true,
            true,  true, true
          ]
        },
        nextNodeId: 'oll-two-corners-cases'
      }
    ]
  },

  // ----------------------------------------------------
  // 1 CORNER YELLOW: SUNE / ANTI-SUNE
  // ----------------------------------------------------
  {
    id: 'oll-fish-cases',
    phase: 'oll',
    stepNumber: 2,
    totalStepsInPhase: 2,
    title: '1 Corner Yellow ("Fish" Cases)',
    question: 'Put the solved yellow corner in FRONT-LEFT. Where is the front-right corner yellow sticker?',
    options: [
      {
        id: 'oll-opt-sune',
        label: 'Sune (Yellow Faces Front)',
        subtitle: 'Front-right corner has yellow facing directly at you',
        solution: {
          id: 'oll-sol-sune',
          caseName: 'Sune (OLL 27)',
          phase: 'oll',
          category: '2-Look OLL Step 2',
          setupMoves: "R U R' U R U2' R'",
          recognitionTip: 'Put the solved fish-head at FRONT-LEFT. The front-right corner yellow sticker faces FRONT.',
          howToHold: 'Hold the solved fish-head corner at FRONT-LEFT (bottom-left). Look at front-right corner: its yellow sticker MUST face FRONT (directly at you).',
          sub30Tip: 'The most important algorithm in speedcubing! Practice until it is under 0.9s: R U R\' U R U2\' R\'.',
          diagramConfig: {
            type: 'oll',
            topGrid: [
              false, true, false,
              true,  true, true,
              true,  true, false
            ],
            wings: {
              right: [true, false, false],
              top: [false, false, true],
              bottom: [false, false, true]
            }
          },
          algorithms: {
            sub30: {
              id: 'oll-sune-sub30',
              name: 'Classic Sune',
              notation: "R U R' U R U2' R'",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 0.9,
              fingertricks: 'Right hand: R (wrist), U (index flick), R\' (wrist), U (index flick), R (wrist), U2\' (index-middle double flick), R\' (wrist).'
            }
          }
        }
      },
      {
        id: 'oll-opt-antisune',
        label: 'Anti-Sune (Yellow Faces Right)',
        subtitle: 'Front-right corner has yellow facing RIGHT',
        solution: {
          id: 'oll-sol-antisune',
          caseName: 'Anti-Sune (OLL 26)',
          phase: 'oll',
          category: '2-Look OLL Step 2',
          setupMoves: "R U2' R' U' R U' R'",
          recognitionTip: 'Fish head at BACK-RIGHT (or front-left with yellow facing right).',
          howToHold: 'Hold the solved fish-head corner at BACK-RIGHT (top-right). Look at front-left corner: its yellow sticker MUST face FRONT (directly at you).',
          sub30Tip: 'Inverse of Sune: R U2\' R\' U\' R U\' R\' or Left-hand Sune: L\' U\' L U\' L\' U2 L.',
          diagramConfig: {
            type: 'oll',
            topGrid: [
              false, true, true,
              true,  true, true,
              false, true, false
            ],
            wings: {
              left: [false, false, true],
              bottom: [true, false, false],
              top: [true, false, false]
            }
          },
          algorithms: {
            sub30: {
              id: 'oll-antisune-sub30',
              name: 'Right-Hand Anti-Sune',
              notation: "R U2' R' U' R U' R'",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Double flick U2\' immediately after R, then crisp U\' pushes with left index.'
            },
            intuitive: {
              id: 'oll-antisune-left',
              name: 'Left-Hand Sune (Mirror)',
              notation: "L' U' L U' L' U2 L",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.1,
              notes: 'Exact mirror image of Sune executed with left hand.'
            }
          }
        }
      }
    ]
  },

  // ----------------------------------------------------
  // 0 CORNERS YELLOW: CAR (H) / BLINKER (PI)
  // ----------------------------------------------------
  {
    id: 'oll-zero-corners-cases',
    phase: 'oll',
    stepNumber: 2,
    totalStepsInPhase: 2,
    title: '0 Corners Yellow Cases',
    question: 'How are the side yellow corner stickers arranged?',
    options: [
      {
        id: 'oll-opt-h',
        label: 'Car / H Case (2 Headlights Front & Back)',
        subtitle: 'Two yellow headlights in front, two in back',
        solution: {
          id: 'oll-sol-h',
          caseName: 'Car / H (OLL 21)',
          phase: 'oll',
          category: '2-Look OLL Step 2',
          setupMoves: "F (R U R' U')3 F'",
          recognitionTip: 'Two headlights facing front, two headlights facing back.',
          howToHold: 'Hold with 2 yellow headlights facing FRONT (facing you), and 2 facing BACK. Left and right sides have NO yellow.',
          sub30Tip: 'Super easy: F followed by 3 sexy moves, then F\'! F (R U R\' U\')3 F\'. Takes ~1.3s.',
          diagramConfig: {
            type: 'oll',
            topGrid: [
              false, true, false,
              true,  true, true,
              false, true, false
            ],
            wings: {
              top: [true, false, true],
              bottom: [true, false, true]
            }
          },
          algorithms: {
            sub30: {
              id: 'oll-h-sub30',
              name: 'Triple Sexy Move',
              notation: "F (R U R' U')3 F'",
              moveCount: 14,
              difficulty: 'sub30',
              timeEstimate: 1.3,
              fingertricks: 'Index finger pushes F, cycle 3 rapid sexy triggers, restore F\' with right thumb.'
            },
            pro: {
              id: 'oll-h-pro',
              name: 'RU Generator Speed Alg',
              notation: "R U2' (R' U' R U R' U') (R U' R')",
              moveCount: 11,
              difficulty: 'pro',
              timeEstimate: 1.0,
              notes: 'Preferred by World Championship speedcubers for zero regrips.'
            }
          }
        }
      },
      {
        id: 'oll-opt-pi',
        label: 'Blinker / Pi (Headlights on Left, Opposites on Right)',
        subtitle: 'Two headlights on left side; front/back on right side',
        solution: {
          id: 'oll-sol-pi',
          caseName: 'Blinker / Pi (OLL 22)',
          phase: 'oll',
          category: '2-Look OLL Step 2',
          setupMoves: "R U2' (R2' U' R2 U') (R2' U2' R)",
          recognitionTip: 'Hold the 2 headlights on the LEFT. The two right-side corners face front and back.',
          howToHold: 'Hold with the 2 yellow headlights on the LEFT side. The right-side corners face FRONT and BACK.',
          sub30Tip: 'Crisp R2-U pattern: R U2\' (R2\' U\' R2 U\') (R2\' U2\' R). Sub-1.2s with muscle memory.',
          diagramConfig: {
            type: 'oll',
            topGrid: [
              false, true, false,
              true,  true, true,
              false, true, false
            ],
            wings: {
              left: [true, false, true],
              bottom: [false, false, true],
              top: [false, false, true]
            }
          },
          algorithms: {
            sub30: {
              id: 'oll-pi-sub30',
              name: 'R2 Rocker Alg',
              notation: "R U2' (R2' U' R2 U') (R2' U2' R)",
              moveCount: 10,
              difficulty: 'sub30',
              timeEstimate: 1.2,
              fingertricks: 'Right wrist keeps continuous rotation for the R2 swings.'
            }
          }
        }
      }
    ]
  },

  // ----------------------------------------------------
  // 2 CORNERS YELLOW: T, U, L
  // ----------------------------------------------------
  {
    id: 'oll-two-corners-cases',
    phase: 'oll',
    stepNumber: 2,
    totalStepsInPhase: 2,
    title: '2 Corners Yellow Cases',
    question: 'Where are the 2 solved yellow corners situated?',
    options: [
      {
        id: 'oll-opt-u',
        label: 'Headlights / U Case',
        subtitle: '2 solved corners on one side; other 2 face FRONT together',
        solution: {
          id: 'oll-sol-u',
          caseName: 'Headlights / U (OLL 23)',
          phase: 'oll',
          category: '2-Look OLL Step 2',
          setupMoves: "R2 D (R' U2 R) D' (R' U2 R')",
          recognitionTip: 'Two yellow corners solved in back. The other two yellow stickers face forward like car headlights.',
          howToHold: 'Hold with the 2 yellow headlights facing FRONT (directly at you). The 2 solved yellow corners must be in the BACK.',
          sub30Tip: 'Hold headlights in front. Alg: R2 D (R\' U2 R) D\' (R\' U2 R\').',
          diagramConfig: {
            type: 'oll',
            topGrid: [
              true,  true, true,
              true,  true, true,
              false, true, false
            ],
            wings: {
              bottom: [true, false, true]
            }
          },
          algorithms: {
            sub30: {
              id: 'oll-u-sub30',
              name: 'Standard Headlights Alg',
              notation: "R2 D (R' U2 R) D' (R' U2 R')",
              moveCount: 9,
              difficulty: 'sub30',
              timeEstimate: 1.2,
              fingertricks: 'Left ring finger pushes D, then D\' with left ring pull.'
            }
          }
        }
      },
      {
        id: 'oll-opt-t',
        label: 'Chameleon / T Case',
        subtitle: '2 solved corners on one side; other 2 face OPPOSITE outwards',
        solution: {
          id: 'oll-sol-t',
          caseName: 'Chameleon / T (OLL 24)',
          phase: 'oll',
          category: '2-Look OLL Step 2',
          setupMoves: "(r U R' U') (r' F R F')",
          recognitionTip: 'Hold the 2 solved corners on the RIGHT. The two unsolved corners face front and back outwards.',
          howToHold: 'Hold with the 2 solved yellow corners on the RIGHT side. The two unsolved corners face front and back outwards.',
          sub30Tip: 'Fat sexy move into Sledgehammer! (r U R\' U\') (r\' F R F\'). Extremely smooth, under 1.1s!',
          diagramConfig: {
            type: 'oll',
            topGrid: [
              false, true, true,
              true,  true, true,
              false, true, true
            ],
            wings: {
              left: [true, false, true]
            }
          },
          algorithms: {
            sub30: {
              id: 'oll-t-sub30',
              name: 'Wide Sexy + Sledgehammer',
              notation: "(r U R' U') (r' F R F')",
              moveCount: 8,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Wide r with right hand, sexy move, wide r\' back, right index pulls F, thumb pushes F\'.'
            }
          }
        }
      },
      {
        id: 'oll-opt-l',
        label: 'Bowtie / L Case',
        subtitle: '2 solved corners are DIAGONAL to each other',
        solution: {
          id: 'oll-sol-l',
          caseName: 'Bowtie / L (OLL 25)',
          phase: 'oll',
          category: '2-Look OLL Step 2',
          setupMoves: "F' (r U R' U') (r' F R)",
          recognitionTip: 'Two diagonal corners are yellow. Hold so one yellow faces front-left.',
          howToHold: 'Hold so the front-left unsolved corner yellow sticker faces FRONT (directly at you). Solved corners will be at back-left and front-right.',
          sub30Tip: 'Alg: F\' (r U R\' U\') (r\' F R). Essentially an F-trigger wrapped around wide sexy!',
          diagramConfig: {
            type: 'oll',
            topGrid: [
              false, true, true,
              true,  true, true,
              true,  true, false
            ],
            wings: {
              bottom: [false, false, true],
              top: [true, false, false]
            }
          },
          algorithms: {
            sub30: {
              id: 'oll-l-sub30',
              name: 'Inverse F Sledge Combo',
              notation: "F' (r U R' U') (r' F R)",
              moveCount: 8,
              difficulty: 'sub30',
              timeEstimate: 1.1,
              fingertricks: 'Left index lifts F\', execute wide sexy (r U R\' U\'), restore with (r\' F R).'
            }
          }
        }
      }
    ]
  }
];
