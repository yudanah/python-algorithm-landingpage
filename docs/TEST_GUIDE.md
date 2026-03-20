# 수동 테스트 가이드

렛츠코딩 기관 결제 시스템의 전체 비즈니스 플로우를 테스트하기 위한 단계별 검증 매뉴얼입니다.

**테스트 범위**: 도입문의 → 견적 생성 → 견적 조회 → 결제

---

## 사전 준비

### 1. 로컬 서버 실행

```bash
# Vercel dev 서버 시작 (포트 3000)
vercel dev --listen 3000
```

### 2. 환경변수 확인

`.env.local` 파일이 다음 환경변수를 포함하는지 확인합니다:

| 환경변수 | 설명 | 예시 |
|---------|------|------|
| `SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxxxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase 서비스 롤 키 | `eyJ...` |
| `RESEND_API_KEY` | Resend 이메일 API 키 | `re_xxxxx` |
| `RESEND_FROM_NAME` | 이메일 발신자 이름 | `Let's Coding` |
| `RESEND_FROM_EMAIL` | 이메일 발신자 주소 | `noreply@letscoding.kr` |
| `SOLAPI_API_KEY` | SOLAPI SMS API 키 | `xxxxx` |
| `SOLAPI_API_SECRET` | SOLAPI SMS API 시크릿 | `xxxxx` |
| `SOLAPI_SENDER_NUMBER` | SMS 발신 번호 | `01000000000` |
| `ADMIN_DASHBOARD_KEY` | 관리자 대시보드 인증 키 | (임의의 문자열) |
| `TOSS_PAYMENTS_SECRET_KEY` | 토스페이먼츠 시크릿 키 | `sk_test_xxxxx` |
| `VITE_TOSS_PAYMENTS_CLIENT_KEY` | 토스페이먼츠 클라이언트 키 | `sk_test_xxxxx` |

### 3. 브라우저 준비

- 최신 크롬/파이어폭스/사파리 사용
- 개발자 도구 열기 (F12 또는 우클릭 → 검사)
- 콘솔 탭에서 에러 확인 준비

---

## 테스트 데이터

### 관리자 정보

| 항목 | 값 |
|------|-----|
| 이메일 | `contact@letscoding.kr` |
| 관리자 키 | `.env` 파일의 `ADMIN_DASHBOARD_KEY` 값 |

### 신청자 정보

| 항목 | 값 |
|------|-----|
| 기관명 | 에코르 |
| 기관유형 | 학교 |
| 담당자 이름 | 이코르 |
| 연락처 | 010-5679-0072 |
| 이메일 | coding-edu@kakao.com |
| 예상 학생 수 | (선택 사항 - 테스트 생략 가능) |
| 희망 라이선스 | 무료체험 |
| 희망 기간 | 14일 (무료체험 선택 시 자동 설정) |
| 문의 내용 | 체험 해보고 싶어요. |

---

## Phase 1: 도입문의 테스트

### 1.1 도입문의 폼 접속

**단계:**
1. 브라우저에서 `http://localhost:3000` 접속
2. 페이지 스크롤 또는 네비게이션에서 "도입 문의" 버튼 클릭
3. 도입문의 모달이 열리는지 확인

### 1.2 폼 필드 입력

**입력 데이터:**

| 필드 | 입력값 | 확인사항 |
|------|--------|---------|
| 기관명 | 에코르 | 필수 항목 |
| 담당자 이름 | 이코르 | 필수 항목 |
| 연락처 | 010-5679-0072 | 필수 항목, 하이픈 포함 가능 |
| 이메일 | coding-edu@kakao.com | 필수 항목, 이메일 형식 |
| 기관 유형 | 학교 | 필수 항목, 드롭다운 선택 |
| 예상 학생 수 | (선택사항 - 건너뛰기) | 선택 항목 |
| 희망 라이선스 | 무료체험 | 선택 항목 |
| 희망 기간 | 14일 | 자동 설정되어야 함 |
| 문의 내용 | 체험 해보고 싶어요. | 선택 항목 |

### 1.3 자동 설정 검증

**확인할 사항:**

