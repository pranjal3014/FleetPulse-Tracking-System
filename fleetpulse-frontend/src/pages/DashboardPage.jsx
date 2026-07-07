import { useEffect, useState } from 'react'
import { Activity, ArrowUpRight, BusFront, CheckCircle2, Clock3, Route } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi, tripApi, vehicleApi } from '../api/services'
import StatusBadge from '../components/StatusBadge'
import AdminDashboardPage from './AdminDashboardPage'

export default function DashboardPage() {
  const { user } = useAuth()
  if (user.role === 'ADMIN') return <AdminDashboardPage />
  return <DriverDashboard />
}

function DriverDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState({ trips: [], vehicles: [], pending: [] })
  useEffect(() => {
    const calls = [tripApi.all()]
    Promise.allSettled(calls).then((result) => setData({
      trips: result[0]?.value?.data || [],
      vehicles: result[1]?.value?.data || [],
      pending: result[2]?.value?.data || [],
    }))
  }, [user.role])
  const active = data.trips.filter((t) => t.tripStatus === 'IN_PROGRESS').length
  const scheduled = data.trips.filter((t) => t.tripStatus === 'SCHEDULED').length
  const stats = [{ label: 'Active trip', value: active, icon: Activity, tone: 'bg-lime' }, { label: 'Upcoming trips', value: scheduled, icon: Clock3, tone: 'bg-amber-100' }, { label: 'Completed', value: data.trips.filter((t) => t.tripStatus === 'COMPLETED').length, icon: CheckCircle2, tone: 'bg-emerald-100' }]
  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-stone-500">Monday, 6 July</p><h2 className="mt-1 font-display text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">Good to see you, {user.name?.split(' ')[0]}.</h2><p className="mt-2 text-stone-500">Here’s the current pulse of your fleet.</p></div><Link to="/tracking" className="btn-primary">Open live map <ArrowUpRight size={17} /></Link></section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => <article className="card" key={label}><div className={`grid h-10 w-10 place-items-center rounded-xl text-ink ${tone}`}><Icon size={19} /></div><p className="mt-6 font-display text-4xl font-extrabold tracking-tight">{value}</p><p className="mt-1 text-sm text-stone-500">{label}</p></article>)}
      </section>
      <section className="card overflow-hidden p-0"><div className="flex items-center justify-between border-b p-5"><div><h3 className="font-display text-lg font-bold">Recent trips</h3><p className="text-sm text-stone-500">Latest movement across the network</p></div><Link to="/trips" className="text-sm font-bold text-pine dark:text-lime">View all</Link></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="text-xs uppercase tracking-wider text-stone-400"><tr><th className="px-5 py-4">Route</th><th className="px-5 py-4">Driver</th><th className="px-5 py-4">Vehicle</th><th className="px-5 py-4">Status</th></tr></thead><tbody>{data.trips.slice(0, 5).map((trip) => <tr className="border-t" key={trip.tripId}><td className="px-5 py-4 font-semibold">{trip.pickupLocation} <span className="mx-2 text-stone-300">→</span> {trip.destinationLocation}</td><td className="px-5 py-4 text-stone-500">{trip.drivername}</td><td className="px-5 py-4">{trip.vehicleNumber}</td><td className="px-5 py-4"><StatusBadge value={trip.tripStatus} /></td></tr>)}</tbody></table></div>
      </section>
    </div>
  )
}
