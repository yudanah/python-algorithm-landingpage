export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
          <div className="footer-brand">
            <a href="#" className="footer-logo">
              <span className="logo-icon">🚀</span>
              <span className="logo-text">Let's Coding &amp; Play</span>
            </a>
            <p className="footer-description">AI와 함께하는 스마트한 코딩 교육</p>
          </div>
          <div className="footer-links">
            <h4 className="footer-title">제품</h4>
            <a href="#features">기능</a>
            <a href="#curriculum">커리큘럼</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footer-links">
            <h4 className="footer-title">지원 &amp; 연락처</h4>
            <a href="#">이용약관</a>
            <a href="#">개인정보처리방침</a>
            <a href="mailto:contact@letscoding.co.kr">contact@letscoding.co.kr</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Let's Coding &amp; Play. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
