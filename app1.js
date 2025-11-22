// ==UserScript==
// @name         Ultimate Median.co Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Powerful ad blocker for Median.co with multiple protection layers
// @author       Professional Blocker
// @match        https://median.co/*
// @match        http://median.co/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    // Block ads before page loads
    blockAdsPreemptively();
    
    function blockAdsPreemptively() {
        // Block requests to ad networks
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            if (isAdUrl(url)) {
                console.log('🚫 Blocked fetch request to:', url);
                return Promise.reject(new Error('Ad request blocked'));
            }
            return originalFetch.apply(this, args);
        };
        
        // Block XMLHttpRequest to ad networks
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            xhr.open = function(method, url, ...rest) {
                if (isAdUrl(url)) {
                    console.log('🚫 Blocked XHR to:', url);
                    return;
                }
                return originalOpen.apply(this, [method, url, ...rest]);
            };
            return xhr;
        };
        
        // Block ad-related script tags
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'SCRIPT') {
                            const src = node.src || '';
                            if (isAdUrl(src)) {
                                node.remove();
                                console.log('🚫 Blocked script:', src);
                            }
                        }
                        if (node.tagName === 'IFRAME') {
                            const src = node.src || '';
                            if (isAdUrl(src)) {
                                node.remove();
                                console.log('🚫 Blocked iframe:', src);
                            }
                        }
                        if (node.tagName === 'IMG') {
                            const src = node.src || '';
                            if (isAdUrl(src)) {
                                node.remove();
                                console.log('🚫 Blocked image:', src);
                            }
                        }
                    }
                });
            });
        });
        
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
    
    function isAdUrl(url) {
        if (!url) return false;
        
        const adPatterns = [
            'doubleclick.net',
            'googleadservices.com',
            'googlesyndication.com',
            'google-analytics.com',
            'facebook.com/tr',
            'adsystem',
            'adserver',
            'adservice',
            'advertising',
            'ads.',
            'ad.',
            'banner',
            'track',
            'analytics',
            'beacon',
            'pixel',
            'tracking',
            'metrics',
            'telemetry',
            'adfox',
            'adriver',
            'adform',
            'criteo',
            'outbrain',
            'taboola',
            'revcontent',
            'zemanta',
            'quantserve',
            'scorecardresearch',
            'exelator',
            'rubiconproject',
            'pubmatic',
            'openx',
            'appnexus',
            'indexexchange',
            'sonobi',
            'triplelift',
            'teads',
            'sharethrough',
            'yieldmo',
            'kargo',
            'gumgum',
            'stickyadstv',
            'unruly',
            'distroscale',
            'content.ad',
            'mgid.com',
            'gravity.com',
            'taboola.com',
            'outbrain.com',
            'revcontent.com',
            'zemanta.com',
            'adsco.re',
            'adblade.com',
            'adbrite.com',
            'adbutler.com',
            'adcenter.net',
            'adconion.com',
            'adform.com',
            'adgent007.com',
            'adition.com',
            'adnxs.com',
            'adocean.pl',
            'adroll.com',
            'adsfac.net',
            'adsfactor.net',
            'adspeed.com',
            'adsrvr.org',
            'adtech.com',
            'adtech.de',
            'advertising.com',
            'afy11.net',
            'atdmt.com',
            'atemda.com',
            'bidswitch.net',
            'brightcom.com',
            'casalemedia.com',
            'contextweb.com',
            'criteo.com',
            'demdex.net',
            'dotandad.com',
            'doubleverify.com',
            'emediate.com',
            'everesttech.net',
            'exponential.com',
            'eyereturn.com',
            'fastclick.com',
            'flashtalking.com',
            'fwmrm.net',
            'googleadservices.com',
            'googlesyndication.com',
            'gtags.com',
            'innovid.com',
            'integral-marketing.com',
            'intellitxt.com',
            'krxd.net',
            'lijit.com',
            'liveintent.com',
            'mediamath.com',
            'media.net',
            'mookie1.com',
            'myads.com',
            'narrative.io',
            'nativeads.com',
            'netseer.com',
            'nexac.com',
            'omniture.com',
            'openadstream.com',
            'optimizely.com',
            'outbrain.com',
            'overture.com',
            'pointroll.com',
            'pubmatic.com',
            'purch.com',
            'quantserve.com',
            'radiumone.com',
            'revcontent.com',
            'richmedia.com',
            'rightmedia.com',
            'rubiconproject.com',
            'scorecardresearch.com',
            'serving-sys.com',
            'sharethrough.com',
            'smartadserver.com',
            'sonobi.com',
            'specificmedia.com',
            'spotxchange.com',
            'stackadapt.com',
            'stickyadstv.com',
            'taboola.com',
            'tapad.com',
            'trafficfactory.biz',
            'tribalfusion.com',
            'turn.com',
            'undertone.com',
            'unruly.com',
            'videoegg.com',
            'videology.com',
            'viewable.com',
            'yieldmo.com',
            'yieldoptimizer.com',
            'yldbt.com',
            'zedo.com',
            '/ads/',
            '/ad/',
            '/banner/',
            '/promo/',
            '/sponsor/',
            'advertising',
            'tracking',
            'analytics'
        ];
        
        return adPatterns.some(pattern => url.toLowerCase().includes(pattern.toLowerCase()));
    }
    
    // CSS-based ad blocking
    function applyCSSBlocking() {
        const style = document.createElement('style');
        style.id = 'ultimate-ad-blocker-css';
        style.textContent = `
            /* Hide ad elements */
            .ad, .ads, .advertisement, .ad-container, .ad-wrapper, 
            .ad-unit, .ad-space, .ad-area, .ad-spot, .ad-place,
            .ad-position, .ad-location, .ad-zone, .ad-region,
            .ad-field, .ad-site, .ad-page, .ad-screen, .ad-view,
            .ad-window, .ad-dialog, .ad-popup, .ad-modal, .ad-lightbox,
            .ad-overlay, .ad-backdrop, .ad-shade, .ad-curtain, .ad-veil,
            .ad-mask, .ad-filter, .ad-blur, .ad-fade, .ad-dim,
            [class*="ad-"], [id*="ad-"], [class*="ads-"], [id*="ads-"],
            [class*="ad_"], [id*="ad_"], [class*="ads_"], [id*="ads_"],
            .banner, .banner-ad, .ad-banner, .promo-banner,
            .sponsor, .sponsorship, .sponsored, .ad-sponsored,
            .commercial, .ad-commercial, .advert, .advertising,
            .advertorial, .ad-content, .ad-body, .ad-main,
            .ad-wrap, .ad-holder, .ad-inner, .ad-outer,
            .ad-cover, .ad-layer, .ad-level, .ad-frame,
            .ad-box, .ad-card, .ad-tile, .ad-cell, .ad-table,
            .ad-list, .ad-menu, .ad-nav, .ad-link, .ad-button,
            .ad-btn, .ad-icon, .ad-image, .ad-img, .ad-picture,
            .ad-photo, .ad-video, .ad-media, .ad-player,
            .ad-iframe, .ad-embed, .ad-script, .ad-code,
            .ad-tag, .ad-label, .ad-text, .ad-title, .ad-heading,
            .ad-caption, .ad-description, .ad-notice, .ad-notification,
            .ad-alert, .ad-message, .ad-bar, .ad-strip, .ad-line,
            .ad-row, .ad-column, .ad-section, .ad-block, .ad-element,
            .ad-item, .ad-object, .ad-entity, .ad-component,
            .ad-widget, .ad-plugin, .ad-tool, .ad-utility,
            .ad-service, .ad-system, .ad-network, .ad-provider,
            .ad-server, .ad-manager, .ad-control, .ad-panel,
            .ad-board, .google-ad, .facebook-ad, .twitter-ad,
            .instagram-ad, .youtube-ad, .video-ad, .popup-ad,
            .floating-ad, .sticky-ad, .fixed-ad, .sidebar-ad,
            .header-ad, .footer-ad, .top-ad, .bottom-ad,
            .left-ad, .right-ad, .center-ad, .middle-ad,
            .inline-ad, .background-ad, .interstitial-ad,
            .preroll-ad, .midroll-ad, .postroll-ad,
            .native-ad, .recommend-ad, .suggest-ad,
            .promoted-ad, .featured-ad, .highlight-ad,
            .premium-ad, .exclusive-ad, .special-ad,
            .offer-ad, .deal-ad, .discount-ad,
            .coupon-ad, .voucher-ad, .promo-ad,
            .sale-ad, .clearance-ad, .bargain-ad,
            .pre-roll, .mid-roll, .post-roll,
            .video-ads, .ad-video, .ad-player,
            .ad-unit, .ad-slot, .ad-placeholder,
            .ad-fallback, .ad-alternative,
            .ad-loading, .ad-loaded, .ad-ready,
            .ad-active, .ad-inactive, .ad-enabled,
            .ad-disabled, .ad-on, .ad-off,
            .ad-visible, .ad-hidden, .ad-show,
            .ad-hide, .ad-blocked, .ad-removed,
            .ad-deleted, .ad-cleared, .ad-free,
            .ad-less, .ad-none, .ad-zero,
            .ad-null, .ad-void, .ad-empty,
            .ad-blank, .ad-missing, .ad-absent,
            .ad-gone, .ad-away, .ad-far,
            .ad-near, .ad-here, .ad-there,
            .ad-this, .ad-that, .ad-other,
            .ad-another, .ad-next, .ad-prev,
            .ad-previous, .ad-first, .ad-last,
            .ad-top, .ad-bottom, .ad-left,
            .ad-right, .ad-center, .ad-middle,
            .ad-front, .ad-back, .ad-up,
            .ad-down, .ad-high, .ad-low,
            .ad-big, .ad-small, .ad-large,
            .ad-wide, .ad-narrow, .ad-tall,
            .ad-short, .ad-thin, .ad-thick,
            .ad-fat, .ad-slim, .ad-long,
            .ad-round, .ad-square, .ad-circle,
            .ad-triangle, .ad-star, .ad-heart,
            .ad-diamond, .ad-spade, .ad-club,
            .ad-arrow, .ad-pointer, .ad-cursor,
            .ad-hand, .ad-finger, .ad-face,
            .ad-eye, .ad-nose, .ad-mouth,
            .ad-ear, .ad-head, .ad-hair,
            .ad-body, .ad-arm, .ad-leg,
            .ad-foot, .ad-toe, .ad-smile,
            .ad-frown, .ad-laugh, .ad-cry,
            .ad-shout, .ad-whisper, .ad-sing,
            .ad-dance, .ad-jump, .ad-run,
            .ad-walk, .ad-stand, .ad-sit,
            .ad-lie, .ad-sleep, .ad-wake,
            .ad-eat, .ad-drink, .ad-cook,
            .ad-bake, .ad-fry, .ad-boil,
            .ad-steam, .ad-grill, .ad-roast,
            .ad-toast, .ad-sandwich, .ad-burger,
            .ad-pizza, .ad-pasta, .ad-rice,
            .ad-bread, .ad-cake, .ad-cookie,
            .ad-candy, .ad-chocolate, .ad-icecream,
            .ad-drink, .ad-juice, .ad-soda,
            .ad-water, .ad-coffee, .ad-tea,
            .ad-milk, .ad-beer, .ad-wine,
            .ad-whiskey, .ad-vodka, .ad-rum,
            .ad-gin, .ad-brandy, .ad-champagne,
            .ad-cocktail, .ad-martini, .ad-margarita,
            .ad-mojito, .ad-daiquiri, .ad-pina-colada,
            .ad-long-island, .ad-mai-tai, .ad-zombie,
            .ad-scorpion, .ad-blue-hawaiian,
            .ins_ad, .adsbygoogle, .GoogleActiveViewElement,
            .ad-728x90, .ad-300x250, .ad-160x600, .ad-970x250,
            .ad-300x600, .ad-336x280, .ad-468x60, .ad-120x600,
            .ad-320x50, .ad-728x90, .ad-970x90,
            .ad-superbanner, .ad-skyscraper, .ad-rectangle,
            .ad-square, .ad-leaderboard, .ad-billboard,
            .ad-wallpaper, .ad-interstitial,
            .dfp-ad, .gpt-ad, .pmd-ad,
            #ad, #ads, #advertisement, #ad-container,
            #ad-wrapper, #ad-unit, #ad-space, #ad-area,
            #ad-spot, #ad-place, #ad-position, #ad-location,
            #ad-zone, #ad-region, #ad-field, #ad-site,
            #ad-page, #ad-screen, #ad-view, #ad-window,
            #ad-dialog, #ad-popup, #ad-modal, #ad-lightbox,
            #ad-overlay, #ad-backdrop, #ad-shade, #ad-curtain,
            #ad-veil, #ad-mask, #ad-filter, #ad-blur,
            #ad-fade, #ad-dim, #ad-banner, #ad-banners,
            #ad-header, #ad-footer, #ad-sidebar, #ad-content,
            #ad-main, #ad-wrap, #ad-holder, #ad-inner,
            #ad-outer, #ad-cover, #ad-layer, #ad-level,
            #ad-frame, #ad-box, #ad-card, #ad-tile,
            #ad-cell, #ad-table, #ad-list, #ad-menu,
            #ad-nav, #ad-link, #ad-button, #ad-btn,
            #ad-icon, #ad-image, #ad-img, #ad-picture,
            #ad-photo, #ad-video, #ad-media, #ad-player,
            #ad-iframe, #ad-embed, #ad-script, #ad-code,
            #ad-tag, #ad-label, #ad-text, #ad-title,
            #ad-heading, #ad-caption, #ad-description,
            #ad-notice, #ad-notification, #ad-alert,
            #ad-message, #ad-bar, #ad-strip, #ad-line,
            #ad-row, #ad-column, #ad-section, #ad-block,
            #ad-element, #ad-item, #ad-object, #ad-entity,
            #ad-component, #ad-widget, #ad-plugin, #ad-tool,
            #ad-utility, #ad-service, #ad-system, #ad-network,
            #ad-provider, #ad-server, #ad-manager, #ad-control,
            #ad-panel, #ad-board, #google-ad, #facebook-ad,
            #twitter-ad, #instagram-ad, #youtube-ad, #video-ad,
            #popup-ad, #floating-ad, #sticky-ad, #fixed-ad,
            #sidebar-ad, #header-ad, #footer-ad, #top-ad,
            #bottom-ad, #left-ad, #right-ad, #center-ad,
            #middle-ad, #inline-ad, #background-ad,
            #interstitial-ad, #preroll-ad, #midroll-ad,
            #postroll-ad, #native-ad, #recommend-ad,
            #suggest-ad, #promoted-ad, #featured-ad,
            #highlight-ad, #premium-ad, #exclusive-ad,
            #special-ad, #offer-ad, #deal-ad, #discount-ad,
            #coupon-ad, #voucher-ad, #promo-ad, #sale-ad,
            #clearance-ad, #bargain-ad, #pre-roll, #mid-roll,
            #post-roll, #video-ads, #ad-video, #ad-player,
            #ad-unit, #ad-slot, #ad-placeholder, #ad-fallback,
            #ad-alternative, #ad-loading, #ad-loaded,
            #ad-ready, #ad-active, #ad-inactive, #ad-enabled,
            #ad-disabled, #ad-on, #ad-off, #ad-visible,
            #ad-hidden, #ad-show, #ad-hide, #ad-blocked,
            #ad-removed, #ad-deleted, #ad-cleared, #ad-free,
            #ad-less, #ad-none, #ad-zero, #ad-null,
            #ad-void, #ad-empty, #ad-blank, #ad-missing,
            #ad-absent, #ad-gone, #ad-away, #ad-far,
            #ad-near, #ad-here, #ad-there, #ad-this,
            #ad-that, #ad-other, #ad-another, #ad-next,
            #ad-prev, #ad-previous, #ad-first, #ad-last,
            #ad-top, #ad-bottom, #ad-left, #ad-right,
            #ad-center, #ad-middle, #ad-front, #ad-back,
            #ad-up, #ad-down, #ad-high, #ad-low,
            #ad-big, #ad-small, #ad-large, #ad-wide,
            #ad-narrow, #ad-tall, #ad-short, #ad-thin,
            #ad-thick, #ad-fat, #ad-slim, #ad-long,
            #ad-round, #ad-square, #ad-circle, #ad-triangle,
            #ad-star, #ad-heart, #ad-diamond, #ad-spade,
            #ad-club, #ad-arrow, #ad-pointer, #ad-cursor,
            #ad-hand, #ad-finger, #ad-face, #ad-eye,
            #ad-nose, #ad-mouth, #ad-ear, #ad-head,
            #ad-hair, #ad-body, #ad-arm, #ad-leg,
            #ad-foot, #ad-toe, #ad-smile, #ad-frown,
            #ad-laugh, #ad-cry, #ad-shout, #ad-whisper,
            #ad-sing, #ad-dance, #ad-jump, #ad-run,
            #ad-walk, #ad-stand, #ad-sit, #ad-lie,
            #ad-sleep, #ad-wake, #ad-eat, #ad-drink,
            #ad-cook, #ad-bake, #ad-fry, #ad-boil,
            #ad-steam, #ad-grill, #ad-roast, #ad-toast,
            #ad-sandwich, #ad-burger, #ad-pizza, #ad-pasta,
            #ad-rice, #ad-bread, #ad-cake, #ad-cookie,
            #ad-candy, #ad-chocolate, #ad-icecream,
            #ad-drink, #ad-juice, #ad-soda, #ad-water,
            #ad-coffee, #ad-tea, #ad-milk, #ad-beer,
            #ad-wine, #ad-whiskey, #ad-vodka, #ad-rum,
            #ad-gin, #ad-brandy, #ad-champagne, #ad-cocktail,
            #ad-martini, #ad-margarita, #ad-mojito,
            #ad-daiquiri, #ad-pina-colada, #ad-long-island,
            #ad-mai-tai, #ad-zombie, #ad-scorpion,
            #ad-blue-hawaiian, #ins_ad, #adsbygoogle,
            #GoogleActiveViewElement, #ad-728x90, #ad-300x250,
            #ad-160x600, #ad-970x250, #ad-300x600,
            #ad-336x280, #ad-468x60, #ad-120x600,
            #ad-320x50, #ad-728x90, #ad-970x90,
            #ad-superbanner, #ad-skyscraper, #ad-rectangle,
            #ad-square, #ad-leaderboard, #ad-billboard,
            #ad-wallpaper, #ad-interstitial, #dfp-ad,
            #gpt-ad, #pmd-ad,
            iframe[src*="ads"], iframe[src*="ad."],
            iframe[src*="doubleclick"], iframe[src*="googleadservices"],
            iframe[src*="googlesyndication"], iframe[src*="adserver"],
            iframe[src*="advertising"], iframe[src*="banner"],
            script[src*="ads"], script[src*="ad."],
            script[src*="doubleclick"], script[src*="googleadservices"],
            script[src*="googlesyndication"], script[src*="adserver"],
            script[src*="advertising"], script[src*="banner"],
            img[src*="ads"], img[src*="ad."],
            img[src*="doubleclick"], img[src*="googleadservices"],
            img[src*="googlesyndication"], img[src*="adserver"],
            img[src*="advertising"], img[src*="banner"]
            {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                width: 0 !important;
                height: 0 !important;
                position: absolute !important;
                left: -9999px !important;
                top: -9999px !important;
                pointer-events: none !important;
                z-index: -9999 !important;
            }
            
            /* Block empty divs that might be ad containers */
            div:empty, span:empty, a:empty,
            div[style*="width: 728px; height: 90px"],
            div[style*="width: 300px; height: 250px"],
            div[style*="width: 160px; height: 600px"],
            div[style*="width: 970px; height: 250px"],
            div[style*="width: 300px; height: 600px"],
            div[style*="width: 336px; height: 280px"],
            div[style*="width: 468px; height: 60px"],
            div[style*="width: 120px; height: 600px"],
            div[style*="width: 320px; height: 50px"]
            {
                display: none !important;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Apply aggressive element hiding
    function applyAggressiveBlocking() {
        const selectors = [
            // Common ad containers
            'div[id*="ad"]', 'div[class*="ad"]',
            'span[class*="ad"]', 'section[class*="ad"]',
            'aside[class*="ad"]', 'nav[class*="ad"]',
            'header[class*="ad"]', 'footer[class*="ad"]',
            
            // Social media widgets that might be ads
            '.social-widget', '.share-widget',
            '.recommendation-widget', '.suggestion-widget',
            
            // Popups and overlays
            '.popup', '.modal', '.overlay', '.lightbox',
            '.dialog', '.popover', '.tooltip',
            
            // Tracking elements
            '[data-ad]', '[data-ads]', '[data-advertiser]',
            '[data-track]', '[data-analytics]',
            
            // Empty containers with ad-like dimensions
            'div[style*="height: 90px"]', 'div[style*="height: 250px"]',
            'div[style*="height: 600px"]', 'div[style*="height: 280px"]',
            'div[style*="height: 60px"]', 'div[style*="height: 50px"]'
        ];
        
        function hideElements() {
            selectors.forEach(selector => {
                try {
                    document.querySelectorAll(selector).forEach(el => {
                        if (el.offsetWidth > 100 || el.offsetHeight > 50) {
                            el.style.cssText = 'display: none !important; visibility: hidden !important;';
                        }
                    });
                } catch (e) {
                    // Ignore errors
                }
            });
        }
        
        // Initial hide
        hideElements();
        
        // Continuous monitoring
        setInterval(hideElements, 1000);
        
        // Monitor DOM changes
        new MutationObserver(hideElements).observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Initialize all blocking methods
    function initializeBlocker() {
        applyCSSBlocking();
        applyAggressiveBlocking();
        
        console.log('🛡️ Ultimate Ad Blocker activated for Median.co');
        console.log('✅ Request blocking enabled');
        console.log('✅ CSS blocking enabled');
        console.log('✅ Aggressive element hiding enabled');
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeBlocker);
    } else {
        initializeBlocker();
    }
    
})();
