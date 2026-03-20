import { useEffect, useState } from 'react'

export default function PaymentFailPage() {
  const [saved, setSaved] = useState(false)
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code') || ''
  const message = params.get('message') || '결제가 취소되었거나 실패했습니다.'
  const orderId = params.get('orderId') || ''
  const token = params.get('token') || ''

  useEffect(() => {
    if (!orderId) return

    void (async () => {
      await fetch('/api/payments/fail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, message, orderId }),
      })
      setSaved(true)
    })()
  }, [code, message, orderId])

  return (
    <div className="payment-shell">
      <div className="payment-card payment-result">
        <h1>결제가 완료되지 않았습니다</h1>
        <p>{message}</p>
        {saved && <p className="payment-muted">실패 사유가 기록되었습니다.</p>}
        <div className="payment-result-actions">
          {token && <a className="payment-secondary-btn" href={`/pay?token=${encodeURIComponent(token)}`}>견적 페이지로 돌아가기</a>}
        </div>
      </div>
    </div>
  )
}
