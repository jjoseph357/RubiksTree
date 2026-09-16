// Intelligent speedcubing algorithm chunker and fingertrick analyzer

export interface AlgChunk {
  name: string;
  notation: string;
  color: string; // Tailwind color classes
  description: string;
}

export interface MoveStep {
  move: string;
  finger: string;
  action: string;
  icon: string; // emoji or icon type
}

// Known standard speedcubing chunks / triggers
const TRIGGER_DICTIONARY: { pattern: RegExp; name: string; color: string; description: string }[] = [
  {
    pattern: /^\(?R\s+U\s+R'\s+U'\)?$/i,
    name: 'Sexy Move',
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'The #1 muscle memory trigger in cubing'
  },
  {
    pattern: /^\(?U\s+R\s+U'\s+R'\)?$/i,
    name: 'Inverse Sexy',
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    description: 'Reversed sexy flow'
  },
  {
    pattern: /^\(?R'\s+F\s+R\s+F'\)?$/i,
    name: 'Sledgehammer',
    color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    description: 'Orients top edges while inserting'
  },
  {
    pattern: /^\(?F\s+R'\s+F'\s+R\)?$/i,
    name: 'Hedgeslammer',
    color: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    description: 'Front-face inverse sledge'
  },
  {
    pattern: /^\(?r\s+U\s+R'\s+U'\)?$/i,
    name: 'Wide Sexy',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'Wide r sexy move'
  },
  {
    pattern: /^\(?r'\s+F\s+R\s+F'\)?$/i,
    name: 'Wide Sledge',
    color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    description: 'Wide r restoration sledge'
  },
  {
    pattern: /^\(?R\s+U\s+R'\s+U\)?$/i,
    name: 'Sune Trigger',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'First half of Sune'
  },
  {
    pattern: /^\(?R\s+U2'?\s+R'\)?$/i,
    name: 'Double Flick Pair',
    color: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    description: 'Index-middle double flick'
  },
  {
    pattern: /^\(?R\s+U'\s+R'\)?$/i,
    name: 'Standard Insert',
    color: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    description: 'Classic 3-move F2L slot insert'
  },
  {
    pattern: /^\(?R\s+U\s+R'\)?$/i,
    name: 'Pop & Pair',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Lift slot to receive edge'
  },
  {
    pattern: /^\(?R'\s+F\s+R2\s+U'\)?$/i,
    name: 'T-Perm Setup',
    color: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    description: 'T-perm middle trigger'
  },
  {
    pattern: /^\(?R'\s+U'\s+R\s+U\)?$/i,
    name: 'T-Perm Insert',
    color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    description: 'T-perm third trigger'
  },
  {
    pattern: /^\(?M2'?\s+U\s+M2'?\)?$/i,
    name: 'M2 Slice Trigger',
    color: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    description: 'Double flick middle slice'
  },
  {
    pattern: /^\(?R2\s+D\s+R'\s+U2\s+R\s+D'\)?$/i,
    name: 'Headlights D-Rocker',
    color: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
    description: 'D-layer positioning trigger'
  },
  {
    pattern: /^\(?L'\s+U'\s+L\s+U\)?$/i,
    name: 'Left Sexy Move',
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'Left-hand mirror of Sexy Move'
  },
  {
    pattern: /^\(?L'\s+U'\s+L\)?$/i,
    name: 'Left Pop & Pair',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Left slot lift & pair'
  },
  {
    pattern: /^\(?L'\s+U\s+L\)?$/i,
    name: 'Left Standard Insert',
    color: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    description: 'Classic 3-move left-slot insert'
  },
  {
    pattern: /^\(?L'\s+U2'?\s+L\)?$/i,
    name: 'Left Double Flick Pair',
    color: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    description: 'Left index-middle double flick'
  },
  {
    pattern: /^\(?L\s+F'\s+L'\s+F\)?$/i,
    name: 'Left Sledgehammer',
    color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    description: 'Left-slot front edge orientation insert'
  },
  {
    pattern: /^\(?F\s+U\s+F'\)?$/i,
    name: 'Left Front Pop & Pair',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Front-face 3-move left pop & pair'
  },
  {
    pattern: /^\(?F\s+U'\s+F'\)?$/i,
    name: 'Left Front Insert',
    color: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    description: 'Front-face 3-move left insert'
  },
  {
    pattern: /^\(?F'\s+U'\s+F\)?$/i,
    name: 'Front Pop & Pair',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Front-face 3-move right pop & pair'
  },
  {
    pattern: /^\(?F'\s+U\s+F\)?$/i,
    name: 'Front Inverse Insert',
    color: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    description: 'Front-face 3-move right insert'
  },
  {
    pattern: /^\(?R'\s+U'\s+R\)?$/i,
    name: 'Back Slot Pair',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Back-right slot hide & pair'
  },
  {
    pattern: /^\(?R'\s+U\s+R\)?$/i,
    name: 'Back Slot Insert',
    color: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    description: 'Back-right slot 3-move insert'
  },
  {
    pattern: /^\(?L\s+U\s+L'\)?$/i,
    name: 'Left Back Pair',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Back-left slot hide & pair'
  },
  {
    pattern: /^\(?L\s+U'\s+L'\)?$/i,
    name: 'Left Back Insert',
    color: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    description: 'Back-left slot 3-move insert'
  },
  {
    pattern: /^\(?r\s+U'\s+R'\s+U\)?$/i,
    name: 'Wide-r Setup',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'Wide r pairing trigger'
  },
  {
    pattern: /^\(?R\s+U\s+r'\)?$/i,
    name: 'Wide-r Insert',
    color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    description: 'Wide r restore insert'
  },
  {
    pattern: /^\(?l'\s+U\s+L\s+U'\)?$/i,
    name: 'Left Wide-l Setup',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'Left wide l pairing trigger'
  },
  {
    pattern: /^\(?L'\s+U'\s+l\)?$/i,
    name: 'Left Wide-l Insert',
    color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    description: 'Left wide l restore insert'
  }
];

// Mirror an algorithm across the M-slice (Right-slot FR <-> Left-slot FL)
export function mirrorAlgToLeftSlot(notation: string): string {
  if (!notation) return notation;
  // Match tokens like: R, R', R2, R2', L, L', L2, U, U', U2, F, F', F2, B, B', B2, D, D', D2, d, d', y, y', r, r', l, l'
  const tokenRegex = /(?<![A-Za-z0-9'])([RLUFBDrfldyMSExyz])(2'?|'|2)?(?![A-Za-z0-9'])/g;
  return notation.replace(tokenRegex, (_match, base, suffix = '') => {
    const isPrime = suffix.includes("'");
    const isTwo = suffix.includes('2');

    let newBase = base;
    let newSuffix = suffix;

    switch (base) {
      case 'R':
        newBase = 'L';
        newSuffix = isTwo ? '2' : (isPrime ? '' : "'");
        break;
      case 'L':
        newBase = 'R';
        newSuffix = isTwo ? '2' : (isPrime ? '' : "'");
        break;
      case 'r':
        newBase = 'l';
        newSuffix = isTwo ? '2' : (isPrime ? '' : "'");
        break;
      case 'l':
        newBase = 'r';
        newSuffix = isTwo ? '2' : (isPrime ? '' : "'");
        break;
      case 'U':
      case 'F':
      case 'B':
      case 'D':
      case 'd':
      case 'y':
      case 'f':
      case 'S':
      case 'M':
        newSuffix = isTwo ? '2' : (isPrime ? '' : "'");
        break;
    }

    return `${newBase}${newSuffix}`;
  });
}


// Decompose raw notation into semantic chunks
export function chunkAlgorithm(notation: string): AlgChunk[] {
  // If already bracketed with parentheses, respect them!
  const parenthesized = notation.match(/\([^)]+\)|[A-Za-z0-9'/]+/g);
  if (!parenthesized) return [{ name: 'Full Move', notation, color: 'bg-slate-800 text-slate-300 border-slate-700', description: 'Continuous sequence' }];

  const chunks: AlgChunk[] = [];

  parenthesized.forEach((rawPart) => {
    const clean = rawPart.trim();
    if (!clean) return;

    // Check against trigger dictionary
    const match = TRIGGER_DICTIONARY.find(t => t.pattern.test(clean));
    if (match) {
      chunks.push({
        name: match.name,
        notation: clean,
        color: match.color,
        description: match.description
      });
    } else {
      // Generic chunk
      chunks.push({
        name: clean.length <= 4 ? 'Turn' : 'Trigger',
        notation: clean,
        color: 'bg-slate-800/80 text-slate-200 border-slate-700',
        description: 'Single grip sequence'
      });
    }
  });

  return chunks;
}

// Decompose raw notation into individual moves with fingertrick advice
export function parseIndividualMoves(notation: string): MoveStep[] {
  // Strip parentheses
  const clean = notation.replace(/[()]/g, ' ');
  // Split on whitespace
  const rawMoves = clean.trim().split(/\s+/).filter(Boolean);

  return rawMoves.map(m => {
    return getMoveFingertrick(m);
  });
}

function getMoveFingertrick(m: string): MoveStep {
  const norm = m.trim();

  switch (norm) {
    case 'R':
      return { move: 'R', finger: 'Right Hand', action: 'Rotate right wrist UP (clockwise)', icon: '✋' };
    case "R'":
      return { move: "R'", finger: 'Right Hand', action: 'Rotate right wrist DOWN (counter-clockwise)', icon: '✋' };
    case 'R2':
    case "R2'":
      return { move: norm, finger: 'Right Hand', action: 'Double swing 180° with right wrist', icon: '🔄' };

    case 'U':
      return { move: 'U', finger: 'Right Index', action: 'Flick top layer LEFT with right index finger', icon: '👆' };
    case "U'":
      return { move: "U'", finger: 'Left Index', action: 'Flick top layer RIGHT with left index finger', icon: '👆' };
    case 'U2':
    case "U2'":
      return { move: norm, finger: 'Index + Middle', action: 'Double flick: right index then right middle finger', icon: '✌️' };

    case 'F':
      return { move: 'F', finger: 'Right Index', action: 'Push front face DOWN with right index finger', icon: '👇' };
    case "F'":
      return { move: "F'", finger: 'Right Thumb', action: 'Push front face UP with right thumb', icon: '👍' };
    case 'F2':
      return { move: 'F2', finger: 'Right Hand', action: 'Double turn front face 180°', icon: '🔄' };

    case 'L':
      return { move: 'L', finger: 'Left Hand', action: 'Rotate left wrist DOWN (clockwise)', icon: '✋' };
    case "L'":
      return { move: "L'", finger: 'Left Hand', action: 'Rotate left wrist UP (counter-clockwise)', icon: '✋' };
    case 'L2':
      return { move: 'L2', finger: 'Left Hand', action: 'Double swing 180° with left wrist', icon: '🔄' };

    case 'D':
      return { move: 'D', finger: 'Left Ring', action: 'Flick bottom layer with left ring finger', icon: '🤙' };
    case "D'":
      return { move: "D'", finger: 'Right Ring', action: 'Push bottom layer with right ring finger', icon: '🤙' };
    case 'D2':
    case "D2'":
      return { move: norm, finger: 'Ring + Pinky', action: 'Double flick bottom layer with left ring + pinky', icon: '✌️' };

    case 'M':
      return { move: 'M', finger: 'Middle Ring', action: 'Push middle slice DOWN', icon: '👇' };
    case "M'":
      return { move: "M'", finger: 'Left Ring', action: 'Push middle slice UP from bottom with left ring finger', icon: '👆' };
    case 'M2':
    case "M2'":
      return { move: norm, finger: 'Ring + Middle', action: 'Double flick: left ring then middle finger pushing M slice up', icon: '✌️' };

    case 'r':
      return { move: 'r', finger: 'Right Hand', action: 'Wide turn: rotate both R and M layers UP together', icon: '✋' };
    case "r'":
      return { move: "r'", finger: 'Right Hand', action: 'Wide turn: rotate both R and M layers DOWN together', icon: '✋' };

    case 'd':
      return { move: 'd', finger: 'Left Ring', action: 'Wide D: turn bottom two layers clockwise (or rotate y\')', icon: '🔄' };
    case "d'":
      return { move: "d'", finger: 'Right Ring', action: 'Wide D\': turn bottom two layers counter-clockwise', icon: '🔄' };

    case 'y':
      return { move: 'y', finger: 'Both Hands', action: 'Cube rotation: rotate entire cube 90° clockwise looking from top', icon: '🔄' };
    case "y'":
      return { move: "y'", finger: 'Both Hands', action: 'Cube rotation: rotate entire cube 90° counter-clockwise looking from top', icon: '🔄' };
    case 'y2':
      return { move: 'y2', finger: 'Both Hands', action: 'Cube rotation: rotate entire cube 180° looking from top', icon: '🔄' };

    case 'l':
      return { move: 'l', finger: 'Left Hand', action: 'Wide turn: rotate both L and M layers DOWN together', icon: '✋' };
    case "l'":
      return { move: "l'", finger: 'Left Hand', action: 'Wide turn: rotate both L and M layers UP together', icon: '✋' };

    case 'B':
      return { move: 'B', finger: 'Right Hand', action: 'Rotate back face clockwise with right index/wrist', icon: '🔄' };
    case "B'":
      return { move: "B'", finger: 'Right Hand', action: 'Rotate back face counter-clockwise with right index', icon: '🔄' };

    default:
      return { move: norm, finger: 'Both Hands', action: `Execute ${norm}`, icon: '🧊' };
  }
}

