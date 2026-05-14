interface Props {
  testId?: string
  variant?: 'primary' | 'ghost' | 'danger' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  children?: React.ReactNode
  fullWidth?: boolean
  className?: string
}

const variants = {
  primary:
    'bg-[#ff1a88] hover:bg-[#ff1a88]/90 text-white shadow-lg shadow-[#ff1a88]/20 hover:shadow-[#ff1a88]/30',
  ghost:
    'bg-transparent border border-[#3a2730] hover:bg-white/5 text-white',
  danger:
    'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20',
  subtle:
    'bg-white/5 hover:bg-white/10 text-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export default function Button({
  testId,
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  type = 'button',
  disabled,
  onClick,
  children,
  fullWidth,
  className = '',
}: Props) {
  return (
    <button
      data-testid={testId}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`font-bold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {loading ? (
        <span
          className="material-symbols-outlined animate-spin"
          style={{ fontSize: '18px' }}
        >
          progress_activity
        </span>
      ) : (
        icon && (
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            {icon}
          </span>
        )
      )}
      {children && <span>{children}</span>}
    </button>
  )
}
