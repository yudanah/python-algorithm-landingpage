import { useState, useEffect } from 'react'

interface Props {
  onVisibilityChange: (visible: boolean) => void
}

export default function TopBanner({ onVisibilityChange }: Props) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    onVisibilityChange(visible)
  }, [visible, onVisibilityChange])

  const handleClose = () => {
    setVisible(false)
    onVisibilityChange(false)
  }

  if (!visible) return null

  return (
    <div className="top-banner">
      <div className="container top-banner-inner">
        <span>
          <span className="full-text">
            이미 사용 중이신가요?{' '}
            <a href="https://python.letscoding.kr" target="_blank" rel="noopener noreferrer">
              python.letscoding.kr 바로가기 &rarr;
            </a>
          </span>
          <span className="short-text">
            <a href="https://python.letscoding.kr" target="_blank" rel="noopener noreferrer">
              학습하러 가기 &rarr;
            </a>
          </span>
        </span>
        <button className="top-banner-close" onClick={handleClose} aria-label="닫기">
          &times;
        </button>
      </div>
    </div>
  )
}
