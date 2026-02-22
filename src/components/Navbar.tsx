import { useState, useEffect, useCallback } from 'react'

interface Props {
  bannerVisible: boolean
  onOpenContact: () => void
}

const NAV_ITEMS = [
  { label: '기능 소개', target: 'features' },
  { label: '교사/기관', target: 'educators' },
  { label: '요금', target: 'pricing' },
]

export default function Navbar({ bannerVisible, onOpenContact }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_ITEMS.map(item => document.getElementById(item.target)).filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMobileOpen(false)
  }, [])

  return (
    <>
      <nav className={`navbar${bannerVisible ? '' : ' no-banner'}${scrolled ? ' scrolled' : ''}`}>
        <div className="container navbar-inner">
          <div className="navbar-logo" onClick={scrollToTop} role="button" tabIndex={0}>
            Let's <span>Coding</span>
          </div>

          <div className="navbar-links">
            {NAV_ITEMS.map(item => (
              <button
                key={item.target}
                className={`navbar-link${activeSection === item.target ? ' active' : ''}`}
                onClick={() => scrollTo(item.target)}
              >
                {item.label}
              </button>
            ))}
            <button className="navbar-cta desktop-only" onClick={onOpenContact}>
              도입 문의
            </button>
          </div>

          <button
            className={`hamburger${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="메뉴"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${mobileOpen ? ' open' : ''}${bannerVisible ? '' : ' no-banner'}`}>
        {NAV_ITEMS.map(item => (
          <button key={item.target} className="mobile-menu-link" onClick={() => scrollTo(item.target)}>
            {item.label}
          </button>
        ))}
        <button className="mobile-menu-cta" onClick={() => { onOpenContact(); setMobileOpen(false); }}>
          도입 문의
        </button>
      </div>
    </>
  )
}
