import { useScrollAnimation } from '../hooks/useScrollAnimation'

interface Props {
  onOpenContact: () => void
}

const PLANS = [
  {
    name: '개인',
    price: '문의',
    period: '',
    desc: '학습자 기능 사용',
    features: [
      '전체 문제 풀이 기능',
      '자동 채점 시스템',
      '타자연습 100단계',
      'AI 튜터 (힌트, 리뷰, 설명)',
      '모두의 문제 커뮤니티',
    ],
    featured: false,
  },
  {
    name: '기관',
    price: '문의',
    period: '',
    desc: '선생님 · 학생 · 클래스 관리',
    features: [
      '개인 요금제 전체 기능',
      '학생 관리 대시보드',
      '반/클래스 관리',
      '교사 배정 및 커리큘럼 관리',
      'AI 학부모 피드백 생성',
    ],
    featured: true,
    badge: '추천',
  },
]

export default function Pricing({ onOpenContact }: Props) {
  const ref = useScrollAnimation()

  return (
    <section className="section section-gray" id="pricing" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2>합리적인 요금제</h2>
          <p>기관 규모에 맞는 플랜을 선택하세요</p>
        </div>
        <div className="pricing-grid">
          {PLANS.map((p, i) => (
            <div className={`pricing-card${p.featured ? ' featured' : ''}`} key={i}>
              {p.badge && <div className="pricing-badge">{p.badge}</div>}
              <div className="pricing-name">{p.name}</div>
              <div className="pricing-price">
                {p.price}
                {p.period && <span className="period"> {p.period}</span>}
              </div>
              <div className="pricing-desc">{p.desc}</div>
              <ul className="pricing-features">
                {p.features.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
              <button className={`btn pricing-btn ${p.featured ? 'btn-primary' : 'btn-outline'}`} onClick={onOpenContact}>
                문의하기
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
