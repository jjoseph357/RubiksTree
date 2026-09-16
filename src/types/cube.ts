export type Phase = 'cross' | 'f2l' | 'oll' | 'pll';

export type DifficultyLevel = 'intuitive' | 'sub30' | 'pro';

export interface Algorithm {
  id: string;
  name: string;
  notation: string;
  moveCount: number; // HTM
  difficulty: DifficultyLevel;
  timeEstimate: number; // In seconds
  intuitiveSteps?: string[];
  fingertricks?: string;
  notes?: string;
  setupMoves?: string;
  alternativeAlgs?: {
    notation: string;
    note: string;
    timeEstimate: number;
  }[];
}

export interface DecisionSolution {
  id: string;
  caseName: string;
  phase: Phase;
  category?: string;
  setupMoves?: string;
  diagramConfig: DiagramConfig;
  recognitionTip: string;
  sub30Tip: string;
  howToHold?: string;
  startingSetup?: {
    cornerPosition: string;
    edgePosition: string;
    setupAction: string;
  };
  algorithms: {
    intuitive?: Algorithm;
    sub30: Algorithm;
    pro?: Algorithm;
  };
}

export interface DiagramConfig {
  type: 'oll' | 'pll' | 'f2l' | 'cross';
  // For OLL: 3x3 grid of top face (yellow or gray), plus 4 sides wings (N, E, S, W outer yellow bars)
  topGrid?: boolean[]; // 9 items: 0=top-left, 1=top-mid, 2=top-right, etc. True if yellow facing UP
  wings?: {
    top?: boolean[]; // [L, M, R]
    right?: boolean[]; // [T, M, B]
    bottom?: boolean[]; // [L, M, R]
    left?: boolean[]; // [T, M, B]
  };
  // For PLL: 2D view with arrows and headlights
  headlights?: ('top' | 'right' | 'bottom' | 'left')[];
  arrows?: { from: number; to: number; twoWay?: boolean; color?: string }[];
  stickers?: string[]; // 12 side stickers around the U-layer: 3 on each side [top, right, bottom, left]
  // For F2L:
  f2lDetails?: {
    cornerPos: 'top' | 'slot-target' | 'slot-wrong';
    cornerWhiteFacing: 'up' | 'front' | 'right' | 'back' | 'left' | 'down';
    cornerColorSecondary: string; // e.g., 'red'
    cornerColorTertiary: string;  // e.g., 'green'
    edgePos: 'top' | 'slot-target' | 'slot-wrong';
    edgeTopPos?: 'back' | 'right' | 'front' | 'left';
    edgeColorTop: string;
    edgeColorFront: string;
    topColorsMatch: boolean | 'n/a';
    slotStatus?: string;
  };
  // For Cross:
  crossDetails?: {
    edgePositions: string;
    alignment: string;
  };
}

export interface DecisionOption {
  id: string;
  label: string;
  subtitle?: string;
  badge?: string;
  diagramConfig?: DiagramConfig;
  nextNodeId?: string;
  solution?: DecisionSolution;
}

export interface DecisionNode {
  id: string;
  phase: Phase;
  stepNumber: number;
  totalStepsInPhase: number;
  title: string;
  question: string;
  helpText?: string;
  options: DecisionOption[];
}

export interface PhaseTimeBudget {
  phase: Phase;
  label: string;
  beginnerTarget: number; // in seconds
  sub30Target: number;   // in seconds
  proTarget: number;      // in seconds
  description: string;
}
