import { useEffect, useState } from 'react'
import type { PaymentQuote } from './types'

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => Promise<{
      payment: (opts?: Record<string, unknown>) => { requestPayment: (method: string, options: Record<string, unknown>) => Promise<void> }
    }>
  }
}

export default function PaymentPage() {
  const [quote, setQuote] = useState<PaymentQuote | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  const token = new URLSearchParams(window.location.search).get('token') || ''

  useEffect(() => {
    if (!token) {
      setError('결제 링크가 올바르지 않습니다.')
      setLoading(false)
      return
    }

    void (async () => {
      try {
        const res = await fetch(`/api/payments/quote?token=${encodeURIComponent(token)}`)
        const text = await res.text()
        if (!text.trim()) throw new Error('서버 응답이 비어 있습니다. API 서버 상태를 확인해주세요.')
        const data = JSON.parse(text) as { error?: string; quote?: PaymentQuote }
        if (!res.ok) throw new Error(data.error || '견적 정보를 불러오지 못했습니다.')
        setQuote(data.quote || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : '견적 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('ko-KR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)

  const formatDate = (value: string | null) => (value ? new Date(value).toLocaleDateString('ko-KR') : '-')

  const startPayment = async () => {
    if (!quote) return

    const clientKey = import.meta.env.VITE_TOSS_PAYMENTS_CLIENT_KEY

    if (!clientKey) {
      setError('VITE_TOSS_PAYMENTS_CLIENT_KEY가 설정되지 않았습니다.')
      return
    }

    if (!window.TossPayments) {
      setError('토스페이먼츠 SDK를 불러오지 못했습니다.')
      return
    }

    setPaying(true)
    setError('')

    try {
      const sessionRes = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const sessionText = await sessionRes.text()
      if (!sessionText.trim()) throw new Error('서버 응답이 비어 있습니다. API 서버 상태를 확인해주세요.')
      const sessionData = JSON.parse(sessionText) as { error?: string; amount?: number; orderId?: string; orderName?: string }
      if (!sessionRes.ok) throw new Error(sessionData.error || '결제 세션 생성에 실패했습니다.')

      const tossPayments = await window.TossPayments(clientKey)
      const payment = tossPayments.payment()

      await payment.requestPayment('CARD', {
        amount: {
          currency: quote.currency,
          value: Number(sessionData.amount || 0),
        },
        orderId: String(sessionData.orderId || ''),
        orderName: String(sessionData.orderName || ''),
        customerEmail: quote.access_email,
        customerName: quote.manager_name || quote.org_name,
        successUrl: `${window.location.origin}/payment/success?token=${encodeURIComponent(token)}`,
        failUrl: `${window.location.origin}/payment/fail?token=${encodeURIComponent(token)}`,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '결제를 시작하지 못했습니다.')
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="payment-shell">
      <div className="payment-card payment-hero">
        <p className="payment-eyebrow">Institution Payment</p>
        <h1>렛츠코딩 견적 결제</h1>
        <p className="payment-subcopy">기관에서 공유받은 결제 페이지입니다. 견적 내용을 확인한 뒤 안전하게 결제를 진행할 수 있습니다.</p>
      </div>

      {loading && <div className="payment-card"><p>견적 정보를 불러오는 중입니다...</p></div>}
      {error && <div className="payment-card payment-error"><p>{error}</p></div>}

      {quote && !loading && (
        <div className="payment-grid">
          <section className="payment-card">
            <div className="payment-section-head">
              <div>
                <p className="payment-label">{quote.quote_number || `견적 #${quote.id}`}</p>
                <h2>{quote.title}</h2>
              </div>
              <span className={`payment-badge status-${quote.status}`}>{quote.status}</span>
            </div>

            <div className="payment-meta">
              <div><span>기관명</span><strong>{quote.org_name}</strong></div>
              <div><span>담당자</span><strong>{quote.manager_name || '-'}</strong></div>
              <div><span>발행일</span><strong>{formatDate(quote.issued_at)}</strong></div>
              <div><span>유효기간</span><strong>{formatDate(quote.valid_until)}</strong></div>
            </div>

            <div className="payment-items">
              {quote.quote_items.slice().sort((a, b) => a.sort_order - b.sort_order).map(item => (
                <div key={item.id} className="payment-item-row">
                  <div>
                    <p>{item.item_name}</p>
                    {item.description && <span>{item.description}</span>}
                  </div>
                  <strong>{formatCurrency(item.amount, quote.currency)}</strong>
                </div>
              ))}
            </div>

            {quote.notes && <p className="payment-notes">{quote.notes}</p>}
          </section>

          <aside className="payment-card payment-summary">
            <h3>결제 요약</h3>
            <div className="payment-summary-row"><span>공급가</span><strong>{formatCurrency(quote.subtotal_amount, quote.currency)}</strong></div>
            <div className="payment-summary-row"><span>할인</span><strong>{formatCurrency(quote.discount_amount, quote.currency)}</strong></div>
            <div className="payment-summary-row"><span>부가세</span><strong>{formatCurrency(quote.tax_amount, quote.currency)}</strong></div>
            <div className="payment-summary-row total"><span>총 결제 금액</span><strong>{formatCurrency(quote.total_amount, quote.currency)}</strong></div>

            <button className="payment-primary-btn" onClick={() => void startPayment()} disabled={paying || quote.status === 'paid'}>
              {quote.status === 'paid' ? '결제 완료된 견적입니다' : paying ? '결제창 여는 중...' : '토스페이먼츠로 결제하기'}
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}
