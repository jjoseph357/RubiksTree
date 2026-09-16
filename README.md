# Rubik's Cube Sub-30 Interactive Decision Tree

An interactive speedcubing roadmap and diagnostic decision tree designed specifically for novice and returning cubers (past PR ~1 minute) to systematically break the 30-second barrier consistently.

![CFOP Roadmap](https://img.shields.io/badge/Method-CFOP-amber.svg)
![Target Speed](https://img.shields.io/badge/Goal-Sub--30s-emerald.svg)
![Difficulty Modes](https://img.shields.io/badge/Modes-Intuitive%20%7C%20Sub--30%20%7C%20Pro-blue.svg)

---

## Quick Start

The app is built with **Vite + React 18 + TypeScript + Tailwind CSS**.

To start the development server:
```bash
npm run dev
```

To run the production build:
```bash
npm run build
npm run preview
```
Visit `http://localhost:5173` in your browser.

---

## The Sub-30 Formula

Consistently solving in under 30 seconds does **not** require memorizing all 119 CFOP algorithms. The realistic split budget is:

| Phase | Sub-30 Target Split | Past 1-Minute Split | Core Technique |
|---|---|---|---|
| **1. White Cross** | **≤ 3.5s** | ~10s | Solved directly on bottom (no daisy!). Planned during 15s inspection. |
| **2. F2L (4 Pairs)** | **≤ 15.0s** (~3.75s/pair) | ~35s | 3-question intuitive flowchart; eliminating cube rotations (`y`/`y'`). |
| **3. 2-Look OLL** | **≤ 3.5s** | ~10s | Only 9 algorithms total (3 Edge Orientation + 7 Corner Cases). |
| **4. PLL** | **≤ 3.5s** | ~12s | 2-Look PLL (6 algs) upgrading to Full PLL (21 algs, highest ROI). |
| **Pauses / Lookahead** | **≤ 2.5s** | ~10s | Smooth turning at 2-3 TPS instead of burst turning with long pauses. |
| **Total Solve** | **~24 – 28 seconds** | **~67 seconds** | **Sub-30 Achieved!** |

---

## App Features

### 1. 🌳 Interactive Decision Tree
- Step-by-step diagnostic questions for each phase: **Cross $\rightarrow$ F2L $\rightarrow$ OLL $\rightarrow$ PLL**.
- Clickable visual cards showing what your cube looks like.
- Dynamic breadcrumb path with Back and Reset buttons.
- Confetti celebration upon reaching solved state!

### 2. 🧩 Dedicated F2L Recovery Lab
- Built specifically for solvers who once learned F2L and forgot it.
- Structured around the **3 Mental Questions**:
  1. *Where are the pieces?* (Both in top, one in slot, both in slot)
  2. *Where is White pointing?* (White UP vs White SIDE)
  3. *Do top face colors match or differ?* (Same color $\rightarrow$ "Hide corner, move edge, unhide"; Different colors $\rightarrow$ standard 3-move insert)
- Interactive filterable matrix of all fundamental F2L cases with 1-click scramble setup moves to practice on your physical cube.

### 3. ⚡ Sub-30 Split Budget & Bottleneck Simulator
- Interactive split sliders and benchmark presets (Past 1-min solve vs Sub-30 Target vs Sub-20 Pro).
- Real-time total time calculation and Turn-per-Second (TPS) tracker.
- Identifies the 3 biggest time wasters for 1-minute cubers.

### 4. ⏱️ Practice Timer & WCA Scrambler
- Hold spacebar (or touch screen) until the timer lights green (0.3s inspection ready), then release to start.
- Instant stop on any keypress or tap.
- Generates official random 20-move WCA scrambles.
- Tracks Session Average of 5 (Ao5) and Personal Best (PB).

### 5. 📖 CFOP Algorithm Library
- Complete reference for 2-Look OLL (9 algs), 2-Look PLL (6 algs), and Full PLL (21 algs).
- Execution times, move counts, trigger notation highlights, and fingertrick guidance.

### 6. 🎓 WCA Notation & Fingertrick Guide
- Visual cheat sheet for moves (`R`, `R'`, `R2`, `U`, `U'`, `U2`, `F`, `M`, `r`, etc.).
- Essential muscle memory triggers (Sexy move, Inverse sexy, Sledgehammer, Sune, T-perm setup).
