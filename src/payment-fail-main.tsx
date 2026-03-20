import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PaymentFailPage from './payments/PaymentFailPage'
import './styles/payment.css'

createRoot(document.getElementById('payment-root')!).render(
  <StrictMode>
    <PaymentFailPage />
  </StrictMode>,
)