- [ ] 희망 라이선스에서 "무료체험" 선택 시, 희망 기간이 자동으로 "14일"로 설정되는지 확인
- [ ] 희망 라이선스가 "무료체험"일 때, 희망 기간 select가 disabled 상태인지 확인
- [ ] 희망 라이선스를 다른 옵션(Basic, Standard 등)으로 변경하면 희망 기간이 disabled 해제되고 빈 상태가 되는지 확인

### 1.4 폼 제출

**단계:**
1. "문의 보내기" 버튼 클릭
2. 로딩 상태 표시 확인

**예상 결과:**

- [ ] 성공 메시지: "문의가 접수되었습니다" 표시
- [ ] 모달에서 체크마크 아이콘과 성공 메시지 표시
- [ ] 모달 닫기 또는 대기 시간 후 자동 닫기

### 1.5 외부 알림 검증

**이메일 확인:**

1. `contact@letscoding.kr` 이메일 계정 확인
2. 제목: `[도입문의] 에코르 - 이코르`
3. 본문에 다음 정보 포함:
   - 기관명: 에코르
   - 담당자 이름: 이코르
   - 전화번호: 010-5679-0072
   - 이메일: coding-edu@kakao.com
   - 기관 유형: 학교
   - 희망 플랜: 무료체험
   - 희망 기간: 14일
   - 문의 내용: 체험 해보고 싶어요.

**SMS 확인:**

1. 010-5679-0072로 문자 수신 확인
2. 내용: `[렛츠코딩] 이코르님, 도입 문의가 정상 접수되었습니다. 빠른 시일 내 연락드리겠습니다.`

### 1.6 데이터베이스 검증

**Supabase 대시보드 → SQL Editor에서 실행:**

```sql
SELECT * FROM contact_inquiries
ORDER BY created_at DESC LIMIT 1;
```

**확인할 항목:**

- [ ] `org_name` = '에코르'
- [ ] `manager_name` = '이코르'
- [ ] `phone` = '010-5679-0072'
- [ ] `email` = 'coding-edu@kakao.com'
- [ ] `org_type` = '학교'
- [ ] `desired_plan` = '무료체험'
- [ ] `desired_period` = '14일'
- [ ] `message` = '체험 해보고 싶어요.'
- [ ] `status` = 'pending' (기본값)
- [ ] `created_at` = 현재 시간 근처

---

## Phase 2: 관리자 견적 생성 테스트

### 2.1 관리자 대시보드 접속

**단계:**
1. 브라우저에서 `http://localhost:3000/admin.html` 접속
2. 상단 키 입력 필드에 `ADMIN_DASHBOARD_KEY` 값 입력
3. "관리자 키 저장" 버튼 클릭

**확인할 사항:**

- [ ] 성공 메시지 표시
- [ ] 관리자 키가 세션 스토리지에 저장됨 (콘솔에서 확인 가능)
- [ ] 좌측 사이드바에 "도입 문의" 목록 로드

### 2.2 문의 선택 및 상세 정보 확인

**단계:**
1. 좌측 사이드바에서 "에코르" 문의 찾아서 클릭
2. 오른쪽 메인 영역에 문의 상세 정보 표시되는지 확인

**확인할 사항:**

- [ ] 기관명: 에코르
- [ ] 담당자 이름: 이코르
- [ ] 이메일: coding-edu@kakao.com
- [ ] 전화번호: 010-5679-0072
- [ ] 기관 유형: 학교
- [ ] 희망 플랜: 무료체험
- [ ] 희망 기간: 14일
- [ ] 문의 내용: 체험 해보고 싶어요.

### 2.3 견적 생성 폼 자동 채움 확인

**확인할 사항:**

- [ ] "견적 생성" 섹션의 "조회용 이메일" 필드가 자동으로 `coding-edu@kakao.com`으로 채워짐
- [ ] "담당자 이름" 필드가 자동으로 `이코르`으로 채워짐

### 2.4 견적 정보 입력

**입력 데이터:**

