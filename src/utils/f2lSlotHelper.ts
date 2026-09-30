import { DiagramConfig, DecisionSolution } from '../types/cube';

export interface F2LSlotPair {
  id: string;
  name: string;
  frontColor: string;
  rightColor: string;
  frontHex: string;
  rightHex: string;
  frontLabel: string;
  rightLabel: string;
  slotLabel: string;
  icon: string;
  description: string;
}

export const CUBE_FACE_COLORS = [
  { id: 'orange', label: 'ORANGE', hex: '#ea580c', icon: '🟧' },
  { id: 'green', label: 'GREEN', hex: '#16a34a', icon: '🟩' },
  { id: 'red', label: 'RED', hex: '#dc2626', icon: '🟥' },
  { id: 'blue', label: 'BLUE', hex: '#2563eb', icon: '🟦' },
];

export function createSlotPair(frontColorId: string, rightColorId: string): F2LSlotPair {
  const f = CUBE_FACE_COLORS.find(c => c.id === frontColorId) || CUBE_FACE_COLORS[0];
  const r = CUBE_FACE_COLORS.find(c => c.id === rightColorId) || CUBE_FACE_COLORS[1];
  return {
    id: `${f.id}-${r.id}`,
    name: `${f.label} & ${r.label}`,
    frontColor: f.id,
    rightColor: r.id,
    frontHex: f.hex,
    rightHex: r.hex,
    frontLabel: f.label,
    rightLabel: r.label,
    slotLabel: `${f.label}-${r.label} Slot`,
    icon: `${f.icon} ${r.icon}`,
    description: `${f.label} is in Front (facing your chest), ${r.label} is on Right. Target slot is at Front-Right.`
  };
}

export const F2L_SLOT_PAIRS: F2LSlotPair[] = [
  {
    id: 'orange-blue',
    name: 'Orange & Blue',
    frontColor: 'orange',
    rightColor: 'blue',
    frontHex: '#ea580c',
    rightHex: '#2563eb',
    frontLabel: 'ORANGE',
    rightLabel: 'BLUE',
    slotLabel: 'Orange-Blue Slot',
    icon: '🟧 🟦',
    description: 'ORANGE is in Front (facing your chest), BLUE is on Right. Target slot is at Front-Right.'
  },
  {
    id: 'blue-red',
    name: 'Blue & Red',
    frontColor: 'blue',
    rightColor: 'red',
    frontHex: '#2563eb',
    rightHex: '#dc2626',
    frontLabel: 'BLUE',
    rightLabel: 'RED',
    slotLabel: 'Blue-Red Slot',
    icon: '🟦 🟥',
    description: 'BLUE is in Front (facing your chest), RED is on Right. Target slot is at Front-Right.'
  },
  {
    id: 'red-green',
    name: 'Red & Green',
    frontColor: 'red',
    rightColor: 'green',
    frontHex: '#dc2626',
    rightHex: '#16a34a',
    frontLabel: 'RED',
    rightLabel: 'GREEN',
    slotLabel: 'Red-Green Slot',
    icon: '🟥 🟩',
    description: 'RED is in Front (facing your chest), GREEN is on Right. Target slot is at Front-Right.'
  },
  {
    id: 'green-orange',
    name: 'Green & Orange',
    frontColor: 'green',
    rightColor: 'orange',
    frontHex: '#16a34a',
    rightHex: '#ea580c',
    frontLabel: 'GREEN',
    rightLabel: 'ORANGE',
    slotLabel: 'Green-Orange Slot',
    icon: '🟩 🟧',
    description: 'GREEN is in Front (facing your chest), ORANGE is on Right. Target slot is at Front-Right.'
  }
];


export function adaptF2LDiagramConfig(config: DiagramConfig, slot: F2LSlotPair): DiagramConfig {
  if (config.type !== 'f2l' || !config.f2lDetails) return config;

  const d = config.f2lDetails;

  const mapColor = (c: string | undefined): string => {
    if (!c) return 'white';
    const lower = c.toLowerCase().trim();
    if (lower === 'orange') return slot.frontColor;
    if (lower === 'blue') return slot.rightColor;
    if (lower === 'white') return 'white';
    if (lower === 'yellow') return 'yellow';
    return c;
  };

  return {
    ...config,
    f2lDetails: {
      ...d,
      cornerColorSecondary: slot.frontColor,
      cornerColorTertiary: slot.rightColor,
      edgeColorTop: mapColor(d.edgeColorTop),
      edgeColorFront: mapColor(d.edgeColorFront)
    }
  };
}

