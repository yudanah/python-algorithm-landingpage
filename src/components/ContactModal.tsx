import { useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({
    institutionName: '',
    contactName: '',
    phone: '',
    email: '',
    institutionType: '',
    studentCount: '',
    desiredPlan: '',
    desiredPeriod: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => {
      const next = { ...prev, [name]: value }
      if (name === 'desiredPlan') {
        next.desiredPeriod = value === '무료체험' ? '14일' : ''
      }
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.institutionName.trim() || !form.contactName.trim() || !form.phone.trim() || !form.email.trim() || !form.institutionType) {
      setError('필수 항목을 모두 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_name: form.institutionName.trim(),
          manager_name: form.contactName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          org_type: form.institutionType,
          student_count: form.studentCount || undefined,
          desired_plan: form.desiredPlan || undefined,
          desired_period: form.desiredPeriod || undefined,
          message: form.message.trim() || undefined,
        }),
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        throw new Error()
      }
    } catch {
      setError('전송에 실패했습니다. contact@letscoding.kr로 직접 문의해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>도입 문의</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {success ? (
            <div className="form-success">
              <div className="form-success-icon">&#10003;</div>
              <h3>문의가 접수되었습니다</h3>
              <p>영업일 기준 1일 이내 연락드리겠습니다.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="form-error">{error}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">기관명 <span className="required">*</span></label>
                  <input className="form-input" name="institutionName" value={form.institutionName} onChange={handleChange} placeholder="학원/학교 이름" />
                </div>
                <div className="form-group">
                  <label className="form-label">담당자 이름 <span className="required">*</span></label>
                  <input className="form-input" name="contactName" value={form.contactName} onChange={handleChange} placeholder="이름" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">연락처 <span className="required">*</span></label>
                  <input className="form-input" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="010-0000-0000" />
                </div>
                <div className="form-group">
                  <label className="form-label">이메일 <span className="required">*</span></label>
                  <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">기관 유형 <span className="required">*</span></label>
                  <select className="form-select" name="institutionType" value={form.institutionType} onChange={handleChange}>
                    <option value="">선택해주세요</option>
                    <option value="학원">학원</option>
                    <option value="학교">학교</option>
                    <option value="방과후">방과후</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">예상 학생 수</label>
                  <select className="form-select" name="studentCount" value={form.studentCount} onChange={handleChange}>
                    <option value="">선택해주세요</option>
                    <option value="1~10명">1~10명</option>
                    <option value="11~30명">11~30명</option>
                    <option value="31~50명">31~50명</option>
                    <option value="50명 이상">50명 이상</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">희망 라이선스</label>
                  <select className="form-select" name="desiredPlan" value={form.desiredPlan} onChange={handleChange}>
                    <option value="">선택해주세요</option>
                    <option value="무료체험">무료체험</option>
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">희망 기간</label>
                  <select className="form-select" name="desiredPeriod" value={form.desiredPeriod} onChange={handleChange} disabled={form.desiredPlan === '무료체험'}>
                    <option value="">선택해주세요</option>
                    <option value="14일">14일</option>
                    <option value="1개월">1개월</option>
                    <option value="3개월">3개월</option>
                    <option value="6개월">6개월</option>
                    <option value="12개월">12개월</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">문의 내용</label>
                <textarea className="form-textarea" name="message" value={form.message} onChange={handleChange} placeholder="궁금한 점이나 요청사항을 적어주세요" />
              </div>

              <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
                {loading ? '전송 중...' : '문의 보내기'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
