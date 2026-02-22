import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState('students')
  const sectionRef = useScrollAnimation()

  return (
    <section className="section dashboard-preview" id="dashboard" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">한눈에 파악하는 학습 현황</h2>
        <p className="section-subtitle">선생님을 위한 강력한 관리 도구</p>
        <div className="dashboard-tabs">
          <button className={`tab-btn${activeTab === 'students' ? ' active' : ''}`} onClick={() => setActiveTab('students')}>학생 현황</button>
          <button className={`tab-btn${activeTab === 'class' ? ' active' : ''}`} onClick={() => setActiveTab('class')}>클래스 관리</button>
          <button className={`tab-btn${activeTab === 'reports' ? ' active' : ''}`} onClick={() => setActiveTab('reports')}>AI 보고서</button>
        </div>
        <div className="dashboard-content">
          <div className="dashboard-window">
            <div className="dashboard-header">
              <span className="class-name">클래스: 파이썬 기초반</span>
            </div>
            <div className="dashboard-table">
              <div className="table-header">
                <span>학생명</span>
                <span>진행률</span>
                <span>로그인</span>
                <span>오늘 학습</span>
                <span>별</span>
              </div>
              <div className="table-row">
                <span className="student-name">김철수</span>
                <span className="progress-cell">
                  <div className="mini-progress"><div className="mini-fill" style={{ width: '72%' }}></div></div>
                  <span>72%</span>
                </span>
                <span className="activity">🟢 온라인</span>
                <span className="activity">12문제</span>
                <span className="stars">⭐⭐⭐</span>
              </div>
              <div className="table-row">
                <span className="student-name">이영희</span>
                <span className="progress-cell">
                  <div className="mini-progress"><div className="mini-fill" style={{ width: '58%' }}></div></div>
                  <span>58%</span>
                </span>
                <span className="activity">⚪ 오프라인</span>
                <span className="activity">0문제</span>
                <span className="stars">⭐⭐</span>
              </div>
              <div className="table-row">
                <span className="student-name">박민수</span>
                <span className="progress-cell">
                  <div className="mini-progress"><div className="mini-fill" style={{ width: '85%' }}></div></div>
                  <span>85%</span>
                </span>
                <span className="activity">🟢 온라인</span>
                <span className="activity">8문제</span>
                <span className="stars">⭐⭐⭐⭐</span>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-features">
          <span className="dashboard-feature">✓ 클래스별 학생 진행 상황</span>
          <span className="dashboard-feature">✓ 실시간 로그인 상태 확인</span>
          <span className="dashboard-feature">✓ 하루 학습량 체크</span>
          <span className="dashboard-feature">✓ 개별 학생 상세 기록 &amp; 메모</span>
          <span className="dashboard-feature">✓ AI 학습 성과 보고서 생성</span>
          <span className="dashboard-feature">✓ 학부모 피드백 공유 링크</span>
          <span className="dashboard-feature">✓ 문제별 정답률 통계</span>
          <span className="dashboard-feature">✓ AI 사용 내역 추적</span>
        </div>
      </div>
    </section>
  )
}
