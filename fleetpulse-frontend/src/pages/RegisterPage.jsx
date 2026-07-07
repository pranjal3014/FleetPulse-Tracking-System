import { useState } from 'react'
import { Check, LoaderCircle } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { messageFromError } from '../api/client'

export default function RegisterPage() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  if (user) return <Navigate to="/dashboard" replace />
  const submit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Use at least 6 characters')
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/pending-approval', { replace: true, state: { registered: true, email: form.email } })
    } catch (error) { toast.error(messageFromError(error)) } finally { setLoading(false) }
  }
  return (
    <AuthLayout eyebrow="Driver onboarding" title="Join the fleet." subtitle="Create your driver profile. An administrator will review it before your first sign-in.">
      <form onSubmit={submit} className="space-y-4">
        <label className="block"><span className="mb-2 block text-sm font-semibold">Full name</span><input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aarav Sharma" required /></label>
        <label className="block"><span className="mb-2 block text-sm font-semibold">Email address</span><input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="aarav@example.com" required /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-2 block text-sm font-semibold">Password</span><input className="field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label><label><span className="mb-2 block text-sm font-semibold">Confirm</span><input className="field" type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required /></label></div>
        <div className="flex gap-3 rounded-xl bg-pine/5 p-3 text-sm text-stone-600 dark:bg-lime/5 dark:text-stone-300"><Check className="mt-0.5 shrink-0 text-pine dark:text-lime" size={17} /><span>By registering, you enter the admin approval queue as a <strong>DRIVER</strong>.</span></div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" size={18} /> : 'Submit for approval'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-stone-500">Already approved? <Link className="font-bold text-pine dark:text-lime" to="/login">Sign in</Link></p>
    </AuthLayout>
  )
}