| 필드 | 입력값 | 비고 |
|------|--------|------|
| 견적명 | 렛츠코딩 기관 이용 견적 | 기본값 사용 |
| 조회용 이메일 | coding-edu@kakao.com | 자동 채움됨 |
| 담당자 이름 | 이코르 | 자동 채움됨 |
| 견적 상태 | sent | 드롭다운에서 선택 |
| 발행일 | (오늘 날짜) | 기본값 |
| 유효기간 | (비워두기) | 선택사항 |
| 할인 금액 | 0 | 무료체험이므로 |

### 2.5 견적 항목 입력

**항목 1 입력:**

| 필드 | 입력값 | 비고 |
|------|--------|------|
| 항목명 | 무료체험 라이선스 | 필수 |
| 설명 | (비워두기) | 선택사항 |
| 수량 | 1 | 필수 |
| 단가 | 0 | 무료체험이므로 0원 |

**참고: 0원 결제 이슈**

토스페이먼츠에서 0원 결제를 지원하지 않을 수 있습니다. 이 경우:
1. 단가를 1000원 등으로 변경하여 유료 견적으로 재테스트합니다.
2. 또는 Phase 4의 결제 테스트를 생략합니다.

### 2.6 견적 발행

**단계:**
1. "견적 발행하기" 버튼 클릭
2. 로딩 상태 대기

**예상 결과:**

- [ ] 성공 메시지: `QT-XXXXXXXX-XXXX 견적이 생성되었습니다` (견적 번호는 시스템에서 생성)
- [ ] 로딩 표시 사라짐
- [ ] 견적 폼이 초기화됨
- [ ] 오른쪽 "발행된 견적" 카드에 새 견적 표시

### 2.7 발행된 견적 확인

**"발행된 견적" 섹션에서 확인:**

- [ ] 견적 번호 표시
- [ ] 견적명: 렛츠코딩 기관 이용 견적
- [ ] 상태: sent
- [ ] 발행일 표시
- [ ] 항목: 무료체험 라이선스, 0원 (또는 설정한 가격)
- [ ] 총액 표시
- [ ] 결제 링크 관련 버튼 표시 ("결제 링크 열기", "링크 복사" 등)

### 2.8 문의 상태 변경 확인

**확인할 사항:**

- [ ] 문의 카드 상단의 상태 표시가 `pending`에서 `quoted`로 자동 변경되는지 확인
- [ ] (자동으로 변경되지 않으면 수동으로 드롭다운에서 `quoted` 선택)

### 2.9 데이터베이스 검증

**Supabase 대시보드 → SQL Editor에서 실행:**

```sql
SELECT
  id,
  quote_number,
  title,
  access_email,
  manager_name,
  status,
  total_amount,
  payment_url,
  public_token
FROM quotes
ORDER BY created_at DESC LIMIT 1;
```

**확인할 항목:**

- [ ] `quote_number`: 형식 `QT-XXXXXXXX-XXXX` (또는 시스템 설정에 따른 형식)
- [ ] `title`: '렛츠코딩 기관 이용 견적'
- [ ] `access_email`: 'coding-edu@kakao.com'
- [ ] `manager_name`: '이코르'
- [ ] `status`: 'sent'
- [ ] `total_amount`: 0 (또는 설정한 금액)
- [ ] `payment_url`: NOT NULL (자동 생성됨)
- [ ] `public_token`: NOT NULL (결제 링크의 토큰)

**견적 항목 확인:**

```sql
SELECT
  id,
  quote_id,
  item_name,
  quantity,
  unit_price,
  amount
FROM quote_items
WHERE quote_id = (SELECT id FROM quotes ORDER BY created_at DESC LIMIT 1)
ORDER BY sort_order;
```

**확인할 항목:**

- [ ] `item_name`: '무료체험 라이선스'
- [ ] `quantity`: 1
- [ ] `unit_price`: 0 (또는 설정한 가격)
- [ ] `amount`: 0 (또는 설정한 가격)

---

## Phase 3: 견적 조회 테스트 (OTP 인증)

### 3.1 견적 조회 기능 접속

**단계:**
1. `http://localhost:3000` 으로 돌아가기
2. 페이지에서 "견적 조회" 또는 "견적 조회하기" 버튼 클릭
3. 견적 조회 모달 열림 확인

