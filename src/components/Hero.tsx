import { useState } from 'react'

interface Props {
  bannerVisible: boolean
  onOpenContact: () => void
}

export default function Hero({ bannerVisible, onOpenContact }: Props) {
  const [showPopup, setShowPopup] = useState(true)

  const dismissPopup = () => {
    setShowPopup(false)
  }

  return (
    <section className={`hero${bannerVisible ? ' with-banner' : ''}`} id="hero" style={{ position: 'relative' }}>
      {showPopup && (
        <div className="hero-popup-overlay">
          <div className="hero-popup">
            <button className="hero-popup-close" onClick={dismissPopup}>&times;</button>
            <div className="hero-popup-icon">&#128226;</div>
            <p className="hero-popup-text">
              기존 렛츠코딩 사이트의 주소가<br />
              <strong>python.letscoding.kr</strong>로 변경되었습니다.<br />
              바로가기 버튼을 눌러서 이동하세요.
            </p>
            <div className="hero-popup-actions">
              <a
                href="https://python.letscoding.kr"
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                바로가기
              </a>
              <button className="btn btn-outline" onClick={dismissPopup}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="hero-badge">AI 기반 파이썬 학습 플랫폼</div>
        <h1>
          <span className="highlight">나나쌤 강의</span> + 코드 작성 + <span className="highlight">AI 나나</span>
        </h1>
        <p className="hero-sub">
          입문자를 위한 최고의 파이썬 교육 플랫폼.<br />AI 튜터와 함께해요.
        </p>
        <div className="hero-cta">
          <a
            href="https://www.youtube.com/watch?v=demo"
            className="btn btn-primary btn-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            &#9654;&ensp;데모 영상 보기
          </a>
          <button className="btn btn-outline btn-lg" onClick={onOpenContact}>
            도입 문의하기
          </button>
        </div>
        <div className="hero-visual">
          <div className="hero-visual-placeholder">
            <div className="play-icon">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <p>문제 선택 &rarr; 코드 작성 &rarr; 실행 &rarr; 정답!</p>
          </div>
        </div>
      </div>
    </section>
  )
}
