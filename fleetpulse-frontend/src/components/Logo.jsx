export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-lime text-ink">
        <span className="absolute h-3 w-7 -rotate-12 rounded-full border-2 border-ink" />
        <span className="h-2 w-2 rounded-full bg-ink" />
      </span>
      {!compact && <span className="font-display text-xl font-extrabold tracking-[-.04em]">FleetPulse</span>}
    </div>
  )
}
