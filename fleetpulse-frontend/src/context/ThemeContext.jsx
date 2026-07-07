import { createContext, useContext, useEffect, useMemo, useState } from 'react'
const ThemeContext = createContext(null)
export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('fp_theme') === 'dark' || (!localStorage.getItem('fp_theme') && matchMedia('(prefers-color-scheme: dark)').matches))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('fp_theme', dark ? 'dark' : 'light')
  }, [dark])
  const value = useMemo(() => ({ dark, toggle: () => setDark((v) => !v) }), [dark])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
export const useTheme = () => useContext(ThemeContext)
