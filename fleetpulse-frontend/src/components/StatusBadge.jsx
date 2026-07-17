const styles = {
  ACTIVE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300',
  APPROVED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300',
  COMPLETED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-300',
  SCHEDULED: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300',
  INACTIVE: 'bg-stone-100 text-stone-700 dark:bg-white/10 dark:text-stone-300',
}
export default function StatusBadge({ value }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${styles[value] || styles.INACTIVE}`}>{value?.replace('_', ' ')}</span>
}
