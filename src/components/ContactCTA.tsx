import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function ContactCTA() {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const sectionRef = useScrollAnimation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSuccess(false)
    setError('')

    if (!phone.trim() || !message.trim()) {
      setError('전화번호와 문의 내용을 모두 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), message: message.trim() }),
      })

      if (response.ok) {
        setSuccess(true)
        setPhone('')
        setMessage('')
      } else {
        throw new Error('Server error')
      }
    } catch {
      setError('전송에 실패했습니다. contact@letscoding.co.kr로 직접 문의해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section final-cta" id="contact" ref={sectionRef}>
      <div className="container">
        <div className="contact-grid">
          <div className="contact-cta-left">
            <span className="final-cta-icon">🚀</span>
            <h2 className="final-cta-title">지금 바로 시작하세요</h2>
            <p className="final-cta-text">코딩 교육의 새로운 기준을 경험해보세요</p>
            <a href="https://python.letscoding.co.kr" className="btn btn-primary btn-xl" target="_blank" rel="noopener noreferrer">체험하기</a>
          </div>
          <div className="contact-cta-right">
            <h3 className="contact-inquiry-title">📞 도입문의</h3>
            <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
              <input
                type="tel"
                id="contact-phone"
                placeholder="연락 받으실 전화번호"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <textarea
                id="contact-message"
                placeholder="학원 규모, 관심 기능 등 문의 내용을 적어주세요"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '전송 중...' : '문의하기'}
              </button>
            </form>
            <p className="contact-email">✉️ contact@letscoding.co.kr</p>
            {success && (
              <div className="contact-success show">
                문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.
              </div>
            )}
            {error && (
              <div className="contact-error show">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
