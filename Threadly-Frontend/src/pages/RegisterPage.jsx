import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { auth, input, btn, text } from '../styles/common'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault(); setError('')
    if (!form.name || !form.username || !form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await register(form.name, form.username, form.email, form.password);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } })
    }
    catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    }
    finally { setLoading(false) }
  }

  const fields = [
    { name: 'name',     label: 'Full Name', type: 'text',     ph: 'Enter your full name' },
    { name: 'username', label: 'Username',  type: 'text',     ph: 'Enter your username' },
    { name: 'email',    label: 'Email',     type: 'email',    ph: 'Enter your email' },
    { name: 'password', label: 'Password',  type: 'password', ph: 'Enter your password' },
  ]

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 sm:p-5">
      <div className={`${auth.card} mx-auto`}>
        <div className="mb-6 sm:mb-7">
          <span className={auth.logo}>thread<span className="text-bark">ly</span></span>
          <h2 className={auth.title}>Create your account</h2>
          <p className={auth.subtitle}>Join the conversation today</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-3.5">
          {fields.map(f => (
            <div key={f.name}>
              <label className={text.label}>{f.label}</label>
              <input name={f.name} type={f.type} value={form[f.name]} placeholder={f.ph}
                onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                className={input.base} />
            </div>
          ))}
          {error && <div className={input.errorMsg}>{error}</div>}
          <button type="submit" disabled={loading} className={`${btn.primaryLg} mt-1`}>
            {loading && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
            Create Account
          </button>
        </form>
        <p className={auth.divider}>
          Already have an account? <Link to="/login" className={text.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
