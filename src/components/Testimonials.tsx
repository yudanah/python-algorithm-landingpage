import { useScrollAnimation } from '../hooks/useScrollAnimation'

const testimonials = [
  {
    text: '"학생들이 별을 모으려고 문제를 더 많이 풀어요. 자동 채점 덕분에 수업 준비 시간이 절반으로 줄었습니다."',
    name: '김○○ 원장',
    company: '○○코딩학원',
  },
  {
    text: '"AI 학습 보고서로 학부모 상담이 훨씬 수월해졌어요. 데이터에 기반한 피드백이라 신뢰도가 높습니다."',
    name: '이○○ 강사',
    company: '△△코딩교육센터',
  },
  {
    text: '"타자연습 랭킹 덕분에 학생들이 쉬는 시간에도 자발적으로 연습해요. 동기 부여가 확실합니다."',
    name: '박○○ 원장',
    company: '□□프로그래밍학원',
  },
]

export default function Testimonials() {
  const sectionRef = useScrollAnimation()

  return (
    <section className="section testimonials" id="testimonials" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">이미 많은 학원에서 사용하고 있습니다</h2>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <span className="author-name">{t.name}</span>
                <span className="author-company">{t.company}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
