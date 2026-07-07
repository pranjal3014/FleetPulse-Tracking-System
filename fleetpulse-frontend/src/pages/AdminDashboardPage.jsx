import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowRight, BusFront, CheckCircle2, Clock3, MapPinned,
  RefreshCw, Route, ShieldCheck, TrendingUp, UserRoundCheck, Wrench,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi, tripApi, vehicleApi } from '../api/services'
import { messageFromError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

const statusColors = {
  COMPLETED: 'bg-emerald-400',
  IN_PROGRESS: 'bg-blue-400',
  SCHEDULED: 'bg-amber-400',
  CANCELLED: 'bg-red-400',
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState({ trips: [], vehicles: [], pending: [] })
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const results = await Promise.allSettled([
      tripApi.all(),
      vehicleApi.all(),
      authApi.pendingDrivers(),
    ])
    setData({
      trips: results[0].status === 'fulfilled' ? results[0].value.data : [],
      vehicles: results[1].status === 'fulfilled' ? results[1].value.data : [],
      pending: results[2].status === 'fulfilled' ? results[2].value.data : [],
    })
    const failed = results.find((result) => result.status === 'rejected')
    if (failed) toast.error(messageFromError(failed.reason))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const metrics = useMemo(() => {
    const count = (status) => data.trips.filter((trip) => trip.tripStatus === status).length
    const activeVehicles = data.vehicles.filter((vehicle) => vehicle.vehicleStatus === 'ACTIVE').length
    return {
      activeTrips: count('IN_PROGRESS'),
      scheduled: count('SCHEDULED'),
      completed: count('COMPLETED'),
      cancelled: count('CANCELLED'),
      activeVehicles,
      utilization: data.vehicles.length ? Math.round((activeVehicles / data.vehicles.length) * 100) : 0,
    }
  }, [data])

  const distribution = [
    ['IN_PROGRESS', metrics.activeTrips],
    ['SCHEDULED', metrics.scheduled],
    ['COMPLETED', metrics.completed],
    ['CANCELLED', metrics.cancelled],
  ]
  const totalTrips = Math.max(data.trips.length, 1)
  const today = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[1.75rem] bg-ink p-6 text-white sm:p-8">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[52px] border-lime/[.08]" />
        <div className="absolute bottom-0 right-1/4 h-20 w-20 rounded-t-full bg-lime/[.06]" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-lime">
              <Activity size={14} /> Operations command center
            </div>
            <h2 className="max-w-2xl font-display text-3xl font-extrabold tracking-[-.045em] sm:text-5xl">
              Morning, {user.name?.split(' ')[0]}.<br />
              <span className="text-stone-400">Your fleet is in motion.</span>
            </h2>
            <p className="mt-4 text-sm text-stone-400">{today} · Live operational summary</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={load} disabled={loading} className="btn-secondary border-white/15 bg-white/10 text-white hover:bg-white/15 dark:bg-white/10">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <Link to="/tracking" className="btn-primary bg-lime text-ink hover:bg-[#d6ff72]">
              <MapPinned size={17} /> Open live map
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Activity} label="Trips in progress" value={metrics.activeTrips} note={`${metrics.scheduled} scheduled next`} tone="lime" />
        <MetricCard icon={BusFront} label="Active vehicles" value={`${metrics.activeVehicles}/${data.vehicles.length}`} note={`${metrics.utilization}% fleet availability`} tone="green" />
        <MetricCard icon={UserRoundCheck} label="Pending drivers" value={data.pending.length} note={data.pending.length ? 'Review required' : 'Approval queue clear'} tone="amber" />
        <MetricCard icon={CheckCircle2} label="Completed trips" value={metrics.completed} note={`${data.trips.length} total assignments`} tone="blue" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_.75fr]">
        <article className="card overflow-hidden p-0">
          <header className="flex items-center justify-between border-b p-5 sm:p-6">
            <div>
              <h3 className="font-display text-xl font-bold">Trip activity</h3>
              <p className="mt-1 text-sm text-stone-500">Current workload by status</p>
            </div>
            <TrendingUp className="text-pine dark:text-lime" />
          </header>
          <div className="grid gap-8 p-5 sm:grid-cols-[1fr_180px] sm:p-6">
            <div className="space-y-5">
              {distribution.map(([status, value]) => (
                <div key={status}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-semibold">{status.replace('_', ' ')}</span>
                    <span className="text-stone-500">{value}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-stone-100 dark:bg-white/10">
                    <div className={`h-full rounded-full transition-all ${statusColors[status]}`} style={{ width: `${Math.max((value / totalTrips) * 100, value ? 8 : 0)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid place-items-center">
              <div className="relative grid h-36 w-36 place-items-center rounded-full" style={{ background: `conic-gradient(#c8f55a 0 ${metrics.utilization}%, rgba(120,113,108,.15) ${metrics.utilization}% 100%)` }}>
                <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center dark:bg-[#131e1a]">
                  <div><p className="font-display text-3xl font-extrabold">{metrics.utilization}%</p><p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Available</p></div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="card p-0">
          <header className="border-b p-5 sm:p-6">
            <h3 className="font-display text-xl font-bold">Quick actions</h3>
            <p className="mt-1 text-sm text-stone-500">Keep operations moving</p>
          </header>
          <div className="space-y-2 p-3">
            <QuickAction to="/approvals" icon={ShieldCheck} title="Review drivers" detail={`${data.pending.length} waiting`} accent="bg-amber-100 text-amber-700" />
            <QuickAction to="/vehicles" icon={BusFront} title="Manage vehicles" detail={`${data.vehicles.length} registered`} accent="bg-emerald-100 text-emerald-700" />
            <QuickAction to="/trips" icon={Route} title="Assign a trip" detail={`${metrics.scheduled} scheduled`} accent="bg-blue-100 text-blue-700" />
            <QuickAction to="/tracking" icon={MapPinned} title="Track fleet" detail={`${metrics.activeTrips} moving now`} accent="bg-lime text-ink" />
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_.75fr]">
        <article className="card overflow-hidden p-0">
          <header className="flex items-center justify-between border-b p-5 sm:p-6">
            <div><h3 className="font-display text-xl font-bold">Latest assignments</h3><p className="mt-1 text-sm text-stone-500">Most recent routes across the fleet</p></div>
            <Link to="/trips" className="flex items-center gap-1 text-sm font-bold text-pine dark:text-lime">All trips <ArrowRight size={15} /></Link>
          </header>
          {data.trips.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-400 dark:bg-white/[.03]"><tr><th className="px-5 py-3">Route</th><th className="px-5 py-3">Driver</th><th className="px-5 py-3">Vehicle</th><th className="px-5 py-3">Status</th></tr></thead>
                <tbody>{data.trips.slice(0, 5).map((trip) => (
                  <tr key={trip.tripId} className="border-t">
                    <td className="px-5 py-4"><p className="max-w-[230px] truncate font-semibold">{trip.pickupLocation}</p><p className="mt-1 max-w-[230px] truncate text-xs text-stone-500">to {trip.destinationLocation}</p></td>
                    <td className="px-5 py-4 text-stone-600 dark:text-stone-300">{trip.drivername}</td>
                    <td className="px-5 py-4 font-medium">{trip.vehicleNumber}</td>
                    <td className="px-5 py-4"><StatusBadge value={trip.tripStatus} /></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          ) : <EmptyState title="No trip assignments yet" text="Create a trip to populate your operations feed." />}
        </article>

        <article className="card p-0">
          <header className="flex items-center justify-between border-b p-5 sm:p-6">
            <div><h3 className="font-display text-xl font-bold">Fleet health</h3><p className="mt-1 text-sm text-stone-500">Vehicle readiness</p></div>
            <Wrench size={19} className="text-stone-400" />
          </header>
          <div className="space-y-3 p-5">
            {data.vehicles.slice(0, 5).map((vehicle) => (
              <div key={vehicle.vehicleId} className="flex items-center gap-3 rounded-xl border p-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-pine/10 text-pine dark:bg-lime/10 dark:text-lime"><BusFront size={18} /></div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{vehicle.vehicleNumber}</p><p className="text-xs text-stone-500">{vehicle.vehicleType}</p></div>
                <StatusBadge value={vehicle.vehicleStatus} />
              </div>
            ))}
            {!data.vehicles.length && <EmptyState title="No vehicles yet" text="Add vehicles to monitor fleet readiness." />}
          </div>
        </article>
      </section>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, note, tone }) {
  const tones = {
    lime: 'bg-lime text-ink',
    green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-300',
  }
  return (
    <article className="card group transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between"><div className={`grid h-11 w-11 place-items-center rounded-2xl ${tones[tone]}`}><Icon size={20} /></div><ArrowRight size={17} className="text-stone-300 transition group-hover:translate-x-1" /></div>
      <p className="mt-6 font-display text-4xl font-extrabold tracking-[-.05em]">{value}</p>
      <p className="mt-1 text-sm font-semibold">{label}</p>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-stone-500"><Clock3 size={12} /> {note}</p>
    </article>
  )
}

function QuickAction({ to, icon: Icon, title, detail, accent }) {
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-2xl p-3 transition hover:bg-stone-50 dark:hover:bg-white/5">
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${accent}`}><Icon size={19} /></div>
      <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{title}</p><p className="text-xs text-stone-500">{detail}</p></div>
      <ArrowRight size={16} className="text-stone-300 transition group-hover:translate-x-1" />
    </Link>
  )
}
