var contador = 1;
(function() {
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
        var $ = window.jQuery;
        // Use $ here...
        
        /*if($('.kat-select-container.small').parent().length > 0) {
            let options = $('.kat-select-container.small').parent().attr("options");
            result = `{"asin": "${asin}","options":${options},"execution":"${execution}"}`;
            if(contador == 1){
                chrome.runtime.sendMessage(result);
            }
            contador++;
        }else if($('.copy-kat-button.primary').length > 0){
            
            let noallowed = $('.copy-kat-button.primary').text();
            options = '[{"name":"Not allowed","value":"Not allowed"}]';
            result = `{"asin": "${asin}","options":${options},"execution":"${execution}"}`;
            if(contador == 1){
                chrome.runtime.sendMessage(result);
            }
            contador++;
        }else if($('kat-button[label="Not available"]').length > 0){
            
            options = '[{"name":"Not available","value":"Not available"}]';
            result = `{"asin": "${asin}","options":${options},"execution":"${execution}"}`;
            if(contador == 1){
                chrome.runtime.sendMessage(result);
            }
            contador++;
        }else if(times > 2){
            
            options = '[{"name":"NeedLogin","value":"Need Login"}]';
            result = `{"asin": "${asin}","options":${options},"execution":"${execution}"}`;
            if(contador == 1){
                chrome.runtime.sendMessage(result);
            }
            contador++;
        }*/



        
        
        let myVar = setInterval(myTimer, 300);
        let times = 0;
        let result;
        function myTimer() {
            console.log(contador)
            if($('.kat-select-container.small').parent().length > 0) {
                setTimeout(function() {
                    let options = $('.kat-select-container.small').parent().attr("options");
                    result = `{"asin": "${asin}","options":${options},"execution":"${execution}"}`;
                    if(contador == 1){
                        chrome.runtime.sendMessage(result);
                    }
                    contador++;
                    clearInterval(myVar);
                },100);
            }else if($('.copy-kat-button.primary').length > 0){
                let noallowed = $('.copy-kat-button.primary').text();
                options = '[{"name":"Not allowed","value":"Not allowed"}]';
                result = `{"asin": "${asin}","options":${options},"execution":"${execution}"}`;
                if(contador == 1){
                    chrome.runtime.sendMessage(result);
                }
                contador++;
                clearInterval(myVar);
            }else if($('kat-button[label="Not available"]').length > 0){
                options = '[{"name":"Not available","value":"Not available"}]';
                result = `{"asin": "${asin}","options":${options},"execution":"${execution}"}`;
                if(contador == 1){
                    chrome.runtime.sendMessage(result);
                }
                contador++;
                clearInterval(myVar);
            }else if(times > 5){
                options = '[{"name":"NeedLogin","value":"Need Login"}]';
                result = `{"asin": "${asin}","options":${options},"execution":"${execution}"}`;
                if(contador == 1){
                    chrome.runtime.sendMessage(result);
                }
                contador++;
                clearInterval(myVar);
            }
            times++;
        }
    };
    document.getElementsByTagName("head")[0].appendChild(script);
})();


