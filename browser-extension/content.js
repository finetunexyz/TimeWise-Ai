// TimeWise Browser Extension Content Script

// This script runs on all web pages to enhance time tracking functionality

(function() {
    'use strict';
    
    let isInitialized = false;
    
    // Initialize content script
    function initialize() {
        if (isInitialized) return;
        isInitialized = true;
        
        console.log('TimeWise content script loaded');
        
        // Track page navigation for context
        trackPageContext();
        
        // Listen for extension messages
        setupMessageListeners();
    }
    
    // Track page context for better activity categorization
    function trackPageContext() {
        const pageContext = {
            url: window.location.href,
            title: document.title,
            domain: window.location.hostname,
            timestamp: Date.now()
        };
        
        // Store context for activity logging
        sessionStorage.setItem('timewise_page_context', JSON.stringify(pageContext));
        
        // Detect work-related sites
        const workDomains = [
            'github.com', 'gitlab.com', 'stackoverflow.com', 'google.com/docs',
            'office.com', 'notion.so', 'slack.com', 'teams.microsoft.com',
            'zoom.us', 'meet.google.com', 'figma.com', 'trello.com',
            'asana.com', 'monday.com', 'linear.app'
        ];
        
        const isWorkSite = workDomains.some(domain => 
            window.location.hostname.includes(domain)
        );
        
        if (isWorkSite) {
            pageContext.suggestedCategory = 'work';
        }
        
        // Detect learning sites
        const learningSites = [
            'youtube.com/watch', 'coursera.org', 'udemy.com', 'pluralsight.com',
            'khan', 'edx.org', 'codecademy.com', 'freecodecamp.org',
            'developer.mozilla.org', 'w3schools.com'
        ];
        
        const isLearningSite = learningSites.some(domain => 
            window.location.href.includes(domain)
        );
        
        if (isLearningSite) {
            pageContext.suggestedCategory = 'learning';
        }
        
        // Store enhanced context
        sessionStorage.setItem('timewise_enhanced_context', JSON.stringify(pageContext));
    }
    
    // Setup message listeners for extension communication
    function setupMessageListeners() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'getPageContext') {
                const context = sessionStorage.getItem('timewise_enhanced_context');
                sendResponse(context ? JSON.parse(context) : null);
            }
            
            if (request.action === 'highlightProductiveTime') {
                highlightProductiveElements();
                sendResponse({ success: true });
            }
        });
    }
    
    // Highlight productive elements on the page (optional feature)
    function highlightProductiveElements() {
        // This could highlight work-related content
        const productiveSelectors = [
            'code', 'pre', '.highlight', '.code-block',
            '[class*="doc"]', '[class*="edit"]', '[class*="write"]'
        ];
        
        productiveSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.boxShadow = '0 0 5px rgba(96, 165, 250, 0.5)';
                el.style.transition = 'box-shadow 0.3s ease';
                
                // Remove highlight after 3 seconds
                setTimeout(() => {
                    el.style.boxShadow = '';
                }, 3000);
            });
        });
    }
    
    // Track time spent on page (for future features)
    let pageStartTime = Date.now();
    let isPageVisible = !document.hidden;
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page became hidden
            isPageVisible = false;
        } else {
            // Page became visible
            isPageVisible = true;
            pageStartTime = Date.now(); // Reset start time
        }
    });
    
    // Track page unload for time calculation
    window.addEventListener('beforeunload', () => {
        if (isPageVisible) {
            const timeSpent = (Date.now() - pageStartTime) / 1000 / 60; // minutes
            
            // Only track if spent more than 30 seconds
            if (timeSpent > 0.5) {
                const context = {
                    url: window.location.href,
                    title: document.title,
                    timeSpent: timeSpent,
                    timestamp: Date.now()
                };
                
                // Store in session for potential activity suggestion
                sessionStorage.setItem('timewise_session_data', JSON.stringify(context));
            }
        }
    });
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();