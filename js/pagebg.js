let counterLogo = 0;

if(counterLogo < 2){
    counterLogo++;
    $('.s-item__title').each(function() {
        console.log(this)        
        var titleSearch = $(this).text()      
        titleSearch = encodeURI(titleSearch);        
        $(this).append(`<a target="_blank" href="https://www.amazon.com/s?k=${titleSearch}"><img style="width:100px;display:block;padding-top: 10px;" src="https://logodownload.org/wp-content/uploads/2014/04/amazon-logo.png"></a>`);    
    })
}

$('.s-item__link').each(function() { 
        
    let link = $(this).attr("href")
       
    let oldURL = link
    let index = 0;
    let newURL = oldURL;
    index = oldURL.indexOf('?');
    if(index == -1){
        index = oldURL.indexOf('#');
    }
    if(index != -1){
        newURL = oldURL.substring(0, index);
    } 
    let affiliate_link = "http://rover.ebay.com/rover/1/711-53200-19255-0/1?ff3=4&pub=5575550092&toolid=10001&campid=5338617495&customid=1001&mpre="+encodeURI(newURL);             
    $(this).attr("href",affiliate_link)
    $(this).attr("target","_blank")        
})