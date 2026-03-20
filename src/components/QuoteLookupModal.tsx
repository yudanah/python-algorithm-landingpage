import { useEffect, useState } from 'react'

interface QuoteItem {
  id: number
  sort_order: number
  item_name: string
  description: string | null
  quantity: number
  unit_price: number
  amount: number
}

interface Quote {
  id: number
  quote_number: string | null
  title: string
  org_name: string
  manager_name: string | null
  status: string
  issued_at: string | null
  valid_until: string | null
  currency: string
  subtotal_amount: number
  discount_amount: number
  tax_amount: number
  total_amount: number
  notes: string | null
  payment_url: string | null
  quote_items: QuoteItem[]
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

const initialLookupForm = {
  orgName: '',
  email: '',
}

async function readJsonSafely(res: Response) {
  const text = await res.text()

  if (!text.trim()) {
    throw new Error('서버 응답이 비어 있습니다. 로컬 API 서버가 실행 중인지 확인해주세요.')
  }

  try {
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    throw new Error('서버가 올바른 JSON 응답을 주지 않았습니다. API 연결 상태를 확인해주세요.')
  }
}

export default function QuoteLookupModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<'request' | 'verify' | 'quotes'>('request')
  const [lookupForm, setLookupForm] = useState(initialLookupForm)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [quotes, setQuotes] = useState<Quote[]>([])

