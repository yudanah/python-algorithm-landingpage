import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Features() {
  const sectionRef = useScrollAnimation()

  return (
    <section className="section features" id="features" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">코딩 교육에 필요한 모든 것</h2>
        <p className="section-subtitle">하나의 플랫폼에서 학습, 평가, 관리까지</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3 className="feature-title">온라인 코드 에디터</h3>
            <p className="feature-text">설치 없이 브라우저에서 바로 Python 코드 작성 및 실행</p>
            <span className="feature-tag">CodeMirror, 문법 하이라이팅</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3 className="feature-title">자동 채점 시스템</h3>
            <p className="feature-text">테스트케이스 기반 즉각적인 정답 확인으로 선생님 부담 감소</p>
            <span className="feature-tag">실시간 채점, 5초 타임아웃</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI 학습 지원</h3>
            <p className="feature-text">막힐 때 AI가 힌트를 주고, 제출한 코드를 리뷰해줍니다</p>
            <span className="feature-tag">Claude AI, 개인 맞춤형</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3 className="feature-title">게이미피케이션</h3>
            <p className="feature-text">문제를 풀면 별을 획득! 은색별 → 금색별로 레벨업</p>
            <span className="feature-tag">동기 부여, 성취감</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⌨️</div>
            <h3 className="feature-title">타자연습</h3>
            <p className="feature-text">Python 코딩 표현식으로 100스테이지 타자 게임 + 일일 랭킹</p>
            <span className="feature-tag">코딩 타자, 기관별 리더보드</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3 className="feature-title">모두의 문제</h3>
            <p className="feature-text">학생이 직접 문제를 만들고, AI가 난이도를 자동 분류</p>
            <span className="feature-tag">커뮤니티, Lv.1~10</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">실시간 대시보드</h3>
            <p className="feature-text">클래스별 학생 진행 상황을 한눈에 파악</p>
            <span className="feature-tag">실시간 모니터링, 리포트</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎬</div>
            <h3 className="feature-title">동영상 문법 강의</h3>
            <p className="feature-text">문법 주제별 영상 자료를 문제 풀이와 함께 제공</p>
            <span className="feature-tag">Bunny Stream, 지도안</span>
          </div>
        </div>
      </div>
    </section>
  )
}
