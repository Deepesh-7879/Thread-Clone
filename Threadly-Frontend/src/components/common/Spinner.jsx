import { misc } from '../../styles/common'
export default function Spinner({ size=32, center=false }) {
  const el = <div className={misc.spinner} style={{width:size,height:size,borderWidth:Math.max(2,size/14)}}/>
  if (center) return <div className="flex justify-center items-center py-12">{el}</div>
  return el
}
