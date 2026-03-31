export default function VerifiedBadge({ size=14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{marginLeft:3,flexShrink:0}}>
      <circle cx="12" cy="12" r="12" fill="#c2603b"/>
      <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}
