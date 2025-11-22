// ==UserScript==
// @name         Median.co Ad Cleanup
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove ads and clean up Median.co
// @author       You
// @match        https://median.co/*
// @match        http://median.co/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Function to remove elements by selector
    function removeElements(selector) {
        document.querySelectorAll(selector).forEach(element => {
            element.remove();
        });
    }
    
    // Function to remove elements by class name pattern
    function removeByClassPattern(pattern) {
        const elements = document.querySelectorAll('[class]');
        elements.forEach(element => {
            const classList = element.className.toString();
            if (classList.includes(pattern)) {
                element.remove();
            }
        });
    }
    
    // Remove common ad containers
    const adSelectors = [
        '.advertisement',
        '.ads',
        '.ad-container',
        '.ad-wrapper',
        '[class*="ad-"]',
        '[class*="ads-"]',
        '[id*="ad-"]',
        '[id*="ads-"]',
        '.banner-ad',
        '.ad-banner',
        '.popup',
        '.modal-ad',
        '.ad-modal',
        '.ad-overlay',
        '.ad-sidebar',
        '.ad-header',
        '.ad-footer'
    ];
    
    // Execute removal functions
    function cleanPage() {
        // Remove by specific selectors
        adSelectors.forEach(selector => {
            removeElements(selector);
        });
        
        // Remove iframes that might contain ads
        document.querySelectorAll('iframe').forEach(iframe => {
            if (iframe.src.includes('ad') || 
                iframe.src.includes('ads') || 
                iframe.src.includes('doubleclick') ||
                iframe.src.includes('googleadservices')) {
                iframe.remove();
            }
        });
        
        // Remove scripts that load ads
        document.querySelectorAll('script').forEach(script => {
            if (script.src && (
                script.src.includes('ad') || 
                script.src.includes('ads') ||
                script.src.includes('doubleclick') ||
                script.src.includes('googleadservices')
            )) {
                script.remove();
            }
        });
    }
    
    // Run initially
    cleanPage();
    
    // Run on DOM changes (for dynamic content)
    const observer = new MutationObserver(cleanPage);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Re-run after page load
    window.addEventListener('load', cleanPage);
    
    // Re-run every 2 seconds for dynamic ads
    setInterval(cleanPage, 2000);
    
    console.log('Median.co Ad Blocker activated');
})();
