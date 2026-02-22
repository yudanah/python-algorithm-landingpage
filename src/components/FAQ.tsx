import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const faqItems = [
  { q: '체험해볼 수 있나요?', a: '네, python.letscoding.co.kr 에서 바로 체험하실 수 있습니다.' },
  { q: '학생들이 직접 가입하나요?', a: '아니요, 관리자가 학생 계정을 생성하고 비밀번호를 안내합니다.' },
  { q: '문제를 직접 만들 수 있나요?', a: '관리자 권한으로 문제와 테스트케이스를 직접 추가할 수 있습니다. 학생도 "모두의 문제"에서 문제를 출제할 수 있습니다.' },
  { q: '어떤 기기에서 사용할 수 있나요?', a: 'PC, 태블릿, 스마트폰 등 모든 기기에서 사용 가능합니다.' },
  { q: 'AI 튜터는 어떤 기능을 제공하나요?', a: '단계별 힌트, 코드 리뷰, 에러 분석, 개념 설명, 대화형 튜터링, 풀이 비교, 학습 성과 보고서 생성을 지원합니다.' },
  { q: '학부모에게 학습 현황을 공유할 수 있나요?', a: 'AI가 생성한 학습 성과 보고서를 보안 링크로 학부모에게 공유할 수 있습니다. 학부모는 로그인 없이 열람합니다.' },
  { q: '도입 비용은 어떻게 되나요?', a: '학원 규모와 필요에 맞는 맞춤 견적을 제공합니다. 도입문의를 남겨주시면 담당자가 안내드립니다.' },
  { q: '기존 학원 관리 프로그램과 연동되나요?', a: '현재 독립 운영되며, API 연동은 도입문의를 통해 상담 가능합니다.' },
]

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const sectionRef = useScrollAnimation()

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="section faq" id="faq" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">자주 묻는 질문</h2>
        <div className="faq-list">
          {faqItems.map((item, i) => (
            <div key={i} className={`faq-item${activeIndex === i ? ' active' : ''}`}>
              <button className="faq-question" onClick={() => toggle(i)}>
                <span>{item.q}</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
