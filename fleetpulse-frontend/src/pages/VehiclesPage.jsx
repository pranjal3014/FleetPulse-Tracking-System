import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Bike, Bus, BusFront, Car, CheckCircle2, Filter, Grid2X2, List,
  LoaderCircle, Pencil, Plus, RefreshCw, Search, Trash2, Truck, XCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { vehicleApi } from '../api/services'
import { messageFromError } from '../api/client'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

const types = ['ALL', 'CAR', 'BIKE', 'TRUCK', 'BUS', 'VAN']
const blank = { vehicleNumber: '', vehicleType: 'CAR', vehicleStatus: 'ACTIVE' }
const typeIcons = { CAR: Car, BIKE: Bike, TRUCK: Truck, BUS: Bus, VAN: BusFront }

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('ALL')
  const [status, setStatus] = useState('ALL')
  const [view, setView] = useState('grid')

  const load = useCallback(async () => {
    setLoading(true)
    try { setVehicles((await vehicleApi.all()).data) }
    catch (error) { toast.error(messageFromError(error)) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.vehicleNumber.toLowerCase().includes(search.trim().toLowerCase())
    return matchesSearch && (type === 'ALL' || vehicle.vehicleType === type) && (status === 'ALL' || vehicle.vehicleStatus === status)
  }), [vehicles, search, type, status])

  const counts = useMemo(() => ({
    total: vehicles.length,
    active: vehicles.filter((vehicle) => vehicle.vehicleStatus === 'ACTIVE').length,
    inactive: vehicles.filter((vehicle) => vehicle.vehicleStatus === 'INACTIVE').length,
  }), [vehicles])

  const showCreate = () => { setEditing(null); setForm(blank); setFormOpen(true) }
  const showEdit = (vehicle) => {
    setEditing(vehicle.vehicleId)
    setForm({ vehicleNumber: vehicle.vehicleNumber, vehicleType: vehicle.vehicleType, vehicleStatus: vehicle.vehicleStatus })
    setFormOpen(true)
  }

  const submit = async (event) => {
    event.preventDefault()
    const body = { ...form, vehicleNumber: form.vehicleNumber.trim().toUpperCase() }
    if (vehicles.some((vehicle) => vehicle.vehicleId !== editing && vehicle.vehicleNumber.toUpperCase() === body.vehicleNumber)) {
      return toast.error('That vehicle number is already in the fleet')
    }
    setSaving(true)
    try {
      const response = editing ? await vehicleApi.update(editing, body) : await vehicleApi.create(body)
      setVehicles((current) => editing
        ? current.map((vehicle) => vehicle.vehicleId === editing ? response.data : vehicle)
        : [response.data, ...current])
      toast.success(editing ? 'Vehicle updated' : 'Vehicle added to fleet')
      setFormOpen(false)
    } catch (error) { toast.error(messageFromError(error)) }
    finally { setSaving(false) }
  }

  const remove = async () => {
    if (!deleting) return
    setSaving(true)
    try {
      await vehicleApi.remove(deleting.vehicleId)
      setVehicles((current) => current.filter((vehicle) => vehicle.vehicleId !== deleting.vehicleId))
      toast.success('Vehicle removed')
      setDeleting(null)
    } catch (error) { toast.error(messageFromError(error)) }
    finally { setSaving(false) }
  }

  const clearFilters = () => { setSearch(''); setType('ALL'); setStatus('ALL') }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-clay"><BusFront size={14} /> Fleet inventory</div>
          <h2 className="font-display text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">Vehicle management</h2>
          <p className="mt-2 text-stone-500">Register, update, and monitor every vehicle in your operation.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={load} disabled={loading}><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh</button>
          <button className="btn-primary" onClick={showCreate}><Plus size={17} /> Add vehicle</button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard icon={BusFront} label="Total vehicles" value={counts.total} className="bg-ink text-white" iconClass="bg-lime text-ink" />
        <SummaryCard icon={CheckCircle2} label="Active & ready" value={counts.active} className="bg-white dark:bg-[#131e1a]" iconClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300" />
        <SummaryCard icon={XCircle} label="Inactive" value={counts.inactive} className="bg-white dark:bg-[#131e1a]" iconClass="bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-300" />
      </section>

      <section className="card p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="relative min-w-0 flex-1">
            <Search className="absolute left-3.5 top-3 text-stone-400" size={18} />
            <input className="field pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search registration number..." />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative">
              <Filter className="absolute left-3.5 top-3 text-stone-400" size={17} />
              <select className="field min-w-40 pl-10" value={type} onChange={(event) => setType(event.target.value)}>
                {types.map((item) => <option value={item} key={item}>{item === 'ALL' ? 'All types' : item}</option>)}
              </select>
            </label>
            <select className="field min-w-40" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="ALL">All statuses</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
            </select>
            <div className="flex rounded-xl border bg-stone-50 p-1 dark:bg-white/5">
              <button onClick={() => setView('grid')} className={`rounded-lg p-2 ${view === 'grid' ? 'bg-white shadow-sm dark:bg-white/10' : 'text-stone-400'}`} aria-label="Grid view"><Grid2X2 size={18} /></button>
              <button onClick={() => setView('list')} className={`rounded-lg p-2 ${view === 'list' ? 'bg-white shadow-sm dark:bg-white/10' : 'text-stone-400'}`} aria-label="List view"><List size={18} /></button>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
          <span>Showing {filtered.length} of {vehicles.length} vehicles</span>
          {(search || type !== 'ALL' || status !== 'ALL') && <button className="font-bold text-pine dark:text-lime" onClick={clearFilters}>Clear filters</button>}
        </div>
      </section>

      {loading ? <VehicleSkeleton /> : !filtered.length ? (
        <div className="card"><EmptyState title={vehicles.length ? 'No matching vehicles' : 'No vehicles yet'} text={vehicles.length ? 'Try changing or clearing the filters.' : 'Add your first vehicle to begin assigning trips.'} /></div>
      ) : view === 'grid' ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((vehicle) => <VehicleCard key={vehicle.vehicleId} vehicle={vehicle} onEdit={showEdit} onDelete={setDeleting} />)}
        </section>
      ) : (
        <VehicleTable vehicles={filtered} onEdit={showEdit} onDelete={setDeleting} />
      )}

      <Modal open={formOpen} onClose={() => !saving && setFormOpen(false)} title={editing ? 'Edit vehicle' : 'Add a vehicle'} subtitle="Details must match the vehicle registration.">
        <form className="space-y-5" onSubmit={submit}>
          <label className="block"><span className="mb-2 block text-sm font-semibold">Registration number</span><input className="field uppercase" value={form.vehicleNumber} onChange={(event) => setForm({ ...form, vehicleNumber: event.target.value.toUpperCase() })} placeholder="KA-01-AB-1234" maxLength={20} required /><span className="mt-1.5 block text-xs text-stone-400">Letters, numbers, spaces and hyphens are accepted.</span></label>
          <div className="grid grid-cols-2 gap-4">
            <label><span className="mb-2 block text-sm font-semibold">Vehicle type</span><select className="field" value={form.vehicleType} onChange={(event) => setForm({ ...form, vehicleType: event.target.value })}>{types.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span className="mb-2 block text-sm font-semibold">Operational status</span><select className="field" value={form.vehicleStatus} onChange={(event) => setForm({ ...form, vehicleStatus: event.target.value })}><option>ACTIVE</option><option>INACTIVE</option></select></label>
          </div>
          <div className="flex gap-3 pt-2"><button type="button" className="btn-secondary flex-1" onClick={() => setFormOpen(false)} disabled={saving}>Cancel</button><button className="btn-primary flex-1" disabled={saving}>{saving && <LoaderCircle className="animate-spin" size={16} />}{editing ? 'Save changes' : 'Add to fleet'}</button></div>
        </form>
      </Modal>

      <Modal open={!!deleting} onClose={() => !saving && setDeleting(null)} title="Remove vehicle?" subtitle="This action cannot be undone.">
        <div className="rounded-2xl bg-red-50 p-4 dark:bg-red-400/10"><p className="text-sm text-red-800 dark:text-red-200">You are about to permanently remove <strong>{deleting?.vehicleNumber}</strong> from the fleet inventory.</p></div>
        <div className="mt-5 flex gap-3"><button className="btn-secondary flex-1" onClick={() => setDeleting(null)} disabled={saving}>Keep vehicle</button><button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50" onClick={remove} disabled={saving}>{saving ? <LoaderCircle className="animate-spin" size={16} /> : <Trash2 size={16} />} Remove</button></div>
      </Modal>
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, className, iconClass }) {
  return <article className={`rounded-[1.4rem] border p-5 shadow-soft ${className}`}><div className="flex items-center justify-between"><div className={`grid h-11 w-11 place-items-center rounded-2xl ${iconClass}`}><Icon size={20} /></div><p className="font-display text-4xl font-extrabold tracking-[-.05em]">{value}</p></div><p className="mt-5 text-sm font-medium opacity-70">{label}</p></article>
}

