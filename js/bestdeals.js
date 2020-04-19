$(document).ready(function() {  
    var api_token ="";
    var params = getQueryParams(document.location.search);
    console.log(params)

    chrome.storage.local.get({
        lacroi_user: ""
    }, function(auth) {
        api_token = auth.lacroi_user.api_token;
        $.ajax({
            url: `https://app.lacroi.co/scrapeebay?query=${params.query}&newprice=${params.newprice}&usedprice=${params.usedprice}&condition=${params.condition}`,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + api_token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //dataType: 'json',  
            //data:JSON.stringify({"email": email,"password":password}),  
            success: function(result, textStatus, xhr) {  
               
                console.log(result.data)
                if(result.data == ""){                   
                    $(".overlay").empty()
                    $(".overlay").append( 
                        `
                        <h1> "Ops, there are not good deals for this product, try  again later"</h1>
                        `
                    );
                    
                }
                else{
                    $(".overlay").hide()
                }
                    $.each(result.data, function(i, value) {                                 
                        console.log(value)
                        
                    let  roi = parseFloat(value.roi)
                    let  width_shipping = parseFloat(value.roi_with_shipping)

                    let roiHtml=""
                    let roiShippingHtml=""
                    if (roi > 0){
                        roiHtml = `<span style="color:green;">${roi}%</span>`
                    }else{
                        roiHtml = `<span >${roi}%</span>`
                    }

                    if (width_shipping > 0){
                        roiShippingHtml = `<span style="color:green;">${width_shipping}%</span>`
                    }else{
                        roiShippingHtml = `<span >${width_shipping}%</span>`
                    }
                    $(".container_best").append(/*html*/
                        `
                        <div>
                            <div>
                                <a href="${value.link}" target="_blank">             
                                    <img src="${value.image}">
                                </a>                               
                            </div>
                            <ul>
                                <li>
                                    <span>Title: </span>   
                                    <a href="${value.link}" target="_blank">             
                                        ${value.title}
                                    </a>
                                </li>  
                                <li class="block_container">
                                    <div>
                                        <span>Price: </span> $${value.price}
                                    </div>
                                    <div>
                                        <span>shipping price: </span> $${value.shipping_price}
                                    </div>                                    
                                </li>                                                                                       
                                <li class="block_container roi-section">
                                    <div>
                                        <span class="rois_">Roi:</span>
                                        ${roiHtml}
                                    </div>
                                    <div>
                                        <span class="rois_">Roi With Shipping: </span> 
                                        ${roiShippingHtml}
                                    </div>                                   
                                </li>                                                                         
                            </ul>
                        </div>
                    `)               
                })                                  
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log(xhr)
            }
        }); //Ajax-Api-log-Out                    
    });



    
}); // on.Ready



function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}