### 3.2 Step 1 - OTP 요청

**입력 데이터:**

| 필드 | 입력값 |
|------|--------|
| 기관명 | 에코르 |
| 이메일 | coding-edu@kakao.com |

**단계:**
1. 위 데이터 입력
2. "인증번호 받기" 버튼 클릭
3. 로딩 상태 대기

**예상 결과:**

- [ ] 로딩 상태 표시 후 사라짐
- [ ] 정보 메시지: `입력하신 이메일로 6자리 인증번호를 발송했습니다.`
- [ ] Step 2로 자동 전환

### 3.3 OTP 이메일 수신 확인

**단계:**
1. `coding-edu@kakao.com` 이메일 계정 확인
2. 발신자 확인 (RESEND_FROM_NAME 및 RESEND_FROM_EMAIL)
3. 6자리 숫자 코드 확인 (예: 123456)

**이메일 내용 확인:**

- [ ] 제목에 "인증번호" 또는 유사 문구 포함
- [ ] 본문에 6자리 OTP 코드 명확히 표시
- [ ] 코드 유효기간 정보 (보통 10분)

### 3.4 Step 2 - OTP 입력

**입력:**
1. 수신한 6자리 코드를 입력 필드에 입력
2. "견적 조회하기" 버튼 클릭

**예상 결과:**

- [ ] 로딩 상태 표시
- [ ] 인증 성공 후 Step 3으로 자동 전환
- [ ] 에러 메시지 없음

### 3.5 잘못된 OTP 입력 테스트 (선택사항)

**단계:**
1. 의도적으로 잘못된 6자리 코드 입력 (예: 000000)
2. "견적 조회하기" 버튼 클릭

**예상 결과:**

- [ ] 에러 메시지: `인증에 실패했습니다.` 또는 유사 메시지
- [ ] Step 2에 유지 (다시 입력 가능)
- [ ] "인증번호 다시 보내기" 버튼으로 OTP 재발송 가능

### 3.6 Step 3 - 견적 목록 확인

**화면에 표시되어야 할 정보:**

- [ ] 제목: "{기관명} 견적 목록" (예: "에코르 견적 목록")
- [ ] 설명: "현재 조회 가능한 유효 견적을 확인할 수 있습니다."
- [ ] Phase 2에서 생성한 견적이 목록에 표시

**견적 카드 정보:**

- [ ] 견적 번호: `QT-XXXXXXXX-XXXX` 형식
- [ ] 견적명: 렛츠코딩 기관 이용 견적
- [ ] 상태 배지: sent
- [ ] 발행일: (생성한 날짜)
- [ ] 유효기간: (설정한 기간 또는 "-")
- [ ] 담당자: 이코르
- [ ] 총 금액: 0원 (또는 설정한 금액)

**견적 상세:**

1. 견적 카드를 확장 또는 클릭하면:
   - [ ] 항목명: 무료체험 라이선스
   - [ ] 금액: 0원 (또는 설정한 금액)
   - [ ] 공급가, 할인, 부가세, 총액 표시

**결제 버튼:**

- [ ] "결제 페이지로 이동" 버튼 또는 링크 표시
- [ ] (0원 견적인 경우 버튼이 비활성화될 수 있음)

### 3.7 데이터베이스 검증

**OTP 요청 기록:**

```sql
SELECT
  id,
  email,
  normalized_org_name,
  expires_at,
  consumed_at
FROM quote_access_requests
WHERE email = 'coding-edu@kakao.com'
ORDER BY created_at DESC LIMIT 1;
```

**확인할 항목:**

- [ ] `email`: 'coding-edu@kakao.com'
- [ ] `normalized_org_name`: '에코르' (정규화된 형태)
- [ ] `expires_at`: 현재 시간 + 10분
- [ ] `consumed_at`: NOT NULL (OTP 인증 완료 후)

---

## Phase 4: 결제 테스트 (토스페이먼츠)

### 4.1 결제 페이지 접속

**방법 1: 관리자 대시보드에서**

