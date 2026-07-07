import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
export default function NotFoundPage() {
  return <main className="grid min-h-screen place-items-center p-6 text-center"><div><div className="flex justify-center"><Logo /></div><p className="mt-10 font-display text-8xl font-extrabold text-pine/15 dark:text-lime/15">404</p><h1 className="-mt-8 font-display text-3xl font-bold">Wrong turn.</h1><p className="mt-3 text-stone-500">This route isn’t part of today’s plan.</p><Link to="/" className="btn-primary mt-7">Return to dashboard</Link></div></main>
}
