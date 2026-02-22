import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function HowItWorks() {
  const sectionRef = useScrollAnimation()

  return (
    <section className="section how-it-works" id="how-it-works" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">3단계로 시작하세요</h2>
        <p className="section-subtitle">복잡한 설정 없이, 도입 문의 후 바로 시작 가능</p>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3 className="step-title">도입 문의</h3>
              <p className="step-text">전화번호와 문의 내용을 남겨주시면 담당자가 연락드립니다</p>
              <span className="step-time">1분</span>
            </div>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3 className="step-title">기관 셋업</h3>
              <p className="step-text">학원/학교 정보 등록, 클래스 생성, 학생 계정 생성</p>
              <span className="step-time">10분</span>
            </div>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3 className="step-title">학습 시작</h3>
              <p className="step-text">학생은 문제를 풀고, 선생님은 실시간으로 확인합니다</p>
              <span className="step-time">즉시</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