export function adaptF2LText(text: string, slot: F2LSlotPair): string {
  if (!text) return text;

  // Phase 1: Convert all tokens to intermediate placeholders to prevent any self-replacement collisions
  let result = text
    .replace(/FRONT center/g, '__FRONT_CENTER__')
    .replace(/Front center/g, '__front_center__')
    .replace(/RIGHT center/g, '__RIGHT_CENTER__')
    .replace(/Right center/g, '__right_center__')
    .replace(/\bORANGE\b/g, '__FRONT_UPPER__')
    .replace(/\bOrange\b/g, '__FRONT_CAP__')
    .replace(/\borange\b/g, '__FRONT_LOWER__')
    .replace(/\bBLUE\b/g, '__RIGHT_UPPER__')
    .replace(/\bBlue\b/g, '__RIGHT_CAP__')
    .replace(/\bblue\b/g, '__RIGHT_LOWER__');

  const frontUpper = slot.frontLabel;
  const frontCap = slot.frontLabel.charAt(0).toUpperCase() + slot.frontLabel.slice(1).toLowerCase();
  const frontLower = slot.frontLabel.toLowerCase();

  const rightUpper = slot.rightLabel;
  const rightCap = slot.rightLabel.charAt(0).toUpperCase() + slot.rightLabel.slice(1).toLowerCase();
  const rightLower = slot.rightLabel.toLowerCase();

  // Phase 2: Expand placeholders with the active slot's exact labels
  result = result
    .replace(/__FRONT_CENTER__/g, `${frontUpper} (Front) center`)
    .replace(/__front_center__/g, `${frontCap} (Front) center`)
    .replace(/__RIGHT_CENTER__/g, `${rightUpper} (Right) center`)
    .replace(/__right_center__/g, `${rightCap} (Right) center`)
    .replace(/__FRONT_UPPER__/g, frontUpper)
    .replace(/__FRONT_CAP__/g, frontCap)
    .replace(/__FRONT_LOWER__/g, frontLower)
    .replace(/__RIGHT_UPPER__/g, rightUpper)
    .replace(/__RIGHT_CAP__/g, rightCap)
    .replace(/__RIGHT_LOWER__/g, rightLower);

  return result;
}

export function adaptF2LSolution(sol: DecisionSolution, slot: F2LSlotPair): DecisionSolution {
  if (sol.phase !== 'f2l') return sol;

  return {
    ...sol,
    caseName: adaptF2LText(sol.caseName, slot),
    recognitionTip: adaptF2LText(sol.recognitionTip, slot),
    howToHold: sol.howToHold ? adaptF2LText(sol.howToHold, slot) : undefined,
    sub30Tip: adaptF2LText(sol.sub30Tip, slot),
    startingSetup: sol.startingSetup ? {
      cornerPosition: adaptF2LText(sol.startingSetup.cornerPosition, slot),
      edgePosition: adaptF2LText(sol.startingSetup.edgePosition, slot),
      setupAction: adaptF2LText(sol.startingSetup.setupAction, slot)
    } : undefined,
    algorithms: {
      ...sol.algorithms,
      intuitive: sol.algorithms.intuitive ? {
        ...sol.algorithms.intuitive,
        intuitiveSteps: sol.algorithms.intuitive.intuitiveSteps?.map(s => adaptF2LText(s, slot)),
        notes: sol.algorithms.intuitive.notes ? adaptF2LText(sol.algorithms.intuitive.notes, slot) : undefined
      } : sol.algorithms.intuitive,
      sub30: {
        ...sol.algorithms.sub30,
        fingertricks: sol.algorithms.sub30.fingertricks ? adaptF2LText(sol.algorithms.sub30.fingertricks, slot) : undefined,
        notes: sol.algorithms.sub30.notes ? adaptF2LText(sol.algorithms.sub30.notes, slot) : undefined
      },
      pro: sol.algorithms.pro ? {
        ...sol.algorithms.pro,
        notes: sol.algorithms.pro.notes ? adaptF2LText(sol.algorithms.pro.notes, slot) : undefined
      } : undefined
    },
    diagramConfig: adaptF2LDiagramConfig(sol.diagramConfig, slot)
  };
}

