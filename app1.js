// ==UserScript==
// @name         EasyList Processor for Median.co
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Fetch and apply EasyList rules
// @author       You
// @match        https://median.co/*
// @match        http://median.co/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(async function() {
    'use strict';
    
    // Fetch EasyList and convert to JavaScript rules
    async function loadAndProcessEasyList() {
        try {
            console.log('📥 Fetching EasyList...');
            
            const response = await fetch('https://easylist-downloads.adblockplus.org/easylist.txt');
            const easyListText = await response.text();
            
            console.log('✅ EasyList loaded, processing rules...');
            
            // Process EasyList rules
            const rules = processEasyListRules(easyListText);
            
            // Apply the rules
            applyRules(rules);
            
            console.log(`🎯 Applied ${rules.length} EasyList rules`);
            
        } catch (error) {
            console.error('❌ Error loading EasyList:', error);
        }
    }
    
    // Process EasyList text into usable rules
    function processEasyListRules(easyListText) {
        const lines = easyListText.split('\n');
        const rules = [];
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Skip comments and empty lines
            if (!trimmedLine || trimmedLine.startsWith('!')) {
                continue;
            }
            
            // Process element hiding rules (##selector)
            if (trimmedLine.includes('##')) {
                const parts = trimmedLine.split('##');
                if (parts.length === 2) {
                    rules.push({
                        type: 'elementHide',
                        selector: parts[1]
                    });
                }
            }
            // Process URL blocking rules (||domain)
            else if (trimmedLine.startsWith('||')) {
                rules.push({
                    type: 'urlBlock',
                    domain: trimmedLine.replace('||', '').split('^')[0]
                });
            }
            // Process other rule types as needed
        }
        
        return rules;
    }
    
    // Apply the processed rules
    function applyRules(rules) {
        let appliedCount = 0;
        
        rules.forEach(rule => {
            try {
                if (rule.type === 'elementHide' && rule.selector) {
                    // Apply element hiding
                    document.querySelectorAll(rule.selector).forEach(element => {
                        element.style.display = 'none';
                        appliedCount++;
                    });
                }
                // Add URL blocking implementation if needed
            } catch (error) {
                // Skip invalid selectors
            }
        });
        
        console.log(`🔄 Applied ${appliedCount} element hiding rules`);
    }
    
    // Start the process
    await loadAndProcessEasyList();
    
    // Watch for dynamic content
    const observer = new MutationObserver(() => {
        loadAndProcessEasyList();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();
