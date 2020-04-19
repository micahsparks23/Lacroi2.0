$(document).ready(function() {  
               
    loadOptions_2(api_token)       

    $("#saveOptions").click(function(e) {
        e.preventDefault()
       
        if ($("#minimum_roi").val().trim() == "" || $("#max_search_price_new").val().trim() == "" || $("#max_search_price_used").val().trim() == "") {
          
            $("#msj-error").html("please fill in all fields").css({
                "color": "red"
            });
        } else if ($("#sales_rank_min").val().trim() == "" || $("#sales_rank_max").val().trim() == "" || $("#min_sellers_new").val().trim() == "") {
           
            $("#msj-error").html("please fill in all fields").css({
                "color": "red"
            });
        } else if ($("#min_sellers_used").val().trim() == "") {
           
            $("#msj-error").html("please fill in all fields").css({
                "color": "red"
            });
        } else {
            $("#msj-error").html("")
            var dataForm = $("#optionForm").serialize();

            chrome.storage.local.get({
                lacroi_user: ""
            }, function(auth) {
                var api_token = auth.lacroi_user.api_token;

                $.ajax({
                    url: 'https://app.lacroi.co/api/v1/options',
                    type: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + api_token,
                        //'Accept':'application/json',
                        // 'Content-Type':'application/json'
                    },
                    dataType: 'json',
                    data: dataForm,
                    success: function(data, textStatus, xhr) {                        
                        $("#msj-error").html("saved data").css({
                            "color": "#17a2b8"
                        });
                        setTimeout(function() {
                            $("#msj-error").html("")
                        }, 2000);
                    },
                    error: function(xhr, textStatus, errorThrown) {                   
                        $("#msj-error").html("save error").css({
                            "color": "red"
                        })
                    }
                }); //Ajax
            });
        } //else      
    }) //click
    loadCategories()
    

    $("#uploadfile").click(function(){
    
        chrome.storage.local.get({
            lacroi_user: ""
        }, function(auth) {
            $("#uploadfile").attr("disabled", true);
            $("#uploadfile").text("Uploading...")
            var api_token = auth.lacroi_user.api_token;      
            var form = new FormData();
            console.log( $("#csv_file").get(0).files[0])
            form.append('csv_file', $("#csv_file").get(0).files[0]);
            form.append('group_id', $("#groups_topList").val()); 
            console.log($("#groups_topList").val())    
            
            $.ajax({
                url: 'https://app.lacroi.co/api/v1/uploadcsv_new',
                type: 'POST',
                mimeType: "multipart/form-data",
                headers: {
                    'Authorization': 'Bearer ' + api_token,
                },
                processData: false,  // tell jQuery not to process the data
                contentType: false ,
                data: form, 
                success: function(data, textStatus, xhr) {                                

                    $("#uploadfile").attr("disabled", false);
                    $("#uploadfile").text("Upload File")
                    $("#filemsg_result").show();
                    setTimeout(function() {
                        $('#filemsg_result').fadeOut('fast');
                    }, 2000);
                    $("#toplist").empty();                    
                    $("#toplist").append(/*html*/
                    `<thead>
                        <tr>
                        <th scope="col">Image</th>
                        <th scope="col">Asin</th>
                        <th scope="col">Name</th>
                        <th scope="col">Brand</th>
                        <th scope="col">Model</th>
                        <th scope="col">Price Amazon</th>
                        <th scope="col">Price New</th>
                        <th scope="col">Price Used</th>
                        <th scope="col">Rank</th>
                        <th scope="col"></th>
                        </tr>
                    </thead>
                    
                    <tbody id="tbodyid">

                    </tbody>
                    <tfoot>
                        <tr>
                        <th scope="col">Image</th>
                        <th scope="col">Asin</th>
                        <th scope="col">Name</th>
                        <th scope="col">Brand</th>
                        <th scope="col">Model</th>
                        <th scope="col">Price Amazon</th>
                        <th scope="col">Price New</th>
                        <th scope="col">Price Used</th>
                        <th scope="col">Rank</th>
                        <th scope="col"></th>
                        </tr>
                    </tfoot>`);
                    // loadTopList();                   
                },
                error: function(xhr, textStatus, errorThrown) {
                    $("#msj-error").html("search error"); 
                    $("#uploadfile").attr("disabled", false);  
                    $("#uploadfile").text("Upload File")                
                }
            }); //Ajax-Api-save*/            
        });            
    });

    $(document).on('click',".edit-item", function(e) {     
        $("#modalEdit").modal()

        $(".resultNote").hide()
        $("#modal_edit_info")[0].reset();
        
        let asinEdit = $(this).data("asin");                
        $("#save_info").attr("data-asin",asinEdit)         
        

        loadGroupsTopList(api_token, "#groups_edit_Info", asinEdit)

    });

   
    $(document).on('click', '#save_info', function(e) { 
        e.preventDefault();
        let asinEdit = $(this).attr("data-asin")
        console.log(asinEdit) 

        $(this).attr("disabled", true)
        $(this).text("Loading...")



        $(".test_"+asinEdit).hide()

        let valName = $("#edit_name").val();                                                
        let valbrand = $("#edit_brand").val();
        let valModel = $("#edit_model").val();
        
        let valRank = $("#edit_rank").val();
        let valNewPrice = $("#edit_new_price").val();
        let valPriceUsed = $("#edit_used_price").val();
        let valAmazonPrice = $("#edit_amazon_price").val();
        let valUpc = $("#edit_upc").val()
        let valIsbn = $("#edit_isbn").val()
        // let valGroupname = $("#edit_groupname").val()

        
        let group_id = $("#groups_edit_Info").val()
        let group_name =   $("#groups_edit_Info").html()


        $("#edit_title_"+asinEdit).html(valName);
        $("#edit_asin_"+ asinEdit).html(valIsbn);
        // $("#edit_group_"+asinEdit).html(valGroupname)
        $("#edit_brand_"+ asinEdit).html(valbrand);
        $("#edit_model_"+ asinEdit).html(valModel);

        $("#edit_rank_"+ asinEdit).html(valRank);
        $("#edit_priceNew_"+ asinEdit).html(valNewPrice);
        $("#edit_priceUsed_"+ asinEdit).html(valPriceUsed);
        $("#edit_priceAmazon_"+ asinEdit).html(valAmazonPrice);
        $("#topList_upc_"+ asinEdit).html(valUpc); 
        $("#topList_group_"+asinEdit).html(group_name)                                                       

        $.ajax({
            url: 'https://app.lacroi.co/api/v1/producttoplist/'+asinEdit,
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + api_token,
            },
            dataType: 'json',
            data: {                
                "title": valName,
                "brand": valbrand,
                "model": valModel,
                "rank": valRank,
                "price_new": valNewPrice,
                "price_used": valPriceUsed,
                "price_amazon": valAmazonPrice,
                "upc": valUpc,
                "isbn" : valIsbn,
                "group_id" : group_id
            },
            success: function(data, textStatus, xhr) {  
                console.log(data)
                  
                $("#save_info").attr("disabled", false)
                $("#save_info").text("Save")
                   
                $(".resultNote").html(data.message).removeClass("alert-danger").fadeIn()

                $("#topList_title_"+asinEdit).val(valName);
                $("#topList_brand_"+asinEdit).val(valbrand);
                $("#topList_model_"+asinEdit).val(valModel);
                $("#topList_rank_"+asinEdit).val(valRank);
                $("#topList_pricenew_"+ asinEdit).val(valNewPrice);
                $("#topList_usedprice_"+ asinEdit).val(valPriceUsed);
                $("#topList_amazon_"+ asinEdit).val(valAmazonPrice);
                $("#topList_upc_"+ asinEdit).val(valUpc);
                $("#topList_isbn_"+ asinEdit).val(valIsbn);   
                // $("#topList_groupname_"+ asinEdit).val(valGroupname);
                
                $("#msj_toplist").html(data.message).fadeIn()
                setTimeout(function(){
                    $("#msj_toplist").hide().html("")
                }, 3000);
            },
            error: function(xhr, textStatus, errorThrown) {   
                
                  
                $("#save_info").attr("disabled", false)
                $("#save_info").text("Save")
            }
        }); //Ajax-Api-toplist
        
    });

    /** ids asign to modal */
    $(document).on("click", "#create_group", function(){
        $("#title_modal_group").html("")
        $("#title_modal_group").html("Create Group")

        $(".saveInfo").attr("id", "save_new_group")
              
        $("#name_group").val("")
        $("#dscrp_group").val("")    
        $("#status_group").val("1")
    })

    $(document).on("click", "#update_group", function(){

        $("#title_modal_group").html("")
        $("#title_modal_group").html("Update Group")

        $(".saveInfo").attr("id", "save_update_group")
        let idUpdate = $(this).attr("data-id")
        let dscrpt = $(this).attr("data-dcript")
        let status = $(this).attr("data-status")
        let name = $(this).attr("data-name")

        $("#name_group").val(name)
        $("#dscrp_group").val(dscrpt)    
        $("#status_group").val(status)
        

        $("#save_update_group").attr("data-id", idUpdate)
        
       
        //loadInfoGroup()      
    })
    /** ids asign to modal */

    $(document).on("click", "#group-tab", function(){         
        getGroups(api_token)
    })


    $(document).on("click", "#save_new_group", function(){
        let newName = $("#name_group").val()
        let newDscrpt = $("#dscrp_group").val()
        let newStatus = $("#status_group").val()
        if(newName == ""){
            $("#msg_result_group").html("Fill the field name").removeClass("d-none").addClass("alert-danger").removeClass("alert-succes")
            $("#name_group").focus()
            $("#name_group").on("keydown", function() {
                $("#msg_result_group").addClass("d-none").removeClass("alert-danger").addClass("alert-success");
            });
        }else{
            $(this).attr("disable", true)
            $(this).text("Loading...")
            createGroup(api_token, newName, newDscrpt, newStatus)
        }

    })


    $(document).on("click", "#save_update_group", function(){  
        
        let idUpdate = $(this).attr("data-id")

        let newName = $("#name_group").val()
        let newDscrpt = $("#dscrp_group").val()
        let newStatus = $("#status_group").val()

        if(newName == ""){
            $("#msg_result_group").html("Fill the field name").removeClass("d-none").addClass("alert-danger").removeClass("alert-succes")
            $("#name_group").focus()
            $("#name_group").on("keydown", function() {
                $("#msg_result_group").addClass("d-none").removeClass("alert-danger").addClass("alert-success");
            });
        }else{
            $(this).attr("disable", true)
            $(this).text("Loading...")
            updateGroup(api_token, newName, newDscrpt, newStatus, idUpdate)
        }
                
    })

    $(document).on("click", "#group_delete", function(){
        $(this).attr("disabled", true);
        $(this).text("Loading..")

        let idGroup = $(this).attr("data-id")
        let refDelete = $(this)

        console.log(idGroup)

        deleteGroup(api_token, idGroup, refDelete)
    })


    $(document).on("click", ".close", function(){  
        $("#msg_result_group").addClass("d-none")
    })

    $(document).on("click", ".hide-msg", function(){  
        $("#msg_result_group").addClass("d-none")
    })

    $(document).on("click", "#loadGroups_modal", function(){ 
        idLoad = $("#groups_topList_modal") 
        loadGroupsTopList(api_token, idLoad)
    })



    $(document).on("click", "#profile-tab", function(){
        idLoad = $("#groups_topList") 
        loadGroupsTopList(api_token, idLoad)
     })

     $(document).on('change', '#groups_topList' ,function() {
        let id = $("#groups_topList").val();
        loadTopList(api_token, id)
                
    }); //change

    $(document).on("click", ".cleanSelect span", function(){         
        $(this).attr("disabled", true)
        $(this).text("Loading...")
        loadCategories()      
    })

    
    $('#category').on('change', function() {   

        let idSub = $("#category").val();                   
        let textBreadCrumb =  $('#category option:selected').text()                                     

         loadSubCategory(idSub, textBreadCrumb)        
        
    }); //change



}); // on.Ready


