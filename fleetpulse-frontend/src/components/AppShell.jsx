import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Activity, BusFront, CheckCircle2, LayoutDashboard, LogOut, Menu, Moon, Route, Sun, UserRound, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Logo from './Logo'

const adminItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/approvals', label: 'Driver approvals', icon: CheckCircle2 },
  { to: '/drivers', label: 'Drivers', icon: UserRound },
  { to: '/vehicles', label: 'Vehicles', icon: BusFront },
  { to: '/trips', label: 'Trips', icon: Route },
  { to: '/tracking', label: 'Live tracking', icon: Activity },
]
const driverItems = [
  { to: '/dashboard', label: 'My dashboard', icon: LayoutDashboard },
  { to: '/trips', label: 'My trips', icon: Route },
  { to: '/tracking', label: 'Live tracking', icon: Activity },
]

export default function AppShell() {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const items = user.role === 'ADMIN' ? adminItems : driverItems
  const current = items.find((item) => location.pathname.startsWith(item.to))?.label || 'FleetPulse'
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      {open && <button className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-ink px-4 py-5 text-white transition-transform lg:sticky lg:top-0 lg:h-screen ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between px-2"><Logo /><button className="lg:hidden" onClick={() => setOpen(false)}><X /></button></div>
        <div className="mt-9 rounded-2xl border border-white/10 bg-white/[.06] p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-lime font-bold text-ink">{user.name?.[0]?.toUpperCase()}</div>
            <div className="min-w-0"><p className="truncate text-sm font-semibold">{user.name}</p><p className="text-xs text-stone-400">{user.role === 'ADMIN' ? 'Operations admin' : 'Fleet driver'}</p></div>
          </div>
        </div>
        <nav className="mt-6 flex-1 space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-lime text-ink' : 'text-stone-300 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-stone-300 hover:bg-white/10 hover:text-white"><LogOut size={18} /> Sign out</button>
      </aside>
      <main className="min-w-0">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b bg-cream/90 px-4 backdrop-blur-xl sm:px-8 dark:bg-[#0c1411]/90">
          <div className="flex items-center gap-3"><button className="rounded-xl border bg-white p-2 lg:hidden dark:bg-white/5" onClick={() => setOpen(true)}><Menu /></button><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-stone-500">Operations</p><h1 className="font-display text-xl font-bold tracking-tight">{current}</h1></div></div>
          <button onClick={toggle} className="rounded-xl border bg-white p-2.5 dark:bg-white/5" aria-label="Toggle dark mode">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        </header>
        <div className="p-4 sm:p-8"><Outlet /></div>
      </main>
    </div>
  )
}
