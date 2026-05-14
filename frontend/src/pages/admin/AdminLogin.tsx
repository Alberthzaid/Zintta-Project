import { FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Field, TextInput } from '../../components/admin/FormControls'
import Button from '../../components/admin/Button'

export default function AdminLogin() {
  const { user, signIn, configured, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!loading && user) {
    return <Navigate to="/dashboard-admin" replace />
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error: err } = await signIn(email, password)
    setSubmitting(false)
    if (err) setError(err)
    else navigate('/dashboard-admin', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Glow background */}
      <div
        className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ff1a88, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #D4AF37, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="size-11 bg-[#ff1a88] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff1a88]/30">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontSize: '26px' }}
              >
                layers
              </span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold tracking-tighter text-white">ZINTTA</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff1a88]">
                Panel administrativo
              </p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
            Inicia sesión
          </h2>
          <p className="text-sm text-white/50">Solo personal autorizado</p>
        </div>

        {!configured && (
          <div
            data-testid="config-warning"
            className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm"
          >
            <strong className="block mb-1">Supabase no está configurado</strong>
            Completa <code className="bg-black/30 px-1.5 py-0.5 rounded text-xs">
              VITE_SUPABASE_URL
            </code>{' '}
            y{' '}
            <code className="bg-black/30 px-1.5 py-0.5 rounded text-xs">
              VITE_SUPABASE_ANON_KEY
            </code>{' '}
            en <code className="bg-black/30 px-1.5 py-0.5 rounded text-xs">
              /app/frontend/.env
            </code>{' '}
            y ejecuta el SQL de <code className="bg-black/30 px-1.5 py-0.5 rounded text-xs">
              /app/supabase/schema.sql
            </code>.
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl"
        >
          <Field label="Correo electrónico">
            <TextInput
              data-testid="login-email-input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@zintta.com"
            />
          </Field>

          <Field label="Contraseña">
            <TextInput
              data-testid="login-password-input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          {error && (
            <div
              data-testid="login-error"
              className="text-sm text-[#ff1a88] bg-[#ff1a88]/5 border border-[#ff1a88]/20 px-4 py-3 rounded-lg"
            >
              {error}
            </div>
          )}

          <Button
            testId="login-submit-btn"
            type="submit"
            loading={submitting}
            disabled={!configured}
            fullWidth
            size="lg"
            icon="login"
          >
            Entrar al panel
          </Button>
        </form>

        <p className="text-center mt-8 text-xs text-white/40">
          ¿Olvidaste tu contraseña? Recupérala desde el dashboard de Supabase.
        </p>
      </div>
    </div>
  )
}
