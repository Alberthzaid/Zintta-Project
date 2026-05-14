export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="border border-dashed border-[#3a2730] rounded-2xl py-16 px-8 flex flex-col items-center justify-center text-center gap-3">
      <div className="size-16 rounded-full bg-[#ff1a88]/10 flex items-center justify-center mb-2">
        <span className="material-symbols-outlined text-[#ff1a88]" style={{ fontSize: '32px' }}>
          {icon}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-white/40 max-w-md">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
