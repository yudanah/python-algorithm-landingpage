import { useEffect, useState } from 'react'

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null)
  const [publicToken, setPublicToken] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paymentKey = params.get('paymentKey') || ''
    const orderId = params.get('orderId') || ''
    const amount = Number(params.get('amount') || 0)

    void (async () => {
      try {
        const res = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentKey, orderId, amount }),
        })
        const text = await res.text()
        if (!text.trim()) throw new Error('서버 응답이 비어 있습니다. API 서버 상태를 확인해주세요.')
        const data = JSON.parse(text) as { error?: string; receiptUrl?: string | null; publicToken?: string | null }
        if (!res.ok) throw new Error(data.error || '결제 승인에 실패했습니다.')
        setReceiptUrl(data.receiptUrl || null)
        setPublicToken(data.publicToken || params.get('token'))
      } catch (err) {
        setError(err instanceof Error ? err.message : '결제 승인에 실패했습니다.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="payment-shell">
      <div className="payment-card payment-result">
        {loading && <p>결제 승인 중입니다...</p>}
        {!loading && error && (
          <>
            <h1>결제 승인에 실패했습니다</h1>
            <p>{error}</p>
          </>
        )}
        {!loading && !error && (
          <>
            <h1>결제가 완료되었습니다</h1>
            <p>결제 내역이 정상 반영되었습니다.</p>
            <div className="payment-result-actions">
              {publicToken && <a className="payment-secondary-btn" href={`/pay?token=${encodeURIComponent(publicToken)}`}>견적 페이지로 돌아가기</a>}
              {receiptUrl && <a className="payment-primary-btn inline" href={receiptUrl} target="_blank" rel="noreferrer">영수증 보기</a>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
