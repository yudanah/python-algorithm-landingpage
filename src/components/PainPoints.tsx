import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function PainPoints() {
  const sectionRef = useScrollAnimation()

  return (
    <section className="section pain-points" id="pain-points" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">코딩 교육, 이런 고민 있으셨죠?</h2>
        <div className="pain-cards">
          <div className="pain-card">
            <div className="pain-icon">😓</div>
            <h3 className="pain-title">개별 관리의 어려움</h3>
            <p className="pain-text">학생마다 실력이 달라서 한 명 한 명 케어하기 힘들어요</p>
          </div>
          <div className="pain-card">
            <div className="pain-icon">⏰</div>
            <h3 className="pain-title">시간 부족</h3>
            <p className="pain-text">채점하고 피드백 주는 데 수업 시간이 다 가요</p>
          </div>
          <div className="pain-card">
            <div className="pain-icon">📊</div>
            <h3 className="pain-title">진도 파악 어려움</h3>
            <p className="pain-text">누가 어디까지 했는지 일일이 확인하기 번거로워요</p>
          </div>
        </div>
        <p className="transition-text">이제 Let's Coding &amp; Play가 해결해 드립니다 ↓</p>
      </div>
    </section>
  )
}
