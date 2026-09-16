import { DecisionNode, PhaseTimeBudget } from '../types/cube';

export const f2lBudget: PhaseTimeBudget = {
  phase: 'f2l',
  label: 'First Two Layers (4 Pairs)',
  beginnerTarget: 35,
  sub30Target: 15, // ~3.75s per pair
  proTarget: 8,    // ~2.0s per pair
  description: 'The single most decisive phase for Sub-30. Solves 4 corner-edge pairs simultaneously without looking at bottom.',
};

export const f2lDecisionTree: DecisionNode[] = [
  {
    id: 'f2l-start',
    phase: 'f2l',
    stepNumber: 1,
    totalStepsInPhase: 3,
    title: 'Step 1: Pick a Pair & Find Its Pieces',
    question: 'Where are your White Corner and its matching Edge located right now?',
    helpText: 'Pick ANY corner piece that has WHITE on it (for example, the White-Orange-Blue corner). Next, locate the matching Orange-Blue edge piece on your cube. Where are these two pieces right now?',
    options: [
      {
        id: 'f2l-opt-both-top',
        label: 'Both in Top Layer (Separated)',
        subtitle: 'Both the corner and edge are in the top layer, but not touching each other (~65% of solves)',
        badge: 'Most Common',
        diagramConfig: {
          type: 'f2l',
          f2lDetails: {
            cornerPos: 'top',
            cornerWhiteFacing: 'right',
            cornerColorSecondary: 'orange',
            cornerColorTertiary: 'blue',
            edgePos: 'top',
            edgeColorTop: 'orange',
            edgeColorFront: 'blue',
            topColorsMatch: false
          }
        },
        nextNodeId: 'f2l-corner-white-orientation'
      },
      {
        id: 'f2l-opt-connected',
        label: 'Connected Pair (Touching in Top Layer)',
        subtitle: 'The corner and edge are already touching together in the top layer (CFOP F2L 1 - 4)',
        badge: 'Instant Insert',
        diagramConfig: {
          type: 'f2l',
          f2lDetails: {
            cornerPos: 'top',
            cornerWhiteFacing: 'front',
            cornerColorSecondary: 'orange',
            cornerColorTertiary: 'blue',
            edgePos: 'top',
            edgeColorTop: 'orange',
            edgeColorFront: 'blue',
            topColorsMatch: true
          }
        },
        nextNodeId: 'f2l-connected-cases'
      },
      {
        id: 'f2l-opt-corner-slot',
        label: 'Corner in Bottom Slot, Edge in Top Layer',
        subtitle: 'The corner is stuck down in the bottom layer, while the edge is up on the top layer (CFOP F2L 25 - 30)',
        badge: 'Ejection Needed',
        diagramConfig: {
          type: 'f2l',
          f2lDetails: {
            cornerPos: 'slot-target',
            cornerWhiteFacing: 'front',
            cornerColorSecondary: 'orange',
            cornerColorTertiary: 'blue',
            edgePos: 'top',
            edgeColorTop: 'orange',
            edgeColorFront: 'blue',
            topColorsMatch: 'n/a'
          }
        },
        nextNodeId: 'f2l-corner-in-slot-cases'
      },
      {
        id: 'f2l-opt-edge-slot',
        label: 'Edge in Middle Slot, Corner in Top Layer',
        subtitle: 'The edge is stuck in the equator/middle layer, while the corner is up on the top layer (CFOP F2L 31 - 36)',
        badge: 'Ejection Needed',
        diagramConfig: {
          type: 'f2l',
          f2lDetails: {
            cornerPos: 'top',
            cornerWhiteFacing: 'up',
            cornerColorSecondary: 'orange',
            cornerColorTertiary: 'blue',
            edgePos: 'slot-target',
            edgeColorTop: 'orange',
            edgeColorFront: 'blue',
            topColorsMatch: 'n/a'
          }
        },
        nextNodeId: 'f2l-edge-in-slot-cases'
      },
      {
        id: 'f2l-opt-both-slot',
        label: 'Both Pieces are in the Slot',
        subtitle: 'Corner and edge are both in the slot, but unsolved or with colors flipped backwards (CFOP F2L 37 - 41)',
        badge: 'Extraction',
        diagramConfig: {
          type: 'f2l',
          f2lDetails: {
            cornerPos: 'slot-target',
            cornerWhiteFacing: 'right',
            cornerColorSecondary: 'orange',
            cornerColorTertiary: 'blue',
            edgePos: 'slot-target',
            edgeColorTop: 'blue',
            edgeColorFront: 'orange',
            topColorsMatch: 'n/a'
          }
        },
        nextNodeId: 'f2l-both-in-slot-cases'
      }
    ]
  },

  // ----------------------------------------------------
  // SUB-TREE: BOTH IN TOP LAYER -> WHITE ORIENTATION
  // ----------------------------------------------------
  {
    id: 'f2l-corner-white-orientation',
    phase: 'f2l',
    stepNumber: 2,
    totalStepsInPhase: 3,
    title: 'Step 2: Corner White Sticker Direction',
    question: 'Look at the corner piece: Which way is its WHITE sticker pointing?',
    helpText: 'Find the white sticker on your corner piece in the top layer. Is it pointing straight up at the ceiling, or pointing sideways (facing your face or off to the right)?',
    options: [
      {
        id: 'f2l-opt-white-side',
        label: 'White is Facing SIDEWAYS (Front or Right)',
        subtitle: 'The white sticker is on the side of the corner. Top has orange or blue.',
        badge: 'Most Common',
        diagramConfig: {
          type: 'f2l',
          f2lDetails: {
            cornerPos: 'top',
            cornerWhiteFacing: 'right',
            cornerColorSecondary: 'orange',
            cornerColorTertiary: 'blue',
            edgePos: 'top',
            edgeColorTop: 'orange',
            edgeColorFront: 'blue',
            topColorsMatch: true
          }
        },
        nextNodeId: 'f2l-white-side-colors'
      },
      {
        id: 'f2l-opt-white-up',
        label: 'White is Facing STRAIGHT UP (At the Ceiling)',
        subtitle: 'You can see the white sticker on the top yellow face alongside yellow stickers (CFOP F2L 19 - 24).',
        badge: 'Rule: Hide Edge',
        diagramConfig: {
          type: 'f2l',
          f2lDetails: {
            cornerPos: 'top',
            cornerWhiteFacing: 'up',
            cornerColorSecondary: 'orange',
            cornerColorTertiary: 'blue',
            edgePos: 'top',
            edgeColorTop: 'blue',
            edgeColorFront: 'orange',
            topColorsMatch: false
          }
        },
        nextNodeId: 'f2l-white-up-cases'
      }
    ]
  },

  // ----------------------------------------------------
  // SUB-TREE: WHITE SIDE -> TOP COLORS MATCH OR DIFFER
  // ----------------------------------------------------
  {
    id: 'f2l-white-side-colors',
    phase: 'f2l',
    stepNumber: 3,
    totalStepsInPhase: 3,
    title: 'Step 3: Top Stickers Comparison',
    question: 'Look down from above: Do the TOP STICKERS of both pieces MATCH or DIFFER?',
    helpText: 'Ignore the white sticker for a moment. Look at the sticker on top of your corner piece, and the sticker on top of your edge piece.',
    options: [
      {
        id: 'f2l-opt-colors-match',
        label: 'Top Colors MATCH (Both have the SAME color)',
        subtitle: 'Example: Both pieces have ORANGE on top (CFOP F2L 5 - 10). (Rule: "Hide corner, move edge, unhide")',
        badge: 'Form Connected Pair',
        diagramConfig: {
          type: 'f2l',
          f2lDetails: {
            cornerPos: 'top',
            cornerWhiteFacing: 'right',
            cornerColorSecondary: 'orange',
            cornerColorTertiary: 'blue',
            edgePos: 'top',
            edgeColorTop: 'orange',
            edgeColorFront: 'blue',
            topColorsMatch: true
          }
        },
        nextNodeId: 'f2l-colors-match-cases'
      },
      {
        id: 'f2l-opt-colors-differ',
        label: 'Top Colors are DIFFERENT (Opposite colors)',
        subtitle: 'Example: Corner has ORANGE on top, but Edge has BLUE on top (CFOP F2L 11 - 18). (Rule: 3-move insert ready)',
        badge: 'Form 3-Move Pair',
        diagramConfig: {
          type: 'f2l',
          f2lDetails: {
            cornerPos: 'top',
            cornerWhiteFacing: 'front',
            cornerColorSecondary: 'orange',
            cornerColorTertiary: 'blue',
            edgePos: 'top',
            edgeColorTop: 'blue',
            edgeColorFront: 'orange',
            topColorsMatch: false
          }
        },
        nextNodeId: 'f2l-colors-differ-cases'
      }
    ]
  },
  // ----------------------------------------------------
  // SOLUTIONS: CONNECTED PAIRS (CFOP F2L 1 - 4)
  // ----------------------------------------------------
  {
    id: 'f2l-connected-cases',
    phase: 'f2l',
    stepNumber: 2,
    totalStepsInPhase: 2,
    title: 'Connected Pairs (F2L 1 - 4)',
    question: 'Which connected or 3-move insert case do you have?',
    options: [
      {
        id: 'f2l-opt-case-1',
        label: 'Basic 3-Move Insert (Right)',
        subtitle: 'Connected pair in top layer with White facing RIGHT. Forms a bonded 1x1x2 block ...',
        badge: 'F2L 1',
        solution: {
          id: 'f2l-sol-case-1',
          caseName: 'Basic 3-Move Insert (Right)',
          phase: 'f2l',
          category: 'Connected Pair',
          setupMoves: "R U R' U'",
          recognitionTip: 'Connected pair in top layer with White facing RIGHT. Forms a bonded 1x1x2 block ready to drop in.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right (target slot is Front-Right). Pair sits at UFR.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): U (R U' R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'right',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'back',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: true
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-1-int',
              name: 'Intuitive Solution',
              notation: "U (R U' R')",
              moveCount: 4,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. U: Aligns the connected pair opposite the slot.',
                '2. R: Opens the front-right slot.',
                '3. U\': Pushes the bonded pair directly into the slot.',
                '4. R\': Closes the slot and restores the white cross.'
              ]
            },
            sub30: {
              id: 'f2l-case-1-sub30',
              name: 'Standard Speedcubing',
              notation: "U (R U' R')",
              moveCount: 4,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right index pushes U, right wrist turns R, right index flicks U\', right wrist restores R\'.'
            },
            pro: {
              id: 'f2l-case-1-pro',
              name: 'Pro Speed Execution',
              notation: "U (R U' R')",
              moveCount: 4,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-2',
        label: 'Front-Facing Connected Pair',
        subtitle: 'Connected pair with White facing FRONT directly at you....',
        badge: 'F2L 2',
        solution: {
          id: 'f2l-sol-case-2',
          caseName: 'Front-Facing Connected Pair',
          phase: 'f2l',
          category: 'Connected Pair',
          setupMoves: "F' U' F U",
          recognitionTip: 'Connected pair with White facing FRONT directly at you.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right (target slot is Front-Right). White points at your chest.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): U' (F' U F). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'front',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'right',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: true
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-2-int',
              name: 'Intuitive Solution',
              notation: "U' (F' U F)",
              moveCount: 4,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. U\': Positions the connected pair to the right.',
                '2. F\': Lifts the front slot to receive the pair.',
                '3. U: Inserts the pair into the open front slot.',
                '4. F: Restores the front face and locks the pair in place.'
              ]
            },
            sub30: {
              id: 'f2l-case-2-sub30',
              name: 'Standard Speedcubing',
              notation: "U' (F' U F)",
              moveCount: 4,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Left index flicks U\', right thumb pushes F\' up, right index flicks U, right index pushes F down.'
            },
            pro: {
              id: 'f2l-case-2-pro',
              name: 'Pro Speed Execution',
              notation: "U' (F' U F)",
              moveCount: 4,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-3',
        label: 'Separated 3-Move Ready (White Right)',
        subtitle: 'Separated pieces, top colors differ. Corner white faces RIGHT, edge is at UL rea...',
        badge: 'F2L 3',
        solution: {
          id: 'f2l-sol-case-3',
          caseName: 'Separated 3-Move Ready (White Right)',
          phase: 'f2l',
          category: 'Connected Pair',
          setupMoves: "R U' R'",
          recognitionTip: 'Separated pieces, top colors differ. Corner white faces RIGHT, edge is at UL ready for 3-move insert.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner at UFR (white right), edge at UL.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'right',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'left',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-3-int',
              name: 'Intuitive Solution',
              notation: "(R U R')",
              moveCount: 3,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. R: Opens the front-right slot.',
                '2. U: Connects the edge and corner into a solved pair in the top layer.',
                '3. R\': Lowers the pair into the slot and restores cross.'
              ]
            },
            sub30: {
              id: 'f2l-case-3-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U R')",
              moveCount: 3,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right wrist turns R, right index flicks U, right wrist restores R\'.'
            },
            pro: {
              id: 'f2l-case-3-pro',
              name: 'Pro Speed Execution',
              notation: "(R U R')",
              moveCount: 3,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-4',
        label: 'Separated 3-Move Ready (White Front)',
        subtitle: 'Separated pieces, top colors differ. Corner white faces FRONT, edge is at UB rea...',
        badge: 'F2L 4',
        solution: {
          id: 'f2l-sol-case-4',
          caseName: 'Separated 3-Move Ready (White Front)',
          phase: 'f2l',
          category: 'Connected Pair',
          setupMoves: "F' U F",
          recognitionTip: 'Separated pieces, top colors differ. Corner white faces FRONT, edge is at UB ready for front 3-move insert.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner at UFR (white front), edge at UB.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (F' U' F). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'front',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'back',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-4-int',
              name: 'Intuitive Solution',
              notation: "(F' U' F)",
              moveCount: 3,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. F\': Opens the front face slot.',
                '2. U\': Connects corner and edge together.',
                '3. F: Restores the front face, completing the insert.'
              ]
            },
            sub30: {
              id: 'f2l-case-4-sub30',
              name: 'Standard Speedcubing',
              notation: "(F' U' F)",
              moveCount: 3,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right thumb lifts F\', left index flicks U\', right index pushes F.'
            },
            pro: {
              id: 'f2l-case-4-pro',
              name: 'Pro Speed Execution',
              notation: "(F' U' F)",
              moveCount: 3,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      }
    ]
  },
  // ----------------------------------------------------
  // SOLUTIONS: WHITE ON SIDE, TOP COLORS MATCH (CFOP F2L 5 - 10)
  // ----------------------------------------------------
  {
    id: 'f2l-colors-match-cases',
    phase: 'f2l',
    stepNumber: 3,
    totalStepsInPhase: 3,
    title: 'Top Colors Match (F2L 5 - 10)',
    question: 'Where is the matching edge located relative to the white sticker?',
    options: [
      {
        id: 'f2l-opt-case-5',
        label: 'White Side: Facing Edge Axis (F2L 5)',
        subtitle: 'Top colors MATCH. Corner at UFR with White facing FRONT. Edge is at BACK (UB). W...',
        badge: 'F2L 5',
        solution: {
          id: 'f2l-sol-case-5',
          caseName: 'White Side: Facing Edge Axis (F2L 5)',
          phase: 'f2l',
          category: 'Colors Match',
          setupMoves: "R U R' U2' R U' R' U",
          recognitionTip: 'Top colors MATCH. Corner at UFR with White facing FRONT. Edge is at BACK (UB). White points along the line to the edge.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right (target slot is Front-Right). Corner at UFR, edge at UB.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): U' (R U R') U2 (R U' R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'front',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'back',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: true
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-5-int',
              name: 'Intuitive Solution',
              notation: "U' (R U R') U2 (R U' R')",
              moveCount: 8,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. U\': Prepares top layer for extraction.',
                '2. (R U R\'): Pops the corner out and bonds it to the edge at the back.',
                '3. U2: Swings the connected pair into insert position.',
                '4. (R U\' R\'): Standard 3-move insert into the slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-5-sub30',
              name: 'Standard Speedcubing',
              notation: "U' (R U R') U2 (R U' R')",
              moveCount: 8,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Left index flicks U\', right wrist pop (R U R\'), index-middle double flick U2, standard insert (R U\' R\').'
            },
            pro: {
              id: 'f2l-case-5-pro',
              name: 'Pro Speed Execution',
              notation: "U' (R U R') U2 (R U' R')",
              moveCount: 8,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-6',
        label: 'White Side: Perpendicular to Edge (F2L 6)',
        subtitle: 'Top colors MATCH. Corner at UFR with White facing RIGHT. Edge is at BACK (UB) at...',
        badge: 'F2L 6',
        solution: {
          id: 'f2l-sol-case-6',
          caseName: 'White Side: Perpendicular to Edge (F2L 6)',
          phase: 'f2l',
          category: 'Colors Match',
          setupMoves: "F' U' F U2' F' U F U'",
          recognitionTip: 'Top colors MATCH. Corner at UFR with White facing RIGHT. Edge is at BACK (UB) at 90° to White.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right (target slot is Front-Right). Corner at UFR, edge at UB.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): U (F' U' F) U2 (F' U F). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'right',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'back',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: true
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-6-int',
              name: 'Intuitive Solution',
              notation: "U (F' U' F) U2 (F' U F)",
              moveCount: 8,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. U: Aligns corner and edge.',
                '2. (F\' U\' F): Front-face pop and pair that joins pieces at the top.',
                '3. U2: Swings pair into insert position.',
                '4. (F\' U F): Inserts pair cleanly into front slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-6-sub30',
              name: 'Standard Speedcubing',
              notation: "U (F' U' F) U2 (F' U F)",
              moveCount: 8,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Index flick U, thumb lift (F\' U\' F), double flick U2, thumb-index finish (F\' U F).'
            },
            pro: {
              id: 'f2l-case-6-pro',
              name: 'Pro Speed Execution',
              notation: "U (F' U' F) U2 (F' U F)",
              moveCount: 8,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-7',
        label: 'White Front: Diagonal Separated (F2L 7)',
        subtitle: 'Top colors MATCH. Corner at UFR with White facing FRONT. Edge is at LEFT (UL) se...',
        badge: 'F2L 7',
        solution: {
          id: 'f2l-sol-case-7',
          caseName: 'White Front: Diagonal Separated (F2L 7)',
          phase: 'f2l',
          category: 'Colors Match',
          setupMoves: "R' U' R U2' R' U2 R d'",
          recognitionTip: 'Top colors MATCH. Corner at UFR with White facing FRONT. Edge is at LEFT (UL) separated diagonally.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner at UFR, edge at UL.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): d (R' U2 R) U2 (R' U R). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'front',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'left',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: true
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-7-int',
              name: 'Intuitive Solution',
              notation: "d (R' U2 R) U2 (R' U R)",
              moveCount: 8,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. d: Rotates lower layers counter-clockwise (or rotate y\').',
                '2. (R\' U2 R): Hides corner, swings edge around to pair up.',
                '3. U2: Brings the pair across.',
                '4. (R\' U R): 3-move insert into back slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-7-sub30',
              name: 'Standard Speedcubing',
              notation: "d (R' U2 R) U2 (R' U R)",
              moveCount: 8,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Left ring turns d, right hand (R\' U2 R), double flick U2, insert (R\' U R).'
            },
            pro: {
              id: 'f2l-case-7-pro',
              name: 'Pro Speed Execution',
              notation: "d (R' U2 R) U2 (R' U R)",
              moveCount: 8,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-8',
        label: 'White Right: Parallel Adjacent (F2L 8)',
        subtitle: 'Top colors MATCH. Corner at UFR with White facing RIGHT. Edge is at FRONT (UF) p...',
        badge: 'F2L 8',
        solution: {
          id: 'f2l-sol-case-8',
          caseName: 'White Right: Parallel Adjacent (F2L 8)',
          phase: 'f2l',
          category: 'Colors Match',
          setupMoves: "R U' R' U R U2 R'",
          recognitionTip: 'Top colors MATCH. Corner at UFR with White facing RIGHT. Edge is at FRONT (UF) parallel adjacent.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner at UFR, edge at UF.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U2 R') U' (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'right',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'front',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: true
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-8-int',
              name: 'Intuitive Solution',
              notation: "(R U2 R') U' (R U R')",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U2 R\'): Hides the corner into the back and aligns top.',
                '2. U\': Repositions the top layer.',
                '3. (R U R\'): Pops and bonds the pair directly into the slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-8-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U2 R') U' (R U R')",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U2 R\'), left index U\', right hand (R U R\').'
            },
            pro: {
              id: 'f2l-case-8-pro',
              name: 'Pro Speed Execution',
              notation: "(R U2 R') U' (R U R')",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-9',
        label: 'White Front: Touching at UR (F2L 9)',
        subtitle: 'Pieces touching in top layer with same top color, but White faces FRONT (touchin...',
        badge: 'F2L 9',
        solution: {
          id: 'f2l-sol-case-9',
          caseName: 'White Front: Touching at UR (F2L 9)',
          phase: 'f2l',
          category: 'Colors Match',
          setupMoves: "R U' R' F R' F' R",
          recognitionTip: 'Pieces touching in top layer with same top color, but White faces FRONT (touching in reverse order).',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Pieces stuck together at UFR.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R' F R F') (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'front',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'right',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: true
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-9-int',
              name: 'Intuitive Solution',
              notation: "(R' F R F') (R U R')",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R\' F R F\'): Sledgehammer separates the incorrectly touching pair safely.',
                '2. (R U R\'): Re-pairs and inserts cleanly.'
              ]
            },
            sub30: {
              id: 'f2l-case-9-sub30',
              name: 'Standard Speedcubing',
              notation: "(R' F R F') (R U R')",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand sledgehammer (R\' F R F\') followed by standard pop & pair (R U R\').'
            },
            pro: {
              id: 'f2l-case-9-pro',
              name: 'Pro Speed Execution',
              notation: "(R' F R F') (R U R')",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-10',
        label: 'White Right: Touching at UF (F2L 10)',
        subtitle: 'Pieces touching in top layer with same top color, White faces RIGHT (touching in...',
        badge: 'F2L 10',
        solution: {
          id: 'f2l-sol-case-10',
          caseName: 'White Right: Touching at UF (F2L 10)',
          phase: 'f2l',
          category: 'Colors Match',
          setupMoves: "R U' R' U2' R U R'",
          recognitionTip: 'Pieces touching in top layer with same top color, White faces RIGHT (touching in reverse order).',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Pieces stuck at UFR.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U' R') U2 (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'right',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'front',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: true
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-10-int',
              name: 'Intuitive Solution',
              notation: "(R U' R') U2 (R U R')",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U\' R\'): Breaks the pair apart and hides corner.',
                '2. U2: Repositions edge across the top layer.',
                '3. (R U R\'): Inserts properly.'
              ]
            },
            sub30: {
              id: 'f2l-case-10-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U' R') U2 (R U R')",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U\' R\'), double flick U2, right hand (R U R\').'
            },
            pro: {
              id: 'f2l-case-10-pro',
              name: 'Pro Speed Execution',
              notation: "(R U' R') U2 (R U R')",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      }
    ]
  },
  // ----------------------------------------------------
  // SOLUTIONS: WHITE ON SIDE, TOP COLORS DIFFER (CFOP F2L 11 - 18)
  // ----------------------------------------------------
  {
    id: 'f2l-colors-differ-cases',
    phase: 'f2l',
    stepNumber: 3,
    totalStepsInPhase: 3,
    title: 'Top Colors Differ (F2L 11 - 18)',
    question: 'Which different top colors configuration do you have?',
    options: [
      {
        id: 'f2l-opt-case-11',
        label: 'White Right: Separated Opposite (F2L 11)',
        subtitle: 'Top colors DIFFER. Corner at UFR with White facing RIGHT. Edge is at LEFT (UL) s...',
        badge: 'F2L 11',
        solution: {
          id: 'f2l-sol-case-11',
          caseName: 'White Right: Separated Opposite (F2L 11)',
          phase: 'f2l',
          category: 'Colors Differ',
          setupMoves: "R U' R' U' R U R' U",
          recognitionTip: 'Top colors DIFFER. Corner at UFR with White facing RIGHT. Edge is at LEFT (UL) separated.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner at UFR, edge at UL.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): U' (R U' R') U (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'right',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'left',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-11-int',
              name: 'Intuitive Solution',
              notation: "U' (R U' R') U (R U R')",
              moveCount: 8,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. U\': Sets up alignment.',
                '2. (R U\' R\'): Hides corner and shifts edge into position.',
                '3. U: Positions pair.',
                '4. (R U R\'): 3-move insert.'
              ]
            },
            sub30: {
              id: 'f2l-case-11-sub30',
              name: 'Standard Speedcubing',
              notation: "U' (R U' R') U (R U R')",
              moveCount: 8,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Left index U\', right hand (R U\' R\'), right index U, right hand (R U R\').'
            },
            pro: {
              id: 'f2l-case-11-pro',
              name: 'Pro Speed Execution',
              notation: "U' (R U' R') U (R U R')",
              moveCount: 8,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-12',
        label: 'White Front: Separated Opposite (F2L 12)',
        subtitle: 'Top colors DIFFER. Corner at UFR with White facing FRONT. Edge is at BACK (UB) s...',
        badge: 'F2L 12',
        solution: {
          id: 'f2l-sol-case-12',
          caseName: 'White Front: Separated Opposite (F2L 12)',
          phase: 'f2l',
          category: 'Colors Differ',
          setupMoves: "R U R' U R U' R' U'",
          recognitionTip: 'Top colors DIFFER. Corner at UFR with White facing FRONT. Edge is at BACK (UB) separated.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner at UFR, edge at UB.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): U (R U R') U' (R U' R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'front',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'back',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-12-int',
              name: 'Intuitive Solution',
              notation: "U (R U R') U' (R U' R')",
              moveCount: 8,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. U: Shifts corner.',
                '2. (R U R\'): Hides corner and prepares edge.',
                '3. U\': Re-aligns pair.',
                '4. (R U\' R\'): Inserts into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-12-sub30',
              name: 'Standard Speedcubing',
              notation: "U (R U R') U' (R U' R')",
              moveCount: 8,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right index U, right hand (R U R\'), left index U\', right hand (R U\' R\').'
            },
            pro: {
              id: 'f2l-case-12-pro',
              name: 'Pro Speed Execution',
              notation: "U (R U R') U' (R U' R')",
              moveCount: 8,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-13',
        label: 'White Right: Long Diagonal (F2L 13)',
        subtitle: 'Top colors DIFFER. Corner at UFR with White facing RIGHT. Edge is at BACK (UB) o...',
        badge: 'F2L 13',
        solution: {
          id: 'f2l-sol-case-13',
          caseName: 'White Right: Long Diagonal (F2L 13)',
          phase: 'f2l',
          category: 'Colors Differ',
          setupMoves: "R U R' U' R U2' R' U'",
          recognitionTip: 'Top colors DIFFER. Corner at UFR with White facing RIGHT. Edge is at BACK (UB) on long diagonal.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner at UFR, edge at UB.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): U (R U2 R') U (R U' R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'right',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'back',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-13-int',
              name: 'Intuitive Solution',
              notation: "U (R U2 R') U (R U' R')",
              moveCount: 8,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. U: Aligns pieces.',
                '2. (R U2 R\'): Hides corner and positions edge opposite.',
                '3. U: Brings pair above slot.',
                '4. (R U\' R\'): 3-move insert.'
              ]
            },
            sub30: {
              id: 'f2l-case-13-sub30',
              name: 'Standard Speedcubing',
              notation: "U (R U2 R') U (R U' R')",
              moveCount: 8,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right index U, right hand (R U2 R\'), right index U, right hand (R U\' R\').'
            },
            pro: {
              id: 'f2l-case-13-pro',
              name: 'Pro Speed Execution',
              notation: "U (R U2 R') U (R U' R')",
              moveCount: 8,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-14',
        label: 'White Front: Left Separated (F2L 14)',
        subtitle: 'Top colors DIFFER. Corner at UFR with White facing FRONT. Edge is at LEFT (UL)....',
        badge: 'F2L 14',
        solution: {
          id: 'f2l-sol-case-14',
          caseName: 'White Front: Left Separated (F2L 14)',
          phase: 'f2l',
          category: 'Colors Differ',
          setupMoves: "R' U' R U R' U2 R d'",
          recognitionTip: 'Top colors DIFFER. Corner at UFR with White facing FRONT. Edge is at LEFT (UL).',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner at UFR, edge at UL.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): d (R' U2 R) U' (R' U R). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'front',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'left',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-14-int',
              name: 'Intuitive Solution',
              notation: "d (R' U2 R) U' (R' U R)",
              moveCount: 8,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. d: Rotates lower layers counter-clockwise.',
                '2. (R\' U2 R): Hides corner and sets up edge.',
                '3. U\': Aligns pair.',
                '4. (R\' U R): 3-move insert into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-14-sub30',
              name: 'Standard Speedcubing',
              notation: "d (R' U2 R) U' (R' U R)",
              moveCount: 8,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Left ring d, right hand (R\' U2 R), left index U\', right hand (R\' U R).'
            },
            pro: {
              id: 'f2l-case-14-pro',
              name: 'Pro Speed Execution',
              notation: "d (R' U2 R) U' (R' U R)",
              moveCount: 8,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-15',
        label: 'White Right: Touching Front-Right (F2L 15)',
        subtitle: 'Top colors DIFFER. Pieces touching at UFR with corner White facing RIGHT (colors...',
        badge: 'F2L 15',
        solution: {
          id: 'f2l-sol-case-15',
          caseName: 'White Right: Touching Front-Right (F2L 15)',
          phase: 'f2l',
          category: 'Colors Differ',
          setupMoves: "R U' R' U2' R U R'",
          recognitionTip: 'Top colors DIFFER. Pieces touching at UFR with corner White facing RIGHT (colors mismatched).',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Pieces touching at UFR.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U' R') U2 (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'right',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'right',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-15-int',
              name: 'Intuitive Solution',
              notation: "(R U' R') U2 (R U R')",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U\' R\'): Breaks pieces apart.',
                '2. U2: Separates edge to the back.',
                '3. (R U R\'): Pairs and inserts.'
              ]
            },
            sub30: {
              id: 'f2l-case-15-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U' R') U2 (R U R')",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U\' R\'), double flick U2, right hand (R U R\').'
            },
            pro: {
              id: 'f2l-case-15-pro',
              name: 'Pro Speed Execution',
              notation: "(R U' R') U2 (R U R')",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-16',
        label: 'White Front: Touching Front (F2L 16)',
        subtitle: 'Top colors DIFFER. Pieces touching at UFR with corner White facing FRONT....',
        badge: 'F2L 16',
        solution: {
          id: 'f2l-sol-case-16',
          caseName: 'White Front: Touching Front (F2L 16)',
          phase: 'f2l',
          category: 'Colors Differ',
          setupMoves: "R U' R' U2 F R' F' R",
          recognitionTip: 'Top colors DIFFER. Pieces touching at UFR with corner White facing FRONT.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Pieces touching at UFR.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R' F R F') U2 (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'front',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'front',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-16-int',
              name: 'Intuitive Solution',
              notation: "(R' F R F') U2 (R U R')",
              moveCount: 8,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R\' F R F\'): Sledgehammer breaks them apart safely.',
                '2. U2: Aligns edge across the top layer.',
                '3. (R U R\'): 3-move insert.'
              ]
            },
            sub30: {
              id: 'f2l-case-16-sub30',
              name: 'Standard Speedcubing',
              notation: "(R' F R F') U2 (R U R')",
              moveCount: 8,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R\' F R F\'), double flick U2, right hand (R U R\').'
            },
            pro: {
              id: 'f2l-case-16-pro',
              name: 'Pro Speed Execution',
              notation: "(R' F R F') U2 (R U R')",
              moveCount: 8,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-17',
        label: 'White Right: Touching Inverted (F2L 17)',
        subtitle: 'Top colors DIFFER. Pieces touching inverted with White facing RIGHT....',
        badge: 'F2L 17',
        solution: {
          id: 'f2l-sol-case-17',
          caseName: 'White Right: Touching Inverted (F2L 17)',
          phase: 'f2l',
          category: 'Colors Differ',
          setupMoves: "R U' R' U R U R'",
          recognitionTip: 'Top colors DIFFER. Pieces touching inverted with White facing RIGHT.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Pieces touching at UFR.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U' R') U' (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'right',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'front',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-17-int',
              name: 'Intuitive Solution',
              notation: "(R U' R') U' (R U R')",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U\' R\'): Hides corner to bottom.',
                '2. U\': Positions edge to the right.',
                '3. (R U R\'): Unhides and bonds directly.'
              ]
            },
            sub30: {
              id: 'f2l-case-17-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U' R') U' (R U R')",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U\' R\'), left index U\', right hand (R U R\').'
            },
            pro: {
              id: 'f2l-case-17-pro',
              name: 'Pro Speed Execution',
              notation: "(R U' R') U' (R U R')",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-18',
        label: 'White Front: Touching Inverted (F2L 18)',
        subtitle: 'Top colors DIFFER. Pieces touching inverted with White facing FRONT....',
        badge: 'F2L 18',
        solution: {
          id: 'f2l-sol-case-18',
          caseName: 'White Front: Touching Inverted (F2L 18)',
          phase: 'f2l',
          category: 'Colors Differ',
          setupMoves: "R U R' U' R U' R'",
          recognitionTip: 'Top colors DIFFER. Pieces touching inverted with White facing FRONT.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Pieces touching at UFR.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U R') U (R U' R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'front',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'right',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-18-int',
              name: 'Intuitive Solution',
              notation: "(R U R') U (R U' R')",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U R\'): Pops pieces out.',
                '2. U: Slides edge into position.',
                '3. (R U\' R\'): Inserts into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-18-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U R') U (R U' R')",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U R\'), right index U, right hand (R U\' R\').'
            },
            pro: {
              id: 'f2l-case-18-pro',
              name: 'Pro Speed Execution',
              notation: "(R U R') U (R U' R')",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      }
    ]
  },
  // ----------------------------------------------------
  // SOLUTIONS: WHITE ON TOP (CFOP F2L 19 - 24)
  // ----------------------------------------------------
  {
    id: 'f2l-white-up-cases',
    phase: 'f2l',
    stepNumber: 3,
    totalStepsInPhase: 3,
    title: 'White Facing UP (F2L 19 - 24)',
    question: 'Where is the edge piece located relative to the centers?',
    options: [
      {
        id: 'f2l-opt-case-19',
        label: 'White UP: Edge Matches Front Center (F2L 19)',
        subtitle: 'White faces UP. Edge side color matches the FRONT center (Orange)....',
        badge: 'F2L 19',
        solution: {
          id: 'f2l-sol-case-19',
          caseName: 'White UP: Edge Matches Front Center (F2L 19)',
          phase: 'f2l',
          category: 'White Up',
          setupMoves: "R U R' U' R U2' R' U'",
          recognitionTip: 'White faces UP. Edge side color matches the FRONT center (Orange).',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner at UFR (white up), edge matches Front.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): U (R U2 R') U (R U' R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'up',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'front',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-19-int',
              name: 'Intuitive Solution',
              notation: "U (R U2 R') U (R U' R')",
              moveCount: 8,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. U: Aligns pieces.',
                '2. (R U2 R\'): Twists the corner so White flips to the side.',
                '3. U: Positions the newly formed pair.',
                '4. (R U\' R\'): 3-move insert.'
              ]
            },
            sub30: {
              id: 'f2l-case-19-sub30',
              name: 'Standard Speedcubing',
              notation: "U (R U2 R') U (R U' R')",
              moveCount: 8,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right index U, right hand (R U2 R\'), right index U, right hand (R U\' R\').'
            },
            pro: {
              id: 'f2l-case-19-pro',
              name: 'Pro Speed Execution',
              notation: "U (R U2 R') U (R U' R')",
              moveCount: 8,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-20',
        label: 'White UP: Edge Matches Right Center (F2L 20)',
        subtitle: 'White faces UP. Edge side color matches the RIGHT center (Blue)....',
        badge: 'F2L 20',
        solution: {
          id: 'f2l-sol-case-20',
          caseName: 'White UP: Edge Matches Right Center (F2L 20)',
          phase: 'f2l',
          category: 'White Up',
          setupMoves: "R U' R' U R U' R' U2 R U' R'",
          recognitionTip: 'White faces UP. Edge side color matches the RIGHT center (Blue).',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner at UFR (white up), edge matches Right.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U R') U2 (R U R') U' (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'up',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'right',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-20-int',
              name: 'Intuitive Solution',
              notation: "(R U R') U2 (R U R') U' (R U R')",
              moveCount: 11,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U R\'): Lifts edge and opens slot.',
                '2. U2: Double flick top layer.',
                '3. (R U R\'): Re-pairs pieces.',
                '4. U\': Positions pair.',
                '5. (R U R\'): Inserts into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-20-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U R') U2 (R U R') U' (R U R')",
              moveCount: 11,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U R\'), double flick U2, right hand (R U R\'), left index U\', right hand (R U R\').'
            },
            pro: {
              id: 'f2l-case-20-pro',
              name: 'Pro Speed Execution',
              notation: "(R U R') U2 (R U R') U' (R U R')",
              moveCount: 11,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-21',
        label: 'White UP: Edge at Back (F2L 21)',
        subtitle: 'White faces UP. Edge is at BACK (UB)....',
        badge: 'F2L 21',
        solution: {
          id: 'f2l-sol-case-21',
          caseName: 'White UP: Edge at Back (F2L 21)',
          phase: 'f2l',
          category: 'White Up',
          setupMoves: "R U R' U' R U' R' U2'",
          recognitionTip: 'White faces UP. Edge is at BACK (UB).',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner at UFR, edge at UB.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): U2 (R U R') U (R U' R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'up',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'back',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-21-int',
              name: 'Intuitive Solution',
              notation: "U2 (R U R') U (R U' R')",
              moveCount: 8,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. U2: Brings edge into setup alignment.',
                '2. (R U R\'): Hides edge and positions corner.',
                '3. U: Connects them into a pair.',
                '4. (R U\' R\'): Inserts pair into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-21-sub30',
              name: 'Standard Speedcubing',
              notation: "U2 (R U R') U (R U' R')",
              moveCount: 8,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Double flick U2, right hand (R U R\'), right index U, right hand (R U\' R\').'
            },
            pro: {
              id: 'f2l-case-21-pro',
              name: 'Pro Speed Execution',
              notation: "U2 (R U R') U (R U' R')",
              moveCount: 8,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-22',
        label: 'White UP: Edge at Left (F2L 22)',
        subtitle: 'White faces UP. Edge is at LEFT (UL)....',
        badge: 'F2L 22',
        solution: {
          id: 'f2l-sol-case-22',
          caseName: 'White UP: Edge at Left (F2L 22)',
          phase: 'f2l',
          category: 'White Up',
          setupMoves: "R' U' R U2' R' U R d'",
          recognitionTip: 'White faces UP. Edge is at LEFT (UL).',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner at UFR, edge at UL.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): d (R' U' R) U2 (R' U R). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'up',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'left',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-22-int',
              name: 'Intuitive Solution',
              notation: "d (R' U' R) U2 (R' U R)",
              moveCount: 8,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. d: Rotates bottom two layers.',
                '2. (R\' U\' R): Hides corner and pairs with edge.',
                '3. U2: Positions pair.',
                '4. (R\' U R): Inserts into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-22-sub30',
              name: 'Standard Speedcubing',
              notation: "d (R' U' R) U2 (R' U R)",
              moveCount: 8,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Left ring d, right hand (R\' U\' R), double flick U2, right hand (R\' U R).'
            },
            pro: {
              id: 'f2l-case-22-pro',
              name: 'Pro Speed Execution',
              notation: "d (R' U' R) U2 (R' U R)",
              moveCount: 8,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-23',
        label: 'White UP: Touching Misaligned at UR (F2L 23)',
        subtitle: 'White faces UP. Pieces touching wrongly at Front-Right (UFR and UR)....',
        badge: 'F2L 23',
        solution: {
          id: 'f2l-sol-case-23',
          caseName: 'White UP: Touching Misaligned at UR (F2L 23)',
          phase: 'f2l',
          category: 'White Up',
          setupMoves: "R U' R' U R U2' R'",
          recognitionTip: 'White faces UP. Pieces touching wrongly at Front-Right (UFR and UR).',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Touching at UFR/UR.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U2 R') U' (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'up',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'right',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-23-int',
              name: 'Intuitive Solution',
              notation: "(R U2 R') U' (R U R')",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U2 R\'): Twists corner and separates edge.',
                '2. U\': Aligns pair.',
                '3. (R U R\'): Inserts into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-23-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U2 R') U' (R U R')",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U2 R\'), left index U\', right hand (R U R\').'
            },
            pro: {
              id: 'f2l-case-23-pro',
              name: 'Pro Speed Execution',
              notation: "(R U2 R') U' (R U R')",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-24',
        label: 'White UP: Touching Misaligned at UF (F2L 24)',
        subtitle: 'White faces UP. Pieces touching wrongly at Front-Right (UFR and UF)....',
        badge: 'F2L 24',
        solution: {
          id: 'f2l-sol-case-24',
          caseName: 'White UP: Touching Misaligned at UF (F2L 24)',
          phase: 'f2l',
          category: 'White Up',
          setupMoves: "R U' R' U2' R U R'",
          recognitionTip: 'White faces UP. Pieces touching wrongly at Front-Right (UFR and UF).',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Touching at UFR/UF.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U' R') U2 (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'up',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'front',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-24-int',
              name: 'Intuitive Solution',
              notation: "(R U' R') U2 (R U R')",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U\' R\'): Breaks pieces apart and hides corner.',
                '2. U2: Swings edge into matching position.',
                '3. (R U R\'): Inserts into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-24-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U' R') U2 (R U R')",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U\' R\'), double flick U2, right hand (R U R\').'
            },
            pro: {
              id: 'f2l-case-24-pro',
              name: 'Pro Speed Execution',
              notation: "(R U' R') U2 (R U R')",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      }
    ]
  },
  // ----------------------------------------------------
  // SOLUTIONS: CORNER IN BOTTOM SLOT (CFOP F2L 25 - 30)
  // ----------------------------------------------------
  {
    id: 'f2l-corner-in-slot-cases',
    phase: 'f2l',
    stepNumber: 2,
    totalStepsInPhase: 2,
    title: 'Corner in Bottom Slot (F2L 25 - 30)',
    question: 'Which way is White facing on the corner in the slot?',
    options: [
      {
        id: 'f2l-opt-case-25',
        label: 'Corner in Slot (White Front, Same Top) (F2L 25)',
        subtitle: 'Corner is in slot with White facing FRONT. Edge is on top with matching top colo...',
        badge: 'F2L 25',
        solution: {
          id: 'f2l-sol-case-25',
          caseName: 'Corner in Slot (White Front, Same Top) (F2L 25)',
          phase: 'f2l',
          category: 'Corner in Slot',
          setupMoves: "R' U' R d' R U R'",
          recognitionTip: 'Corner is in slot with White facing FRONT. Edge is on top with matching top color.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner in FR slot (white front).',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U' R') d (R' U R). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'slot-target',
              cornerWhiteFacing: 'front',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'left',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: true
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-25-int',
              name: 'Intuitive Solution',
              notation: "(R U' R') d (R' U R)",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U\' R\'): Ejects corner from slot.',
                '2. d: Rotates lower layers.',
                '3. (R\' U R): Pairs pieces and inserts into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-25-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U' R') d (R' U R)",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U\' R\'), left ring d, right hand (R\' U R).'
            },
            pro: {
              id: 'f2l-case-25-pro',
              name: 'Pro Speed Execution',
              notation: "(R U' R') d (R' U R)",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-26',
        label: 'Corner in Slot (White Right, Same Top) (F2L 26)',
        subtitle: 'Corner is in slot with White facing RIGHT. Edge is on top with matching top colo...',
        badge: 'F2L 26',
        solution: {
          id: 'f2l-sol-case-26',
          caseName: 'Corner in Slot (White Right, Same Top) (F2L 26)',
          phase: 'f2l',
          category: 'Corner in Slot',
          setupMoves: "R U' R' U R U' R'",
          recognitionTip: 'Corner is in slot with White facing RIGHT. Edge is on top with matching top color.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner in FR slot (white right).',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U R') U' (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'slot-target',
              cornerWhiteFacing: 'right',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'back',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: true
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-26-int',
              name: 'Intuitive Solution',
              notation: "(R U R') U' (R U R')",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U R\'): Ejects corner and bonds to edge.',
                '2. U\': Positions pair.',
                '3. (R U R\'): Inserts pair into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-26-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U R') U' (R U R')",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U R\'), left index U\', right hand (R U R\').'
            },
            pro: {
              id: 'f2l-case-26-pro',
              name: 'Pro Speed Execution',
              notation: "(R U R') U' (R U R')",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-27',
        label: 'Corner in Slot (White Front, Diff Top) (F2L 27)',
        subtitle: 'Corner is in slot with White facing FRONT. Edge is on top with differing top col...',
        badge: 'F2L 27',
        solution: {
          id: 'f2l-sol-case-27',
          caseName: 'Corner in Slot (White Front, Diff Top) (F2L 27)',
          phase: 'f2l',
          category: 'Corner in Slot',
          setupMoves: "R U R' U' R U' R'",
          recognitionTip: 'Corner is in slot with White facing FRONT. Edge is on top with differing top color.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner in FR slot.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U R') U (R U' R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'slot-target',
              cornerWhiteFacing: 'front',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'left',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-27-int',
              name: 'Intuitive Solution',
              notation: "(R U R') U (R U' R')",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U R\'): Ejects corner to top layer.',
                '2. U: Prepares pair.',
                '3. (R U\' R\'): 3-move insert into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-27-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U R') U (R U' R')",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U R\'), right index U, right hand (R U\' R\').'
            },
            pro: {
              id: 'f2l-case-27-pro',
              name: 'Pro Speed Execution',
              notation: "(R U R') U (R U' R')",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-28',
        label: 'Corner in Slot (White Right, Diff Top) (F2L 28)',
        subtitle: 'Corner is in slot with White facing RIGHT. Edge is on top with differing top col...',
        badge: 'F2L 28',
        solution: {
          id: 'f2l-sol-case-28',
          caseName: 'Corner in Slot (White Right, Diff Top) (F2L 28)',
          phase: 'f2l',
          category: 'Corner in Slot',
          setupMoves: "R U R' U' R U R'",
          recognitionTip: 'Corner is in slot with White facing RIGHT. Edge is on top with differing top color.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner in FR slot.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U' R') U (R U' R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'slot-target',
              cornerWhiteFacing: 'right',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'back',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-28-int',
              name: 'Intuitive Solution',
              notation: "(R U' R') U (R U' R')",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U\' R\'): Ejects corner.',
                '2. U: Aligns pieces into 3-move insert state.',
                '3. (R U\' R\'): Inserts pair into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-28-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U' R') U (R U' R')",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U\' R\'), right index U, right hand (R U\' R\').'
            },
            pro: {
              id: 'f2l-case-28-pro',
              name: 'Pro Speed Execution',
              notation: "(R U' R') U (R U' R')",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-29',
        label: 'Corner Solved, Edge on U (Opposite) (F2L 29)',
        subtitle: 'Corner is solved in slot (White on bottom). Edge is in top layer inverted....',
        badge: 'F2L 29',
        solution: {
          id: 'f2l-sol-case-29',
          caseName: 'Corner Solved, Edge on U (Opposite) (F2L 29)',
          phase: 'f2l',
          category: 'Corner in Slot',
          setupMoves: "R U' R' U R U R'",
          recognitionTip: 'Corner is solved in slot (White on bottom). Edge is in top layer inverted.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner solved at DFR.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U' R') U' (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'slot-target',
              cornerWhiteFacing: 'down',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'back',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-29-int',
              name: 'Intuitive Solution',
              notation: "(R U' R') U' (R U R')",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U\' R\'): Ejects solved corner to break inverted edge.',
                '2. U\': Repositions pieces.',
                '3. (R U R\'): Inserts pair solved.'
              ]
            },
            sub30: {
              id: 'f2l-case-29-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U' R') U' (R U R')",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U\' R\'), left index U\', right hand (R U R\').'
            },
            pro: {
              id: 'f2l-case-29-pro',
              name: 'Pro Speed Execution',
              notation: "(R U' R') U' (R U R')",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-30',
        label: 'Corner Solved, Edge on U (Adjacent) (F2L 30)',
        subtitle: 'Corner is solved in slot (White on bottom). Edge is in top layer ready to pair....',
        badge: 'F2L 30',
        solution: {
          id: 'f2l-sol-case-30',
          caseName: 'Corner Solved, Edge on U (Adjacent) (F2L 30)',
          phase: 'f2l',
          category: 'Corner in Slot',
          setupMoves: "R U R' U' R U R'",
          recognitionTip: 'Corner is solved in slot (White on bottom). Edge is in top layer ready to pair.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Corner solved at DFR.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U' R') U (R U' R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'slot-target',
              cornerWhiteFacing: 'down',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'top',
              edgeTopPos: 'left',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: false
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-30-int',
              name: 'Intuitive Solution',
              notation: "(R U' R') U (R U' R')",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U\' R\'): Ejects corner to receive edge.',
                '2. U: Bonds edge to corner.',
                '3. (R U\' R\'): Restores pair into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-30-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U' R') U (R U' R')",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U\' R\'), right index U, right hand (R U\' R\').'
            },
            pro: {
              id: 'f2l-case-30-pro',
              name: 'Pro Speed Execution',
              notation: "(R U' R') U (R U' R')",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      }
    ]
  },
  // ----------------------------------------------------
  // SOLUTIONS: EDGE IN MIDDLE SLOT (CFOP F2L 31 - 36)
  // ----------------------------------------------------
  {
    id: 'f2l-edge-in-slot-cases',
    phase: 'f2l',
    stepNumber: 2,
    totalStepsInPhase: 2,
    title: 'Edge in Middle Slot (F2L 31 - 36)',
    question: 'Is the edge solved or flipped, and which way does White face on top?',
    options: [
      {
        id: 'f2l-opt-case-31',
        label: 'Edge Solved, Corner White Front (F2L 31)',
        subtitle: 'Edge is solved in slot. Corner is in top layer with White facing FRONT....',
        badge: 'F2L 31',
        solution: {
          id: 'f2l-sol-case-31',
          caseName: 'Edge Solved, Corner White Front (F2L 31)',
          phase: 'f2l',
          category: 'Edge in Slot',
          setupMoves: "R U R' U2' R U R' U",
          recognitionTip: 'Edge is solved in slot. Corner is in top layer with White facing FRONT.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Edge solved in FR slot, corner at UFR.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): U' (R U' R') U2 (R U' R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'front',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'slot-target',
              edgeTopPos: 'front',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: 'n/a'
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-31-int',
              name: 'Intuitive Solution',
              notation: "U' (R U' R') U2 (R U' R')",
              moveCount: 8,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. U\': Prepares top layer.',
                '2. (R U\' R\'): Ejects edge and pairs with corner.',
                '3. U2: Double flick top layer.',
                '4. (R U\' R\'): Standard 3-move insert into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-31-sub30',
              name: 'Standard Speedcubing',
              notation: "U' (R U' R') U2 (R U' R')",
              moveCount: 8,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Left index U\', right hand (R U\' R\'), double flick U2, right hand (R U\' R\').'
            },
            pro: {
              id: 'f2l-case-31-pro',
              name: 'Pro Speed Execution',
              notation: "U' (R U' R') U2 (R U' R')",
              moveCount: 8,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-32',
        label: 'Edge Solved, Corner White Right (F2L 32)',
        subtitle: 'Edge is solved in slot. Corner is in top layer with White facing RIGHT....',
        badge: 'F2L 32',
        solution: {
          id: 'f2l-sol-case-32',
          caseName: 'Edge Solved, Corner White Right (F2L 32)',
          phase: 'f2l',
          category: 'Edge in Slot',
          setupMoves: "R U' R' U R U' R'",
          recognitionTip: 'Edge is solved in slot. Corner is in top layer with White facing RIGHT.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Edge solved in FR slot, corner at UFR.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U R') U' (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'right',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'slot-target',
              edgeTopPos: 'right',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: 'n/a'
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-32-int',
              name: 'Intuitive Solution',
              notation: "(R U R') U' (R U R')",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U R\'): Ejects edge and pairs with corner.',
                '2. U\': Positions pair.',
                '3. (R U R\'): 3-move insert.'
              ]
            },
            sub30: {
              id: 'f2l-case-32-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U R') U' (R U R')",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U R\'), left index U\', right hand (R U R\').'
            },
            pro: {
              id: 'f2l-case-32-pro',
              name: 'Pro Speed Execution',
              notation: "(R U R') U' (R U R')",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-33',
        label: 'Edge Solved, Corner White UP (F2L 33)',
        subtitle: 'Edge is solved in slot. Corner is in top layer with White facing UP....',
        badge: 'F2L 33',
        solution: {
          id: 'f2l-sol-case-33',
          caseName: 'Edge Solved, Corner White UP (F2L 33)',
          phase: 'f2l',
          category: 'Edge in Slot',
          setupMoves: "R U R' U' R U R' U2' R U' R'",
          recognitionTip: 'Edge is solved in slot. Corner is in top layer with White facing UP.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Edge solved in FR slot, corner at UFR.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U R') U2 (R U' R') U (R U' R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'up',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'slot-target',
              edgeTopPos: 'front',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: 'n/a'
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-33-int',
              name: 'Intuitive Solution',
              notation: "(R U R') U2 (R U' R') U (R U' R')",
              moveCount: 11,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U R\'): Ejects edge.',
                '2. U2: Double flick to align.',
                '3. (R U\' R\'): Pairs edge and corner.',
                '4. U: Prepares insert.',
                '5. (R U\' R\'): Inserts pair.'
              ]
            },
            sub30: {
              id: 'f2l-case-33-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U R') U2 (R U' R') U (R U' R')",
              moveCount: 11,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U R\'), double flick U2, right hand (R U\' R\'), right index U, right hand (R U\' R\').'
            },
            pro: {
              id: 'f2l-case-33-pro',
              name: 'Pro Speed Execution',
              notation: "(R U R') U2 (R U' R') U (R U' R')",
              moveCount: 11,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-34',
        label: 'Edge Flipped, Corner White Front (F2L 34)',
        subtitle: 'Edge is flipped backwards in slot. Corner is in top layer with White facing FRON...',
        badge: 'F2L 34',
        solution: {
          id: 'f2l-sol-case-34',
          caseName: 'Edge Flipped, Corner White Front (F2L 34)',
          phase: 'f2l',
          category: 'Edge in Slot',
          setupMoves: "R' U2' R d' R U' R'",
          recognitionTip: 'Edge is flipped backwards in slot. Corner is in top layer with White facing FRONT.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Edge flipped in FR slot.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U R') d (R' U2 R). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'front',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'slot-target',
              edgeTopPos: 'front',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: 'n/a'
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-34-int',
              name: 'Intuitive Solution',
              notation: "(R U R') d (R' U2 R)",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U R\'): Ejects flipped edge.',
                '2. d: Rotates lower layers.',
                '3. (R\' U2 R): Pairs pieces correctly and inserts.'
              ]
            },
            sub30: {
              id: 'f2l-case-34-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U R') d (R' U2 R)",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U R\'), left ring d, right hand (R\' U2 R).'
            },
            pro: {
              id: 'f2l-case-34-pro',
              name: 'Pro Speed Execution',
              notation: "(R U R') d (R' U2 R)",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-35',
        label: 'Edge Flipped, Corner White Right (F2L 35)',
        subtitle: 'Edge is flipped backwards in slot. Corner is in top layer with White facing RIGH...',
        badge: 'F2L 35',
        solution: {
          id: 'f2l-sol-case-35',
          caseName: 'Edge Flipped, Corner White Right (F2L 35)',
          phase: 'f2l',
          category: 'Edge in Slot',
          setupMoves: "L' U2' L d R U R'",
          recognitionTip: 'Edge is flipped backwards in slot. Corner is in top layer with White facing RIGHT.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Edge flipped in FR slot.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U' R') d' (L' U2 L). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'right',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'slot-target',
              edgeTopPos: 'right',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: 'n/a'
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-35-int',
              name: 'Intuitive Solution',
              notation: "(R U' R') d' (L' U2 L)",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U\' R\'): Ejects flipped edge.',
                '2. d\': Rotates lower layers clockwise.',
                '3. (L\' U2 L): Pairs pieces and inserts.'
              ]
            },
            sub30: {
              id: 'f2l-case-35-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U' R') d' (L' U2 L)",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U\' R\'), right ring d\', left hand (L\' U2 L).'
            },
            pro: {
              id: 'f2l-case-35-pro',
              name: 'Pro Speed Execution',
              notation: "(R U' R') d' (L' U2 L)",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-36',
        label: 'Edge Flipped, Corner White UP (F2L 36)',
        subtitle: 'Edge is flipped backwards in slot. Corner is in top layer with White facing UP....',
        badge: 'F2L 36',
        solution: {
          id: 'f2l-sol-case-36',
          caseName: 'Edge Flipped, Corner White UP (F2L 36)',
          phase: 'f2l',
          category: 'Edge in Slot',
          setupMoves: "R' U' R d' R U R'",
          recognitionTip: 'Edge is flipped backwards in slot. Corner is in top layer with White facing UP.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Edge flipped in FR slot.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U' R') d (R' U R). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'top',
              cornerWhiteFacing: 'up',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'slot-target',
              edgeTopPos: 'front',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: 'n/a'
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-36-int',
              name: 'Intuitive Solution',
              notation: "(R U' R') d (R' U R)",
              moveCount: 7,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U\' R\'): Ejects flipped edge.',
                '2. d: Rotates lower layers.',
                '3. (R\' U R): Bonds pair into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-36-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U' R') d (R' U R)",
              moveCount: 7,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U\' R\'), left ring d, right hand (R\' U R).'
            },
            pro: {
              id: 'f2l-case-36-pro',
              name: 'Pro Speed Execution',
              notation: "(R U' R') d (R' U R)",
              moveCount: 7,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      }
    ]
  },
  // ----------------------------------------------------
  // SOLUTIONS: BOTH PIECES IN SLOT (CFOP F2L 37 - 41)
  // ----------------------------------------------------
  {
    id: 'f2l-both-in-slot-cases',
    phase: 'f2l',
    stepNumber: 2,
    totalStepsInPhase: 2,
    title: 'Both Pieces in Slot (F2L 37 - 41)',
    question: 'What is the misorientation of the corner and edge in the slot?',
    options: [
      {
        id: 'f2l-opt-case-37',
        label: 'Both in Slot: Corner Solved, Edge Flipped (F2L 37)',
        subtitle: 'Both pieces in slot. Corner is solved on bottom, but edge is flipped backwards i...',
        badge: 'F2L 37',
        solution: {
          id: 'f2l-sol-case-37',
          caseName: 'Both in Slot: Corner Solved, Edge Flipped (F2L 37)',
          phase: 'f2l',
          category: 'Both in Slot',
          setupMoves: "R' U' R U2' R' U2 R d' R U R'",
          recognitionTip: 'Both pieces in slot. Corner is solved on bottom, but edge is flipped backwards in slot.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Both in FR slot.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U' R') d (R' U2 R) U2 (R' U R). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'slot-target',
              cornerWhiteFacing: 'down',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'slot-target',
              edgeTopPos: 'front',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: 'n/a'
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-37-int',
              name: 'Intuitive Solution',
              notation: "(R U' R') d (R' U2 R) U2 (R' U R)",
              moveCount: 11,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U\' R\'): Ejects corner and flipped edge together.',
                '2. d (R\' U2 R): Rotates and pairs pieces correctly.',
                '3. U2 (R\' U R): Inserts pair solved into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-37-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U' R') d (R' U2 R) U2 (R' U R)",
              moveCount: 11,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U\' R\'), left ring d, (R\' U2 R), double flick U2, (R\' U R).'
            },
            pro: {
              id: 'f2l-case-37-pro',
              name: 'Pro Speed Execution',
              notation: "(R U' R') d (R' U2 R) U2 (R' U R)",
              moveCount: 11,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-38',
        label: 'Both in Slot: Corner Twisted Front, Edge Solved (F2L 38)',
        subtitle: 'Both pieces in slot. Edge is correctly oriented, but corner is twisted with Whit...',
        badge: 'F2L 38',
        solution: {
          id: 'f2l-sol-case-38',
          caseName: 'Both in Slot: Corner Twisted Front, Edge Solved (F2L 38)',
          phase: 'f2l',
          category: 'Both in Slot',
          setupMoves: "R' U R y U2' R U R' U R U' R'",
          recognitionTip: 'Both pieces in slot. Edge is correctly oriented, but corner is twisted with White facing FRONT.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Both in FR slot.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U R' U') (R U' R') U2 (y' R' U' R). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'slot-target',
              cornerWhiteFacing: 'front',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'slot-target',
              edgeTopPos: 'front',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: 'n/a'
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-38-int',
              name: 'Intuitive Solution',
              notation: "(R U R' U') (R U' R') U2 (y' R' U' R)",
              moveCount: 12,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U R\' U\'): Sexy move ejects both pieces safely.',
                '2. (R U\' R\'): Pairs pieces in top layer.',
                '3. U2: Repositions pair.',
                '4. (y\' R\' U\' R): Inserts into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-38-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U R' U') (R U' R') U2 (y' R' U' R)",
              moveCount: 12,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Sexy move (R U R\' U\'), right hand (R U\' R\'), double flick U2, rotationless or cube rotation insert.'
            },
            pro: {
              id: 'f2l-case-38-pro',
              name: 'Pro Speed Execution',
              notation: "(R U R' U') (R U' R') U2 (y' R' U' R)",
              moveCount: 12,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-39',
        label: 'Both in Slot: Corner Twisted Right, Edge Solved (F2L 39)',
        subtitle: 'Both pieces in slot. Edge is correctly oriented, but corner is twisted with Whit...',
        badge: 'F2L 39',
        solution: {
          id: 'f2l-sol-case-39',
          caseName: 'Both in Slot: Corner Twisted Right, Edge Solved (F2L 39)',
          phase: 'f2l',
          category: 'Both in Slot',
          setupMoves: "R U' R' U2' R U R' U' R U R'",
          recognitionTip: 'Both pieces in slot. Edge is correctly oriented, but corner is twisted with White facing RIGHT.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Both in FR slot.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U' R' U) (R U' R') U2 (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'slot-target',
              cornerWhiteFacing: 'right',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'slot-target',
              edgeTopPos: 'front',
              edgeColorTop: 'orange',
              edgeColorFront: 'blue',
              topColorsMatch: 'n/a'
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-39-int',
              name: 'Intuitive Solution',
              notation: "(R U' R' U) (R U' R') U2 (R U R')",
              moveCount: 11,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U\' R\' U): Ejects corner while preserving edge orientation.',
                '2. (R U\' R\'): Pairs pieces.',
                '3. U2: Double flick top layer.',
                '4. (R U R\'): 3-move insert.'
              ]
            },
            sub30: {
              id: 'f2l-case-39-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U' R' U) (R U' R') U2 (R U R')",
              moveCount: 11,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U\' R\' U), right hand (R U\' R\'), double flick U2, right hand (R U R\').'
            },
            pro: {
              id: 'f2l-case-39-pro',
              name: 'Pro Speed Execution',
              notation: "(R U' R' U) (R U' R') U2 (R U R')",
              moveCount: 11,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-40',
        label: 'Both in Slot: Corner Twisted Front, Edge Flipped (F2L 40)',
        subtitle: 'Both pieces in slot: Corner twisted with White facing FRONT, and edge is flipped...',
        badge: 'F2L 40',
        solution: {
          id: 'f2l-sol-case-40',
          caseName: 'Both in Slot: Corner Twisted Front, Edge Flipped (F2L 40)',
          phase: 'f2l',
          category: 'Both in Slot',
          setupMoves: "R' U R U' R' U R d' R U R'",
          recognitionTip: 'Both pieces in slot: Corner twisted with White facing FRONT, and edge is flipped.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Both in FR slot.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U' R') d (R' U' R) U (R' U' R). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'slot-target',
              cornerWhiteFacing: 'front',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'slot-target',
              edgeTopPos: 'front',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: 'n/a'
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-40-int',
              name: 'Intuitive Solution',
              notation: "(R U' R') d (R' U' R) U (R' U' R)",
              moveCount: 11,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U\' R\'): Ejects pieces to top layer.',
                '2. d (R\' U\' R): Re-orients and pairs pieces correctly.',
                '3. U (R\' U\' R): Inserts pair solved into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-40-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U' R') d (R' U' R) U (R' U' R)",
              moveCount: 11,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U\' R\'), left ring d, (R\' U\' R), right index U, (R\' U\' R).'
            },
            pro: {
              id: 'f2l-case-40-pro',
              name: 'Pro Speed Execution',
              notation: "(R U' R') d (R' U' R) U (R' U' R)",
              moveCount: 11,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      },
      {
        id: 'f2l-opt-case-41',
        label: 'Both in Slot: Corner Twisted Right, Edge Flipped (F2L 41)',
        subtitle: 'Both pieces in slot: Corner twisted with White facing RIGHT, and edge is flipped...',
        badge: 'F2L 41',
        solution: {
          id: 'f2l-sol-case-41',
          caseName: 'Both in Slot: Corner Twisted Right, Edge Flipped (F2L 41)',
          phase: 'f2l',
          category: 'Both in Slot',
          setupMoves: "R U' R' U' R U' R' U R U' R'",
          recognitionTip: 'Both pieces in slot: Corner twisted with White facing RIGHT, and edge is flipped.',
          howToHold: 'Hold White on BOTTOM. Orange in Front, Blue on Right. Both in FR slot.',
          startingSetup: {
            cornerPosition: 'Front-Right (UFR) or target slot',
            edgePosition: 'Positioned according to case pattern',
            setupAction: 'Turn top layer (U, U\', or U2) until pieces match diagram'
          },
          sub30Tip: "Right Slot (FR): (R U R') U' (R U R') U (R U R'). Left Slot (FL) Mirror available via the toggle above.",
          diagramConfig: {
            type: 'f2l',
            f2lDetails: {
              cornerPos: 'slot-target',
              cornerWhiteFacing: 'right',
              cornerColorSecondary: 'orange',
              cornerColorTertiary: 'blue',
              edgePos: 'slot-target',
              edgeTopPos: 'front',
              edgeColorTop: 'blue',
              edgeColorFront: 'orange',
              topColorsMatch: 'n/a'
            }
          },
          algorithms: {
            intuitive: {
              id: 'f2l-case-41-int',
              name: 'Intuitive Solution',
              notation: "(R U R') U' (R U R') U (R U R')",
              moveCount: 11,
              difficulty: 'intuitive',
              timeEstimate: 1.5,
              intuitiveSteps: [
                '1. (R U R\'): Ejects corner.',
                '2. U\': Aligns top layer.',
                '3. (R U R\'): Pairs edge and corner.',
                '4. U (R U R\'): Inserts pair into slot.'
              ]
            },
            sub30: {
              id: 'f2l-case-41-sub30',
              name: 'Standard Speedcubing',
              notation: "(R U R') U' (R U R') U (R U R')",
              moveCount: 11,
              difficulty: 'sub30',
              timeEstimate: 1.0,
              fingertricks: 'Right hand (R U R\'), left index U\', right hand (R U R\'), right index U, right hand (R U R\').'
            },
            pro: {
              id: 'f2l-case-41-pro',
              name: 'Pro Speed Execution',
              notation: "(R U R') U' (R U R') U (R U R')",
              moveCount: 11,
              difficulty: 'pro',
              timeEstimate: 0.8,
              notes: 'Optimal speedcubing execution. Use the Left Slot toggle for mirror execution.'
            }
          }
        }
      }
    ]
  }
];
