$(function () {
    'use strict';
    featured();
    pagination(false);
    cookieConsent();
    privacyPreferences();
});

// Consent state is read in default.hbs (window.osConsent) before gtag loads.
function consentState() {
    'use strict';
    var c = window.osConsent || {key: 'os_cookie_consent', choice: null, signal: false, likelyEEA: false};
    try { c.choice = localStorage.getItem(c.key); } catch (e) {}
    c.analyticsOn = !c.signal && (c.choice === 'accepted' || (c.choice !== 'rejected' && !c.likelyEEA));
    return c;
}

function setAnalyticsConsent(granted, sendPageView) {
    'use strict';
    var c = consentState();
    try { localStorage.setItem(c.key, granted ? 'accepted' : 'rejected'); } catch (e) {}
    if (typeof gtag !== 'function') return;
    gtag('consent', 'update', { 'analytics_storage': granted ? 'granted' : 'denied' });
    // The landing page_view went out before consent; count it now.
    if (granted && sendPageView) gtag('event', 'page_view');
}

function cookieConsent() {
    'use strict';

    var banner = document.getElementById('os-cookie-banner');
    if (!banner) return;

    var acceptBtn = document.getElementById('os-cookie-accept');
    var declineBtn = document.getElementById('os-cookie-decline');

    function showBanner() {
        banner.setAttribute('aria-hidden', 'false');
    }

    function hideBanner() {
        banner.setAttribute('aria-hidden', 'true');
    }

    if (acceptBtn) acceptBtn.addEventListener('click', function () {
        var wasOn = consentState().analyticsOn;
        setAnalyticsConsent(true, !wasOn);
        hideBanner();
    });
    if (declineBtn) declineBtn.addEventListener('click', function () {
        setAnalyticsConsent(false);
        hideBanner();
    });

    $(document).on('click', 'a[href="#cookie-settings"]', function (e) {
        e.preventDefault();
        showBanner();
    });

    // The banner asks only visitors who are likely in the EEA/UK/CH (opt-in
    // regions) and have not chosen yet. Everyone else is opt-out via
    // /preferences/, GPC or DNT.
    var c = consentState();
    if (c.likelyEEA && !c.signal && !c.choice) {
        showBanner();
    } else {
        hideBanner();
    }
}

function privacyPreferences() {
    'use strict';

    var toggle = document.getElementById('os-pref-analytics-toggle');
    if (!toggle) return;

    var badge = document.getElementById('os-pref-analytics-badge');
    var gpcNotice = document.getElementById('os-pref-gpc-notice');
    var isSignal = consentState().signal;

    function updateUI() {
        var isOn = consentState().analyticsOn;
        toggle.checked = isOn;

        if (badge) {
            badge.textContent = isOn ? 'Enabled' : 'Disabled';
            badge.className = 'os-pref-badge ' + (isOn ? 'os-pref-badge-on' : 'os-pref-badge-off');
        }
    }

    if (isSignal && gpcNotice) {
        gpcNotice.classList.add('visible');
        toggle.disabled = true;
        toggle.closest('.os-toggle').style.opacity = '0.5';
        toggle.closest('.os-toggle').style.cursor = 'not-allowed';
    }

    toggle.addEventListener('change', function () {
        if (isSignal) {
            toggle.checked = false;
            return;
        }
        setAnalyticsConsent(toggle.checked, false);
        updateUI();
    });

    updateUI();
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