1. `http://localhost:3000/admin.html` 접속
2. "에코르" 문의 선택
3. "발행된 견적" 카드에서 "결제 링크 복사" 버튼 클릭
4. 브라우저 주소창에 붙여넣고 이동

**방법 2: 직접 입력**

결제 링크 형식: `http://localhost:3000/pay?token={publicToken}`

### 4.2 결제 페이지 로드 확인

**확인할 사항:**

- [ ] 페이지 제목: "렛츠코딩 견적 결제"
- [ ] 견적 정보 표시:
  - [ ] 견적 번호
  - [ ] 견적명: 렛츠코딩 기관 이용 견적
  - [ ] 상태: sent
- [ ] 기관 정보:
  - [ ] 기관명: 에코르
  - [ ] 담당자: 이코르
  - [ ] 발행일, 유효기간
- [ ] 항목 정보:
  - [ ] 항목명: 무료체험 라이선스
  - [ ] 금액: 0원 (또는 설정한 금액)
- [ ] 결제 요약:
  - [ ] 공급가, 할인, 부가세, 총액 표시
- [ ] "토스페이먼츠로 결제하기" 버튼

### 4.3 0원 결제 이슈 확인

**상황:**

무료체험 견적은 금액이 0원이므로 토스페이먼츠에서 결제할 수 없을 수 있습니다.

**대응 방법:**

**Option A: 유료 견적으로 재테스트**

1. admin.html로 돌아가기
2. 견적 수정 (우측 "발행된 견적" 카드에서 "수정" 버튼)
3. 항목 단가를 1000원으로 변경
4. "견적 수정 저장" 버튼 클릭
5. 새 결제 링크로 다시 진행

**Option B: 0원 결제 테스트 생략**

1. 기술적 제약으로 0원 결제는 불가능
2. Phase 3까지의 테스트로 견적 조회 기능 검증 완료
3. 실제 운영 시 유료 견적으로만 결제 테스트 진행

### 4.4 결제 실행

**단계:**
1. "토스페이먼츠로 결제하기" 버튼 클릭
2. 로딩 상태 표시
3. 토스페이먼츠 결제 팝업 또는 페이지 열림

**예상 결과:**

- [ ] 토스 결제 팝업 표시
- [ ] 결제 수단 선택 화면 (신용카드, 계좌이체 등)

### 4.5 테스트 결제 진행

**토스페이먼츠 테스트 모드 사용:**

1. 토스 결제 팝업에서 신용카드 선택
2. 테스트 카드 번호 입력:
   - 테스트 승인 카드: `4111 1111 1111 1111` (또는 토스 공식 문서 참조)
   - 만료월: 임의의 미래 월 (예: 12)
   - 만료년: 임의의 미래 년 (예: 28)
   - CVC: 임의의 3자리 (예: 123)
   - 비밀번호 앞 2자리: 임의의 2자리 (예: 00)

3. 결제 버튼 클릭

### 4.6 결제 성공 페이지 확인

**예상 결과:**

- [ ] 페이지 경로: `/payment/success`
- [ ] 성공 메시지 표시
- [ ] 영수증 URL 또는 링크 표시
- [ ] 처리 중 표시가 사라짐

**영수증 정보:**

- [ ] 결제 금액 표시
- [ ] 결제일시 표시
- [ ] 영수증 번호 표시
- [ ] 토스페이먼츠 링크 또는 영수증 URL

### 4.7 관리자 대시보드에서 결제 기록 확인

**단계:**
1. `http://localhost:3000/admin.html` 접속
2. "에코르" 문의 선택
3. "발행된 견적" 카드 확인

**확인할 사항:**

- [ ] 견적 상태: `sent` → `paid` 변경
- [ ] "결제 기록" 섹션 표시:
  - [ ] 상태: paid
  - [ ] 금액: 결제 금액 (예: ₩1,100)
  - [ ] 승인일시: 결제 실행 시간

### 4.8 문의 상태 확인

**단계:**
1. "에코르" 문의 카드 상단 상태 확인

**확인할 사항:**

