import { av } from '../../styles/common'
const PALETTE = ['#c2603b','#3b7ac2','#3b8c5a','#8c3b7a','#7a8c3b','#3b6e8c']
function getColor(str='') { let h=0; for(let i=0;i<str.length;i++) h=str.charCodeAt(i)+((h<<5)-h); return PALETTE[Math.abs(h)%PALETTE.length] }
function getInitials(name='') { return name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase() }
export default function Avatar({ user, size='md', className='' }) {
  const color = getColor(user?.username || user?._id || '')
  return (
    <div className={`${av[size]||av.md} ${className}`}
      style={{ backgroundColor:color+'18', borderColor:color+'44', color, fontFamily:'var(--font-family-sans)' }}>
      {getInitials(user?.name||'')}
    </div>
  )
}
