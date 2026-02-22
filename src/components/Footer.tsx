interface Props {
  onOpenContact: () => void
}

export default function Footer({ onOpenContact }: Props) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">LET'S <span>CODING</span></div>
            <p>입문자를 위한 최고의 파이썬 교육 플랫폼.<br />렛츠코딩앤플레이</p>
          </div>
          <div className="footer-col">
            <h4>서비스</h4>
            <a href="https://python.letscoding.co.kr" target="_blank" rel="noopener noreferrer">학습 플랫폼</a>
            <a href="#features">기능 소개</a>
          </div>
          <div className="footer-col">
            <h4>고객지원</h4>
            <button
              onClick={onOpenContact}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'block', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', padding: '0.25rem 0', fontFamily: 'inherit', textAlign: 'left' }}
            >
              도입 문의
            </button>
            <a href="mailto:contact@letscoding.co.kr">이메일 문의</a>
          </div>
          <div className="footer-col">
            <h4>법률</h4>
            <a href="#">이용약관</a>
            <a href="#">개인정보처리방침</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 렛츠코딩앤플레이. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
