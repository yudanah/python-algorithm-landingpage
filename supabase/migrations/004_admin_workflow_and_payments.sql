-- 문의 상태 확장 및 결제 기록 테이블

ALTER TABLE contact_inquiries
  DROP CONSTRAINT IF EXISTS contact_inquiries_status_check;

ALTER TABLE contact_inquiries
  ADD CONSTRAINT contact_inquiries_status_check
  CHECK (status IN ('pending', 'contacted', 'quoted', 'payment_pending', 'paid', 'closed', 'lost'));

CREATE TABLE IF NOT EXISTS quote_payments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quote_id BIGINT NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
  method TEXT,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_key TEXT,
  order_id TEXT,
  receipt_url TEXT,
  approved_at TIMESTAMPTZ,
  failure_code TEXT,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quote_payments_quote_id_idx
  ON quote_payments(quote_id, created_at DESC);

CREATE TRIGGER set_updated_at_quote_payments
  BEFORE UPDATE ON quote_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE quote_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access quote_payments"
  ON quote_payments
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
