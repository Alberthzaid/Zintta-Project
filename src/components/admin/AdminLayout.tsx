import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/dashboard-admin', label: 'Resumen', icon: 'space_dashboard', end: true },
  { to: '/dashboard-admin/categorias', label: 'Categorías', icon: 'category' },
  { to: '/dashboard-admin/tallas', label: 'Tallas', icon: 'straighten' },
  { to: '/dashboard-admin/productos', label: 'Productos', icon: 'checkroom' },
  { to: '/dashboard-admin/historial', label: 'Historial', icon: 'history' },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const onLogout = async () => {
    await signOut()
    navigate('/dashboard-admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-[#3a2730] bg-black/40 flex flex-col">
        <div className="px-6 py-7 border-b border-[#3a2730]">
          <button
            data-testid="admin-logo-btn"
            onClick={() => navigate('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="size-9 bg-[#ff1a88] rounded-lg flex items-center justify-center">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontSize: '22px' }}
              >
                layers
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-bold tracking-tighter text-white">
                ZINTTA
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff1a88]">
                Admin
              </span>
            </div>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              data-testid={`sidebar-link-${item.label.toLowerCase()}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#ff1a88]/10 text-[#ff1a88] border border-[#ff1a88]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#3a2730] space-y-3">
          <div className="px-4 py-3 bg-white/5 rounded-xl">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
              Sesión
            </p>
            <p
              data-testid="admin-user-email"
              className="text-sm font-medium text-white truncate"
            >
              {user?.email ?? '—'}
            </p>
          </div>
          <button
            data-testid="admin-logout-btn"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-red-600/10 hover:border-red-600/30 border border-transparent transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              logout
            </span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-10 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