const getGroups = (api_token) => {    
    $.ajax({
        url: 'https://app.lacroi.co/api/v1/groups',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + api_token,
        },
        success: function(result, textStatus, xhr) {
            $(".coontainer_groups > div").empty()
            $(".loader_groups").hide()

            $.each(result.data, function(i, value) { 
                console.log(value)

                if(value.status == "0"){
                     status = "Inactive" 
                }else if(value.status == "1"){
                    status = "Active" 
                }

                if(value.description == null){
                    value.description = ""
                }
                                                                     
                $('.coontainer_groups > div').append(
                `                        
                <div class="item_group">
                    <div>
                        <span>Group Name: 
                            <span>${value.name}</span>
                        </span>
                        <span>Description:
                            <span>${value.description}</span>
                        </span>
                        <span>Status: 
                            <span>${status}</span>
                        </span>
                    </div>
                    <div>
                        <span id="update_group" data-id="${value.id}" data-dcript="${value.description}" data-status="${value.status}" data-name="${value.name}" class="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#modalGroup">Edit Group</span>
                        <span id="group_delete" data-id="${value.id}" class="btn btn-outline-danger btn-sm">Delete</span>
                    </div>
                </div>
                `)
            })  
        },
        error: function(xhr, textStatus, errorThrown) {   
            console.log(xhr)     
        }
    }); //Ajax-end

}

