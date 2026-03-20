import { useState, useCallback, useEffect } from 'react'
import TopBanner from './components/TopBanner'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import ForEducators from './components/ForEducators'
import ForParents from './components/ForParents'
import Pricing from './components/Pricing'
import ContactModal from './components/ContactModal'
import QuoteLookupModal from './components/QuoteLookupModal'
import Footer from './components/Footer'

export default function App() {
  const [bannerVisible, setBannerVisible] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [quoteLookupOpen, setQuoteLookupOpen] = useState(false)

  const openContact = useCallback(() => setContactOpen(true), [])
  const closeContact = useCallback(() => setContactOpen(false), [])
  const openQuoteLookup = useCallback(() => setQuoteLookupOpen(true), [])
  const closeQuoteLookup = useCallback(() => setQuoteLookupOpen(false), [])
  const onBannerChange = useCallback((v: boolean) => setBannerVisible(v), [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('quoteLookup') === '1') {
      setQuoteLookupOpen(true)
    }
  }, [])

  return (
    <>
      <TopBanner onVisibilityChange={onBannerChange} />
      <Navbar bannerVisible={bannerVisible} onOpenContact={openContact} onOpenQuoteLookup={openQuoteLookup} />
      <Hero bannerVisible={bannerVisible} onOpenContact={openContact} />
      <Features />
      <HowItWorks />
      <ForEducators onOpenContact={openContact} />
      <ForParents />
      <Pricing onOpenContact={openContact} />
      <Footer onOpenContact={openContact} />
      <ContactModal isOpen={contactOpen} onClose={closeContact} />
      <QuoteLookupModal isOpen={quoteLookupOpen} onClose={closeQuoteLookup} />

      <div className="mobile-cta-bar">
        <button onClick={openContact}>도입 문의하기</button>
      </div>
    </>
  )
}
