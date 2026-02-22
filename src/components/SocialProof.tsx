const STATS = [
  { icon: '\uD83C\uDFEB', number: '10+', label: '도입 기관' },
  { icon: '\uD83D\uDC68\u200D\uD83C\uDF93', number: '500+', label: '누적 학습자' },
  { icon: '\uD83D\uDCDD', number: '300+', label: '학습 문제' },
]

export default function SocialProof() {
  return (
    <section className="social-proof">
      <div className="container">
        <div className="social-proof-inner">
          {STATS.map((s, i) => (
            <div className="proof-item" key={i}>
              <div className="proof-number">{s.icon} {s.number}</div>
              <div className="proof-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
