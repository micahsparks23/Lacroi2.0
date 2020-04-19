$(document).ready(function() {
    console.log("seller");
    $("#checkonsellercentral").click(function(){

        console.log("sellerclick");
        var newURL = "https://sellercentral.amazon.com/product-search/search?q=B003UMCMU6";
        tabId = 10000001;
        chrome.tabs.create({'index':tabId,'url': newURL,'selected':false });
        

        chrome.tabs.onUpdated.addListener(function(tabId, info) {
           
            if (info.status === 'complete') {              
                chrome.tabs.executeScript(tabId, {
                    
                }, function() {
                    chrome.tabs.executeScript(tabId, {
                        file: 'js/test.js'
                    });
                });
            }
        });

        chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
            console.log(message);
           
        });
       // $.get('https://sellercentral.amazon.com/product-search/search?q=B00CAUTK0E' + name, function(response) {  console.log(response);});


    });



});