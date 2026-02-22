import { useScrollAnimation } from '../hooks/useScrollAnimation'

interface Props {
  onOpenContact: () => void
}

const FEATURES = [
  { title: '실시간 진행상황', desc: '어떤 학생이 어디서 막혀있는지 한눈에 파악' },
  { title: '커리큘럼 관리', desc: '학생 수준에 맞게 개인별 커리큘럼 설정' },
  { title: '학부모 피드백 공유', desc: 'AI가 학습 리포트를 자동 생성, 링크 하나로 학부모에게 전달' },
  { title: '코드 이력 관리', desc: '학생이 어떻게 성장했는지 코드로 확인' },
  { title: '반/교사 관리', desc: '반 생성, 교사 배정, 구독 관리까지 한 곳에서' },
]

const MOCK_STUDENTS = [
  { name: '김민준', progress: 85, status: '학습 중', color: '#10B981' },
  { name: '이서연', progress: 72, status: '학습 중', color: '#10B981' },
  { name: '박지호', progress: 45, status: '도움 필요', color: '#F59E0B' },
  { name: '최수아', progress: 93, status: '완료', color: '#2563EB' },
]

export default function ForEducators({ onOpenContact }: Props) {
  const ref = useScrollAnimation()

  return (
    <section className="section" id="educators" ref={ref}>
      <div className="container">
        <div className="educators-layout">
          <div className="educators-text">
            <h2>선생님은 가르치는 데만<br />집중하세요.</h2>
            <p className="subtitle">학생 관리는 저희가 도와드립니다.</p>
            <div className="educators-features">
              {FEATURES.map((f, i) => (
                <div className="educator-feature" key={i}>
                  <div className="check">&#10003;</div>
                  <p><strong>{f.title}</strong> &mdash; {f.desc}</p>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={onOpenContact}>
              도입 문의하기
            </button>
          </div>
          <div className="educators-visual">
            <div className="dashboard-mockup">
              <div className="dashboard-mockup-header">
                <div className="dashboard-mockup-dot" style={{ background: '#EF4444' }} />
                <div className="dashboard-mockup-dot" style={{ background: '#F59E0B' }} />
                <div className="dashboard-mockup-dot" style={{ background: '#10B981' }} />
                <span style={{ marginLeft: '0.5rem' }}>중등반 A - 학생 진행상황</span>
              </div>
              <div className="dashboard-mockup-body">
                {MOCK_STUDENTS.map((s, i) => (
                  <div className="mockup-row" key={i}>
                    <div className="mockup-student">
                      <div className="mockup-avatar">{s.name[0]}</div>
                      <span className="mockup-name">{s.name}</span>
                    </div>
                    <div className="mockup-progress">
                      <div className="mockup-bar">
                        <div className="mockup-bar-fill" style={{ width: `${s.progress}%`, background: s.color }} />
                      </div>
                      <span className="mockup-percent">{s.progress}%</span>
                    </div>
                    <span className="mockup-status" style={{ color: s.color }}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
