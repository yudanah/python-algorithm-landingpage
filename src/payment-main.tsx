import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PaymentPage from './payments/PaymentPage'
import './styles/payment.css'

createRoot(document.getElementById('payment-root')!).render(
  <StrictMode>
    <PaymentPage />
  </StrictMode>,
)
