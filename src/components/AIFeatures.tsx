import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function AIFeatures() {
  const sectionRef = useScrollAnimation()

  return (
    <section className="section ai-features" id="ai-features" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">24시간 AI 튜터가 함께합니다</h2>
        <p className="section-subtitle">학생이 막힐 때, AI가 도와드립니다</p>
        <div className="ai-container">
          <div className="ai-list">
            <div className="ai-item">
              <div className="ai-item-icon">🔍</div>
              <div className="ai-item-content">
                <h3 className="ai-item-title">AI 힌트</h3>
                <p className="ai-item-text">문제를 못 풀 때 단계별로 힌트를 제공합니다. 정답을 직접 알려주지 않고 생각할 수 있게 유도합니다.</p>
              </div>
            </div>
            <div className="ai-item">
              <div className="ai-item-icon">📝</div>
              <div className="ai-item-content">
                <h3 className="ai-item-title">코드 리뷰</h3>
                <p className="ai-item-text">제출한 코드의 개선점을 친절하게 알려줍니다. 더 좋은 코드 작성법을 학습할 수 있습니다.</p>
              </div>
            </div>
            <div className="ai-item">
              <div className="ai-item-icon">🐛</div>
              <div className="ai-item-content">
                <h3 className="ai-item-title">에러 분석</h3>
                <p className="ai-item-text">코드 실행 중 발생한 에러를 학생 눈높이에 맞춰 설명합니다.</p>
              </div>
            </div>
            <div className="ai-item">
              <div className="ai-item-icon">💬</div>
              <div className="ai-item-content">
                <h3 className="ai-item-title">대화형 튜터</h3>
                <p className="ai-item-text">리스트, 딕셔너리 등 이해가 어려운 개념을 대화형으로 설명합니다. 여러 번 주고받는 멀티턴 대화를 지원합니다.</p>
              </div>
            </div>
            <div className="ai-item">
              <div className="ai-item-icon">🔄</div>
              <div className="ai-item-content">
                <h3 className="ai-item-title">풀이 비교</h3>
                <p className="ai-item-text">제출한 코드와 모범 답안을 비교 분석하여 개선 방향을 알려줍니다.</p>
              </div>
            </div>
          </div>
          <div className="ai-demo">
            <div className="chat-window">
              <div className="chat-header">
                <span className="chat-avatar">🤖</span>
                <span className="chat-title">AI 튜터</span>
              </div>
              <div className="chat-messages">
                <div className="chat-message user">
                  <p>리스트에서 값을 어떻게 가져와요?</p>
                </div>
                <div className="chat-message ai">
                  <p>💡 <strong>힌트:</strong> 리스트의 인덱스는 0부터 시작해요.</p>
                  <p><code>arr[0]</code>이 첫 번째 요소입니다.</p>
                  <p>예를 들어 <code>{'fruits = ["사과", "바나나"]'}</code>에서 "사과"는 <code>fruits[0]</code>으로 접근해요!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ai-teacher-section">
          <h3 className="ai-teacher-subtitle">선생님을 위한 AI</h3>
          <div className="ai-teacher-grid">
            <div className="ai-teacher-item">
              <div className="ai-teacher-icon">📊</div>
              <div className="ai-teacher-content">
                <h4 className="ai-teacher-title">AI 학습 성과 보고서</h4>
                <p className="ai-teacher-text">학생별 학습 데이터를 AI가 분석하여 성장 포인트와 개선 사항을 담은 보고서를 자동 생성합니다.</p>
              </div>
            </div>
            <div className="ai-teacher-item">
              <div className="ai-teacher-icon">🔗</div>
              <div className="ai-teacher-content">
                <h4 className="ai-teacher-title">학부모 피드백 공유</h4>
                <p className="ai-teacher-text">생성된 보고서를 보안 링크로 학부모에게 공유합니다. 학부모는 로그인 없이 열람할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
