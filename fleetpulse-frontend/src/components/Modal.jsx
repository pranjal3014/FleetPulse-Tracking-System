import { X } from 'lucide-react'
export default function Modal({ title, subtitle, open, onClose, children }) {
  if (!open) return null
  return <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 p-4 backdrop-blur-sm" onMouseDown={onClose}><div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-0" onMouseDown={(e) => e.stopPropagation()}><div className="flex items-start justify-between border-b p-5"><div><h2 className="font-display text-xl font-bold">{title}</h2>{subtitle && <p className="mt-1 text-sm text-stone-500">{subtitle}</p>}</div><button className="rounded-lg p-1 hover:bg-stone-100 dark:hover:bg-white/10" onClick={onClose}><X /></button></div><div className="p-5">{children}</div></div></div>
}
