import { useScrollAnimation } from '../hooks/useScrollAnimation'

const categories = [
  { num: 1, title: '출력', desc: '문자열 출력과 간단한 문자열 활용' },
  { num: 2, title: '입력', desc: '숫자 입력과 기본 산술 연산' },
  { num: 3, title: '자료형', desc: '자료형 구분과 활용' },
  { num: 4, title: '변수', desc: '변수 만들기와 값 활용' },
  { num: 5, title: '리스트', desc: '리스트로 여러 값 다루기' },
  { num: 6, title: '딕셔너리', desc: '딕셔너리로 정보 정리' },
  { num: 7, title: '논리', desc: '참과 거짓으로 조건 판단' },
  { num: 8, title: '조건문', desc: '조건문으로 프로그램 흐름 제어' },
  { num: 9, title: '반복문', desc: '반복문으로 작업 자동화' },
  { num: 10, title: '함수', desc: '함수로 코드 정리 및 재사용' },
]

export default function Curriculum() {
  const sectionRef = useScrollAnimation()

  return (
    <section className="section curriculum" id="curriculum" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">체계적인 커리큘럼으로 시작하세요</h2>
        <p className="section-subtitle">파이썬 기초부터 알고리즘까지, 단계별 학습</p>
        <div className="curriculum-levels">
          <div className="level-card active">
            <div className="level-icon">📗</div>
            <h3 className="level-title">문법 학습</h3>
            <p className="level-subtitle">기초</p>
            <span className="level-count">10카테고리 + 동영상</span>
          </div>
          <div className="level-card active">
            <div className="level-icon">📙</div>
            <h3 className="level-title">알고리즘 (Lv.1~10)</h3>
            <p className="level-subtitle">실전</p>
            <span className="level-count">210+ AI 시드 문제</span>
          </div>
          <div className="level-card active">
            <div className="level-icon">🌐</div>
            <h3 className="level-title">모두의 문제</h3>
            <p className="level-subtitle">커뮤니티</p>
            <span className="level-count">학생 직접 출제</span>
          </div>
        </div>
        <div className="curriculum-detail">
          <h3 className="curriculum-detail-title">기초 커리큘럼 (10개 카테고리)</h3>
          <div className="curriculum-grid">
            {categories.map((cat) => (
              <div key={cat.num} className="curriculum-item">
                <span className="curriculum-number">{cat.num}</span>
                <div className="curriculum-content">
                  <h4>{cat.title}</h4>
                  <p>{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
