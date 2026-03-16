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
            contactHref: base + "#contact"
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
            '    <a class="btn-primary" href="' + config.contactHref + '" data-ml>도입 문의</a>',
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

        if (footerTarget) {
            footerTarget.innerHTML = renderFooter(config);
        }

        bindShellBehavior();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSiteShell);
    } else {
        initSiteShell();
    }
})();
