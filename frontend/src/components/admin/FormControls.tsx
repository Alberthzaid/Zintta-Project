import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold uppercase tracking-widest text-white/60">
        {label}
      </span>
      {children}
      {hint && !error && <span className="text-xs text-white/40 block">{hint}</span>}
      {error && (
        <span data-testid="field-error" className="text-xs text-[#ff1a88] block">
          {error}
        </span>
      )}
    </label>
  )
}

const base =
  'w-full bg-black/40 border border-[#3a2730] rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff1a88] focus:ring-2 focus:ring-[#ff1a88]/20 transition-all'

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${base} ${props.className ?? ''}`} />
}

export function NumberInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="number" step="0.01" {...props} className={`${base} ${props.className ?? ''}`} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${base} ${props.className ?? ''}`} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${base} appearance-none cursor-pointer ${props.className ?? ''}`}
    />
  )
}
