import { useScrollAnimation } from '../hooks/useScrollAnimation'

const STEPS = [
  { num: 1, title: '문제 선택', desc: '레벨별로 원하는 문제를 골라요' },
  { num: 2, title: '코드 작성', desc: '에디터에서 Python 코드를 작성해요' },
  { num: 3, title: '실행 & 채점', desc: '테스트 케이스로 자동 채점해요' },
  { num: 4, title: 'AI 피드백', desc: '틀리면 AI가 힌트와 설명을 줘요' },
  { num: 5, title: '성장 기록', desc: '진행상황이 자동으로 기록돼요' },
]

export default function HowItWorks() {
  const ref = useScrollAnimation()

  return (
    <section className="section section-gray" id="how-it-works" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2>이렇게 학습해요</h2>
          <p>문제를 풀고, 피드백을 받고, 성장하는 과정</p>
        </div>
        <div className="steps-container">
          {STEPS.map(s => (
            <div className="step" key={s.num}>
              <div className="step-number">{s.num}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              <div className="step-connector" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