- [ ] 문의 상태: `quoted` → `paid` 변경
- [ ] 문의 드롭다운도 `paid` 상태로 업데이트됨

### 4.9 데이터베이스 결제 기록 검증

**결제 기록 확인:**

```sql
SELECT
  id,
  quote_id,
  status,
  method,
  amount,
  approved_at,
  receipt_url,
  payment_key,
  created_at
FROM quote_payments
ORDER BY created_at DESC LIMIT 1;
```

**확인할 항목:**

- [ ] `status`: 'paid'
- [ ] `method`: 'CARD'
- [ ] `amount`: 결제 금액 (0이 아님, 예: 1100)
- [ ] `approved_at`: 결제 승인 시간
- [ ] `receipt_url`: NOT NULL (토스 영수증 URL)
- [ ] `payment_key`: NOT NULL (토스 결제 키)

**견적 상태 확인:**

```sql
SELECT
  id,
  status,
  total_amount
FROM quotes
WHERE id = (SELECT quote_id FROM quote_payments ORDER BY created_at DESC LIMIT 1);
```

**확인할 항목:**

- [ ] `status`: 'paid'
- [ ] `total_amount`: 결제 금액과 일치

**문의 상태 확인:**

```sql
SELECT
  id,
  status
FROM contact_inquiries
WHERE id = (SELECT inquiry_id FROM quotes WHERE id = (SELECT quote_id FROM quote_payments ORDER BY created_at DESC LIMIT 1));
```

**확인할 항목:**

- [ ] `status`: 'paid'

---

## Phase 5: 결제 실패 테스트 (선택사항)

### 5.1 의도적 결제 취소

**단계:**
1. 새로운 견적 생성 (또는 기존 견적 재사용)
2. 결제 페이지 접속
3. 토스 결제 팝업에서 "결제 취소" 또는 팝업 닫기
4. 또는 토스 테스트 모드에서 "거절 카드" 번호 사용

### 5.2 결제 실패 페이지 확인

**예상 결과:**

- [ ] 페이지 경로: `/payment/fail`
- [ ] 실패 메시지 표시
- [ ] 오류 코드 또는 사유 표시
- [ ] "다시 시도" 버튼 또는 홈으로 돌아가기 버튼

### 5.3 데이터베이스 실패 기록 확인

**결제 기록 확인:**

```sql
SELECT
  id,
  status,
  failure_reason
FROM quote_payments
WHERE status = 'failed'
ORDER BY created_at DESC LIMIT 1;
```

**확인할 항목:**

- [ ] `status`: 'failed'
- [ ] `failure_reason`: 에러 메시지 포함

**견적 상태 확인:**

```sql
SELECT
  id,
  status
FROM quotes
WHERE id = (SELECT quote_id FROM quote_payments WHERE status = 'failed' ORDER BY created_at DESC LIMIT 1);
```

**중요 확인:**

- [ ] 견적 상태: `payment_pending` 유지 (reset되지 않음)
- [ ] 상태가 이전 상태로 되돌아가지 않음

---

## Phase 6: OTP 보안 테스트 (선택사항)

### 6.1 잘못된 OTP 반복 시도

**단계:**
1. 견적 조회 모달 열기
2. 기관명: 에코르, 이메일: coding-edu@kakao.com 입력
3. "인증번호 받기" 클릭
4. Step 2에서 의도적으로 잘못된 코드 5회 입력
   - 000000, 111111, 222222, 333333, 444444

**예상 결과:**

- [ ] 각 시도마다 에러 메시지 표시
- [ ] 5회 초과 후 차단 메시지 표시
- [ ] 예: "인증 시도 횟수를 초과했습니다. 나중에 다시 시도해주세요."

### 6.2 만료된 OTP 입력 시도

**단계:**
1. OTP 요청 후 10분 이상 대기
2. 발송된 OTP 코드 입력 시도

**예상 결과:**

- [ ] 에러 메시지: "인증번호가 만료되었습니다." 또는 유사 메시지
- [ ] "인증번호 다시 보내기" 버튼으로 재발송 필요

---

## 트러블슈팅

### 문제: 서버 에러 (500 에러)

