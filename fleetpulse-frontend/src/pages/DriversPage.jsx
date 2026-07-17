import { useCallback, useEffect, useMemo, useState } from 'react'
import { LoaderCircle, Pencil, Plus, RefreshCw, Search, Trash2, UserRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { driverApi, vehicleApi } from '../api/services'
import { messageFromError } from '../api/client'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'

const blank = { driverName: '', driverPhone: '', vehicleId: '' }

export default function DriversPage() {
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [driverResponse, vehicleResponse] = await Promise.all([driverApi.all(), vehicleApi.all()])
      setDrivers(driverResponse.data)
      setVehicles(vehicleResponse.data)
    } catch (error) {
      toast.error(messageFromError(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return drivers
    return drivers.filter((driver) =>
      `${driver.driverName} ${driver.driverPhone || ''} ${driver.vehicleNumber || ''}`.toLowerCase().includes(term),
    )
  }, [drivers, search])

  const openCreate = () => {
    setEditing(null)
    setForm(blank)
    setFormOpen(true)
  }

  const openEdit = (driver) => {
    setEditing(driver.driverId)
    setForm({
      driverName: driver.driverName || '',
      driverPhone: driver.driverPhone || '',
      vehicleId: driver.vehicleId || '',
    })
    setFormOpen(true)
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!form.vehicleId) return toast.error('Select a vehicle for this driver')
    setSaving(true)
    try {
      const body = {
        driverName: form.driverName.trim(),
        driverPhone: Number(form.driverPhone),
        vehicleId: Number(form.vehicleId),
      }
      const response = editing ? await driverApi.update(editing, body) : await driverApi.create(body)
      setDrivers((current) =>
        editing ? current.map((driver) => driver.driverId === editing ? response.data : driver) : [response.data, ...current],
      )
      toast.success(editing ? 'Driver updated' : 'Driver added')
      setFormOpen(false)
    } catch (error) {
      toast.error(messageFromError(error))
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!deleting) return
    setSaving(true)
    try {
      await driverApi.remove(deleting.driverId)
      setDrivers((current) => current.filter((driver) => driver.driverId !== deleting.driverId))
      setDeleting(null)
      toast.success('Driver removed')
    } catch (error) {
      toast.error(messageFromError(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-clay">
            <UserRound size={14} /> Driver operations
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">Driver management</h2>
          <p className="mt-2 text-stone-500">Manage approved drivers and their assigned vehicles.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={load} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={17} /> Add driver
          </button>
        </div>
      </header>

      <section className="card p-4">
        <label className="relative block">
          <Search className="absolute left-3.5 top-3 text-stone-400" size={18} />
          <input className="field pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search driver, phone, or vehicle..." />
        </label>
      </section>

      <section className="card overflow-hidden p-0">
        {loading ? (
          <div className="space-y-3 p-5">{[1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl bg-stone-100 dark:bg-white/5" />)}</div>
        ) : filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-400 dark:bg-white/[.03]">
                <tr><th className="px-5 py-4">Driver</th><th className="px-5 py-4">Phone</th><th className="px-5 py-4">Vehicle</th><th className="px-5 py-4 text-right">Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((driver) => (
                  <tr className="border-t" key={driver.driverId}>
                    <td className="px-5 py-4 font-semibold">{driver.driverName}</td>
                    <td className="px-5 py-4 text-stone-500">{driver.driverPhone || 'Not set'}</td>
                    <td className="px-5 py-4 text-stone-500">{driver.vehicleNumber || 'No vehicle assigned'}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="btn-secondary" onClick={() => openEdit(driver)}><Pencil size={14} /> Edit</button>
                        <button className="btn-secondary text-red-600" onClick={() => setDeleting(driver)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No drivers found" text="Approved drivers and manually added drivers will appear here." />
        )}
      </section>

      <Modal open={formOpen} onClose={() => !saving && setFormOpen(false)} title={editing ? 'Edit driver' : 'Add driver'} subtitle="Assign the driver to a vehicle before trip dispatch.">
        <form onSubmit={submit} className="space-y-5">
          <label>
            <span className="mb-2 block text-sm font-semibold">Driver name</span>
            <input className="field" required value={form.driverName} onChange={(event) => setForm({ ...form, driverName: event.target.value })} />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold">Phone number</span>
            <input className="field" type="tel" required value={form.driverPhone} onChange={(event) => setForm({ ...form, driverPhone: event.target.value.replace(/\D/g, '') })} />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold">Vehicle</span>
            <select className="field" required value={form.vehicleId} onChange={(event) => setForm({ ...form, vehicleId: event.target.value })}>
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => <option value={vehicle.vehicleId} key={vehicle.vehicleId}>{vehicle.vehicleNumber} · {vehicle.vehicleType}</option>)}
            </select>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-secondary flex-1" onClick={() => setFormOpen(false)} disabled={saving}>Cancel</button>
            <button className="btn-primary flex-1" disabled={saving}>{saving && <LoaderCircle className="animate-spin" size={16} />}{editing ? 'Save changes' : 'Add driver'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleting} onClose={() => !saving && setDeleting(null)} title="Remove driver?" subtitle="Assigned active trips may prevent deletion.">
        <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-800 dark:bg-red-400/10 dark:text-red-200">
          Remove <strong>{deleting?.driverName}</strong> from driver management?
        </p>
        <div className="mt-5 flex gap-3">
          <button className="btn-secondary flex-1" onClick={() => setDeleting(null)} disabled={saving}>Keep driver</button>
          <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50" onClick={remove} disabled={saving}>{saving ? <LoaderCircle className="animate-spin" size={16} /> : <Trash2 size={16} />} Remove</button>
        </div>
      </Modal>
    </div>
  )
}
