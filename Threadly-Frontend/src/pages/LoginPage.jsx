import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { auth, input, btn, text } from '../styles/common'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message)
    }
  }, [location.state])

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setSuccess('')
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try { await login(form.email, form.password); navigate('/') }
    catch (err) { setError(err.message || 'Login failed. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 sm:p-5">
      <div className="flex w-full max-w-225 gap-16 items-center">
        {/* Branding — only on large screens */}
        <div className="flex-1 hidden lg:flex flex-col gap-6">
          <span className={auth.logo}>thread<span className="text-bark">ly</span></span>
          <p className="font-display text-xl xl:text-2xl font-light italic text-ink-light leading-relaxed">
            Share your thoughts, connect with the world.
          </p>
          {['Post and discover ideas', 'Follow people you love', 'Join the conversation'].map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
              <span className="text-[15px] text-ink-muted">{t}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className={`${auth.card} mx-auto`}>
          <div className="mb-6 sm:mb-7">
            <span className={auth.logo}>thread<span className="text-bark">ly</span></span>
            <h2 className={auth.title}>Welcome back</h2>
            <p className={auth.subtitle}>Sign in to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { name: 'email',    label: 'Email',    type: 'email',    ph: ' Enter your email' },
              { name: 'password', label: 'Password', type: 'password', ph: ' Enter your password(Min. 6 characters)' },
            ].map(f => (
              <div key={f.name}>
                <label className={text.label}>{f.label}</label>
                <input name={f.name} type={f.type} value={form[f.name]} placeholder={f.ph}
                  onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                  className={input.base} />
              </div>
            ))}
            {error && <div className={input.errorMsg}>{error}</div>}
            {success && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">{success}</div>}
            <button type="submit" disabled={loading} className={`${btn.primaryLg} mt-1`}>
              {loading && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
              Sign In
            </button>
          </form>
          <p className={auth.divider}>
            Don't have an account? <Link to="/register" className={text.link}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
