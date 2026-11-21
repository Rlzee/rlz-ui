"use client";

import * as React from "react";

export type BezierPoints = [number, number, number, number];

const PRESETS: Record<string, BezierPoints> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
};

export function parseBezier(easing: string): BezierPoints {
  if (PRESETS[easing]) return [...PRESETS[easing]];
  const match =
    /^cubic-bezier\(\s*(-?(?:\d+\.?\d*|\.\d+))\s*,\s*(-?(?:\d+\.?\d*|\.\d+))\s*,\s*(-?(?:\d+\.?\d*|\.\d+))\s*,\s*(-?(?:\d+\.?\d*|\.\d+))\s*\)$/.exec(
      easing
    );
  if (!match) return [...PRESETS.ease];
  const values = match.slice(1).map(Number) as BezierPoints;
  return values.every(Number.isFinite) &&
    values[0] >= 0 &&
    values[0] <= 1 &&
    values[2] >= 0 &&
    values[2] <= 1
    ? values
    : [...PRESETS.ease];
}

export function serializeBezier(points: BezierPoints): string {
  return `cubic-bezier(${points.map((n) => Number(n.toFixed(3))).join(", ")})`;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const X0 = 34,
  X1 = 286,
  Y0 = 182,
  HEIGHT = 126;
const px = (x: number) => X0 + x * (X1 - X0);
const py = (y: number) => Y0 - y * HEIGHT;

export function BezierEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const points = parseBezier(value);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = React.useState<0 | 1 | null>(null);
  const [manual, setManual] = React.useState("");
  React.useEffect(() => setManual(serializeBezier(points)), [value]);

  function updateHandle(
    index: 0 | 1,
    event: React.PointerEvent<SVGCircleElement>
  ) {
    const svg = svgRef.current;
    if (!svg) return;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse()
    );
    const next: BezierPoints = [...points];
    next[index * 2] = clamp((point.x - X0) / (X1 - X0), 0, 1);
    next[index * 2 + 1] = clamp((Y0 - point.y) / HEIGHT, -1, 2);
    onChange(serializeBezier(next));
  }

  return (
    <div className="flex flex-col gap-2">
      <svg
        ref={svgRef}
        viewBox="0 0 320 238"
        className="w-full rounded-md border bg-background touch-none"
        role="img"
        aria-label="Interactive cubic bezier editor"
      >
        <rect
          x={X0}
          y={py(1)}
          width={X1 - X0}
          height={HEIGHT}
          fill="currentColor"
          opacity="0.025"
        />
        {[0, 0.25, 0.5, 0.75, 1].map((n) => (
          <React.Fragment key={n}>
            <line
              x1={px(n)}
              y1="22"
              x2={px(n)}
              y2="215"
              stroke="currentColor"
              opacity="0.09"
            />
            <line
              x1={X0}
              y1={py(n)}
              x2={X1}
              y2={py(n)}
              stroke="currentColor"
              opacity="0.09"
            />
          </React.Fragment>
        ))}
        <line
          x1={px(0)}
          y1={py(0)}
          x2={px(1)}
          y2={py(1)}
          stroke="currentColor"
          opacity="0.18"
          strokeDasharray="4 4"
        />
        <line
          x1={px(0)}
          y1={py(0)}
          x2={px(points[0])}
          y2={py(points[1])}
          stroke="currentColor"
          opacity="0.5"
          strokeWidth="1.5"
        />
        <line
          x1={px(1)}
          y1={py(1)}
          x2={px(points[2])}
          y2={py(points[3])}
          stroke="currentColor"
          opacity="0.5"
          strokeWidth="1.5"
        />
        <path
          d={`M ${px(0)} ${py(0)} C ${px(points[0])} ${py(points[1])}, ${px(
            points[2]
          )} ${py(points[3])}, ${px(1)} ${py(1)}`}
          fill="none"
          stroke="var(--primary, #3b82f6)"
          strokeWidth="3"
        />
        <circle cx={px(0)} cy={py(0)} r="4" fill="currentColor" />
        <circle cx={px(1)} cy={py(1)} r="4" fill="currentColor" />
        {([0, 1] as const).map((index) => (
          <circle
            key={index}
            cx={px(points[index * 2])}
            cy={py(points[index * 2 + 1])}
            r="9"
            fill="var(--background, white)"
            stroke="var(--primary, #3b82f6)"
            strokeWidth="3"
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={(event) => {
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging(index);
              updateHandle(index, event);
            }}
            onPointerMove={(event) => {
              if (dragging === index) updateHandle(index, event);
            }}
            onPointerUp={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId))
                event.currentTarget.releasePointerCapture(event.pointerId);
              setDragging(null);
            }}
            onPointerCancel={() => setDragging(null)}
          />
        ))}
        <text x={X0} y="231" fontSize="11" fill="currentColor" opacity="0.6">
          0
        </text>
        <text
          x={X1}
          y="231"
          textAnchor="end"
          fontSize="11"
          fill="currentColor"
          opacity="0.6"
        >
          1
        </text>
      </svg>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <span className="text-muted-foreground">
          P1: {points[0].toFixed(2)}, {points[1].toFixed(2)}
        </span>
        <span className="text-right text-muted-foreground">
          P2: {points[2].toFixed(2)}, {points[3].toFixed(2)}
        </span>
      </div>
      <label className="flex flex-col gap-1 text-xs">
        CSS cubic-bezier
        <input
          className="h-8 w-full rounded-md border bg-background px-2 font-mono text-xs"
          value={manual}
          onChange={(event) => setManual(event.target.value)}
          onBlur={() => {
            const parsed = parseBezier(manual);
            if (/^cubic-bezier\(/.test(manual.trim()))
              onChange(serializeBezier(parsed));
            else setManual(serializeBezier(points));
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
        />
      </label>
      <span className="text-[11px] text-muted-foreground">
        Drag the handles. X is limited to 0–1; Y allows overshoot.
      </span>
    </div>
  );
}