function VehicleCard({ vehicle, onEdit, onDelete }) {
  const Icon = typeIcons[vehicle.vehicleType] || BusFront
  return <article className="card group">
    <div className="flex items-start justify-between"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-pine/10 text-pine dark:bg-lime/10 dark:text-lime"><Icon /></div><StatusBadge value={vehicle.vehicleStatus} /></div>
    <p className="mt-6 font-display text-2xl font-bold tracking-tight">{vehicle.vehicleNumber}</p>
    <div className="mt-2 flex items-center gap-2 text-sm text-stone-500"><span>{vehicle.vehicleType}</span><span>·</span><span>ID #{vehicle.vehicleId}</span></div>
    <p className="mt-4 text-xs text-stone-400">Added {formatDate(vehicle.createdAt)}</p>
    <div className="mt-5 flex gap-2 border-t pt-4"><button className="btn-secondary flex-1" onClick={() => onEdit(vehicle)}><Pencil size={15} /> Edit details</button><button className="btn-secondary text-red-600" onClick={() => onDelete(vehicle)} aria-label={`Delete ${vehicle.vehicleNumber}`}><Trash2 size={15} /></button></div>
  </article>
}

function VehicleTable({ vehicles, onEdit, onDelete }) {
  return <section className="card overflow-hidden p-0"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-400 dark:bg-white/[.03]"><tr><th className="px-5 py-4">Vehicle</th><th className="px-5 py-4">Type</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Added</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody>{vehicles.map((vehicle) => { const Icon = typeIcons[vehicle.vehicleType] || BusFront; return <tr className="border-t" key={vehicle.vehicleId}><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-pine/10 text-pine dark:text-lime"><Icon size={17} /></div><div><p className="font-semibold">{vehicle.vehicleNumber}</p><p className="text-xs text-stone-400">ID #{vehicle.vehicleId}</p></div></div></td><td className="px-5 py-4">{vehicle.vehicleType}</td><td className="px-5 py-4"><StatusBadge value={vehicle.vehicleStatus} /></td><td className="px-5 py-4 text-stone-500">{formatDate(vehicle.createdAt)}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button className="btn-secondary" onClick={() => onEdit(vehicle)}><Pencil size={14} /> Edit</button><button className="btn-secondary text-red-600" onClick={() => onDelete(vehicle)}><Trash2 size={14} /></button></div></td></tr> })}</tbody></table></div></section>
}

function VehicleSkeleton() {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="card animate-pulse"><div className="h-12 w-12 rounded-2xl bg-stone-200 dark:bg-white/10" /><div className="mt-6 h-7 w-2/3 rounded bg-stone-200 dark:bg-white/10" /><div className="mt-3 h-4 w-1/3 rounded bg-stone-100 dark:bg-white/5" /><div className="mt-8 h-11 rounded-xl bg-stone-100 dark:bg-white/5" /></div>)}</div>
}

function formatDate(value) {
  if (!value) return 'Recently'
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
}
