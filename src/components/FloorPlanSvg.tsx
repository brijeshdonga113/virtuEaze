type FloorPlanSvgProps = { className?: string };

export default function FloorPlanSvg({ className = "" }: FloorPlanSvgProps) {
  return (
    <svg viewBox="0 0 440 320" className={className} fill="none">
      <rect x={20} y={20} width={400} height={280} stroke="#c9a44c" strokeWidth={4} />

      <line x1={260} y1={20} x2={260} y2={300} stroke="#c9a44c" strokeWidth={2} />
      <line x1={260} y1={100} x2={420} y2={100} stroke="#c9a44c" strokeWidth={2} />
      <line x1={260} y1={200} x2={420} y2={200} stroke="#c9a44c" strokeWidth={2} />
      <line x1={20} y1={180} x2={260} y2={180} stroke="#c9a44c" strokeWidth={2} />

      <rect
        x={0}
        y={20}
        width={20}
        height={160}
        stroke="#c9a44c"
        strokeWidth={2}
        strokeDasharray="4 3"
      />

      <path
        d="M120 300 L120 266 A34 34 0 0 1 154 300"
        stroke="#c9a44c"
        strokeWidth={1.5}
        opacity={0.6}
      />
      <line x1={100} y1={300} x2={140} y2={300} stroke="#0a0a0a" strokeWidth={4} />

      <text x={90} y={102} fontSize={11} letterSpacing={2} fill="#f2f0ea">
        LIVING ROOM
      </text>
      <text x={300} y={64} fontSize={11} letterSpacing={2} fill="#f2f0ea">
        KITCHEN
      </text>
      <text x={293} y={154} fontSize={11} letterSpacing={2} fill="#f2f0ea">
        BEDROOM
      </text>
      <text x={308} y={222} fontSize={10} letterSpacing={2} fill="#f2f0ea">
        BATH
      </text>
      <text x={60} y={245} fontSize={11} letterSpacing={2} fill="#f2f0ea">
        MASTER BEDROOM
      </text>
      <text x={0} y={104} fontSize={9} letterSpacing={2} fill="#f2f0ea" opacity={0.6}>
        BALCONY
      </text>
    </svg>
  );
}
