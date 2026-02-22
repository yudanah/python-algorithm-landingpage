import { useScrollAnimation } from '../hooks/useScrollAnimation'

const FEATURES = [
  {
    icon: '\uD83D\uDCDA',
    title: '단계별 문제 풀이',
    desc: '출력부터 함수까지 8단계 입문 커리큘럼. 나나쌤 영상과 코드 작성, AI 나나의 도움까지.',
  },
  {
    icon: '\uD83E\uDD16',
    title: 'AI 튜터',
    desc: '막힐 때 AI가 힌트 제공, 코드 리뷰, 개념 설명, 풀이 비교까지. 1:1 채팅 튜터링도 지원.',
  },
  {
    icon: '\u2328\uFE0F',
    title: '타자연습',
    desc: 'Python 키워드로 구성된 100단계 타자 게임. 코딩에 필요한 특수문자 타이핑까지 자연스럽게.',
  },
  {
    icon: '\uD83C\uDF10',
    title: '모두의 문제',
    desc: '학생이 직접 문제를 만들고 친구들이 풀 수 있는 커뮤니티. AI가 난이도를 자동 배정.',
  },
]

export default function Features() {
  const ref = useScrollAnimation()

  return (
    <section className="section" id="features" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2>코딩 교육에 필요한 모든 것</h2>
          <p>하나의 플랫폼에서 학습, 평가, 관리까지</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
