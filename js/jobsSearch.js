$(document).ready(function() {  
    var api_token ="";
    var params = getQueryParams(document.location.search);

    chrome.storage.local.get({
        lacroi_user: ""
    }, function(auth) {
        api_token = auth.lacroi_user.api_token;
        $.ajax({
            url: `https://app.lacroi.co/api/v1/searchjobresult?searchjob_id=${params.id}`,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + api_token,             
            },         
            success: function(result, textStatus, xhr) {   
                
                console.log(result)

                $(".loader_main .overlay").hide()
                $(".container_jobs").removeClass("d-none")

                $.each(result.data.products, function(i, value) {                                 
                    console.log(value.id)
                    if(value.groupname == null){
                        value.groupname = ""
                    }
                    if(value.model == null){
                        value.model = ""
                    }

                    $('#jobProds_search > tbody').append(`
                    <tr class="activeProds" data-toggle="modal" data-target="#myModal" data-id="${value.id}">
                        <td><img style="max-height:100px;" src="${value.image}"></td>
                        <td id="edit_asin_${value.asin}" >${value.asin}</td>
                        <td id="edit_title_${value.asin}">${value.title}</td>
                        <td id="edit_brand_${value.asin}">${value.brand}</td>
                        <td id="edit_model_${value.asin}">${value.model}</td>                       
                        <td id="edit_priceNew_${value.asin}">${value.price_new}</td>
                        <td id="edit_priceUsed_${value.asin}">${value.price_used}</td>
                        <td id="edit_priceUsed_${value.asin}">${value.number_roi}</td>
                        <td id="edit_group_${value.asin}">${value.groupname}</td>                    
                    </tr>`);  
                })
                $('#jobProds_search').DataTable();
                
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log(xhr)
            }
        });                
    });

    $(document).on("click", ".activeProds", function(){
        let topListId = $(this).attr("data-id")
     
        $("#get_prods_job_search").empty()
        $(".loader_container").fadeIn()

        $.ajax({
            
            url: `https://app.lacroi.co/api/v1/searchjobdetail?searchjob_id=${params.id}&searchjoblist_id=${topListId}`,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + api_token,             
            },         
            success: function(result, textStatus, xhr) {                 
                console.log(result.data)
                $("#get_prods_job_search").empty()
                $(".loader_container").hide()

                $.each(result.data, function(i, value){
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
                    $("#get_prods_job_search").append(/*html*/
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

                    `);                              
                })                
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log(xhr)
            }
        }); 
    })
  
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