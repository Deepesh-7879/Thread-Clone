import { useNavigate } from 'react-router-dom'
import { navbar, text } from '../../styles/common'
export default function Navbar({ title, showBack = false, rightElement }) {
  const navigate = useNavigate()
  return (
    <div className={navbar.wrapper}>
      {showBack && (
        <button className={navbar.backBtn} onClick={() => navigate(-1)}>←</button>
      )}
      <h1 className={`${text.pageTitle} flex-1 truncate`}>{title}</h1>
      {rightElement && <div className="shrink-0">{rightElement}</div>}
    </div>
  )
}