const createGroup = (api_token, newName, newDscrpt, newStatus) =>{
        
    $.ajax({
        url: 'https://app.lacroi.co/api/v1/groups',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + api_token,
        },
        dataType: 'json',
        data: {                
            "name": newName,
            "description": newDscrpt,
            "status": newStatus   
        },
        success: function(data, textStatus, xhr) {                              
            console.log(data)

            if(data.status == "success"){
                $("#msg_result_group").html(data.message).removeClass("d-none")
            }else if(data.status == "failed"){
                $("#msg_result_group").html(data.message).addClass("alert-danger").removeClass("alert-succes").removeClass("d-none")
            }

            setTimeout(function(){
                $("#msg_result_group").html("").addClass("d-none")
            }, 5000);
            
            
            $("#save_new_group").attr("disable", false)
            $("#save_new_group").text("Save")
           
        },
        error: function(xhr, textStatus, errorThrown) {   
            console.log(xhr)             
        }
    }); //Ajax-end
}

const updateGroup = (api_token, newName, newDscrpt, newStatus, idUpdate) => {  

    $.ajax({
        url: `https://app.lacroi.co/api/v1/groups_update/${idUpdate}`,
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + api_token,
        },
        dataType: 'json',
        data: {                
            "name": newName,
            "description": newDscrpt,
            "status": newStatus   
        },
        success: function(data, textStatus, xhr) {                              
            console.log(data)

            if(data.status == "success"){
                $("#msg_result_group").html(data.message).removeClass("d-none").addClass("alert-success").removeClass("alert-danger")
            }else if(data.status == "failed"){
                $("#msg_result_group").html(data.message).addClass("alert-danger").removeClass("alert-succes").removeClass("d-none")
            }

            setTimeout(function(){
                $("#msg_result_group").html("").addClass("d-none")
            }, 5000);
            
            
            $("#save_update_group").attr("disable", false)
            $("#save_update_group").text("Save")
        },
        error: function(xhr, textStatus, errorThrown) {   
            console.log(xhr)             
        }
    }); //Ajax-end

}

