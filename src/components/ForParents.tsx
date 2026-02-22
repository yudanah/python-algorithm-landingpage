import { useScrollAnimation } from '../hooks/useScrollAnimation'

const CARDS = [
  {
    icon: '\uD83D\uDCF1',
    title: '학습 리포트 링크',
    desc: '선생님이 보내주는 학습 리포트 링크로, 로그인 없이 바로 우리 아이의 학습 현황을 확인하세요.',
  },
  {
    icon: '\uD83D\uDD12',
    title: '개인정보 보호',
    desc: 'AI 분석 시 학생 실명 비식별화 처리. 이용약관 및 개인정보처리방침을 준수합니다.',
  },
  {
    icon: '\uD83D\uDCCA',
    title: '성장 과정 확인',
    desc: '어떤 문제를 풀었는지, 어디서 어려워하는지 코드 이력으로 성장 과정을 확인할 수 있습니다.',
  },
  {
    icon: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67',
    title: '만 14세 미만 보호',
    desc: '만 14세 미만 학습자의 경우 법정대리인 동의 절차를 거쳐 안전하게 서비스를 이용합니다.',
  },
]

export default function ForParents() {
  const ref = useScrollAnimation()

  return (
    <section className="section section-gray" id="parents" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2>우리 아이 코딩 학습,<br />이렇게 확인하세요</h2>
          <p>학부모님이 안심할 수 있는 환경을 만듭니다</p>
        </div>
        <div className="parents-content">
          <div className="parents-cards">
            {CARDS.map((c, i) => (
              <div className="parent-card" key={i}>
                <div className="parent-card-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
