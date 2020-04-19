
chrome.webNavigation.onCompleted.addListener(function() {
    chrome.tabs.executeScript( {
        file: 'js/pagebg.js'
    });
}, {url: [{urlMatches : 'https://www.ebay.com/'}]});