const deleteGroup = (api_token, idGroup, refDelete) =>{
    $.ajax({
        url: `https://app.lacroi.co/api/v1/groups/${idGroup}`,
        type: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + api_token,
        },
        success: function(result, textStatus, xhr) {
            console.log(result)
            refDelete.parents(".item_group").remove();

            $("#group_delete").attr("disable", false)
            $("#group_delete").text("Delete")    
        },
        error: function(xhr, textStatus, errorThrown) {                    
            console.log(xhr)    
        }
    }); //Ajax end    
}

const loadGroupsTopList = (api_token, idLoad, asinEdit) => {
    $.ajax({
        url: 'https://app.lacroi.co/api/v1/groups',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + api_token,
        },
        success: function(result, textStatus, xhr) {          
            $(idLoad).empty()

            $(idLoad).append(
                `                    
                    <option value="0">-- Select Group --</option>
                `
            )                                 
            $.each(result.data, function(i, value) { 
                
                $(idLoad).append(
                `                    
                    <option value="${value.id}">${value.name}</option>
                `
                )
            }) 
            $(idLoad).append(
                `                    
                    <option value="1">General</option>
                `
            ) 

            if(idLoad == "#groups_edit_Info"){               
                edit_infoLoad(asinEdit)
            }
        },
        error: function(xhr, textStatus, errorThrown) {   
            console.log(xhr)     
        }
    }); //Ajax-end
}


