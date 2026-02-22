interface MobileMenuProps {
  isOpen: boolean
  onNavigate: (id: string) => void
}

export default function MobileMenu({ isOpen, onNavigate }: MobileMenuProps) {
  return (
    <div className={`mobile-menu${isOpen ? ' active' : ''}`} id="mobile-menu">
      <a href="#features" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); onNavigate('features') }}>기능</a>
      <a href="#curriculum" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); onNavigate('curriculum') }}>커리큘럼</a>
      <a href="#faq" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); onNavigate('faq') }}>FAQ</a>
      <a href="https://python.letscoding.co.kr" className="btn btn-secondary mobile-cta" target="_blank" rel="noopener noreferrer">체험하기</a>
      <a href="#contact" className="btn btn-primary mobile-cta" onClick={(e) => { e.preventDefault(); onNavigate('contact') }}>도입문의</a>
    </div>
  )
}
