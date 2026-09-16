import React from 'react';
import { DiagramConfig } from '../types/cube';

interface CubeDiagramProps {
  config: DiagramConfig;
  size?: number;
  interactive?: boolean;
}

export const CubeDiagram: React.FC<CubeDiagramProps> = ({ config, size = 180 }) => {
  if (config.type === 'oll') {
    return renderOLLDiagram(config, size);
  } else if (config.type === 'pll') {
    return renderPLLDiagram(config, size);
  } else if (config.type === 'f2l') {
    return renderF2LDiagram(config, size);
  } else {
    return renderCrossDiagram(config, size);
  }
};

// ----------------------------------------------------
// OLL DIAGRAM: 3x3 Top yellow face + 4 side flaps (wings) + Orientation Guides
// ----------------------------------------------------
function renderOLLDiagram(config: DiagramConfig, size: number) {
  const cellSize = 38;
  const gridOffset = 53; // Centers 3*38 = 114 in 220
  const flapThick = 13;
  const yellowColor = '#eab308'; // amber-500
  const grayColor = '#334155';   // slate-700
  const borderColor = '#0f172a'; // slate-900

  const topGrid = config.topGrid || [
    false, false, false,
    false, true,  false,
    false, false, false
  ];

  const wings = config.wings || {};

  return (
    <div className="flex flex-col items-center justify-center p-1">
      <svg width={size} height={size} viewBox="0 0 220 220" className="drop-shadow-md select-none font-sans">
        {/* Background rounded frame */}
        <rect x="0" y="0" width="220" height="220" rx="14" fill="#090d16" />

        {/* Orientation Guides / Compass */}
        <text x="110" y="22" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold" letterSpacing="1">
          ⬆️ BACK
        </text>
        
        {/* Front Orientation Badge */}
        <rect x="36" y="196" width="148" height="18" rx="9" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
        <text x="110" y="209" fill="#34d399" fontSize="9" textAnchor="middle" fontWeight="bold" letterSpacing="0.5">
          ⬇️ FRONT (Facing You)
        </text>

        {/* Side Face Indicators */}
        <text x="16" y="114" fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="bold">L</text>
        <text x="204" y="114" fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="bold">R</text>

        {/* Outer Top Wing Flaps (North / Back) */}
        {wings.top && [0, 1, 2].map((idx) => (
          <rect
            key={`w-top-${idx}`}
            x={gridOffset + idx * cellSize + 2}
            y={gridOffset - flapThick - 4}
            width={cellSize - 4}
            height={flapThick}
            rx="3"
            fill={wings.top?.[idx] ? yellowColor : 'transparent'}
            stroke={wings.top?.[idx] ? borderColor : 'none'}
            strokeWidth="1.5"
          />
        ))}

        {/* Outer Bottom Wing Flaps (South / Front) */}
        {wings.bottom && [0, 1, 2].map((idx) => (
          <rect
            key={`w-bot-${idx}`}
            x={gridOffset + idx * cellSize + 2}
            y={gridOffset + 3 * cellSize + 4}
            width={cellSize - 4}
            height={flapThick}
            rx="3"
            fill={wings.bottom?.[idx] ? yellowColor : 'transparent'}
            stroke={wings.bottom?.[idx] ? borderColor : 'none'}
            strokeWidth="1.5"
          />
        ))}

        {/* Outer Left Wing Flaps (West / Left) */}
        {wings.left && [0, 1, 2].map((idx) => (
          <rect
            key={`w-left-${idx}`}
            x={gridOffset - flapThick - 4}
            y={gridOffset + idx * cellSize + 2}
            width={flapThick}
            height={cellSize - 4}
            rx="3"
            fill={wings.left?.[idx] ? yellowColor : 'transparent'}
            stroke={wings.left?.[idx] ? borderColor : 'none'}
            strokeWidth="1.5"
          />
        ))}

        {/* Outer Right Wing Flaps (East / Right) */}
        {wings.right && [0, 1, 2].map((idx) => (
          <rect
            key={`w-right-${idx}`}
            x={gridOffset + 3 * cellSize + 4}
            y={gridOffset + idx * cellSize + 2}
            width={flapThick}
            height={cellSize - 4}
            rx="3"
            fill={wings.right?.[idx] ? yellowColor : 'transparent'}
            stroke={wings.right?.[idx] ? borderColor : 'none'}
            strokeWidth="1.5"
          />
        ))}

        {/* Central 3x3 Grid */}
        <g stroke={borderColor} strokeWidth="2.5" strokeLinejoin="round">
          {topGrid.map((isYellow, idx) => {
            const col = idx % 3;
            const row = Math.floor(idx / 3);
            const x = gridOffset + col * cellSize;
            const y = gridOffset + row * cellSize;
            return (
              <rect
                key={`cell-${idx}`}
                x={x + 1.5}
                y={y + 1.5}
                width={cellSize - 3}
                height={cellSize - 3}
                rx="4"
                fill={isYellow ? yellowColor : grayColor}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

// ----------------------------------------------------
// PLL DIAGRAM: Top yellow face with headlights & arrows + Orientation Guides
// ----------------------------------------------------
function renderPLLDiagram(config: DiagramConfig, size: number) {
  const cellSize = 38;
  const gridOffset = 53;
  const yellowColor = '#eab308';
  const borderColor = '#0f172a';

  const headlights = config.headlights || [];

  return (
    <div className="flex flex-col items-center justify-center p-1">
      <svg width={size} height={size} viewBox="0 0 220 220" className="drop-shadow-md select-none font-sans">
        <rect x="0" y="0" width="220" height="220" rx="14" fill="#090d16" />

        {/* Orientation Guides / Compass */}
        <text x="110" y="22" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold" letterSpacing="1">
          ⬆️ BACK
        </text>
        
        {/* Front Orientation Badge */}
        <rect x="36" y="196" width="148" height="18" rx="9" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
        <text x="110" y="209" fill="#34d399" fontSize="9" textAnchor="middle" fontWeight="bold" letterSpacing="0.5">
          ⬇️ FRONT (Facing You)
        </text>

        {/* Side Face Indicators */}
        <text x="16" y="114" fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="bold">L</text>
        <text x="204" y="114" fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="bold">R</text>

        {/* 3x3 all yellow face on top */}
        <g stroke={borderColor} strokeWidth="2.5" strokeLinejoin="round">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
            const col = idx % 3;
            const row = Math.floor(idx / 3);
            const x = gridOffset + col * cellSize;
            const y = gridOffset + row * cellSize;
            return (
              <rect
                key={`pll-cell-${idx}`}
                x={x + 1.5}
                y={y + 1.5}
                width={cellSize - 3}
                height={cellSize - 3}
                rx="4"
                fill={yellowColor}
              />
            );
          })}
        </g>

        {/* Headlight indicators */}
        {headlights.includes('top') && (
          <g>
            <circle cx={gridOffset + cellSize * 0.5} cy={gridOffset - 8} r="5" fill="#38bdf8" />
            <circle cx={gridOffset + cellSize * 2.5} cy={gridOffset - 8} r="5" fill="#38bdf8" />
            <line x1={gridOffset + cellSize * 0.5} y1={gridOffset - 8} x2={gridOffset + cellSize * 2.5} y2={gridOffset - 8} stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
          </g>
        )}

        {headlights.includes('bottom') && (
          <g>
            <circle cx={gridOffset + cellSize * 0.5} cy={gridOffset + cellSize * 3 + 8} r="5" fill="#38bdf8" />
            <circle cx={gridOffset + cellSize * 2.5} cy={gridOffset + cellSize * 3 + 8} r="5" fill="#38bdf8" />
            <line x1={gridOffset + cellSize * 0.5} y1={gridOffset + cellSize * 3 + 8} x2={gridOffset + cellSize * 2.5} y2={gridOffset + cellSize * 3 + 8} stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
          </g>
        )}

        {headlights.includes('left') && (
          <g>
            <circle cx={gridOffset - 8} cy={gridOffset + cellSize * 0.5} r="5" fill="#38bdf8" />
            <circle cx={gridOffset - 8} cy={gridOffset + cellSize * 2.5} r="5" fill="#38bdf8" />
            <line x1={gridOffset - 8} y1={gridOffset + cellSize * 0.5} x2={gridOffset - 8} y2={gridOffset + cellSize * 2.5} stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
            <text x={gridOffset - 22} y={gridOffset + cellSize * 1.55} fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">HL</text>
          </g>
        )}

        {headlights.includes('right') && (
          <g>
            <circle cx={gridOffset + cellSize * 3 + 8} cy={gridOffset + cellSize * 0.5} r="5" fill="#38bdf8" />
            <circle cx={gridOffset + cellSize * 3 + 8} cy={gridOffset + cellSize * 2.5} r="5" fill="#38bdf8" />
            <line x1={gridOffset + cellSize * 3 + 8} y1={gridOffset + cellSize * 0.5} x2={gridOffset + cellSize * 3 + 8} y2={gridOffset + cellSize * 2.5} stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
          </g>
        )}

        {/* Center label */}
        <text
          x="110"
          y="114"
          fill="#0f172a"
          fontSize="11"
          fontWeight="bold"
          textAnchor="middle"
        >
          PLL
        </text>
      </svg>
    </div>
  );
}

// Helper to parse named cube colors
function parseCubeColor(name?: string, fallback = '#334155'): string {
  if (!name) return fallback;
  const n = name.toLowerCase().trim();
  switch (n) {
    case 'white': return '#ffffff';
    case 'yellow': return '#eab308';
    case 'red': return '#ef4444';
    case 'green': return '#22c55e';
    case 'blue': return '#3b82f6';
    case 'orange': return '#f97316';
    default: return fallback;
  }
}

// ----------------------------------------------------
// ----------------------------------------------------
// F2L DIAGRAM: High-Clarity Top-Down View + Prominent Face Color Badges
// ----------------------------------------------------
function renderF2LDiagram(config: DiagramConfig, size: number) {
  const details = config.f2lDetails;
  const cornerWhiteFacing = details?.cornerWhiteFacing || 'up';
  const cornerPos = details?.cornerPos || 'top';
  const edgePos = details?.edgePos || 'top';

  // Dynamic colors from details (defaults to standard Orange-Blue slot)
  const frontNameRaw = details?.cornerColorSecondary || 'orange';
  const rightNameRaw = details?.cornerColorTertiary || 'blue';
  const frontColor = parseCubeColor(frontNameRaw, '#f97316');
  const rightColor = parseCubeColor(rightNameRaw, '#3b82f6');
  const edgeColorTop = parseCubeColor(details?.edgeColorTop, '#f97316');
  const edgeColorSide = parseCubeColor(details?.edgeColorFront, '#3b82f6');

  const frontLabel = frontNameRaw.toUpperCase();
  const rightLabel = rightNameRaw.toUpperCase();

  const whiteColor = '#ffffff';
  const yellowColor = '#eab308';
  const grayTile = '#1e293b';
  const slotDark = '#090d16';

  // Grid coordinates
  // Canvas 240 x 260
  const cSize = 40;
  const ox = 56;
  const oy = 32;

  // Determine corner colors based on white facing
  let cornerTopFill = grayTile;
  let cornerFrontFill = frontColor;
  let cornerRightFill = rightColor;
  let cornerTopText = '';

  if (cornerPos === 'top') {
    if (cornerWhiteFacing === 'up') {
      cornerTopFill = whiteColor;
      cornerTopText = 'WHITE ⬆️';
      cornerFrontFill = frontColor;
      cornerRightFill = rightColor;
    } else if (cornerWhiteFacing === 'front') {
      cornerTopFill = frontColor;
      cornerFrontFill = whiteColor;
      cornerRightFill = rightColor;
      cornerTopText = frontLabel;
    } else if (cornerWhiteFacing === 'right') {
      cornerTopFill = frontColor;
      cornerFrontFill = rightColor;
      cornerRightFill = whiteColor;
      cornerTopText = frontLabel;
    }
  }

  const isEdgeInTop = edgePos === 'top';
  const edgeTopPos = details?.edgeTopPos || 'back';

  return (
    <div className="flex flex-col items-center justify-center p-1">
      <svg width={size} height={size} viewBox="0 0 240 260" className="drop-shadow-md select-none font-sans">
        <rect width="240" height="260" rx="14" fill="#090d16" />

        {/* Compass Guides */}
        <text x="120" y="17" fill="#cbd5e1" fontSize="10.5" textAnchor="middle" fontWeight="bold" letterSpacing="0.5">
          ⬆️ BACK (Opposite)
        </text>
        <text x="14" y="102" fill="#94a3b8" fontSize="10.5" textAnchor="middle" fontWeight="bold">
          ⬅️ L
        </text>

        {/* Right Face Color Badge */}
        <g transform="translate(182, 44)">
          <rect width="52" height="24" rx="6" fill={rightColor} stroke="#ffffff" strokeWidth="1" />
          <text x="26" y="16" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="black">
            👉 {rightLabel}
          </text>
        </g>

        {/* Central 3x3 U-Layer Background Grid */}
        <g stroke="#0f172a" strokeWidth="1.5">
          {[0, 1, 2].map(r => (
            [0, 1, 2].map(c => {
              const x = ox + c * (cSize + 2);
              const y = oy + r * (cSize + 2);
              const isCenter = r === 1 && c === 1;
              const isCorner = r === 2 && c === 2;
              const isEdge =
                (edgeTopPos === 'back' && r === 0 && c === 1) ||
                (edgeTopPos === 'right' && r === 1 && c === 2) ||
                (edgeTopPos === 'front' && r === 2 && c === 1) ||
                (edgeTopPos === 'left' && r === 1 && c === 0);

              let fill = grayTile;
              let text = '';
              let textFill = '#cbd5e1';

              if (isCenter) {
                fill = yellowColor;
                text = 'YELLOW';
                textFill = '#0f172a';
              } else if (isCorner) {
                fill = cornerPos === 'top' ? cornerTopFill : slotDark;
                text = cornerPos === 'top' ? cornerTopText : 'IN SLOT ⬇️';
                textFill = cornerWhiteFacing === 'up' ? '#0f172a' : '#f8fafc';
              } else if (isEdge && isEdgeInTop) {
                fill = edgeColorTop;
                text = 'EDGE TOP';
                textFill = edgeColorTop === '#ffffff' ? '#0f172a' : '#ffffff';
              }

              return (
                <g key={`cell-${r}-${c}`}>
                  <rect
                    x={x}
                    y={y}
                    width={cSize}
                    height={cSize}
                    rx="4"
                    fill={fill}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                  {text && (
                    <text
                      x={x + cSize / 2}
                      y={y + cSize / 2 + 3.5}
                      fill={textFill}
                      fontSize={text.length > 7 ? '7.5' : '9'}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {text}
                    </text>
                  )}
                </g>
              );
            })
          ))}

          {/* Active Edge Side Flap: Back */}
          {isEdgeInTop && edgeTopPos === 'back' && (
            <g>
              <rect
                x={ox + cSize + 2}
                y={oy - 17}
                width={cSize}
                height={15}
                rx="3"
                fill={edgeColorSide}
                stroke="#0f172a"
                strokeWidth="1.5"
              />
              <text
                x={ox + cSize + 2 + cSize / 2}
                y={oy - 6.5}
                fill="#ffffff"
                fontSize="7.5"
                fontWeight="bold"
                textAnchor="middle"
              >
                EDGE SIDE
              </text>
            </g>
          )}

          {/* Active Edge Side Flap: Left */}
          {isEdgeInTop && edgeTopPos === 'left' && (
            <g>
              <rect
                x={ox - 17}
                y={oy + cSize + 2}
                width={15}
                height={cSize}
                rx="3"
                fill={edgeColorSide}
                stroke="#0f172a"
                strokeWidth="1.5"
              />
              <text
                x={ox - 9}
                y={oy + cSize + 2 + cSize / 2 + 2}
                fill="#ffffff"
                fontSize="7"
                fontWeight="bold"
                textAnchor="middle"
                transform={`rotate(-90 ${ox - 9} ${oy + cSize + 2 + cSize / 2 + 2})`}
              >
                EDGE SIDE
              </text>
            </g>
          )}

          {/* Side Flaps: FRONT FACE */}
          {/* Front Center or Front Edge Flap */}
          <rect
            x={ox + cSize + 2}
            y={oy + 3 * (cSize + 2) + 2}
            width={cSize}
            height={16}
            rx="3"
            fill={isEdgeInTop && edgeTopPos === 'front' ? edgeColorSide : frontColor}
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          <text
            x={ox + cSize + 2 + cSize / 2}
            y={oy + 3 * (cSize + 2) + 13}
            fill="#ffffff"
            fontSize="7.5"
            fontWeight="black"
            textAnchor="middle"
          >
            {isEdgeInTop && edgeTopPos === 'front' ? 'EDGE SIDE' : 'F CENTER'}
          </text>

          {/* Front Flap of Front-Right Corner */}
          <rect
            x={ox + 2 * (cSize + 2)}
            y={oy + 3 * (cSize + 2) + 2}
            width={cSize}
            height={16}
            rx="3"
            fill={cornerPos === 'top' ? cornerFrontFill : slotDark}
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          <text
            x={ox + 2 * (cSize + 2) + cSize / 2}
            y={oy + 3 * (cSize + 2) + 13}
            fill={cornerFrontFill === '#ffffff' ? '#0f172a' : '#ffffff'}
            fontSize="8"
            fontWeight="bold"
            textAnchor="middle"
          >
            {cornerPos === 'top' && cornerWhiteFacing === 'front' ? 'WHITE' : frontLabel}
          </text>

          {/* Side Flaps: RIGHT FACE */}
          {/* Right Center or Right Edge Flap */}
          <rect
            x={ox + 3 * (cSize + 2) + 2}
            y={oy + cSize + 2}
            width={16}
            height={cSize}
            rx="3"
            fill={isEdgeInTop && edgeTopPos === 'right' ? edgeColorSide : rightColor}
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          <text
            x={ox + 3 * (cSize + 2) + 10}
            y={oy + cSize + 2 + cSize / 2 + 2}
            fill="#ffffff"
            fontSize="7.5"
            fontWeight="black"
            textAnchor="middle"
            transform={`rotate(90 ${ox + 3 * (cSize + 2) + 10} ${oy + cSize + 2 + cSize / 2 + 2})`}
          >
            {isEdgeInTop && edgeTopPos === 'right' ? 'EDGE SIDE' : 'R CENTER'}
          </text>

          {/* Right Flap of Front-Right Corner */}
          <rect
            x={ox + 3 * (cSize + 2) + 2}
            y={oy + 2 * (cSize + 2)}
            width={16}
            height={cSize}
            rx="3"
            fill={cornerPos === 'top' ? cornerRightFill : slotDark}
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          <text
            x={ox + 3 * (cSize + 2) + 10}
            y={oy + 2 * (cSize + 2) + cSize / 2 + 2}
            fill={cornerRightFill === '#ffffff' ? '#0f172a' : '#ffffff'}
            fontSize="8"
            fontWeight="bold"
            textAnchor="middle"
            transform={`rotate(90 ${ox + 3 * (cSize + 2) + 10} ${oy + 2 * (cSize + 2) + cSize / 2 + 2})`}
          >
            {cornerPos === 'top' && cornerWhiteFacing === 'right' ? 'WHITE' : rightLabel}
          </text>
        </g>

        {/* Target Slot Highlight Box */}
        <rect
          x={ox + 2 * (cSize + 2) - 3}
          y={oy + 2 * (cSize + 2) - 3}
          width={cSize + 23}
          height={cSize + 23}
          rx="7"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.2"
          strokeDasharray="5 3"
        />

        {/* Informative Status Badge */}
        <g transform="translate(14, 194)">
          <rect width="212" height="24" rx="7" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <text x="106" y="16" fill="#f8fafc" fontSize="9.5" textAnchor="middle" fontWeight="bold">
            {cornerPos === 'slot-target' && edgePos === 'slot-target'
              ? '🔄 Both in Slot (Edge Flipped)'
              : cornerPos === 'slot-target'
              ? '📥 Corner in Bottom Slot (Needs Ejection)'
              : edgePos === 'slot-target'
              ? '📥 Edge in Middle Slot (Needs Ejection)'
              : cornerWhiteFacing === 'up'
              ? '⚪ White Corner Facing UP (At Ceiling)'
              : details?.topColorsMatch === true
              ? '🟢🟢 Top Colors MATCH (Both Same)'
              : '🟢🔴 Top Colors DIFFER (Different Colors)'}
          </text>
        </g>

        {/* Prominent Front Face Banner (Faces You) */}
        <g transform="translate(14, 224)">
          <rect width="212" height="26" rx="13" fill={frontColor} stroke="#ffffff" strokeWidth="1.5" />
          <text x="106" y="17.5" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="black" letterSpacing="0.5">
            ⬇️ FRONT: {frontLabel} (Facing You)
          </text>
        </g>
      </svg>
    </div>
  );
}

// ----------------------------------------------------
// CROSS DIAGRAM: Simple 2D Cross representation
// ----------------------------------------------------
function renderCrossDiagram(config: DiagramConfig, size: number) {
  const whiteColor = '#ffffff';
  const grayColor = '#334155';
  const alignmentText = config.crossDetails?.alignment || 'White Cross on Bottom';

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <svg width={size} height={size} viewBox="0 0 160 160" className="drop-shadow-md">
        <rect width="160" height="160" rx="12" fill="#090d16" />

        {/* 3x3 Grid on Bottom Face */}
        <g stroke="#0f172a" strokeWidth="2">
          {/* Top-left */}
          <rect x="25" y="25" width="32" height="32" rx="3" fill={grayColor} />
          {/* Top-mid (Cross edge) */}
          <rect x="64" y="25" width="32" height="32" rx="3" fill={whiteColor} />
          {/* Top-right */}
          <rect x="103" y="25" width="32" height="32" rx="3" fill={grayColor} />

          {/* Mid-left (Cross edge) */}
          <rect x="25" y="64" width="32" height="32" rx="3" fill={whiteColor} />
          {/* Center (White core) */}
          <rect x="64" y="64" width="32" height="32" rx="3" fill={whiteColor} />
          {/* Mid-right (Cross edge) */}
          <rect x="103" y="64" width="32" height="32" rx="3" fill={whiteColor} />

          {/* Bot-left */}
          <rect x="25" y="103" width="32" height="32" rx="3" fill={grayColor} />
          {/* Bot-mid (Cross edge) */}
          <rect x="64" y="103" width="32" height="32" rx="3" fill={whiteColor} />
          {/* Bot-right */}
          <rect x="103" y="103" width="32" height="32" rx="3" fill={grayColor} />
        </g>

        {/* Label */}
        <text x="80" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle" fontWeight="bold">
          {alignmentText.slice(0, 26)}
        </text>
      </svg>
    </div>
  );
}
