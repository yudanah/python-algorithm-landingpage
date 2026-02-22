-- Contact Inquiries Table
-- 랜딩페이지 도입문의 폼 데이터 저장

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화 (서비스 키로만 접근 허용)
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- 서비스 역할만 CRUD 허용 (anon/authenticated 차단)
CREATE POLICY "Service role full access"
  ON contact_inquiries
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
