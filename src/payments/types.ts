export type PaymentQuote = {
  id: number
  quote_number: string | null
  title: string
  org_name: string
  manager_name: string | null
  access_email: string
  status: string
  issued_at: string | null
  valid_until: string | null
  currency: string
  subtotal_amount: number
  discount_amount: number
  tax_amount: number
  total_amount: number
  notes: string | null
  payment_url: string | null
  public_token: string
  quote_items: Array<{
    id: number
    sort_order: number
    item_name: string
    description: string | null
    quantity: number
    unit_price: number
    amount: number
  }>
  quote_payments?: Array<{
    id: number
    status: string
    method: string | null
    amount: number
    approved_at: string | null
    receipt_url: string | null
    created_at: string
  }>
}
