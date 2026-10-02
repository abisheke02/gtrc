import { useState } from 'react'

type Theme = 'light' | 'dark'

const current = (): Theme => (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark')

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(current)

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', next)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#f6f3ea' : '#0f1114')
    try { localStorage.setItem('theme', next) } catch { /* storage unavailable */ }
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded p-2 text-paper/80 transition-colors hover:text-gold"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? 'Dark mode' : 'Light mode'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {theme === 'light'
          ? <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>}
      </svg>
    </button>
  )
}
