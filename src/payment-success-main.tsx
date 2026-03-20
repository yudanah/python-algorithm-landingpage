import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PaymentSuccessPage from './payments/PaymentSuccessPage'
import './styles/payment.css'

createRoot(document.getElementById('payment-root')!).render(
  <StrictMode>
    <PaymentSuccessPage />
  </StrictMode>,
)
