(function () {
    "use strict";

    function getShellConfig(pageType) {
        var isHome = pageType === "home";
        var base = isHome ? "" : "/";

        return {
            brandHref: isHome ? "#hero" : "/",
            workflowHref: base + "#workflow",
            featuresHref: base + "#features",
            educatorsHref: base + "#educators",
            pricingHref: base + "#pricing",
            contactHref: base + "#contact",
            quoteLookupHref: "/?quoteLookup=1"
        };
    }

    function renderHeader(config) {
        return [
            '<header class="site-header" id="siteHeader">',
            '    <nav class="nav">',
            '        <a class="brand" href="' + config.brandHref + '">',
            '            <span class="brand-mark">LET\'S CODING</span>',
            '        </a>',
            '        <div class="nav-links">',
            '            <a class="nav-link" href="' + config.workflowHref + '">학습 흐름</a>',
            '            <a class="nav-link" href="' + config.featuresHref + '">핵심 기능</a>',
            '            <a class="nav-link" href="' + config.educatorsHref + '">기대 효과</a>',
            '            <a class="nav-link" href="' + config.pricingHref + '">라이선스</a>',
            '        </div>',
            '        <div class="nav-right">',
            '            <a class="btn-ghost" href="https://python.letscoding.kr" target="_blank" rel="noopener noreferrer">학습 사이트 이동</a>',
            '            <a class="btn-ghost" href="' + config.quoteLookupHref + '" data-quote-lookup>견적 조회</a>',
            '            <a class="btn-primary" href="' + config.contactHref + '">도입 문의</a>',
            '            <button class="nav-hamburger" id="navHamburger" aria-label="메뉴 열기">',
            '                <span></span><span></span><span></span>',
            '            </button>',
            '        </div>',
            '    </nav>',
            '</header>'
        ].join("\n");
    }

    function renderMobileMenu(config) {
        return [
            '<div class="mobile-menu" id="mobileMenu">',
            '    <a class="nav-link" href="' + config.workflowHref + '" data-ml>학습 흐름</a>',
            '    <a class="nav-link" href="' + config.featuresHref + '" data-ml>핵심 기능</a>',
            '    <a class="nav-link" href="' + config.educatorsHref + '" data-ml>기대 효과</a>',
            '    <a class="nav-link" href="' + config.pricingHref + '" data-ml>라이선스</a>',
            '    <a class="nav-link" href="https://python.letscoding.kr" target="_blank" rel="noopener noreferrer" data-ml>학습 사이트 이동</a>',
            '    <a class="nav-link" href="' + config.quoteLookupHref + '" data-ml data-quote-lookup>견적 조회</a>',
            '    <a class="btn-primary" href="' + config.contactHref + '" data-ml>도입 문의</a>',
        '</div>'
    ].join("\n");
    }

    function renderQuoteLookupModal() {
        return [
            '<div class="quote-modal-overlay hidden" id="quoteLookupModal" aria-hidden="true">',
            '    <div class="quote-modal-box">',
            '        <button class="quote-modal-close" id="quoteLookupClose" aria-label="닫기">&times;</button>',
            '        <div class="quote-modal-step" id="quoteLookupStepRequest">',
            '            <p class="quote-modal-eyebrow">Estimate Lookup</p>',
            '            <h2>견적 조회</h2>',
            '            <p class="quote-modal-copy">도입 문의 시 등록한 기관명과 이메일을 입력하면 인증번호를 보내드립니다.</p>',
            '            <div class="quote-modal-alert error hidden" id="quoteLookupError"></div>',
            '            <div class="quote-modal-alert info hidden" id="quoteLookupInfo"></div>',
            '            <form id="quoteLookupRequestForm">',
            '                <label class="quote-modal-label">기관명</label>',
            '                <input class="quote-modal-input" id="quoteLookupOrgName" placeholder="예: OO중학교, OO학원" />',
            '                <label class="quote-modal-label">이메일 주소</label>',
            '                <input class="quote-modal-input" id="quoteLookupEmail" type="email" placeholder="도입 문의 시 입력한 이메일" />',
            '                <button class="quote-modal-primary" id="quoteLookupRequestBtn" type="submit">인증번호 받기</button>',
            '            </form>',
            '        </div>',
            '        <div class="quote-modal-step hidden" id="quoteLookupStepVerify">',
            '            <p class="quote-modal-eyebrow">Email Verification</p>',
            '            <h2>이메일 인증</h2>',
            '            <p class="quote-modal-copy" id="quoteLookupVerifyCopy"></p>',
            '            <div class="quote-modal-alert error hidden" id="quoteLookupVerifyError"></div>',
            '            <div class="quote-modal-alert info hidden" id="quoteLookupVerifyInfo"></div>',
            '            <form id="quoteLookupVerifyForm">',
            '                <label class="quote-modal-label">인증번호</label>',
            '                <input class="quote-modal-input quote-modal-code" id="quoteLookupCode" inputmode="numeric" maxlength="6" placeholder="6자리 숫자" />',
            '                <button class="quote-modal-primary" id="quoteLookupVerifyBtn" type="submit">견적 조회하기</button>',
            '            </form>',
            '            <button class="quote-modal-text" id="quoteLookupResendBtn" type="button">인증번호 다시 보내기</button>',
            '        </div>',
            '        <div class="quote-modal-step hidden" id="quoteLookupStepResults">',
            '            <div class="quote-modal-results-head">',
            '                <div>',
            '                    <p class="quote-modal-eyebrow">Quote Results</p>',
            '                    <h2>조회 결과</h2>',
            '                </div>',
            '                <button class="quote-modal-text" id="quoteLookupRestartBtn" type="button">다시 조회</button>',
            '            </div>',
            '            <div class="quote-modal-results" id="quoteLookupResults"></div>',
            '        </div>',
            '    </div>',
            '</div>'
        ].join("\n");
    }

    function renderFooter(config) {
        return [
            '<footer class="site-footer">',
            '    <div class="footer-inner">',
            '        <div class="footer-top">',
            '            <div>',
            '                <div class="footer-brand-row">',
            '                    <span class="brand-mark">LET\'S CODING</span>',
            '                </div>',
            '                <p class="footer-desc">학생 학습, AI 보조, 기관 운영이 한 제품 안에서 이어지는 파이썬 학습 플랫폼.</p>',
            '                <div class="footer-contact">',
            '                    <p>주소 : 전북특별자치도 완주군 이서면 출판로 46-5 대온빌딩 301호</p>',
            '                    <p>TEL : 063-714-2536&nbsp;&nbsp;&nbsp;FAX : 063-714-2537&nbsp;&nbsp;&nbsp;Email : contact@letscoding.kr</p>',
            '                </div>',
            '            </div>',
            '            <div class="footer-nav-group">',
            '                <h4>제품</h4>',
            '                <a href="' + config.workflowHref + '">학습 흐름</a>',
            '                <a href="' + config.featuresHref + '">핵심 기능</a>',
            '                <a href="' + config.educatorsHref + '">기대 효과</a>',
            '            </div>',
            '            <div class="footer-nav-group">',
            '                <h4>도입</h4>',
            '                <a href="' + config.pricingHref + '">라이선스</a>',
            '                <a href="' + config.contactHref + '">도입 문의</a>',
            '                <a href="https://python.letscoding.kr" target="_blank" rel="noopener noreferrer">학습 플랫폼 <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>',
            '            </div>',
            '        </div>',
            '        <div class="footer-bottom">',
            '            <div class="footer-legal">',
            '                <a href="/legal.html?tab=terms">이용약관</a>',
            '                <a href="/legal.html?tab=privacy">개인정보처리방침</a>',
            '                <a href="/legal.html?tab=no-email">이메일무단수집거부</a>',
            '            </div>',
            '            <span>\u00a9 <span id="year"></span> 렛츠코딩. All rights reserved.</span>',
            '        </div>',
            '    </div>',
            '</footer>'
        ].join("\n");
    }

    function bindShellBehavior() {
        var header = document.getElementById("siteHeader");
        if (header) {
            window.addEventListener("scroll", function () {
                header.classList.toggle("scrolled", window.scrollY > 10);
            }, { passive: true });
        }

        var hamburger = document.getElementById("navHamburger");
        var mobileMenu = document.getElementById("mobileMenu");

        if (hamburger && mobileMenu) {
            hamburger.addEventListener("click", function () {
                var open = mobileMenu.classList.toggle("open");
                hamburger.classList.toggle("open", open);
                document.body.style.overflow = open ? "hidden" : "";
                hamburger.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
            });

            document.querySelectorAll("[data-ml]").forEach(function (link) {
                link.addEventListener("click", function () {
                    mobileMenu.classList.remove("open");
                    hamburger.classList.remove("open");
                    document.body.style.overflow = "";
                });
            });
        }

        var year = document.getElementById("year");
        if (year) {
            year.textContent = String(new Date().getFullYear());
        }
    }

    function bindQuoteLookupBehavior() {
        var modal = document.getElementById("quoteLookupModal");
        if (!modal) return;

        var requestStep = document.getElementById("quoteLookupStepRequest");
        var verifyStep = document.getElementById("quoteLookupStepVerify");
        var resultsStep = document.getElementById("quoteLookupStepResults");
        var orgNameInput = document.getElementById("quoteLookupOrgName");
        var emailInput = document.getElementById("quoteLookupEmail");
        var codeInput = document.getElementById("quoteLookupCode");
        var requestForm = document.getElementById("quoteLookupRequestForm");
        var verifyForm = document.getElementById("quoteLookupVerifyForm");
        var requestBtn = document.getElementById("quoteLookupRequestBtn");
        var verifyBtn = document.getElementById("quoteLookupVerifyBtn");
        var resendBtn = document.getElementById("quoteLookupResendBtn");
        var restartBtn = document.getElementById("quoteLookupRestartBtn");
        var closeBtn = document.getElementById("quoteLookupClose");
        var verifyCopy = document.getElementById("quoteLookupVerifyCopy");
        var results = document.getElementById("quoteLookupResults");
        var requestError = document.getElementById("quoteLookupError");
        var requestInfo = document.getElementById("quoteLookupInfo");
        var verifyError = document.getElementById("quoteLookupVerifyError");
        var verifyInfo = document.getElementById("quoteLookupVerifyInfo");
        var accessToken = "";

        function showStep(stepName) {
            requestStep.classList.toggle("hidden", stepName !== "request");
            verifyStep.classList.toggle("hidden", stepName !== "verify");
            resultsStep.classList.toggle("hidden", stepName !== "results");
        }

        function setMessage(target, text) {
            if (!target) return;
            target.textContent = text || "";
            target.classList.toggle("hidden", !text);
        }

        function openModal() {
            modal.classList.remove("hidden");
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            if (orgNameInput) {
                window.setTimeout(function () { orgNameInput.focus(); }, 30);
            }
        }

        function closeModal() {
            modal.classList.add("hidden");
            modal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        }

        function resetModal() {
            accessToken = "";
            if (codeInput) codeInput.value = "";
            if (results) results.innerHTML = "";
            setMessage(requestError, "");
            setMessage(requestInfo, "");
            setMessage(verifyError, "");
            setMessage(verifyInfo, "");
            showStep("request");
        }

        function formatDate(value) {
            if (!value) return "-";
            return new Date(value).toLocaleDateString("ko-KR");
        }

        function formatCurrency(value, currency) {
            return new Intl.NumberFormat("ko-KR", {
                style: "currency",
                currency: currency || "KRW",
                maximumFractionDigits: 0
            }).format(Number(value || 0));
        }

        function renderResults(quotes) {
            if (!results) return;

            if (!quotes || !quotes.length) {
                results.innerHTML = [
                    '<div class="quote-result-empty">',
                    '  <h3>조회 가능한 견적이 없습니다</h3>',
                    '  <p>아직 발행된 견적이 없거나 유효기간이 지난 상태일 수 있습니다.</p>',
                    '</div>'
                ].join("");
                return;
            }

            results.innerHTML = quotes.map(function (quote) {
                var items = (quote.quote_items || []).slice().sort(function (a, b) {
                    return a.sort_order - b.sort_order;
                }).map(function (item) {
                    return [
                        '<div class="quote-result-item">',
                        '  <div>',
                        '    <p>' + item.item_name + '</p>',
                        (item.description ? '<span>' + item.description + '</span>' : ''),
                        '  </div>',
                        '  <strong>' + formatCurrency(item.amount, quote.currency) + '</strong>',
                        '</div>'
                    ].join("");
                }).join("");

                return [
                    '<article class="quote-result-card">',
                    '  <div class="quote-result-head">',
                    '    <div>',
                    '      <p class="quote-result-number">' + (quote.quote_number || ('견적 #' + quote.id)) + '</p>',
                    '      <h3>' + quote.title + '</h3>',
                    '    </div>',
                    '    <span class="quote-result-status">' + quote.status + '</span>',
                    '  </div>',
                    '  <div class="quote-result-meta">',
                    '    <div><span>발행일</span><strong>' + formatDate(quote.issued_at) + '</strong></div>',
                    '    <div><span>유효기간</span><strong>' + formatDate(quote.valid_until) + '</strong></div>',
                    '    <div><span>총 금액</span><strong>' + formatCurrency(quote.total_amount, quote.currency) + '</strong></div>',
                    '  </div>',
                    items ? ('<div class="quote-result-items">' + items + '</div>') : '',
                    quote.payment_url ? ('<a class="quote-modal-primary inline" href="' + quote.payment_url + '" target="_blank" rel="noopener noreferrer">결제 페이지로 이동</a>') : '',
                    '</article>'
                ].join("");
            }).join("");
        }

        async function readJsonSafely(response) {
            var text = await response.text();
            if (!text.trim()) {
                throw new Error("서버 응답이 비어 있습니다. 로컬 API 서버가 실행 중인지 확인해주세요.");
            }
            try {
                return JSON.parse(text);
            } catch (_error) {
                throw new Error("서버가 올바른 JSON 응답을 주지 않았습니다. API 연결 상태를 확인해주세요.");
            }
        }

        async function loadQuotes() {
            var response = await fetch("/api/quotes/list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ access_token: accessToken })
            });
            var data = await readJsonSafely(response);
            if (!response.ok) {
                throw new Error(data.error || "견적 조회에 실패했습니다.");
            }
            renderResults(data.quotes || []);
            showStep("results");
        }

        async function requestAccess() {
            setMessage(requestError, "");
            setMessage(requestInfo, "");

            var orgName = orgNameInput.value.trim();
            var email = emailInput.value.trim();

            if (!orgName || !email) {
                setMessage(requestError, "기관명과 이메일을 입력해주세요.");
                return;
            }

            requestBtn.disabled = true;
            requestBtn.textContent = "발송 중...";

            try {
                var response = await fetch("/api/quotes/request-access", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ org_name: orgName, email: email })
                });
                var data = await readJsonSafely(response);
                if (!response.ok) {
                    throw new Error(data.error || "인증번호 발송에 실패했습니다.");
                }
                verifyCopy.textContent = email + "로 발송된 6자리 인증번호를 입력해주세요.";
                setMessage(verifyInfo, "입력하신 이메일로 인증번호를 발송했습니다.");
                showStep("verify");
            } catch (error) {
                setMessage(requestError, error instanceof Error ? error.message : "인증번호 발송에 실패했습니다.");
            } finally {
                requestBtn.disabled = false;
                requestBtn.textContent = "인증번호 받기";
            }
        }

        async function verifyAccess() {
            setMessage(verifyError, "");

            var code = codeInput.value.trim();
            if (code.length !== 6) {
                setMessage(verifyError, "6자리 인증번호를 입력해주세요.");
                return;
            }

            verifyBtn.disabled = true;
            verifyBtn.textContent = "확인 중...";

            try {
                var response = await fetch("/api/quotes/verify-access", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        org_name: orgNameInput.value.trim(),
                        email: emailInput.value.trim(),
                        code: code
                    })
                });
                var data = await readJsonSafely(response);
                if (!response.ok) {
                    throw new Error(data.error || "인증에 실패했습니다.");
                }
                accessToken = data.accessToken;
                await loadQuotes();
            } catch (error) {
                setMessage(verifyError, error instanceof Error ? error.message : "인증에 실패했습니다.");
            } finally {
                verifyBtn.disabled = false;
                verifyBtn.textContent = "견적 조회하기";
            }
        }

        document.querySelectorAll("[data-quote-lookup]").forEach(function (trigger) {
            trigger.addEventListener("click", function (event) {
                event.preventDefault();
                resetModal();
                openModal();
            });
        });

        requestForm.addEventListener("submit", function (event) {
            event.preventDefault();
            void requestAccess();
        });

        verifyForm.addEventListener("submit", function (event) {
            event.preventDefault();
            void verifyAccess();
        });

        resendBtn.addEventListener("click", function () {
            void requestAccess();
        });

        restartBtn.addEventListener("click", function () {
            resetModal();
        });

        closeBtn.addEventListener("click", closeModal);

        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && !modal.classList.contains("hidden")) {
                closeModal();
            }
        });

        if (codeInput) {
            codeInput.addEventListener("input", function () {
                codeInput.value = codeInput.value.replace(/\D/g, "").slice(0, 6);
            });
        }

        var params = new URLSearchParams(window.location.search);
        if (params.get("quoteLookup") === "1") {
            resetModal();
            openModal();
            params.delete("quoteLookup");
            var nextUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "") + window.location.hash;
            window.history.replaceState({}, "", nextUrl);
        }
    }

    function initSiteShell() {
        var host = document.body;
        var pageType = host && host.dataset ? host.dataset.pageType : "";
        var config = getShellConfig(pageType);

        var headerTarget = document.querySelector("[data-site-header]");
        var mobileTarget = document.querySelector("[data-site-mobile-menu]");
        var footerTarget = document.querySelector("[data-site-footer]");

        if (headerTarget) {
            headerTarget.innerHTML = renderHeader(config);
        }

        if (mobileTarget) {
            mobileTarget.innerHTML = renderMobileMenu(config);
        }

        if (!document.getElementById("quoteLookupModal")) {
            document.body.insertAdjacentHTML("beforeend", renderQuoteLookupModal());
        }

        if (footerTarget) {
            footerTarget.innerHTML = renderFooter(config);
        }

        bindShellBehavior();
        bindQuoteLookupBehavior();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSiteShell);
    } else {
        initSiteShell();
    }
})();
