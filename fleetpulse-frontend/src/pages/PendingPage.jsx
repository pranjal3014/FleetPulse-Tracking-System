import { Clock3, ShieldCheck } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
export default function PendingPage() {
  const { state } = useLocation()
  return (
    <AuthLayout eyebrow="Application received" title="You’re in the queue." subtitle="Your profile needs a quick admin review before you can access driver operations.">
      <div className="card text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"><Clock3 size={30} /></div>
        <h2 className="mt-5 font-display text-xl font-bold">Approval pending</h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">{state?.email ? <>We’ll activate <strong>{state.email}</strong> once an admin approves it.</> : 'An administrator still needs to approve this driver account.'}</p>
        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400"><ShieldCheck size={15} /> Secure manual review</div>
      </div>
      <Link to="/login" className="btn-primary mt-5 w-full">Back to sign in</Link>
    </AuthLayout>
  )
}