**확인사항:**

1. Vercel dev 터미널 로그 확인
   ```
   vercel dev --listen 3000
   ```
   터미널에 에러 메시지 출력 확인

2. Supabase 연결 확인
   - `SUPABASE_URL` 및 `SUPABASE_SERVICE_KEY` 설정 확인
   - Supabase 대시보드에서 프로젝트 상태 확인

3. API 엔드포인트 확인
   - 브라우저 개발자 도구 → Network 탭
   - 실패한 API 요청 확인
   - 응답 상태 코드 및 에러 메시지 확인

### 문제: 이메일 미수신

**확인사항:**

1. Resend 설정
   - `RESEND_API_KEY` 확인
   - `RESEND_FROM_EMAIL` 도메인 인증 여부 확인
   - Resend 대시보드에서 발송 로그 확인

2. 스팸 폴더 확인
   - Gmail, Outlook 등의 스팸 폴더 확인
   - 발신자 주소 허용 목록 추가

3. .env 재로드
   - `.env` 변경 후 `vercel dev` 재시작

### 문제: SMS 미수신

**확인사항:**

1. SOLAPI 설정
   - `SOLAPI_API_KEY` 및 `SOLAPI_API_SECRET` 확인
   - `SOLAPI_SENDER_NUMBER` 확인 (발신 번호가 등록되어 있는지)

2. 수신자 번호 형식
   - 테스트 전화번호가 유효한지 확인
   - 국내 번호 형식 (010-xxxx-xxxx 또는 01000000000)

3. SOLAPI 대시보드
   - SOLAPI 대시보드에서 발송 로그 확인
   - 크레딧 잔액 확인

### 문제: 결제 페이지 로드 실패

**확인사항:**

1. 결제 링크 토큰 확인
   - URL의 `token` 파라미터가 존재하는지 확인
   - Supabase에서 `quotes.public_token` 존재 여부 확인

2. 토스페이먼츠 SDK 확인
   - `VITE_TOSS_PAYMENTS_CLIENT_KEY` 설정 확인
   - 브라우저 콘솔에서 CORS 에러 확인
   - 토스 SDK 로드 여부 확인

### 문제: 결제 팝업이 열리지 않음

**확인사항:**

1. 팝업 차단 확인
   - 브라우저 팝업 차단 설정 확인
   - localhost:3000 팝업 허용 추가

2. 토스페이먼츠 테스트 모드 확인
   - `TOSS_PAYMENTS_SECRET_KEY`가 테스트 키인지 확인 (접두어 `sk_test_`)
   - 토스 테스트 환경 설정 확인

3. JavaScript 에러
   - 브라우저 콘솔에서 JavaScript 에러 확인
   - 네트워크 탭에서 요청 상태 확인

### 문제: 0원 결제 불가

**현상:**

토스페이먼츠에서 0원 결제를 지원하지 않음

**해결방법:**

1. 단가를 1000원 이상으로 설정하여 유료 견적으로 재생성
2. 또는 0원 견적은 결제 기능 테스트 대상에서 제외

---

## 데이터 정리

### 테스트 후 데이터 삭제

테스트 완료 후 테스트 데이터를 정리하려면 다음 SQL을 Supabase SQL Editor에서 실행합니다:

```sql
-- 1단계: 테스트 결제 삭제
DELETE FROM quote_payments
WHERE quote_id IN (
  SELECT id FROM quotes
  WHERE access_email = 'coding-edu@kakao.com'
);

-- 2단계: 테스트 견적 삭제 (quote_items는 CASCADE)
DELETE FROM quotes
WHERE access_email = 'coding-edu@kakao.com';

-- 3단계: 테스트 OTP 삭제
DELETE FROM quote_access_requests
WHERE email = 'coding-edu@kakao.com';

-- 4단계: 테스트 문의 삭제
DELETE FROM contact_inquiries
WHERE email = 'coding-edu@kakao.com';
```

**실행 순서:**

- 위 순서대로 실행 필수 (외래키 관계 때문)
- 한 번에 한 쿼리씩 실행
- 각 단계 후 영향받은 행 수 확인