  useEffect(() => {
    if (!isOpen) {
      setStep('request')
      setLookupForm(initialLookupForm)
      setCode('')
      setLoading(false)
      setError('')
      setInfoMessage('')
      setQuotes([])
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleLookupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLookupForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const requestAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfoMessage('')

    if (!lookupForm.orgName.trim() || !lookupForm.email.trim()) {
      setError('기관명과 이메일을 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/quotes/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_name: lookupForm.orgName.trim(),
          email: lookupForm.email.trim(),
        }),
      })

      const data = await readJsonSafely(res)

      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : '인증번호 발송에 실패했습니다.')
      }

      setStep('verify')
      setInfoMessage('입력하신 이메일로 6자리 인증번호를 발송했습니다.')
    } catch (err) {
      setError(err instanceof Error ? err.message : '인증번호 발송에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadQuotes = async (token: string) => {
    const res = await fetch('/api/quotes/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: token }),
    })

    const data = await readJsonSafely(res)

    if (!res.ok) {
      throw new Error(typeof data.error === 'string' ? data.error : '견적 조회에 실패했습니다.')
    }

    setQuotes(Array.isArray(data.quotes) ? (data.quotes as Quote[]) : [])
    setStep('quotes')
  }

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (code.trim().length !== 6) {
      setError('6자리 인증번호를 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/quotes/verify-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_name: lookupForm.orgName.trim(),
          email: lookupForm.email.trim(),
          code: code.trim(),
        }),
      })

      const data = await readJsonSafely(res)

      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : '인증에 실패했습니다.')
      }

      await loadQuotes(typeof data.accessToken === 'string' ? data.accessToken : '')
    } catch (err) {
      setError(err instanceof Error ? err.message : '인증 처리에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async () => {
    setError('')
    setInfoMessage('')
    setLoading(true)

    try {
      const res = await fetch('/api/quotes/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_name: lookupForm.orgName.trim(),
          email: lookupForm.email.trim(),
        }),
      })

      const data = await readJsonSafely(res)

      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : '재발송에 실패했습니다.')
      }

      setInfoMessage('인증번호를 다시 발송했습니다.')
    } catch (err) {
      setError(err instanceof Error ? err.message : '재발송에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)

  const formatDate = (value: string | null) => {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('ko-KR')
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal quote-modal">
        <div className="modal-header">
          <h2>견적 조회</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {step === 'request' && (
            <form onSubmit={requestAccess}>
              <p className="quote-modal-copy">
                도입 문의에 등록한 기관명과 이메일을 입력하면 인증번호를 보내드립니다.
              </p>

              {error && <div className="form-error">{error}</div>}

              <div className="form-group">
                <label className="form-label">기관명</label>
                <input
                  className="form-input"
                  name="orgName"
                  value={lookupForm.orgName}
                  onChange={handleLookupChange}
                  placeholder="예: OO중학교, OO학원"
                />
              </div>

              <div className="form-group">
                <label className="form-label">이메일 주소</label>
                <input
                  className="form-input"
                  name="email"
                  type="email"
                  value={lookupForm.email}
                  onChange={handleLookupChange}
                  placeholder="도입 문의 시 입력한 이메일"
                />
              </div>

              <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
                {loading ? '발송 중...' : '인증번호 받기'}
              </button>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={verifyCode}>
              <p className="quote-modal-copy">
                <strong>{lookupForm.email}</strong>로 발송된 6자리 인증번호를 입력해주세요.
              </p>

              {infoMessage && <div className="quote-modal-info">{infoMessage}</div>}
              {error && <div className="form-error">{error}</div>}

              <div className="form-group">
                <label className="form-label">인증번호</label>
                <input
                  className="form-input quote-code-input"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6자리 숫자"
                />
              </div>

              <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
                {loading ? '확인 중...' : '견적 조회하기'}
              </button>

              <button type="button" className="quote-text-button" onClick={resendCode} disabled={loading}>
                인증번호 다시 보내기
              </button>
            </form>
          )}

          {step === 'quotes' && (
            <div className="quote-results">
              <div className="quote-results-header">
                <div>
                  <h3>{lookupForm.orgName} 견적 목록</h3>
                  <p>현재 조회 가능한 유효 견적을 확인할 수 있습니다.</p>
                </div>
                <button
                  type="button"
                  className="quote-text-button"
                  onClick={() => {
                    setStep('request')
                    setCode('')
                    setQuotes([])
                  }}
                >
                  다른 정보로 조회
                </button>
              </div>

              {quotes.length === 0 ? (
                <div className="quote-empty-state">
                  <h4>조회 가능한 견적이 없습니다</h4>
                  <p>발송 완료된 견적이 아직 없거나 유효기간이 지난 상태일 수 있습니다.</p>
                </div>
              ) : (
                <div className="quote-card-list">
                  {quotes.map(quote => (
                    <article key={quote.id} className="quote-card">
                      <div className="quote-card-head">
                        <div>
                          <p className="quote-card-number">{quote.quote_number || `견적 #${quote.id}`}</p>
                          <h4>{quote.title}</h4>
                        </div>
                        <span className={`quote-status status-${quote.status}`}>{quote.status}</span>
                      </div>

                      <div className="quote-meta-grid">
                        <div>
                          <span>발행일</span>
                          <strong>{formatDate(quote.issued_at)}</strong>
                        </div>
                        <div>
                          <span>유효기간</span>
                          <strong>{formatDate(quote.valid_until)}</strong>
                        </div>
                        <div>
                          <span>담당자</span>
                          <strong>{quote.manager_name || '-'}</strong>
                        </div>
                        <div>
                          <span>총 금액</span>
                          <strong>{formatCurrency(quote.total_amount, quote.currency)}</strong>
                        </div>
                      </div>

                      {quote.quote_items?.length > 0 && (
                        <div className="quote-items">
                          {quote.quote_items
                            .slice()
                            .sort((a, b) => a.sort_order - b.sort_order)
                            .map(item => (
                              <div key={item.id} className="quote-item-row">
                                <div>
                                  <p>{item.item_name}</p>
                                  {item.description && <span>{item.description}</span>}
                                </div>
                                <strong>{formatCurrency(item.amount, quote.currency)}</strong>
                              </div>
                            ))}
                        </div>
                      )}

                      {quote.notes && <p className="quote-notes">{quote.notes}</p>}

                      <div className="quote-summary">
                        <span>공급가 {formatCurrency(quote.subtotal_amount, quote.currency)}</span>
                        <span>할인 {formatCurrency(quote.discount_amount, quote.currency)}</span>
                        <span>부가세 {formatCurrency(quote.tax_amount, quote.currency)}</span>
                      </div>

                      {quote.payment_url && (
                        <a
                          className="btn btn-primary quote-payment-link"
                          href={quote.payment_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          결제 페이지로 이동
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
