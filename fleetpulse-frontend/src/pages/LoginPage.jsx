import { useState } from 'react'
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { messageFromError } from '../api/client'

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  if (user) return <Navigate to="/dashboard" replace />
  const submit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back')
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (error) {
      const message = messageFromError(error)
      if (message.toLowerCase().includes('approval pending')) navigate('/pending-approval')
      else toast.error(message)
    } finally { setLoading(false) }
  }
  return (
    <AuthLayout eyebrow="Welcome back" title="Ready to roll?" subtitle="Sign in to see what’s moving, what needs attention, and what’s next.">
      <form onSubmit={submit} className="space-y-5">
        <label className="block"><span className="mb-2 block text-sm font-semibold">Email address</span><span className="relative block"><Mail className="absolute left-4 top-3.5 text-stone-400" size={18} /><input className="field pl-11" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@fleetpulse.io" required autoComplete="email" /></span></label>
        <label className="block"><span className="mb-2 block text-sm font-semibold">Password</span><span className="relative block"><LockKeyhole className="absolute left-4 top-3.5 text-stone-400" size={18} /><input className="field px-11" type={show ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your password" required autoComplete="current-password" /><button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-3.5 text-stone-400">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
        <button className="btn-primary w-full" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" size={18} /> : 'Sign in to FleetPulse'}</button>
      </form>
      <p className="mt-7 text-center text-sm text-stone-500">Joining as a driver? <Link className="font-bold text-pine dark:text-lime" to="/register">Create an account</Link></p>
    </AuthLayout>
  )
}
