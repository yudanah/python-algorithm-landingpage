-- 기관, 견적, 견적 항목, 견적 조회용 이메일 인증 세션

-- organizations 테이블은 python.letscoding.kr 과 공유하므로
-- 기존 테이블에 랜딩페이지용 컬럼만 추가한다.
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS inquiry_id BIGINT REFERENCES contact_inquiries(id) ON DELETE SET NULL;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS normalized_name TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS manager_name TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS organizations_normalized_name_idx
  ON organizations(normalized_name);

CREATE INDEX IF NOT EXISTS organizations_contact_email_idx
  ON organizations(contact_email);

CREATE TABLE IF NOT EXISTS quotes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  organization_id BIGINT REFERENCES organizations(id) ON DELETE SET NULL,
  inquiry_id BIGINT REFERENCES contact_inquiries(id) ON DELETE SET NULL,
  quote_number TEXT UNIQUE,
  title TEXT NOT NULL,
  org_name TEXT NOT NULL,
  access_email TEXT NOT NULL,
  manager_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'payment_pending', 'paid', 'expired', 'cancelled')),
  issued_at TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  currency TEXT NOT NULL DEFAULT 'KRW',
  subtotal_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  payment_url TEXT,
  public_token TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quotes_access_email_idx
  ON quotes(access_email);

CREATE INDEX IF NOT EXISTS quotes_org_name_idx
  ON quotes(org_name);

CREATE INDEX IF NOT EXISTS quotes_status_idx
  ON quotes(status);

CREATE INDEX IF NOT EXISTS quotes_public_token_idx
  ON quotes(public_token);

CREATE TABLE IF NOT EXISTS quote_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quote_id BIGINT NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quote_items_quote_id_idx
  ON quote_items(quote_id, sort_order);

CREATE TABLE IF NOT EXISTS quote_access_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_name TEXT NOT NULL,
  normalized_org_name TEXT NOT NULL,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  access_token_hash TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  access_expires_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  failed_attempts INT NOT NULL DEFAULT 0,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quote_access_requests_lookup_idx
  ON quote_access_requests(email, normalized_org_name, created_at DESC);

CREATE INDEX IF NOT EXISTS quote_access_requests_token_idx
  ON quote_access_requests(access_token_hash);

DROP TRIGGER IF EXISTS set_updated_at_organizations ON organizations;
CREATE TRIGGER set_updated_at_organizations
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_quotes
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- organizations RLS는 python.letscoding.kr에서 이미 설정되어 있을 수 있으므로
-- 정책만 추가 (이미 존재하면 재생성)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_access_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access organizations" ON organizations;
CREATE POLICY "Service role full access organizations"
  ON organizations
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access quotes"
  ON quotes
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access quote_items"
  ON quote_items
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access quote_access_requests"
  ON quote_access_requests
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
