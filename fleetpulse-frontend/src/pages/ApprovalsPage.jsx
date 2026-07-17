import { useCallback, useEffect, useState } from 'react'
import { Check, LoaderCircle, RefreshCw, UserCheck, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '../api/services'
import { messageFromError } from '../api/client'
import EmptyState from '../components/EmptyState'

export default function ApprovalsPage() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(null)
  const load = useCallback(async () => { setLoading(true); try { setDrivers((await authApi.pendingDrivers()).data) } catch (e) { toast.error(messageFromError(e)) } finally { setLoading(false) } }, [])
  useEffect(() => { load() }, [load])
  const decide = async (id, approved) => {
    setActing(id)
    try {
      await (approved ? authApi.approveDriver(id) : authApi.rejectDriver(id))
      setDrivers((items) => items.filter((item) => item.userId !== id))
      toast.success(approved ? 'Driver approved' : 'Application rejected')
    } catch (e) { toast.error(messageFromError(e)) } finally { setActing(null) }
  }
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between"><div><h2 className="font-display text-3xl font-extrabold tracking-tight">Driver approvals</h2><p className="mt-2 text-stone-500">Review new drivers before they enter operations.</p></div><button className="btn-secondary" onClick={load}><RefreshCw size={16} /> Refresh</button></div>
      <div className="card p-0">
        {loading ? <div className="grid min-h-64 place-items-center"><LoaderCircle className="animate-spin text-pine" /></div> : drivers.length === 0 ? <EmptyState title="Queue clear" text="There are no pending driver applications." /> :
          <div className="divide-y">{drivers.map((driver) => <article className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center" key={driver.userId}><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-pine/10 text-pine dark:bg-lime/10 dark:text-lime"><UserCheck /></div><div className="min-w-0 flex-1"><h3 className="font-semibold">{driver.name}</h3><p className="truncate text-sm text-stone-500">{driver.email}</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">PENDING</span><div className="flex gap-2"><button className="btn-secondary text-red-600" disabled={acting === driver.userId} onClick={() => decide(driver.userId, false)}><X size={16} /> Reject</button><button className="btn-primary py-2.5" disabled={acting === driver.userId} onClick={() => decide(driver.userId, true)}>{acting === driver.userId ? <LoaderCircle className="animate-spin" size={16} /> : <Check size={16} />} Approve</button></div></article>)}</div>}
      </div>
    </div>
  )
}