**검증:**

완료 후 다음 쿼리로 삭제 확인:

```sql
SELECT COUNT(*) as total_inquiries FROM contact_inquiries WHERE email = 'coding-edu@kakao.com';
SELECT COUNT(*) as total_quotes FROM quotes WHERE access_email = 'coding-edu@kakao.com';
SELECT COUNT(*) as total_otp FROM quote_access_requests WHERE email = 'coding-edu@kakao.com';
SELECT COUNT(*) as total_payments FROM quote_payments WHERE quote_id IN (SELECT id FROM quotes WHERE access_email = 'coding-edu@kakao.com');
```

모든 COUNT가 0이면 정상 삭제됨

---

## 테스트 체크리스트

다음 체크리스트를 복사하여 테스트 진행 상황을 추적할 수 있습니다:

### Phase 1: 도입문의
- [ ] 모달 열림
- [ ] 필수 필드 입력
- [ ] 무료체험 선택 시 기간 자동 설정
- [ ] 폼 제출 성공
- [ ] 성공 메시지 표시
- [ ] 관리자 이메일 수신
- [ ] 신청자 SMS 수신
- [ ] DB에 저장됨

### Phase 2: 견적 생성
- [ ] 관리자 대시보드 접속
- [ ] 키 저장
- [ ] 문의 선택
- [ ] 폼 자동 채움
- [ ] 견적 정보 입력
- [ ] 견적 발행 성공
- [ ] 발행된 견적 표시
- [ ] 문의 상태 변경 (pending → quoted)
- [ ] DB 레코드 생성

### Phase 3: 견적 조회
- [ ] OTP 요청 성공
- [ ] OTP 이메일 수신
- [ ] OTP 입력 인증 성공
- [ ] 견적 목록 표시
- [ ] 견적 상세 정보 정확
- [ ] 결제 링크/버튼 표시
- [ ] DB OTP 기록 생성

### Phase 4: 결제
- [ ] 결제 페이지 로드
- [ ] 견적 정보 표시
- [ ] (0원이 아닌 경우) 결제 팝업 열림
- [ ] (0원이 아닌 경우) 테스트 결제 성공
- [ ] (0원이 아닌 경우) /payment/success 이동
- [ ] (0원이 아닌 경우) 영수증 정보 표시
- [ ] 관리자 대시보드에서 결제 상태 확인
- [ ] 견적 상태 paid 변경
- [ ] 문의 상태 paid 변경
- [ ] DB 결제 기록 생성

### Phase 5: 결제 실패 (선택)
- [ ] 결제 취소/실패
- [ ] /payment/fail 이동
- [ ] 실패 메시지 표시
- [ ] DB 실패 기록 생성
- [ ] 견적 상태는 payment_pending 유지

### Phase 6: OTP 보안 (선택)
- [ ] 잘못된 OTP 5회 차단
- [ ] 만료된 OTP 거부

---

## 참고사항

### 환경 변수 암호화

프로덕션 환경에서는 다음 민감한 정보를 암호화하여 관리합니다:

- `SUPABASE_SERVICE_KEY`
- `RESEND_API_KEY`
- `SOLAPI_API_KEY`, `SOLAPI_API_SECRET`
- `ADMIN_DASHBOARD_KEY`
- `TOSS_PAYMENTS_SECRET_KEY`

### 테스트 이메일/SMS 주의

- 테스트 데이터는 실제 사용자에게 영향을 주지 않도록 전용 테스트 이메일/번호 사용
- 본 가이드의 `coding-edu@kakao.com`은 테스트용 이메일
- 실제 고객 이메일로는 테스트 금지

### 토스페이먼츠 테스트 환경

- 테스트 중에는 항상 토스페이먼츠 테스트 환경 사용
- 실제 결제 환경과 혼동 금지
- 테스트 카드는 토스 공식 문서 참조

### 성능 테스트

대용량 데이터에 대한 성능 테스트는 별도 문서 참조

---

**최종 업데이트**: 2026년 3월 20일

문서에 대한 피드백이나 개선사항은 프로젝트 이슈 트래커에 등록해주세요.
