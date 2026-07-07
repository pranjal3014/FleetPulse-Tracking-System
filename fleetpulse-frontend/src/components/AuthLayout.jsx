import { ArrowLeft, Moon, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import { useTheme } from '../context/ThemeContext'

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  const { dark, toggle } = useTheme()
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-[70px] border-lime/10" />
        <Logo />
        <div className="relative my-auto max-w-xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[.24em] text-lime">Fleet intelligence, simplified</p>
          <h2 className="font-display text-6xl font-extrabold leading-[1.02] tracking-[-.055em]">Every vehicle.<br />Every turn.<br /><span className="text-lime">One pulse.</span></h2>
          <p className="mt-7 max-w-md text-lg leading-8 text-stone-300">From assignment to arrival, keep your whole operation moving with live, human-readable fleet insight.</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-stone-400"><span className="h-2 w-2 animate-pulse rounded-full bg-lime" /> System ready for dispatch</div>
      </section>
      <section className="flex min-h-screen flex-col p-5 sm:p-10 lg:p-14">
        <div className="flex items-center justify-between lg:justify-end"><div className="lg:hidden"><Logo /></div><button onClick={toggle} className="rounded-xl border bg-white p-2.5 dark:bg-white/5">{dark ? <Sun size={18} /> : <Moon size={18} />}</button></div>
        <div className="mx-auto my-auto w-full max-w-md py-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[.2em] text-clay">{eyebrow}</p>
          <h1 className="font-display text-4xl font-extrabold tracking-[-.045em] sm:text-5xl">{title}</h1>
          <p className="mt-4 leading-7 text-stone-500 dark:text-stone-400">{subtitle}</p>
          <div className="mt-9">{children}</div>
        </div>
        <Link to="/" className="flex items-center gap-2 text-sm text-stone-500"><ArrowLeft size={16} /> FleetPulse home</Link>
      </section>
    </main>
  )
}