const loadOptions_2 = (api_token) => {
 

    $.ajax({
        url: 'https://app.lacroi.co/api/v1/options',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + api_token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        //dataType: 'json',  
        //data:JSON.stringify({"email": email,"password":password}),  
        success: function(data, textStatus, xhr) {
            $("#minimum_roi").val(data.minimum_roi)
            $("#max_search_price_new").val(data.max_search_price_new)
            $("#max_search_price_used").val(data.max_search_price_used)
            $("#sales_rank_min").val(data.sales_rank_min)
            $("#sales_rank_max").val(data.sales_rank_max)
            $("#min_sellers_new").val(data.min_sellers_new)
            $("#min_sellers_used").val(data.min_sellers_used)
            $("#category").val(data.category)
            $("#subcategory").val(data.subcategory)
            $("#subcategory2").val(data.subcategory_l2)
            if (data.amazon_sell == 1) {
                $('#amazon_sell-yes').prop('checked', true);
            } else {
                $('#amazon_sell-no').prop('checked', true);
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            
        }
    }); //Ajax-Api-log-Out                    
}


const loadTopList = (api_token, id) => {

    $(".loader_topList").removeClass("d-none")
    $("#toplist").addClass("d-none")

    if(typeof  table_opt != 'undefined'){        
        table_opt.destroy()
    }

    if(id == "0"){
        $("#toplist").addClass("d-none")
    }

    $("#toplist > tbody").empty()
               
    $.ajax({
        url: `https://app.lacroi.co/api/v1/toplistgroup/${id}`,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + api_token,
        },
        success: function(data, textStatus, xhr) {
            console.log(data)
                  
            
            $.each(data, function(i, value) {                                              
                $('#toplist > tbody').append(`
                <tr id="product_${value.asin}">
                    <td><img style="max-height:100px;" src="https://images-na.ssl-images-amazon.com/images/I/${value.image}"></td>
                    <td id="edit_asin_${value.asin}" >${value.asin}</td>
                    <td id="edit_title_${value.asin}">${value.title}</td>
                    <td id="edit_brand_${value.asin}">${value.brand}</td>
                    <td id="edit_model_${value.asin}">${value.model}</td>
                    <td id="edit_priceAmazon_${value.asin}">${value.price_amazon}</td>
                    <td id="edit_priceNew_${value.asin}">${value.price_new}</td>
                    <td id="edit_priceUsed_${value.asin}">${value.price_used}</td>
                    <td id="edit_rank_${value.asin}">${value.rank}</td>
                    <td id="edit_group_${value.asin}">${value.name}</td>
                    <td>
                        <a class="edit-item" href="#"  data-asin="${value.asin}"><i class="fas fa-edit"></i></a>  <br> <br>
                        <a class="delete-item" href="#" data-asin="${value.asin}" style="color:red;"><i class="fas fa-trash-alt"></i></a> 
                    </td>
                </tr>`);   
                                                                
            });
            
            
            $(document).on("click", ".delete-item", function(e){          
                e.preventDefault();               
                var currentAsin = $(this).data("asin")
                deleteAsin(currentAsin);
                $(this).closest('tr').remove();
            }); 

           
            table_opt = $('#toplist').DataTable();
            
            $(".loader_topList").addClass("d-none")
            $("#toplist").removeClass("d-none")


            if(data == ""){
                $("#toplist").addClass("d-none")               
            }   
        },
        error: function(xhr, textStatus, errorThrown) {
            
        }
    }); //Ajax-Api-toplist
}

