import { useState, useEffect } from 'react'
import MobileMenu from './MobileMenu'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70
      const top = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="navbar" id="navbar" style={{ boxShadow: scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none' }}>
        <div className="container navbar-container">
          <a href="#" className="logo">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">Let's Coding &amp; Play</span>
          </a>
          <div className="nav-links" id="nav-links">
            <a href="#features" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('features') }}>기능</a>
            <a href="#curriculum" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('curriculum') }}>커리큘럼</a>
            <a href="#faq" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('faq') }}>FAQ</a>
          </div>
          <div className="nav-cta-group">
            <a href="https://python.letscoding.co.kr" className="btn btn-secondary nav-cta" target="_blank" rel="noopener noreferrer">체험하기</a>
            <a href="#contact" className="btn btn-primary nav-cta" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>도입문의</a>
          </div>
          <button className={`mobile-menu-btn${mobileMenuOpen ? ' active' : ''}`} id="mobile-menu-btn" aria-label="메뉴 열기" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
      <MobileMenu isOpen={mobileMenuOpen} onNavigate={scrollTo} />
    </>
  )
}
