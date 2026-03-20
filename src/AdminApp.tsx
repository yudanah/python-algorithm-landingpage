import { useEffect, useMemo, useState } from 'react'

type Inquiry = {
  id: number
  org_name: string | null
  manager_name: string | null
  phone: string | null
  email: string | null
  org_type: string | null
  student_count: string | null
  desired_plan: string | null
  desired_period: string | null
  message: string | null
  status: string
  created_at: string
}

type QuoteItem = {
  id: number
  sort_order: number
  item_name: string
  description: string | null
  quantity: number
  unit_price: number
  amount: number
}

type Quote = {
  id: number
  quote_number: string | null
  title: string
  access_email?: string
  manager_name?: string | null
  status: string
  issued_at: string | null
  valid_until: string | null
  subtotal_amount?: number
  discount_amount?: number
  tax_amount?: number
  total_amount: number
  notes?: string | null
  payment_url: string | null
  public_token?: string | null
  quote_items: QuoteItem[]
  quote_payments?: {
    id: number
    status: string
    method: string | null
    amount: number
    approved_at: string | null
    receipt_url: string | null
    created_at: string
  }[]
}

type DraftItem = {
  item_name: string
  description: string
  quantity: number
  unit_price: number
}

const initialItem = (): DraftItem => ({
  item_name: '',
  description: '',
  quantity: 1,
  unit_price: 0,
})

const today = new Date().toISOString().slice(0, 10)
const inquiryStatuses = ['pending', 'contacted', 'quoted', 'payment_pending', 'paid', 'closed', 'lost']
const quoteStatuses = ['sent', 'approved', 'payment_pending', 'paid', 'expired', 'cancelled']