var api_token ="";

chrome.storage.local.get({
    lacroi_user: ""
}, function(auth) {
    api_token = auth.lacroi_user.api_token;
})

const deleteAsin = (asin) => {

    chrome.storage.local.get({
        lacroi_user: ""
    }, function(auth) {
        var api_token = auth.lacroi_user.api_token;            
        $.ajax({
            url: 'https://app.lacroi.co/api/v1/toplist',
            type: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + api_token,
            },
            dataType: 'json',
            data: {
                "asin": asin
            },
            success: function(data, textStatus, xhr) {
                
            },
            error: function(xhr, textStatus, errorThrown) {
                $("#msj-error").html("search error");                   
            }
        }); //Ajax-Api-save
    })
}

const edit_infoLoad = (asinEdit) => {
    $.ajax({
        url: 'https://app.lacroi.co/api/v1/producttoplist/'+asinEdit,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + api_token,
        },
        success: function(data, textStatus, xhr) {
            console.log(data.data)
            console.log(data.data.group_id)

            $("#edit_name").val(data.data.title)
            $("#edit_brand").val(data.data.brand)
            $("#edit_model").val(data.data.model)
            $("#edit_rank").val(data.data.rank)
            $("#edit_new_price").val(data.data.price_new)
            $("#edit_used_price").val(data.data.price_used)
            $("#edit_amazon_price").val(data.data.price_amazon)
            $("#edit_upc").val(data.data.upc)
            $("#edit_isbn").val(data.data.isbn)                                    
            $("#groups_edit_Info").val(data.data.group_id)
           
        },
        error: function(xhr, textStatus, errorThrown) {   
                    
        }
    }); //Ajax-Api-toplist    

}

const loadSubCategory =(idSub, textBreadCrumb) => {

    $("#valueCategories").val(idSub)  
    $("#category").attr("disabled", true)
    

    console.log(idSub)
       
    $.ajax({
        url: `https://app.lacroi.co/api/v1/getcategories/${idSub}`,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + api_token,                    
        },
        dataType: 'json',              
        success: function(data, textStatus, xhr) { 

            $(".cleanSelect").removeClass("d-none")
            $(".breadcrumb_category").append(`<span>${textBreadCrumb} <span>></span></span>`)
          
            $("#category").empty();
            $('#category').append(new Option("Select sub Category", ""));

            if(data != ""){                
                $.each(data, function(i, value) {                         
                    $('#category').append(new Option(value.name, value.catId));
                })
            }
    
                          
            $("#category").attr("disabled", false)                                   
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log(xhr)
            $("#category").attr("disabled", false)           
        }
    }); //Ajax-          
}

const loadCategories = () => {
    
    chrome.storage.local.get({
        lacroi_user: ""
    }, function(auth) {
        var api_token = auth.lacroi_user.api_token;
        $.ajax({
            url: 'https://app.lacroi.co/api/v1/getcategories/0',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + api_token
     
            },
            dataType: 'json',
            //data:JSON.stringify({"email": email,"password":password}),  
            success: function(data, textStatus, xhr) {
                
                $(".cleanSelect").addClass("d-none")
                $(".breadcrumb_category").empty()
                $("#category").empty().append('<option value="" selected>All Categories</option>')
                
                $.each(data, function(i, value) {
                    $('#category').append(new Option(value.name, value.catId));
                })

                 
                $(".cleanSelect span").attr("disabled", false)
                $(".cleanSelect span").text("Clean")
            },
            error: function(xhr, textStatus, errorThrown) {
    
            }
        }); //Ajax


    }); //storage    
}