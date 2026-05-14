import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, configured } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <span
          className="material-symbols-outlined animate-spin text-[#ff1a88]"
          style={{ fontSize: '36px' }}
        >
          progress_activity
        </span>
      </div>
    )
  }
  if (!configured) {
    return <Navigate to="/dashboard-admin/login" replace />
  }
  if (!user) {
    return <Navigate to="/dashboard-admin/login" replace />
  }
  return <>{children}</>
}
