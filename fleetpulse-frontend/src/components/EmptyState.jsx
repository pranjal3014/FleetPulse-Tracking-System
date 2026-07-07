import { Inbox } from 'lucide-react'
export default function EmptyState({ title = 'Nothing here yet', text = 'New records will appear here.' }) {
  return <div className="grid min-h-52 place-items-center text-center"><div><Inbox className="mx-auto text-stone-300" size={38} /><h3 className="mt-3 font-semibold">{title}</h3><p className="mt-1 text-sm text-stone-500">{text}</p></div></div>
}
