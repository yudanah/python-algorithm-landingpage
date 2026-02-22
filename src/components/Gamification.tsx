import { useEffect, useRef } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Gamification() {
  const sectionRef = useScrollAnimation()
  const pixelGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = pixelGridRef.current
    if (!grid || grid.children.length > 0) return

    const totalPixels = 256
    const filledPercentage = 25
    const filledCount = Math.floor(totalPixels * filledPercentage / 100)

    const rocketPattern = [
      0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,
      0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
      0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,
      0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,
      0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,
      0,0,0,0,1,1,0,1,1,0,1,1,0,0,0,0,
      0,0,0,0,1,1,0,1,1,0,1,1,0,0,0,0,
      0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,
      0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,
      0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
      0,0,1,0,1,1,1,1,1,1,1,1,0,1,0,0,
      0,1,1,0,0,1,1,1,1,1,1,0,0,1,1,0,
      0,1,0,0,0,0,1,1,1,1,0,0,0,0,1,0,
      0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,
      0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,
      0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0
    ]

    let currentFilled = 0
    for (let i = 0; i < totalPixels; i++) {
      const pixel = document.createElement('div')
      pixel.classList.add('pixel')
      if (rocketPattern[i] === 1 && currentFilled < filledCount) {
        pixel.classList.add('filled')
        currentFilled++
      }
      grid.appendChild(pixel)
    }
  }, [])

  return (
    <section className="section gamification" id="gamification" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">재미있게 배우니까 더 오래 기억해요</h2>
        <p className="section-subtitle">별을 모으고, 픽셀아트를 완성하고, 타자 랭킹에 도전하세요</p>
        <div className="gamification-grid">
          <div className="gamification-card">
            <h3 className="gamification-title">⭐ 별 시스템</h3>
            <div className="star-system">
              <div className="star-level">
                <span className="star-icon empty">☆</span>
                <span className="star-label">0회</span>
                <span className="star-status">아직없음</span>
              </div>
              <div className="star-arrow">→</div>
              <div className="star-level">
                <span className="star-icon silver">⭐</span>
                <span className="star-label">1-9회</span>
                <span className="star-status">은색별</span>
              </div>
              <div className="star-arrow">→</div>
              <div className="star-level">
                <span className="star-icon gold">🌟</span>
                <span className="star-label">10회+</span>
                <span className="star-status">금색별</span>
              </div>
            </div>
            <p className="gamification-text">문제를 반복해서 풀수록 별이 빛나요!<br />10번 이상 정답 시 금색별로 레벨업!</p>
          </div>
          <div className="gamification-card">
            <h3 className="gamification-title">🎨 픽셀아트 진행도</h3>
            <div className="pixel-art-demo">
              <div className="pixel-grid" ref={pixelGridRef}></div>
            </div>
            <div className="progress-info">
              <span className="progress-text">현재: 127/500</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '25%' }}></div>
              </div>
              <span className="progress-percent">25%</span>
            </div>
            <p className="gamification-text">500문제 달성 시 픽셀아트가 완성됩니다!</p>
          </div>
          <div className="gamification-card">
            <h3 className="gamification-title">⌨️ 코딩 타자연습</h3>
            <div className="typing-demo">
              <div className="typing-info">
                <p>100스테이지 Python 표현식</p>
                <p>30초 제한 시간</p>
                <p>기관별 일일 랭킹 시스템</p>
              </div>
              <div className="typing-leaderboard">
                <div className="leaderboard-row">🥇 박민수 Stage 47</div>
                <div className="leaderboard-row">🥈 김철수 Stage 38</div>
                <div className="leaderboard-row">🥉 이영희 Stage 32</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
