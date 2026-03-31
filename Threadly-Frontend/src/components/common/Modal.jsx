import { useEffect } from 'react'
import { modal, text } from '../../styles/common'

export default function Modal({ isOpen, onClose, title, children, width = 520 }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className={modal.overlay} onClick={onClose}>
      {/* On mobile: full-width sheet from bottom. On sm+: centered card */}
      <div className={modal.panel}
        style={{ maxWidth: window.innerWidth >= 640 ? width : '100%' }}
        onClick={e => e.stopPropagation()}>
        {/* Drag handle on mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-sand" />
        </div>
        <div className={modal.header}>
          <h2 className={text.h3}>{title}</h2>
          <button className={modal.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={modal.body}>{children}</div>
      </div>
    </div>
  )
}
