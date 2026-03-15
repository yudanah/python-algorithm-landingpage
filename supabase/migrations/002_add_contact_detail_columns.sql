-- 도입문의 상세 정보 컬럼 추가
-- 기존 phone, message 외에 개별 필드로 저장

ALTER TABLE contact_inquiries
  ADD COLUMN IF NOT EXISTS org_name TEXT,
  ADD COLUMN IF NOT EXISTS manager_name TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS org_type TEXT,
  ADD COLUMN IF NOT EXISTS student_count TEXT,
  ADD COLUMN IF NOT EXISTS desired_plan TEXT,
  ADD COLUMN IF NOT EXISTS desired_period TEXT;

-- 기존 message 컬럼은 NULL 허용으로 변경 (개별 필드로 분리되었으므로)
ALTER TABLE contact_inquiries ALTER COLUMN message DROP NOT NULL;
