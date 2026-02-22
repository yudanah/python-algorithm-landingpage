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
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.institutionName.trim() || !form.contactName.trim() || !form.phone.trim() || !form.institutionType) {
      setError('필수 항목을 모두 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone.trim(),
          message: [
            `[기관명] ${form.institutionName.trim()}`,
            `[담당자] ${form.contactName.trim()}`,
            `[기관유형] ${form.institutionType}`,
            form.email ? `[이메일] ${form.email.trim()}` : '',
            form.studentCount ? `[예상학생수] ${form.studentCount}` : '',
            form.message ? `[문의내용] ${form.message.trim()}` : '',
          ].filter(Boolean).join('\n'),
        }),
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        throw new Error()
      }
    } catch {
      setError('전송에 실패했습니다. contact@letscoding.co.kr로 직접 문의해주세요.')
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
                  <label className="form-label">이메일</label>
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
