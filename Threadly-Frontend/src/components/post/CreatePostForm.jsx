import { useState, useRef } from 'react'
import Avatar from '../common/Avatar'
import { uploadImage } from '../../utils/uploadImage'
import { useAuth } from '../../hooks/useAuth'
import { input, btn, text, misc } from '../../styles/common'

const MAX = 280

export default function CreatePostForm({ onPost }) {
  const { user } = useAuth()
  const [txt, setTxt] = useState('')
  const [img, setImg] = useState(null)
  const [preview, setPreview] = useState(null)
  const [sub, setSub] = useState(false)
  const [err, setErr] = useState('')
  const [focused, setFocused] = useState(false)
  const fileRef = useRef()

  const handleImg = async e => {
    const file = e.target.files[0]; if (!file) return
    try { const url = await uploadImage(file); setImg(file); setPreview(url); setErr('') }
    catch (ex) { setErr(ex.message) }
  }
  const handleSubmit = async e => {
    e.preventDefault()
    if (!txt.trim() && !img) return
    if (txt.length > MAX) return
    setSub(true)
    await onPost?.(txt.trim(), img)
    setTxt(''); setImg(null); setPreview(null); setFocused(false); setSub(false)
  }

  const rem = MAX - txt.length
  const over = rem < 0
  const near = rem <= 20 && rem >= 0
  if (!user) return null

  return (
    <form onSubmit={handleSubmit} className="px-3 sm:px-5 py-3.5 sm:py-4 border-b border-cream-border bg-cream">
      <div className="flex gap-2.5 sm:gap-3">
        <Avatar user={user} size="md" />
        <div className="flex-1 min-w-0">
          <textarea value={txt} onChange={e => setTxt(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="What's on your mind?"
            rows={focused ? 3 : 2}
            className={input.compose} />

          {preview && (
            <div className="relative mb-2.5">
              <img src={preview} alt="" className="w-full max-h-48 sm:max-h-56 object-cover rounded-xl sm:rounded-2xl border border-cream-border" />
              <button type="button" onClick={() => { setImg(null); setPreview(null) }}
                className="absolute top-2 right-2 w-6 h-6 bg-ink/55 text-white rounded-full text-[13px] flex items-center justify-center border-0 cursor-pointer">✕</button>
            </div>
          )}
          {err && <p className={text.error + ' mt-1'}>{err}</p>}

          {(focused || txt || preview) && (
            <div className="flex items-center justify-between pt-2.5 border-t border-cream-border mt-2">
              <div>
                <button type="button" onClick={() => fileRef.current.click()}
                  className="text-accent text-xl p-1.5 rounded-xl hover:bg-accent-light transition-colors border-0 bg-transparent cursor-pointer">🖼</button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} className="hidden" />
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {txt.length > 0 && (
                  <span className={`text-xs font-semibold ${over ? 'text-red-600' : near ? 'text-amber-600' : 'text-ink-muted'}`}>{rem}</span>
                )}
                <button type="submit" disabled={(!txt.trim() && !img) || over || sub} className={btn.composePost}>
                  {sub && <span className={misc.spinnerSm} />}
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