export default function AdminApp() {
  const [adminKeyInput, setAdminKeyInput] = useState('')
  const [adminKey, setAdminKey] = useState('')
  const [authReady, setAuthReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [quotesLoading, setQuotesLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [editingQuoteId, setEditingQuoteId] = useState<number | null>(null)
  const [notice, setNotice] = useState('')
  const [quoteForm, setQuoteForm] = useState({
    title: '렛츠코딩 기관 이용 견적',
    access_email: '',
    manager_name: '',
    status: 'sent',
    issued_at: today,
    valid_until: '',
    notes: '',
    payment_url: '',
    discount_amount: 0,
  })
  const [items, setItems] = useState<DraftItem[]>([
    { item_name: '기관 라이선스', description: '기본 이용권', quantity: 1, unit_price: 0 },
  ])

  useEffect(() => {
    const storedKey = window.sessionStorage.getItem('admin-dashboard-key') || ''
    if (storedKey) {
      setAdminKey(storedKey)
      setAdminKeyInput(storedKey)
    }
    setAuthReady(true)
  }, [])

  const selectedInquiry = useMemo(
    () => inquiries.find(inquiry => inquiry.id === selectedInquiryId) ?? null,
    [inquiries, selectedInquiryId]
  )

  const subtotalAmount = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0), 0),
    [items]
  )

  const discountAmount = Number(quoteForm.discount_amount) || 0
  const taxableAmount = Math.max(subtotalAmount - discountAmount, 0)
  const taxAmount = Math.round(taxableAmount * 0.1)
  const totalAmount = taxableAmount + taxAmount

  useEffect(() => {
    if (!authReady) return
    void fetchInquiries(adminKey)
  }, [authReady, adminKey])

  useEffect(() => {
    if (!selectedInquiry) return

    setQuoteForm(prev => ({
      ...prev,
      access_email: prev.access_email || selectedInquiry.email || '',
      manager_name: prev.manager_name || selectedInquiry.manager_name || '',
    }))
  }, [selectedInquiry])

  useEffect(() => {
    if (!selectedInquiryId) return
    void fetchQuotes(selectedInquiryId, adminKey)
  }, [selectedInquiryId, adminKey])

  async function fetchInquiries(key: string) {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/inquiries', {
        headers: key ? { 'x-admin-key': key } : undefined,
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '문의 목록을 불러오지 못했습니다.')
      }

      const nextInquiries = Array.isArray(data.inquiries) ? data.inquiries : []
      setInquiries(nextInquiries)
      setSelectedInquiryId(current => current ?? nextInquiries[0]?.id ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '문의 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  async function fetchQuotes(inquiryId: number, key: string) {
    setQuotesLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/quotes?inquiry_id=${inquiryId}`, {
        headers: key ? { 'x-admin-key': key } : undefined,
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '견적 목록을 불러오지 못했습니다.')
      }

      setQuotes(Array.isArray(data.quotes) ? data.quotes : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '견적 목록을 불러오지 못했습니다.')
    } finally {
      setQuotesLoading(false)
    }
  }

  function handleSaveKey() {
    window.sessionStorage.setItem('admin-dashboard-key', adminKeyInput)
    setAdminKey(adminKeyInput)
    setNotice('')
    setError('')
  }

  function resetForm() {
    setEditingQuoteId(null)
    setQuoteForm(prev => ({
      ...prev,
      title: '렛츠코딩 기관 이용 견적',
      status: 'sent',
      issued_at: today,
      valid_until: '',
      notes: '',
      payment_url: '',
      discount_amount: 0,
    }))
    setItems([initialItem()])
  }

  function hydrateFormFromQuote(quote: Quote) {
    setEditingQuoteId(quote.id)
    setQuoteForm({
      title: quote.title,
      access_email: quote.access_email || selectedInquiry?.email || '',
      manager_name: quote.manager_name || selectedInquiry?.manager_name || '',
      status: quote.status,
      issued_at: quote.issued_at ? quote.issued_at.slice(0, 10) : today,
      valid_until: quote.valid_until ? quote.valid_until.slice(0, 10) : '',
      notes: quote.notes || '',
      payment_url: quote.payment_url || '',
      discount_amount: quote.discount_amount || 0,
    })
    setItems(
      quote.quote_items?.length
        ? quote.quote_items
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map(item => ({
              item_name: item.item_name,
              description: item.description || '',
              quantity: item.quantity,
              unit_price: item.unit_price,
            }))
        : [initialItem()]
    )
  }

  function updateItem(index: number, field: keyof DraftItem, value: string) {
    setItems(current =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) return item

        if (field === 'quantity' || field === 'unit_price') {
          return { ...item, [field]: Number(value) || 0 }
        }

        return { ...item, [field]: value }
      })
    )
  }

  async function saveQuote(e: React.FormEvent) {
    e.preventDefault()

    if (!selectedInquiry) {
      setError('먼저 문의를 선택해주세요.')
      return
    }

    if (!quoteForm.access_email.trim()) {
      setError('조회용 이메일을 입력해주세요.')
      return
    }

    if (items.some(item => !item.item_name.trim())) {
      setError('모든 견적 항목에 이름을 입력해주세요.')
      return
    }

    setSubmitLoading(true)
    setError('')
    setNotice('')

    try {
      const res = await fetch('/api/admin/quotes', {
        method: editingQuoteId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminKey ? { 'x-admin-key': adminKey } : {}),
        },
        body: JSON.stringify({
          id: editingQuoteId,
          inquiry_id: selectedInquiry.id,
          title: quoteForm.title.trim(),
          access_email: quoteForm.access_email.trim(),
          manager_name: quoteForm.manager_name.trim(),
          status: quoteForm.status,
          issued_at: quoteForm.issued_at ? new Date(quoteForm.issued_at).toISOString() : undefined,
          valid_until: quoteForm.valid_until ? new Date(quoteForm.valid_until).toISOString() : undefined,
          notes: quoteForm.notes.trim(),
          payment_url: quoteForm.payment_url.trim(),
          subtotal_amount: subtotalAmount,
          discount_amount: discountAmount,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          items: items.map(item => ({
            item_name: item.item_name.trim(),
            description: item.description.trim(),
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.quantity * item.unit_price,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || (editingQuoteId ? '견적 수정에 실패했습니다.' : '견적 생성에 실패했습니다.'))
      }

      setNotice(editingQuoteId ? '견적이 수정되었습니다.' : `${data.quoteNumber} 견적이 생성되었습니다.`)
      resetForm()
      await fetchQuotes(selectedInquiry.id, adminKey)
      await fetchInquiries(adminKey)
    } catch (err) {
      setError(err instanceof Error ? err.message : (editingQuoteId ? '견적 수정에 실패했습니다.' : '견적 생성에 실패했습니다.'))
    } finally {
      setSubmitLoading(false)
    }
  }

  async function updateInquiryStatus(status: string) {
    if (!selectedInquiry) return

    setError('')
    setNotice('')

    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(adminKey ? { 'x-admin-key': adminKey } : {}),
        },
        body: JSON.stringify({ id: selectedInquiry.id, status }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '문의 상태 변경에 실패했습니다.')
      }

      setInquiries(current => current.map(inquiry => (
        inquiry.id === selectedInquiry.id ? { ...inquiry, status } : inquiry
      )))
      setNotice('문의 상태를 변경했습니다.')
    } catch (err) {
      setError(err instanceof Error ? err.message : '문의 상태 변경에 실패했습니다.')
    }
  }

  async function deleteQuote(quoteId: number) {
    if (!selectedInquiry || !window.confirm('이 견적을 삭제할까요?')) return

    setError('')
    setNotice('')

    try {
      const res = await fetch(`/api/admin/quotes?id=${quoteId}`, {
        method: 'DELETE',
        headers: adminKey ? { 'x-admin-key': adminKey } : undefined,
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '견적 삭제에 실패했습니다.')
      }

      if (editingQuoteId === quoteId) {
        resetForm()
      }

      setNotice('견적을 삭제했습니다.')
      await fetchQuotes(selectedInquiry.id, adminKey)
      await fetchInquiries(adminKey)
    } catch (err) {
      setError(err instanceof Error ? err.message : '견적 삭제에 실패했습니다.')
    }
  }

  function formatDate(value: string | null) {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('ko-KR')
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">Let's Coding Sales Admin</p>
          <h1>문의와 견적을 한 화면에서 관리</h1>
        </div>
        <div className="admin-keybox">
          <input
            className="admin-input"
            type="password"
            value={adminKeyInput}
            onChange={e => setAdminKeyInput(e.target.value)}
            placeholder="ADMIN_DASHBOARD_KEY"
          />
          <button className="admin-primary-btn" onClick={handleSaveKey}>
            관리자 키 저장
          </button>
        </div>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {notice && <div className="admin-alert admin-alert-success">{notice}</div>}

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-panel-header">
            <div>
              <h2>도입 문의</h2>
              <p>{loading ? '불러오는 중...' : `${inquiries.length}건`}</p>
            </div>
            <button className="admin-ghost-btn" onClick={() => void fetchInquiries(adminKey)}>
              새로고침
            </button>
          </div>

          <div className="admin-inquiry-list">
            {inquiries.map(inquiry => (
              <button
                key={inquiry.id}
                className={`admin-inquiry-card${selectedInquiryId === inquiry.id ? ' active' : ''}`}
                onClick={() => setSelectedInquiryId(inquiry.id)}
              >
                <div className="admin-inquiry-head">
                  <strong>{inquiry.org_name || '기관명 미입력'}</strong>
                  <span>{formatDate(inquiry.created_at)}</span>
                </div>
                <p>{inquiry.manager_name || '-'} · {inquiry.email || '이메일 없음'}</p>
                <small>{inquiry.org_type || '-'} / {inquiry.student_count || '학생 수 미입력'}</small>
              </button>
            ))}
          </div>
        </aside>

        <main className="admin-main">
          {!selectedInquiry ? (
            <section className="admin-empty">
              <h2>선택된 문의가 없습니다</h2>
              <p>왼쪽에서 문의를 선택하면 견적 작성과 조회 링크 관리를 시작할 수 있습니다.</p>
            </section>
          ) : (
            <>
              <section className="admin-panel">
                <div className="admin-panel-header">
                  <div>
                    <h2>{selectedInquiry.org_name}</h2>
                    <p>{selectedInquiry.manager_name || '-'} · {selectedInquiry.email || '-'} · {selectedInquiry.phone || '-'}</p>
                  </div>
                  <div className="admin-inline-actions">
                    <span className="admin-status-chip">{selectedInquiry.status}</span>
                    <select
                      className="admin-input admin-compact-select"
                      value={selectedInquiry.status}
                      onChange={e => void updateInquiryStatus(e.target.value)}
                    >
                      {inquiryStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="admin-detail-grid">
                  <div>
                    <span>기관 유형</span>
                    <strong>{selectedInquiry.org_type || '-'}</strong>
                  </div>
                  <div>
                    <span>예상 학생 수</span>
                    <strong>{selectedInquiry.student_count || '-'}</strong>
                  </div>
                  <div>
                    <span>희망 플랜</span>
                    <strong>{selectedInquiry.desired_plan || '-'}</strong>
                  </div>
                  <div>
                    <span>희망 기간</span>
                    <strong>{selectedInquiry.desired_period || '-'}</strong>
                  </div>
                </div>

                <div className="admin-message-box">
                  <span>문의 내용</span>
                  <p>{selectedInquiry.message || '문의 내용이 없습니다.'}</p>
                </div>
              </section>

              <section className="admin-grid">
                <section className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2>견적 생성</h2>
                      <p>{editingQuoteId ? '선택한 견적을 수정하고 있습니다.' : '현재 문의를 기반으로 이메일 조회 가능한 견적을 발행합니다.'}</p>
                    </div>
                    {editingQuoteId && (
                      <button type="button" className="admin-ghost-btn" onClick={resetForm}>
                        새 견적 작성으로 전환
                      </button>
                    )}
                  </div>

                  <form className="admin-form" onSubmit={saveQuote}>
                    <div className="admin-form-grid">
                      <label>
                        <span>견적명</span>
                        <input
                          className="admin-input"
                          value={quoteForm.title}
                          onChange={e => setQuoteForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </label>

                      <label>
                        <span>조회용 이메일</span>
                        <input
                          className="admin-input"
                          type="email"
                          value={quoteForm.access_email}
                          onChange={e => setQuoteForm(prev => ({ ...prev, access_email: e.target.value }))}
                        />
                      </label>

                      <label>
                        <span>담당자 이름</span>
                        <input
                          className="admin-input"
                          value={quoteForm.manager_name}
                          onChange={e => setQuoteForm(prev => ({ ...prev, manager_name: e.target.value }))}
                        />
                      </label>

                      <label>
                        <span>견적 상태</span>
                        <select
                          className="admin-input"
                          value={quoteForm.status}
                          onChange={e => setQuoteForm(prev => ({ ...prev, status: e.target.value }))}
                        >
                          {quoteStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </label>

                      <label>
                        <span>발행일</span>
                        <input
                          className="admin-input"
                          type="date"
                          value={quoteForm.issued_at}
                          onChange={e => setQuoteForm(prev => ({ ...prev, issued_at: e.target.value }))}
                        />
                      </label>

                      <label>
                        <span>유효기간</span>
                        <input
                          className="admin-input"
                          type="date"
                          value={quoteForm.valid_until}
                          onChange={e => setQuoteForm(prev => ({ ...prev, valid_until: e.target.value }))}
                        />
                      </label>
                    </div>

                    <div className="admin-items-header">
                      <h3>견적 항목</h3>
                      <button
                        type="button"
                        className="admin-ghost-btn"
                        onClick={() => setItems(current => [...current, initialItem()])}
                      >
                        항목 추가
                      </button>
                    </div>

                    <div className="admin-item-list">
                      {items.map((item, index) => (
                        <div key={`${index}-${item.item_name}`} className="admin-item-card">
                          <label>
                            <span>항목명</span>
                            <input
                              className="admin-input"
                              value={item.item_name}
                              onChange={e => updateItem(index, 'item_name', e.target.value)}
                            />
                          </label>

                          <label>
                            <span>설명</span>
                            <input
                              className="admin-input"
                              value={item.description}
                              onChange={e => updateItem(index, 'description', e.target.value)}
                            />
                          </label>

                          <label>
                            <span>수량</span>
                            <input
                              className="admin-input"
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={e => updateItem(index, 'quantity', e.target.value)}
                            />
                          </label>

                          <label>
                            <span>단가</span>
                            <input
                              className="admin-input"
                              type="number"
                              min="0"
                              step="1000"
                              value={item.unit_price}
                              onChange={e => updateItem(index, 'unit_price', e.target.value)}
                            />
                          </label>

                          <div className="admin-item-total">
                            <span>항목 금액</span>
                            <strong>{formatCurrency(item.quantity * item.unit_price)}</strong>
                          </div>

                          <button
                            type="button"
                            className="admin-text-btn"
                            onClick={() => setItems(current => current.filter((_, itemIndex) => itemIndex !== index))}
                            disabled={items.length === 1}
                          >
                            삭제
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="admin-form-grid">
                      <label>
                        <span>할인 금액</span>
                        <input
                          className="admin-input"
                          type="number"
                          min="0"
                          step="1000"
                          value={quoteForm.discount_amount}
                          onChange={e => setQuoteForm(prev => ({ ...prev, discount_amount: Number(e.target.value) || 0 }))}
                        />
                      </label>

                      <label>
                        <span>결제 페이지 URL</span>
                        <input
                          className="admin-input"
                          value={quoteForm.payment_url}
                          onChange={e => setQuoteForm(prev => ({ ...prev, payment_url: e.target.value }))}
                          placeholder="비워두면 토스 결제 페이지가 자동 생성됩니다"
                        />
                      </label>
                    </div>

                    <label className="admin-block-label">
                      <span>비고</span>
                      <textarea
                        className="admin-input admin-textarea"
                        value={quoteForm.notes}
                        onChange={e => setQuoteForm(prev => ({ ...prev, notes: e.target.value }))}
                      />
                    </label>

                    <div className="admin-summary-box">
                      <div><span>공급가</span><strong>{formatCurrency(subtotalAmount)}</strong></div>
                      <div><span>할인</span><strong>{formatCurrency(discountAmount)}</strong></div>
                      <div><span>부가세</span><strong>{formatCurrency(taxAmount)}</strong></div>
                      <div><span>총액</span><strong>{formatCurrency(totalAmount)}</strong></div>
                    </div>

                    <button className="admin-primary-btn admin-submit-btn" disabled={submitLoading}>
                      {submitLoading ? (editingQuoteId ? '견적 수정 중...' : '견적 생성 중...') : (editingQuoteId ? '견적 수정 저장' : '견적 발행하기')}
                    </button>
                  </form>
                </section>

                <section className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h2>발행된 견적</h2>
                      <p>{quotesLoading ? '불러오는 중...' : `${quotes.length}건`}</p>
                    </div>
                  </div>

                  <div className="admin-quote-list">
                    {quotes.map(quote => (
                      <article key={quote.id} className="admin-quote-card">
                        <div className="admin-quote-head">
                          <div>
                            <small>{quote.quote_number || `견적 #${quote.id}`}</small>
                            <h3>{quote.title}</h3>
                          </div>
                          <div className="admin-inline-actions">
                            <span className="admin-status-chip">{quote.status}</span>
                            <button type="button" className="admin-ghost-btn" onClick={() => hydrateFormFromQuote(quote)}>
                              수정
                            </button>
                            <button type="button" className="admin-text-btn" onClick={() => void deleteQuote(quote.id)}>
                              삭제
                            </button>
                          </div>
                        </div>

                        <div className="admin-quote-meta">
                          <span>발행일 {formatDate(quote.issued_at)}</span>
                          <span>유효기간 {formatDate(quote.valid_until)}</span>
                          <span>총액 {formatCurrency(quote.total_amount)}</span>
                        </div>

                        <div className="admin-quote-items">
                          {quote.quote_items?.map(item => (
                            <div key={item.id} className="admin-quote-item-row">
                              <span>{item.item_name}</span>
                              <strong>{formatCurrency(item.amount)}</strong>
                            </div>
                          ))}
                        </div>

                        {!!quote.quote_payments?.length && (
                          <div className="admin-payments-box">
                            <strong>결제 기록</strong>
                            {quote.quote_payments.map(payment => (
                              <div key={payment.id} className="admin-payment-row">
                                <span>{payment.status} · {payment.method || '결제수단 미입력'}</span>
                                <span>{formatCurrency(payment.amount)} · {formatDate(payment.approved_at || payment.created_at)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {quote.payment_url && (
                          <div className="admin-quote-links">
                            <a className="admin-link-btn" href={quote.payment_url} target="_blank" rel="noreferrer">
                              결제 링크 열기
                            </a>
                            <button
                              type="button"
                              className="admin-ghost-btn"
                              onClick={async () => {
                                await navigator.clipboard.writeText(quote.payment_url || '')
                                setNotice('결제 링크를 복사했습니다.')
                              }}
                            >
                              링크 복사
                            </button>
                          </div>
                        )}
                      </article>
                    ))}

                    {!quotesLoading && quotes.length === 0 && (
                      <div className="admin-empty-list">
                        <h3>아직 발행된 견적이 없습니다</h3>
                        <p>왼쪽 문의를 바탕으로 첫 견적을 생성해보세요.</p>
                      </div>
                    )}
                  </div>
                </section>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
