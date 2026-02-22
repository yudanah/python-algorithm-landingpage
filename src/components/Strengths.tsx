import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Strengths() {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student')
  const sectionRef = useScrollAnimation()

  return (
    <section className="section strengths" id="strengths" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">누구에게나 최적의 코딩 교육</h2>
        <p className="section-subtitle">학생과 선생님 모두를 위한 맞춤 기능</p>
        <div className="strength-tabs">
          <button className={`strength-tab-btn${activeTab === 'student' ? ' active' : ''}`} onClick={() => setActiveTab('student')}>학생에게는</button>
          <button className={`strength-tab-btn${activeTab === 'teacher' ? ' active' : ''}`} onClick={() => setActiveTab('teacher')}>선생님에게는</button>
        </div>
        <div className={`tab-content${activeTab === 'student' ? ' active' : ''}`} data-tab="student">
          <div className="strength-cards">
            <div className="strength-card">
              <div className="strength-icon">🤖</div>
              <h3 className="strength-title">AI 인공지능 튜터</h3>
              <p className="strength-text">24시간 언제든 도움받을 수 있어요. 막힐 때 힌트를 주고, 코드를 리뷰해주고, 에러를 쉽게 설명해줍니다.</p>
            </div>
            <div className="strength-card">
              <div className="strength-icon">📚</div>
              <h3 className="strength-title">단계별 문법 학습</h3>
              <p className="strength-text">출력, 입력, 변수부터 함수까지! 체계적인 10단계 커리큘럼과 동영상 강의로 쉽게 배워요.</p>
            </div>
            <div className="strength-card">
              <div className="strength-icon">🏆</div>
              <h3 className="strength-title">알고리즘 난이도별 학습</h3>
              <p className="strength-text">Lv.1부터 Lv.10까지 210+개 문제! 내 실력에 맞는 문제를 풀고, 직접 문제를 만들 수도 있어요.</p>
            </div>
          </div>
        </div>
        <div className={`tab-content${activeTab === 'teacher' ? ' active' : ''}`} data-tab="teacher">
          <div className="strength-cards">
            <div className="strength-card">
              <div className="strength-icon">📊</div>
              <h3 className="strength-title">AI 학습 성과 보고서</h3>
              <p className="strength-text">AI가 학생별 학습 데이터를 분석해 보고서를 생성합니다. 보안 링크로 학부모에게 바로 공유하세요.</p>
            </div>
            <div className="strength-card">
              <div className="strength-icon">👀</div>
              <h3 className="strength-title">학생 학습 관리</h3>
              <p className="strength-text">실시간 로그인 상태, 하루 학습량, 진행률을 한눈에 파악합니다. 개별 메모와 이력 관리도 가능합니다.</p>
            </div>
            <div className="strength-card">
              <div className="strength-icon">🎬</div>
              <h3 className="strength-title">동영상 문법 지도안</h3>
              <p className="strength-text">문법 주제별 동영상 강의를 제공합니다. 학생이 문제 풀이 중에도 바로 시청할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
