export default function Hero() {
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById('contact')
    if (el) {
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70
      const top = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <section className="hero" id="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <span className="badge">🚀 AI 기반 코딩 교육 플랫폼</span>
          <h1 className="hero-title">
            학생은 <span className="gradient-text">재미있게</span>,<br />
            선생님은 <span className="gradient-text">편리하게</span>
          </h1>
          <p className="hero-subtitle">
            AI 튜터와 게이미피케이션으로<br />
            완성하는 파이썬 코딩 교육
          </p>
          <div className="hero-features">
            <span className="hero-feature">✓ AI 튜터</span>
            <span className="hero-feature">✓ 자동 채점</span>
            <span className="hero-feature">✓ 실시간 관리</span>
            <span className="hero-feature">✓ 동영상 강의</span>
          </div>
          <div className="hero-cta">
            <a href="https://python.letscoding.co.kr" className="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">체험하기</a>
            <a href="#contact" className="btn btn-secondary btn-lg" onClick={scrollToContact}>도입문의</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="code-editor-preview">
            <div className="editor-header">
              <div className="editor-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="editor-title">main.py</span>
            </div>
            <div className="editor-content">
              <pre><code><span className="code-comment"># 두 수의 합을 구하세요</span>{'\n'}<span className="code-keyword">def</span> <span className="code-function">add_numbers</span>(a, b):{'\n'}    <span className="code-keyword">return</span> a + b{'\n'}{'\n'}<span className="code-variable">result</span> = add_numbers(<span className="code-number">5</span>, <span className="code-number">3</span>){'\n'}<span className="code-function">print</span>(result)  <span className="code-comment"># 8</span></code></pre>
            </div>
            <div className="editor-footer">
              <span className="status-badge success">✓ 정답입니다!</span>
              <span className="star-badge">⭐ +1</span>
            </div>
          </div>
          <div className="floating-elements">
            <div className="floating-star star-1">⭐</div>
            <div className="floating-star star-2">🌟</div>
            <div className="floating-star star-3">✨</div>
          </div>
        </div>
      </div>
    </section>
  )
}
