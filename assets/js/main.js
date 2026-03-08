$(function () {
    'use strict';
    featured();
    pagination(false);
    cookieConsent();
});

function cookieConsent() {
    'use strict';

    var STORAGE_KEY = 'os_cookie_consent';
    var banner = document.getElementById('os-cookie-banner');
    if (!banner) return;

    var acceptBtn = document.getElementById('os-cookie-accept');
    var declineBtn = document.getElementById('os-cookie-decline');

    function gpcActive() {
        return !!(navigator.globalPrivacyControl);
    }

    function grantAnalytics() {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', { 'analytics_storage': 'granted' });
        }
    }

    function showBanner() {
        banner.setAttribute('aria-hidden', 'false');
    }

    function hideBanner() {
        banner.setAttribute('aria-hidden', 'true');
    }

    function accept() {
        localStorage.setItem(STORAGE_KEY, 'accepted');
        grantAnalytics();
        hideBanner();
    }

    function decline() {
        localStorage.setItem(STORAGE_KEY, 'rejected');
        hideBanner();
    }

    if (gpcActive()) {
        localStorage.setItem(STORAGE_KEY, 'rejected');
        hideBanner();
        return;
    }

    var consent = localStorage.getItem(STORAGE_KEY);

    if (consent === 'accepted') {
        grantAnalytics();
        hideBanner();
    } else if (consent === 'rejected') {
        hideBanner();
    } else {
        showBanner();
    }

    if (acceptBtn) acceptBtn.addEventListener('click', accept);
    if (declineBtn) declineBtn.addEventListener('click', decline);

    $(document).on('click', 'a[href="#cookie-settings"]', function (e) {
        e.preventDefault();
        localStorage.removeItem(STORAGE_KEY);
        showBanner();
    });
}

function featured() {
    'use strict';
    $('.featured-feed').owlCarousel({
        dots: false,
        margin: 30,
        nav: true,
        navText: [
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" class="icon"><path d="M20.547 22.107L14.44 16l6.107-6.12L18.667 8l-8 8 8 8 1.88-1.893z"></path></svg>',
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" class="icon"><path d="M11.453 22.107L17.56 16l-6.107-6.12L13.333 8l8 8-8 8-1.88-1.893z"></path></svg>',
        ],
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 2,
            },
            992: {
                items: 3,
            },
        },
    });
}
