// Redrawn from miramare.ro/wp-content/uploads/2020/03/logo-miramare-01.png (193×52).
// Double-line M mark + wordmark; paths use pathLength=1 so the intro can draw them.
export default function Logo({ className }) {
  const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'miter', pathLength: 1 }
  return (
    <svg className={className} viewBox="0 0 193 52" role="img" aria-label="Miramare Residence, Mamaia Nord">
      <g className="logo-mark">
        <path className="logo-line" {...line} d="M74 43V1l21.5 19.5L117 1v42" />
        <path className="logo-line" {...line} d="M78 43V13l17.5 14L113 13v30" />
      </g>
      <g className="logo-type" fill="currentColor" fontFamily="Archivo" fontWeight="800" style={{ fontStretch: '100%' }}>
        <text className="t-left" x="0" y="30" fontSize="10.5" textLength="65" lengthAdjust="spacingAndGlyphs">MIRAMARE</text>
        <text className="t-right" x="125" y="30" fontSize="10.5" textLength="68" lengthAdjust="spacingAndGlyphs">RESIDENCE</text>
        <text className="t-sub" x="95.5" y="51.5" fontSize="6.6" textAnchor="middle" textLength="46" lengthAdjust="spacingAndGlyphs">MAMAIA NORD</text>
      </g>
    </svg>
  )
}
