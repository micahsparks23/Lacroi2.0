$(document).ready(function() {

    $("body").append(/*html*/
        `                          
        <style>
            .open{
                transform: rotate(0deg)!important;
            }
            .newRoi,{
                color: #33bb12;
                width: 100%;
                max-width: 100%;
                display: block;                
            }
            .newRoi span{
                display: block;
                width: 100%;
                padding: 3px 0;
                color: #479933;
                font-size: 17px;
            }
            .price-send{
                font-size:17px;                        
                color: #9e0010!important;
            }
            .location_red{
                background:red;
                padding:3px;
                border-radius:5px;
                color:#000;

            }
            .rois{
                width:400px;
                position :fixed;               
                z-index: 99999;
                height:400px;
                top:0;
                right:1%;
            }
            .rois .container-info{
                background: #efeeee;
                border: 1px solid #cccccc;
            }        
            .accordion{
                border: 0px solid #ddd; 
                border-top: none; 
                margin: 10px 0; 
                float: left; width: 100%; 
                position: relative;
            }
            .accordion a{display: block; text-decoration: none;}
            .accordion h2, .accordion a{background-color: #fff; background-image: url(../img/gradient.jpg);
            background-image: -moz-linear-gradient(bottom, #f1f1f1, #fff);
            background-image: -ms-linear-gradient(bottom, #f1f1f1, #fff);
            background-image: -o-linear-gradient(bottom, #f1f1f1, #fff);
            background-image: -webkit-linear-gradient(bottom, #f1f1f1, #fff);
            background-image: -webkit-linear-gradient(bottom, #cacaca, #fff);
            border: 1px solid #ddd;
            color: #222; font: 14px/30px 'Verdana', sans-serif; height: 30px; margin: 0; padding: 0; text-indent: 10px;}
            p{color: #555; font: 12px/18px 'Verdana', sans-serif; padding: 20px 10px;}

            #accordionhtml5{clear: both; margin-top: 20px;}
            details summary::-webkit-details-marker{display: none;}

            .container-info div{
                border-bottom: 1px solid gray;
                margin: 10px 10px;
                padding-bottom: 15px;
            }

            .container-info div span{
                padding: 2px 0;
                position: relative;
                display: block;
                border: none;
            }

            .container-info div span a{
                border: none;
                background: none;
                position: relative;
                display: inline-block;
                color: #000!important;
                font-weight: 600;                
                height: auto!important;
                line-height: 20px;
                text-indent: 0;
                font-size: 13px!important;
            }
            .container-info div span a:hover{
                text-decoration: underline!important;
                opacity:0.8;
            }

            #mydivheader summary div:nth-of-type(1){
                position: absolute;
                width: 15px;
                height: 2px;
                background: #717171;
                right: 10px;
                top: 15px;
                cursor:pointer;
            }
            #mydivheader summary div:nth-of-type(2){
                position: absolute;
                width: 15px;
                height: 2px;
                background: #717171;
                right: 10px;
                top: 15px;
                transform: rotate(90deg);
                cursor:pointer;
            }
            #mydivheader .container-info{
                cursor:move;
            }
        </style>        
                      
    `)

    let positiveRois = [];
    let counter = 0;
    $('.s-item__price').each(function() {

        var location_info = $(this).parent().siblings().find(".s-item__location").html();
        var contain_location = $(this).parent().siblings().find(".s-item__location")

        if (location_info == "From China" || location_info == "From Hong Kong") {
            $(contain_location).addClass("location_red")
        }
        price = $(this).html()

        if (!$(this).find("a").length > 0) {

            price = price.split("$")
            coin = price[0].trim()
            price = price[1]

            price = remove_character(",", price)
            price = remove_character(" ", price)
            price = remove_character("&nbsp;", price)

            var sendPrice = $(this).parent().siblings().find(".s-item__shipping").html();
            sendPrice = (typeof sendPrice === 'undefined') ? 0 : sendPrice;

            var someVar = $(this).parent().siblings().find(".s-item__shipping");

            if ($(someVar).length > 0 && sendPrice != 0) {

                sendPrice = sendPrice.split("$", 2);

                if (sendPrice.length > 1) {
                    sendPrice = sendPrice[1];
                    sendPrice = sendPrice.split(" ", 2);
                    sendPrice = sendPrice[0]
                    lastPrice = parseFloat(sendPrice)
                    var precio = parseFloat(price)
                } else {
                    lastPrice = 0;
                    var precio = parseFloat(price)
                }

            } else {
                lastPrice = 0;
                var precio = parseFloat(price)
            }            

            if (!isNaN(price)) {
                if (coin == "MXN") {
                    price = price / 19.5;
                    price = Math.round(price * 100) / 100

                    lastPrice = lastPrice / 19.5;
                    lastPrice = Math.round(lastPrice * 100) / 100
                }
                var shipping_Price = price + lastPrice;
                shipping_Price = Math.round(shipping_Price * 100) / 100            

                roi_nuevo = ((price_new - price) / price) * 100;
                roi_nuevo = Math.round(roi_nuevo * 100) / 100

                roi_used = ((price_used - price) / price) * 100;
                roi_used = Math.round(roi_used * 100) / 100;

                roi_shipping_new = ((price_new - shipping_Price) / shipping_Price) * 100;
                roi_shipping_new = Math.round(roi_shipping_new * 100) / 100;

                roi_shipping_used = ((price_used - shipping_Price) / shipping_Price) * 100;
                roi_shipping_used = Math.round(roi_shipping_used * 100) / 100;         

                

                var productTitle =  $(this).parents(".s-item__wrapper").find(".s-item__title").text()
                var productImage =  $(this).parents(".s-item__wrapper").find(".s-item__image-img").attr("src")
                
                if(searchingFor == "new"){
                    if(roi_nuevo > 0 || roi_shipping_new > 0){

                        let prodId = "anchor_"+counter
                        positiveRois[counter] = {'id':prodId,'image':productImage,'title':productTitle,'roi_nuevo':roi_nuevo,'roi_used':roi_used,'roi_shipping_new':roi_shipping_new,'roi_shipping_used':roi_shipping_used,}
                        $(this).parents(".s-item__wrapper").attr("id",prodId)
                        counter++;
                    }
                }
                if(searchingFor == "used"){
                    if(roi_used > 0 || roi_shipping_used > 0){
                        let prodId = "anchor_"+counter
                        positiveRois[counter] = {'id':prodId,'image':productImage,'title':productTitle,'roi_nuevo':roi_nuevo,'roi_used':roi_used,'roi_shipping_new':roi_shipping_new,'roi_shipping_used':roi_shipping_used,}
                        $(this).parents(".s-item__wrapper").attr("id",prodId)
                        counter++;
                    }
                }
                

        
                var elemento = $(this).parent().parent().parent().find(".SECONDARY_INFO").html();
                if (elemento == "Brand New" || typeof elemento === 'undefined') {
                    if (sendPrice != 0) {
                        $(this).append(`
                            <div class="newRoi">
                                <span class="roi"> ROI: ${roi_nuevo}% </span> 
                                <span class="price-send">Price with shipping: $${shipping_Price}</span>
                                <span class="roi"> ROI with shipping: ${roi_shipping_new}% </span>                                                                                
                            </div>                                       
                        `)
                    } else {
                        $(this).append(`
                            <div class="newRoi">
                                <span class="roi"> ROI: ${roi_nuevo}% </span> 
                                                                                
                            </div>                                       
                        `)
                    }

                } else if (elemento == "Totalmente nuevo") {
                    if (sendPrice != 0) {
                        $(this).append(`                             
                            <div class="newRoi">
                                <span class="roi"> ROI: ${roi_nuevo}% </span>
                                <span class="price-send">Precio con envio: $${shipping_Price}</span>  
                                <span class="roi"> ROI con envio: ${roi_shipping_new}% </span>                                                                                      
                            </div>                              
                        `)
                    } else {
                        $(this).append(`                             
                            <div class="newRoi">
                                <span class="roi"> ROI: ${roi_nuevo}% </span>                                                                                    
                            </div>                                          
                        `)
                    }
                } else if (elemento == "Pre-Owned" || elemento == "Refurbished") {
                    if (sendPrice != 0) {
                        $(this).append(`          
                            <div class="newRoi">                                            
                                <span class="used"> ROI Used: $${roi_used}% </span>
                                <span class="price-send">Price with shipping: $${shipping_Price}</span> 
                                <span class="roi"> ROI with shipping: ${roi_shipping_used}% </span> 
                            </div> 
                        `)
                    } else {
                        $(this).append(`          
                            <div class="newRoi">                                            
                                <span class="used"> ROI Used: $${roi_used}% </span>
                            </div> 
                        `)
                    }

                } else if (elemento == "De segunda mano" || elemento == "Restauradas") {

                    if (sendPrice != 0) {
                        $(this).append(`          
                            <div class="newRoi">                                            
                                <span class="used"> ROI Usado: $${roi_used}% </span>
                                <span class="price-send">Precio con envio: $${shipping_Price}</span> 
                                <span class="roi"> ROI con envio: ${roi_shipping_used}% </span> 
                            </div> 
                        `)
                    } else {
                        $(this).append(`          
                            <div class="newRoi">                                            
                                <span class="used"> ROI Usado: $${roi_used}% </span>
                            </div> 
                        `)
                    }
                }
                $(".roi:contains('-')").css({
                    "color": "red"
                })
                $(".used:contains('-')").css({
                    "color": "red"
                })
            }
        }
    });


    
/*
    $("body").append(/*html
        `
    <div class="rois" id="mydiv">
        <div id="accordionHTML5" class="accordion">        
            <details id="mydivheader">
            <summary>
                <div class="first"></div>
                <div class="last"></div>
                <h2>List Of Products</h2>
            </summary>              
                <div class="container-info">
                   
                </div>
            </details>            
        </div>
    </div>
     
    `);
    
    
    $.each(positiveRois, function(index, producto) {      

        $(".container-info").append(`
            <div>
                <span> <a href="#${producto.id}">${producto.title}</a></span>
                <span class="roi-new"> ROI New: ${producto.roi_nuevo}%</span>
                <span class="roi-used">ROI Used: ${producto.roi_used}%</span>
            </div>                       
        `);
        if(producto.roi_nuevo > 0){
            $(".container-info div .roi-new").css({"color":"#479933"})
        }                    
    });



       // Make the DIV element draggable:
       dragElement(document.getElementById("mydiv"));

       function dragElement(elmnt) {
           var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
           if (document.getElementById(elmnt.id + "header")) {
           // if present, the header is where you move the DIV from:
           document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
           } else {
           // otherwise, move the DIV from anywhere inside the DIV:
               elmnt.onmousedown = dragMouseDown;
           }

           function dragMouseDown(e) {
               e = e || window.event;
               e.preventDefault();
               // get the mouse cursor position at startup:
               pos3 = e.clientX;
               pos4 = e.clientY;
               document.onmouseup = closeDragElement;
               // call a function whenever the cursor moves:
               document.onmousemove = elementDrag;
           }

           function elementDrag(e) {
               e = e || window.event;
               e.preventDefault();
               // calculate the new cursor position:
               pos1 = pos3 - e.clientX;
               pos2 = pos4 - e.clientY;
               pos3 = e.clientX;
               pos4 = e.clientY;
               // set the element's new position:
               elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
               elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
           }

           function closeDragElement() {
           // stop moving when mouse button is released:
           document.onmouseup = null;
           document.onmousemove = null;
           }
       }

       $(document).on("click","#mydivheader summary", function(){
           $("#mydivheader summary .last").toggleClass("open")
       })*/       
});// on.Ready

function remove_character(str_to_remove, str) {
    let reg = new RegExp(str_to_remove)
    return str.replace(reg, '')
}