import { ReactNode } from 'react'

interface Props {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export default function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = 'md',
}: Props) {
  if (!open) return null
  const maxW = size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-3xl' : 'max-w-lg'
  return (
    <div
      data-testid="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div
        className={`w-full ${maxW} bg-[#181014] border border-[#3a2730] rounded-2xl shadow-2xl flex flex-col overflow-hidden`}
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#3a2730]">
          <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
          <button
            data-testid="modal-close-btn"
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors size-8 flex items-center justify-center rounded-lg hover:bg-white/5"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              close
            </span>
          </button>
        </header>
        <div className="p-6 overflow-y-auto custom-scrollbar max-h-[70vh]">{children}</div>
        {footer && (
          <footer className="px-6 py-4 border-t border-[#3a2730] bg-black/20 flex items-center justify-end gap-3">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}
