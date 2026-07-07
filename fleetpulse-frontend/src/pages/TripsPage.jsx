import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity, CalendarDays, CheckCircle2, Clock3, Eye, Filter, LoaderCircle,
  MapPin, Navigation, Play, Plus, RefreshCw, Route, Search, UserRound, XCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { driverApi, tripApi, vehicleApi } from '../api/services'
import { messageFromError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

const statuses = ['ALL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
const blank = { driverId: '', vehicleId: '', pickupLocation: '', destinationLocation: '', tripDate: '', tripTime: '' }

export default function TripsPage() {
  const { user } = useAuth()
  const isAdmin = user.role === 'ADMIN'
  const [trips, setTrips] = useState([])
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(blank)
  const [formOpen, setFormOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [routeInfo, setRouteInfo] = useState(null)
  const [cancelling, setCancelling] = useState(null)
  const [busy, setBusy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [date, setDate] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try { setTrips((await tripApi.all()).data) }
    catch (error) { toast.error(messageFromError(error)) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    load()
    if (isAdmin) {
      Promise.all([driverApi.all(), vehicleApi.all()])
        .then(([driverResponse, vehicleResponse]) => {
          setDrivers(driverResponse.data)
          setVehicles(vehicleResponse.data)
        })
        .catch((error) => toast.error(messageFromError(error)))
    }
  }, [load, isAdmin])

  const counts = useMemo(() => Object.fromEntries(statuses.slice(1).map((item) => [item, trips.filter((trip) => trip.tripStatus === item).length])), [trips])
  const filtered = useMemo(() => trips.filter((trip) => {
    const term = search.trim().toLowerCase()
    const searchable = `${trip.pickupLocation} ${trip.destinationLocation} ${trip.drivername} ${trip.vehicleNumber}`.toLowerCase()
    return (!term || searchable.includes(term)) && (status === 'ALL' || trip.tripStatus === status) && (!date || trip.tripDate === date)
  }).sort((a, b) => `${b.tripDate}T${b.tripTime}`.localeCompare(`${a.tripDate}T${a.tripTime}`)), [trips, search, status, date])

  const submit = async (event) => {
    event.preventDefault()
    setBusy('create')
    try {
      const body = {
        ...form,
        driverId: Number(form.driverId),
        vehicleId: Number(form.vehicleId),
        pickupLocation: form.pickupLocation.trim(),
        destinationLocation: form.destinationLocation.trim(),
        tripTime: form.tripTime.length === 5 ? `${form.tripTime}:00` : form.tripTime,
      }
      const { data } = await tripApi.create(body)
      setTrips((current) => [data, ...current])
      setForm(blank)
      setFormOpen(false)
      toast.success('Trip assigned successfully')
    } catch (error) { toast.error(messageFromError(error)) }
    finally { setBusy(null) }
  }

  const start = async (trip) => {
    setBusy(`start-${trip.tripId}`)
    try {
      await tripApi.start(trip.tripId)
      setTrips((current) => current.map((item) => item.tripId === trip.tripId ? { ...item, tripStatus: 'IN_PROGRESS' } : item))
      toast.success('Trip is now live')
    } catch (error) { toast.error(messageFromError(error)) }
    finally { setBusy(null) }
  }

  const cancel = async () => {
    if (!cancelling) return
    setBusy(`cancel-${cancelling.tripId}`)
    try {
      await tripApi.remove(cancelling.tripId)
      setTrips((current) => current.map((item) => item.tripId === cancelling.tripId ? { ...item, tripStatus: 'CANCELLED' } : item))
      setCancelling(null)
      toast.success('Trip cancelled')
    } catch (error) { toast.error(messageFromError(error)) }
    finally { setBusy(null) }
  }

  const showDetails = async (trip) => {
    setSelected(trip)
    setRouteInfo(null)
    try { setRouteInfo((await tripApi.route(trip.tripId)).data) }
    catch { /* Route engine may be unavailable; trip details still remain useful. */ }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-clay"><Route size={14} /> Dispatch control</div>
          <h2 className="font-display text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">{isAdmin ? 'Trip management' : 'My trips'}</h2>
          <p className="mt-2 text-stone-500">{isAdmin ? 'Plan assignments and follow every journey through its lifecycle.' : 'Review assignments and begin scheduled journeys.'}</p>
        </div>
        <div className="flex gap-2"><button className="btn-secondary" onClick={load} disabled={loading}><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh</button>{isAdmin && <button className="btn-primary" onClick={() => setFormOpen(true)}><Plus size={17} /> Assign trip</button>}</div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Summary icon={Clock3} label="Scheduled" value={counts.SCHEDULED} color="bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300" />
        <Summary icon={Activity} label="In progress" value={counts.IN_PROGRESS} color="bg-lime text-ink" />
        <Summary icon={CheckCircle2} label="Completed" value={counts.COMPLETED} color="bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300" />
        <Summary icon={XCircle} label="Cancelled" value={counts.CANCELLED} color="bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-300" />
      </section>

      <section className="card p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_200px_190px]">
          <label className="relative"><Search className="absolute left-3.5 top-3 text-stone-400" size={18} /><input className="field pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search route, driver, or vehicle..." /></label>
          <label className="relative"><Filter className="absolute left-3.5 top-3 text-stone-400" size={17} /><select className="field pl-10" value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((item) => <option value={item} key={item}>{item === 'ALL' ? 'All statuses' : item.replace('_', ' ')}</option>)}</select></label>
          <input className="field" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        <div className="mt-3 flex justify-between text-xs text-stone-500"><span>Showing {filtered.length} of {trips.length} trips</span>{(search || status !== 'ALL' || date) && <button className="font-bold text-pine dark:text-lime" onClick={() => { setSearch(''); setStatus('ALL'); setDate('') }}>Clear filters</button>}</div>
      </section>

      <section className="card overflow-hidden p-0">
        {loading ? <TripSkeleton /> : filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-400 dark:bg-white/[.03]"><tr><th className="px-5 py-4">Trip</th><th className="px-5 py-4">Route</th><th className="px-5 py-4">Assignment</th><th className="px-5 py-4">Departure</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
              <tbody>{filtered.map((trip) => <TripRow key={trip.tripId} trip={trip} isAdmin={isAdmin} busy={busy} onStart={start} onCancel={setCancelling} onView={showDetails} />)}</tbody>
            </table>
          </div>
        ) : <EmptyState title={trips.length ? 'No matching trips' : 'No trips assigned'} text={trips.length ? 'Try clearing or changing the filters.' : 'New trip assignments will appear here.'} />}
      </section>

      <Modal open={formOpen} onClose={() => !busy && setFormOpen(false)} title="Assign a new trip" subtitle="Match one available driver and vehicle to a route.">
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label><span className="mb-2 block text-sm font-semibold">Driver</span><select className="field" required value={form.driverId} onChange={(event) => setForm({ ...form, driverId: event.target.value })}><option value="">Select driver</option>{drivers.map((driver) => <option value={driver.driverId} key={driver.driverId}>{driver.driverName}</option>)}</select></label>
            <label><span className="mb-2 block text-sm font-semibold">Vehicle</span><select className="field" required value={form.vehicleId} onChange={(event) => setForm({ ...form, vehicleId: event.target.value })}><option value="">Select vehicle</option>{vehicles.filter((vehicle) => vehicle.vehicleStatus === 'ACTIVE').map((vehicle) => <option value={vehicle.vehicleId} key={vehicle.vehicleId}>{vehicle.vehicleNumber} · {vehicle.vehicleType}</option>)}</select></label>
          </div>
          <div className="relative space-y-4 before:absolute before:bottom-6 before:left-[15px] before:top-6 before:border-l before:border-dashed before:border-stone-300">
            <label className="relative block pl-10"><span className="absolute left-0 top-9 h-3 w-3 rounded-full bg-pine ring-4 ring-pine/10 dark:bg-lime" /><span className="mb-2 block text-sm font-semibold">Pickup location</span><input className="field" required value={form.pickupLocation} onChange={(event) => setForm({ ...form, pickupLocation: event.target.value })} placeholder="Bengaluru, Karnataka" /></label>
            <label className="relative block pl-10"><span className="absolute left-0 top-9 h-3 w-3 rounded-full bg-clay ring-4 ring-clay/10" /><span className="mb-2 block text-sm font-semibold">Destination</span><input className="field" required value={form.destinationLocation} onChange={(event) => setForm({ ...form, destinationLocation: event.target.value })} placeholder="Mysuru, Karnataka" /></label>
          </div>
          <div className="grid grid-cols-2 gap-4"><label><span className="mb-2 block text-sm font-semibold">Departure date</span><input className="field" type="date" min={new Date().toISOString().slice(0, 10)} required value={form.tripDate} onChange={(event) => setForm({ ...form, tripDate: event.target.value })} /></label><label><span className="mb-2 block text-sm font-semibold">Departure time</span><input className="field" type="time" required value={form.tripTime} onChange={(event) => setForm({ ...form, tripTime: event.target.value })} /></label></div>
          <div className="flex gap-3 pt-2"><button type="button" className="btn-secondary flex-1" onClick={() => setFormOpen(false)} disabled={!!busy}>Cancel</button><button className="btn-primary flex-1" disabled={!!busy}>{busy === 'create' ? <LoaderCircle className="animate-spin" size={16} /> : <Navigation size={16} />} Assign trip</button></div>
        </form>
      </Modal>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Trip #${selected?.tripId}`} subtitle="Assignment and route summary">
        {selected && <div className="space-y-5">
          <div className="flex items-center justify-between rounded-2xl bg-stone-50 p-4 dark:bg-white/5"><div><p className="text-xs uppercase tracking-wider text-stone-400">Current status</p><div className="mt-2"><StatusBadge value={selected.tripStatus} /></div></div><Route className="text-pine dark:text-lime" size={30} /></div>
          <div className="relative space-y-5 pl-8 before:absolute before:bottom-3 before:left-[7px] before:top-3 before:border-l before:border-dashed before:border-stone-300"><RoutePoint label="Pickup" value={selected.pickupLocation} color="bg-pine dark:bg-lime" /><RoutePoint label="Destination" value={selected.destinationLocation} color="bg-clay" /></div>
          <div className="grid grid-cols-2 gap-3"><Detail icon={UserRound} label="Driver" value={selected.drivername} /><Detail icon={BusFrontIcon} label="Vehicle" value={selected.vehicleNumber} /><Detail icon={CalendarDays} label="Date" value={formatDate(selected.tripDate)} /><Detail icon={Clock3} label="Time" value={formatTime(selected.tripTime)} /></div>
          <div className="rounded-2xl border p-4"><p className="text-xs font-bold uppercase tracking-wider text-stone-400">Calculated route</p>{routeInfo ? <div className="mt-3 grid grid-cols-2 gap-4"><div><p className="font-display text-2xl font-bold">{routeInfo.distanceKm?.toFixed(1)} km</p><p className="text-xs text-stone-500">Distance</p></div><div><p className="font-display text-2xl font-bold">{formatDuration(routeInfo.durationHours)}</p><p className="text-xs text-stone-500">Estimated duration</p></div></div> : <p className="mt-3 text-sm text-stone-500">Route estimate unavailable.</p>}</div>
        </div>}
      </Modal>

      <Modal open={!!cancelling} onClose={() => !busy && setCancelling(null)} title="Cancel this trip?" subtitle="The assignment will remain in history as cancelled.">
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-800 dark:bg-red-400/10 dark:text-red-200"><strong>{cancelling?.pickupLocation}</strong> to <strong>{cancelling?.destinationLocation}</strong> will no longer be available to start.</div>
        <div className="mt-5 flex gap-3"><button className="btn-secondary flex-1" onClick={() => setCancelling(null)} disabled={!!busy}>Keep trip</button><button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50" onClick={cancel} disabled={!!busy}>{busy?.startsWith('cancel') ? <LoaderCircle className="animate-spin" size={16} /> : <XCircle size={16} />} Cancel trip</button></div>
      </Modal>
    </div>
  )
}

function Summary({ icon: Icon, label, value, color }) {
  return <article className="card flex items-center gap-4"><div className={`grid h-12 w-12 place-items-center rounded-2xl ${color}`}><Icon size={21} /></div><div><p className="font-display text-3xl font-extrabold tracking-tight">{value}</p><p className="text-sm text-stone-500">{label}</p></div></article>
}

function TripRow({ trip, isAdmin, busy, onStart, onCancel, onView }) {
  return <tr className="border-t transition hover:bg-stone-50/70 dark:hover:bg-white/[.02]">
    <td className="px-5 py-4"><p className="font-semibold">#{trip.tripId}</p><p className="mt-1 text-xs text-stone-400">{trip.createdAt ? `Created ${formatDate(trip.createdAt)}` : 'Trip assignment'}</p></td>
    <td className="px-5 py-4"><p className="max-w-[210px] truncate font-semibold">{trip.pickupLocation}</p><p className="mt-1 flex max-w-[210px] items-center gap-1 truncate text-xs text-stone-500"><MapPin size={12} /> {trip.destinationLocation}</p></td>
    <td className="px-5 py-4"><p>{trip.drivername}</p><p className="mt-1 text-xs text-stone-500">{trip.vehicleNumber}</p></td>
    <td className="px-5 py-4"><p>{formatDate(trip.tripDate)}</p><p className="mt-1 text-xs text-stone-500">{formatTime(trip.tripTime)}</p></td>
    <td className="px-5 py-4"><StatusBadge value={trip.tripStatus} /></td>
    <td className="px-5 py-4"><div className="flex justify-end gap-2"><button className="btn-secondary" onClick={() => onView(trip)}><Eye size={14} /> View</button>{trip.tripStatus === 'SCHEDULED' && <button className="btn-primary py-2.5" onClick={() => onStart(trip)} disabled={!!busy}>{busy === `start-${trip.tripId}` ? <LoaderCircle className="animate-spin" size={14} /> : <Play size={14} />} Start</button>}{isAdmin && ['SCHEDULED', 'IN_PROGRESS'].includes(trip.tripStatus) && <button className="btn-secondary text-red-600" onClick={() => onCancel(trip)}><XCircle size={14} /></button>}</div></td>
  </tr>
}

function RoutePoint({ label, value, color }) {
  return <div className="relative"><span className={`absolute -left-8 top-1 h-4 w-4 rounded-full border-4 border-white dark:border-[#131e1a] ${color}`} /><p className="text-xs uppercase tracking-wider text-stone-400">{label}</p><p className="mt-1 font-semibold">{value}</p></div>
}

function Detail({ icon: Icon, label, value }) {
  return <div className="rounded-xl border p-3"><Icon size={16} className="text-stone-400" /><p className="mt-3 text-xs text-stone-400">{label}</p><p className="mt-1 truncate text-sm font-semibold">{value}</p></div>
}

function BusFrontIcon(props) {
  return <Navigation {...props} />
}

function TripSkeleton() {
  return <div className="space-y-0">{[1, 2, 3, 4, 5].map((item) => <div key={item} className="grid animate-pulse grid-cols-5 gap-6 border-t p-5"><div className="h-8 rounded bg-stone-100 dark:bg-white/5" /><div className="h-8 rounded bg-stone-100 dark:bg-white/5" /><div className="h-8 rounded bg-stone-100 dark:bg-white/5" /><div className="h-8 rounded bg-stone-100 dark:bg-white/5" /><div className="h-8 rounded bg-stone-100 dark:bg-white/5" /></div>)}</div>
}

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
}
function formatTime(value) {
  if (!value) return '—'
  const [hour, minute] = value.split(':')
  return new Date(2000, 0, 1, Number(hour), Number(minute)).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
}
function formatDuration(hours) {
  if (hours == null) return '—'
  const whole = Math.floor(hours)
  const minutes = Math.round((hours - whole) * 60)
  return whole ? `${whole}h ${minutes}m` : `${minutes} min`
}
