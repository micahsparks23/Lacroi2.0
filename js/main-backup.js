$(document).ready(function() {
  $("#result").hide();
  var api_token = "";
  var show_affiliate = 0;  
  chrome.storage.local.get({
      lacroi_user: ""
  }, function(auth) {
     
      api_token = auth.lacroi_user.api_token;  
      show_affiliate = auth.lacroi_user.show_affiliate;    

      $("#newSearch").hide();
    

      if (typeof api_token === "undefined") {
          api_token = ""
          singInClick();
      }
      if (api_token == "") {
          $("#newSearch").hide();
          $("#lacRoi_ext").hide();
          $("#frm-login").show();
          ga('send', 'pageview', "/loginpage");
      } else {
          $("#lacRoi_ext").show();
          $("#frm-login").hide();        
          ga('send', 'pageview', "/mainpage");

          checkSuscription(api_token)                                     
          chrome.storage.local.get(["product"], function(items) {            
              $("#product_info").append(items.product)
                         

              chrome.storage.local.get(["product_info"], function(infoProd) {           
                  $(".tittle > h4").click(function() {
                      amazonLink = "https://www.amazon.com/dp/" + infoProd.product_info.asin;                     
                      chrome.tabs.update({
                          url: amazonLink,
                          active: true
                      });
                  });
              });            
              setClickAddProduct();
              loadLastSearch();
          });
          populateTabTopList();
          openClickedProduct();
          openTopListProduct();
          $(document).on("click", "#jobs", function(){
                loadJobs(api_token)
                loadRefresh(api_token)
          })       
          
      } //else   
  });

  $(document).on("click", "#to_premium", function(){
    chrome.tabs.update({
        url: "https://app.lacroi.co/login",
        active: true
    });
  })

    const openTopListProduct = () => {
        chrome.storage.local.get({
            'ProductHtmlTopList': '',
            'respLoad': ''
        }, function(result) {          
            if (result.ProductHtmlTopList != "") {
                $("#toplistExt").hide();
                $(".add-asin").hide();
                $(".back-product").fadeIn();
                $("#viewProduct").fadeIn();
                $("#viewProduct").empty()
                $("#viewProduct").append(result.ProductHtmlTopList)
                $(".container_notes span").html(result.respLoad);
                // $("#newTabSsearch").click(); 
                $(".loadImage").click(function() {
                    chrome.tabs.executeScript(null, {
                        code: 'var currentAsin = "' + currentAsin + '"'
                    }, function() {
                        chrome.tabs.executeScript(null, {
                            file: 'js/modalbox.js'
                        });
                    });
                });
            }
        });
    }

    const openClickedProduct = () => {
        chrome.storage.local.get({
            'openProductHtml': '',
            'respLoad': ''
        }, function(result) {        
            if (result.openProductHtml != "") {

                $(".add-asin").hide();
                $(".pagination").hide();
                $("#tab__results").hide();
                $("#viewProduct1").fadeIn();
                $("#viewProduct1").empty()
                $("#viewProduct1").append(result.openProductHtml)
                $(".container_notes span").html(result.respLoad);
                $(".loadImage").click(function() {
                    chrome.tabs.executeScript(null, {
                        code: 'var currentAsin = "' + currentAsin + '"'
                    }, function() {
                        chrome.tabs.executeScript(null, {
                            file: 'js/modalbox.js'
                        });
                    });
                });
                $("#results-tab").click();
            }
        });
    }

    $('body').on('click', '#test', function(e) {
        e.preventDefault();
        var query = $("#_nkw").val();
        if (query != "") {
            $(this).attr("disabled", true);
            $(this).text("Loading...");
            $("#upload-file").empty();
            $.ajax({
                url: 'https://app.lacroi.co/api/v1/extsearch',
                type: 'POST',
                dataType: 'json',
                data: {
                    'query': query
                },
                success: function(data, textStatus, xhr) {

                    var html = `            
                        <div id="upload-file">
                            <span id="save"></span>
                            <div id="img-content">      
                                <img id="product" style="width:200px;" src="https://images-na.ssl-images-amazon.com/images/I/${data.image}">
                                <img id="addProduct" src="img/plus-symbol.png" alt="" title="Save">
                            </div>
                            <div class="tittle">
                                <h4>${data.title}</h4>
                            </div>
                            <ul>
                                <li> SalesRank <span> ${data.salesRank}</span></li>
                                <li> Asin <span> ${data.asin}</span></li>
                                <li> Brand <span>${data.brand}</span></li>
                                <li> Model <span> ${data.mode}</span></li>
                                <li class="price"> Amazon Price <span> ${data.amazon_price}</span></li>
                                <li class="price"> New Price <span>${data.new_price}</span></li>
                                <li class="price"> Used Price <span> ${data.used_price}</span></li>        
                            </ul>
                        </div>
                    `;

                    $("#querySearch").append(html)

                    $(".tittle > h4").click(function() {
                        amazonLink = "https://www.amazon.com/dp/" + data.asin;                      
                        chrome.tabs.update({
                            url: amazonLink,
                            active: true
                        });

                    });
                    chrome.storage.local.set({
                        "product": ""
                    }, function() {
                        //  Data's been saved
                    })
                    chrome.storage.local.set({
                        "product": html
                    }, function() {
                        //  Data's been saved
                    })
                    chrome.storage.local.set({
                        "product_info": data
                    }, function() {
                        //  Data's been saved 
                    })

                    $("#test").attr("disabled", false);
                    $("#test").text("Search");

                    if (query != "") {
                        urlLink = "https://www.ebay.com/sch/?_nkw=" + query;
                        chrome.tabs.update({
                            url: urlLink,
                            active: true
                        });
                    }
                    setClickAddProduct();
                },
                error: function(xhr, textStatus, errorThrown) {              
                    $("#test").attr("disabled", false);
                    $("#test").text("Search");
                }
            }); //Ajax-Api        
        }
        return false;
    }); //on.Click

    $(document).on("click", "#logOut", function(){
   
        chrome.storage.local.get({
            lacroi_user: ""           
        }, function(auth) {
                        
            api_token = auth.lacroi_user.api_token;  
            console.log(auth.lacroi_user)
           
            $.ajax({
                url: 'https://app.lacroi.co/api/logout',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + api_token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                dataType: 'json',
                data: JSON.stringify({
                    "email": email,
                    "password": password
                }),
                success: function(data, textStatus, xhr) {
                    $("#type-Account").html("");
                    console.log(auth.lacroi_user)
                    chrome.storage.local.set({
                        "lacroi_user": "",
                        "product": ""
                    }, function() {                        
                        $("#lacRoi_ext").hide();
                        $("#frm-login").show();
                        $("#upload-file").empty();
                        api_token = "";
                        singInClick();
                        $("#searchTableBody").empty();
                        $("#home-tab").click();
                        $("#searchData")[0].reset();
                    })                                                                                              
                },
                error: function(xhr, textStatus, errorThrown) {            
                }
            }); //Ajax-Api-log-Out
        });

    }); //log-out Click

    $("#go-to-options").click(function() {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });

    const setClickAddProduct = () => {
        $("#addProduct").click(function() {

            chrome.storage.local.get({
                lacroi_user: ""
            }, function(auth) {
                api_token = auth.lacroi_user.api_token;
                chrome.storage.local.get(["product_info"], function(infoProd) {             
                    dataProd = infoProd.product_info
                    $.ajax({
                        url: 'https://app.lacroi.co/api/v1/toplist',
                        type: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + api_token,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        dataType: 'json',
                        data: JSON.stringify(dataProd),
                        success: function(data, textStatus, xhr) {                                                    
                            $("#save").html("Saved").css({
                                "color": "#4285f4"
                            })
                        },
                        error: function(xhr, textStatus, errorThrown) {
                            $("#addProductt").attr("disabled", false);
                            $("#addProduct").text("Search");                         
                        }
                    }); //Ajax-Api-save
                });
            });
        });
    }
    $("#errorSearch").hide();

    $("#searchOptions").click(function(e) {
        e.preventDefault(); 
        chrome.storage.local.get({
            lacroi_user: ""
        }, function(auth) {
            let status = auth.lacroi_user.subscription_status;
            console.log(status)
            console.log("*************")
        })                           
        chrome.storage.local.set({
            'page': '',
            'searchid': ''
        }, function() {

        });

        chrome.storage.local.set({
            "search_result": ""
        }, function() {
            $("#searchTableBody").empty();
        })

        if(status == "expired"){
            $("#days-free").click();
        }
                   
        var brand = $("#search_brand").val();
        var model = $("#search_model").val();
        var title = $("#search_title").val();

        if(brand !=""){                
            ga('send', 'event', 'Search', 'SearchBrand ', brand);
        }
        if(model !=""){                
            ga('send', 'event', 'Search', 'SearchModel ', model);
        }
        if(title !=""){                
            ga('send', 'event', 'Search', 'SearchTitle ', model);
        }

        $(this).text("Searching...");
        $(this).attr("disabled", true);

        var type_search = $("input[name='inlineRadioOptions']:checked").val();
        var manufacturer = $("#search_manufacturated").val();
        var brand = $("#search_brand").val();
        var model = $("#search_model").val();
        var title = $("#search_title").val();
        var minimum_roi = $("#minimum_roi").val();
        var category = $("#category").val();
        var max_search_price_new = $("#max_search_price_new").val();
        var max_search_price_used = $("#max_search_price_used").val();
        var sales_rank_min = $("#sales_rank_min").val();
        var sales_rank_max = $("#sales_rank_max").val();
        var min_sellers_new = $("#min_sellers_new").val();
        var min_sellers_used = $("#min_sellers_used").val();
        var min_search_price_new = $("#min_search_price_new").val();
        var min_search_price_used = $("#min_search_price_used").val()
        var page = $("#page").val();

        formInfo = {
            "type_search": type_search,
            "manufacturer": manufacturer,
            "brand": brand,
            "model": model,
            "title": title,
            "minimum_roi": minimum_roi,
            "category": category,
            "max_search_price_new": max_search_price_new,
            "max_search_price_used": max_search_price_used,
            "sales_rank_min": sales_rank_min,
            "sales_rank_max": sales_rank_max,
            "min_sellers_new": min_sellers_new,
            "min_sellers_used": min_sellers_used,
            "page": page,
            "min_search_price_new": min_search_price_new,
            "min_search_price_used": min_search_price_used
        }
        $('#next').attr("data-page", page);
        $('#next').attr("data-page", page);

        chrome.storage.local.set({
            "formInfo": formInfo,
            "page": page
        }, function() {

        })
        searchPage(formInfo, page);                     
    });

    const loadOptions = () => {      
        chrome.storage.local.get({
            lacroi_user: ""
        }, function(auth) {           
            api_token = auth.lacroi_user.api_token;
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

        });
    }

    $("#viewProduct1").hide();
    const populateProductTable = (products) => {
        let asinsList = "";

        $("#searchTableBody").empty();
        $.each(products, function(i, value) {
            $(".resultNote").hide();
           
            $('#searchTable  tbody ').append(/*html*/
            `
            <tr>
                <td>            
                    <img data-price_amazon="${value.amazon_price}" data-brand="${value.brand}" data-asin="${value.asin}" data-price_new="${value.new_price}" data-price_used="${value.used_price}" data-rank="${value.salesRank}" data-title="${value.title}"  data-image="${value.image}" data-model="${value.model}" class="newOpen" src="https://images-na.ssl-images-amazon.com/images/I/${value.image}">
                    <div class="action_Buttons">
                        <span class="saveToTopList" title="Save Toplist" data-upc="${value.upc}" data-isbn="${value.isbn}" data-rank="${value.salesRank}" data-price_new="${value.new_price}" data-price_used="${value.used_price}" data-price_amazon="${value.amazon_price}" data-asin="${value.asin}" data-image="${value.image}" data-title="${value.title}"  data-brand="${value.brand}" data-model="${value.model}" >
                            <i class="fas fa-plus"></i>                       
                            <i id="success-img" class="far fa-check-circle"></i>
                        </span>                    
                        <span id="note_${value.asin}" class="active_notes note${value.asin}" data-toggle="modal" data-target=".modalNotes" title="Add Note" data-asin="${value.asin}" title="Add Note"><i class="fas fa-sticky-note"></i></span>            
                    </div>                                        
                </td>
                <td class="column_middle"> 
                    <a href="#" data-title="${value.title}" class="searchByTitle" data-price_used="${value.used_price}" data-price_amazon="${value.amazon_price}" data-price_new="${value.new_price}" data-price_used="${value.used_price}"  data-brand="${value.brand}" data-model="${value.model}"> <span>${value.title}</span></a>  <br>
                    <span class="" data-price_amazon="${value.amazon_price}" data-brand="${value.brand}" data-asin="${value.asin}" data-price_new="${value.new_price}" data-price_used="${value.used_price}" data-rank="${value.salesRank}" data-title="${value.title}"  data-image="${value.image}" data-model="${value.model}">

                        <ul class="info_Prod">
                            <span class="gotoebayPopulateProds" data-rank="${value.salesRank}" data-price_new="${value.new_price}" data-price_used="${value.used_price}" data-price_amazon="${value.amazon_price}"  data-brand="${value.brand}" data-model="${value.model}"">
                                <li><span> Brand: </span> ${value.brand}</li>
                                <li><span>Model: </span> ${value.model}</li>                        
                            </span>
                            <li><span>Rank: </span> ${value.salesRank}</li>
                            <li><span>New Price: </span> ${value.new_price}</li>
                            <li><span>Used Price: </span> ${value.used_price}</li>
                            <li><span>Amazon Price: </span> ${value.amazon_price}</li>
                            <li class="searchByUPC" data-price_new="${value.new_price}" data-price_used="${value.used_price}" data-brand="${value.brand}" data-model="${value.model}" data-upc="${value.upc}">
                                <span>UPC: </span>  ${value.upc}
                            </li>
                            <li class="searchByIsbn style-link" data-price_new="${value.new_price}" data-price_used="${value.used_price}" data-brand="${value.brand}" data-model="${value.model}" data-upc="${value.upc}" data-price_amazon="${value.amazon_price}" data-isbn="${value.isbn}">
                                <span>EAN/ISBN: </span>
                                <span>${value.isbn}</span>
                            </li>
                        </ul>                                                                                                                      
                    </span>
                </td>
                <td>
                    <div class="container_asin"> 
                        <a target="_blank" href="https://www.amazon.com/dp/${value.asin}" data-asin="${value.asin}" class="" >${value.asin}</a>
                        <a target="_blank" href="https://sellercentral.amazon.com/productsearch?q=${value.asin}">Sell New?</a>                                        
                    </div>
                </td>                          
            </tr>
        
            `);                      
            asinsList = asinsList + "," + value.asin;
        });

        loadNotes(asinsList);                         

        $(".newOpen").click(function() {
            $(".pagination").hide();
            $("#tab__results").hide();
            $("#viewProduct1").fadeIn();
            var currentAsin = $(this).data("asin")
            var currentImage = $(this).data("image")
            var currentTitle = $(this).data("title")
            var currentModel = $(this).data("model")
            var currentBrand = $(this).data("brand")
            var rank = $(this).data("rank")
            var price_new = $(this).data("price_new")
            var price_used = $(this).data("price_used")
            var price_amazon = $(this).data("price_amazon")
            $("#viewProduct1").empty()

            var openProductHtml = /*html */
            `
            <img class="backTo" src="img/go.png" alt="">
            <div id="img-content">
                <img src="https://images-na.ssl-images-amazon.com/images/I/${currentImage}">  
            </div>
            <div class="tittle">
                <a class="gotoebay" href="#" data-price_amazon="${price_amazon}" data-price_used="${price_used}" data-price_new="${price_new}" data-brand="${currentBrand}" data-model="${currentModel}">
                <h4>${currentTitle}</h4>
                </a>                                
            </div>
            <ul>                                                      
                <li> SalesRank <span> ${rank}</span></li>
                <a target="_blank" href="https://www.amazon.com/dp/${currentAsin}" data-asin="${currentAsin}" class="">                                
                    <li> Asin <span> ${currentAsin}</span></li>
                </a>
                <li> Brand  <span>${currentBrand}</span></li>
                <li> Model <span> ${currentModel}</span></li>
                <li class="price"> Amazon Price <span> ${price_amazon}</span></li>
                <li class="price"> New Price  <span>${price_new}</span></li>
                <li class="price"> Used Price <span> ${price_used}</span></li>
                
                <span class="loadImage">Load graph</span> <br>                   
                <img class="graph" src="">
                <div class="container_notes">
                    <p>Notes :</p>
                    <span></span>                                                       
                </div>
            </ul>
            <span class="backTo">Back</span>  
            `
            $("#viewProduct1").append(openProductHtml)

            // Ajax Load Note
            $.ajax({
                url: 'https://app.lacroi.co/api/v1/notes/' + currentAsin,
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + api_token,
                },
                success: function(result, textStatus, xhr) {

                    if (result.content != "") {
                        $(".container_notes span").html(result.content);
                        var respLoad = result.content;

                        chrome.storage.local.set({
                            'respLoad': respLoad
                        }, function() {
                            
                        });
                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                    
                }
            }); //Ajax-Api-notes-load  

            // Ajax Load Note 
            chrome.storage.local.set({
                'openProductHtml': openProductHtml
            }, function() {
                
            });

            $(".loadImage").click(function() {
                chrome.tabs.executeScript(null, {
                    code: 'var currentAsin = "' + currentAsin + '"'
                }, function() {
                    chrome.tabs.executeScript(null, {
                        file: 'js/modalbox.js'
                    });
                });
            });
        });

        $(".gotoebayPopulateProds").click(function(e) {
            e.preventDefault();
            var currentBrand = $(this).data("brand")
            var currentModel = $(this).data("model")

            if (!isNaN(currentModel)) {
                currentModel = currentModel.toString()
            }

            if (currentModel.indexOf('#') != -1) {
                currentModel = currentModel.replace('#', '')
            } else if (currentModel.indexOf('&') != -1) {
                currentModel = currentModel.replace('&', '')
            } else if (currentBrand.indexOf('#') != -1) {
                currentBrand = currentBrand.replace('#', '')
            } else if (currentBrand.indexOf('&') != -1) {
                currentBrand = currentBrand.replace('&', '')
            }
            
            let condition;
            let ValCondition = $(".valCondition").val()
                                        
            if (ValCondition == "new"){
                condition = "&rt=nc&LH_ItemCondition=1000"
            }else if (ValCondition == "used"){
                condition = "&rt=nc&LH_ItemCondition=3000"
            }else if(ValCondition == "both"){
                condition = "" 
            }


            var query = encodeURI(currentBrand + " " + currentModel);
            urlLink = "https://www.ebay.com/sch/?_nkw=" + query + condition;
            chrome.tabs.update({
                url: urlLink,
                active: true
            });
            var currentModel = $(this).data("model")
            var currentBrand = $(this).data("brand")
            var price_new = $(this).data("price_new")
            var price_used = $(this).data("price_used")
            var price_amazon = $(this).data("price_amazon")
            extractpage(currentBrand, currentModel, price_new, price_used, price_amazon,show_affiliate);
        });

        $(".saveToTopList").click(function(e) {
            e.preventDefault();
            var currentAsin = $(this).data("asin")
            var currentTitle = $(this).data("title")
            var currentImage = $(this).data("image")
            var currentModel = $(this).data("model")
            var currentBrand = $(this).data("brand")
            var rank = $(this).data("rank")
            var price_new = $(this).data("price_new")
            var price_used = $(this).data("price_used")
            var price_amazon = $(this).data("price_amazon")
            var upc = $(this).data("upc")
            var isbn = $(this).data("isbn")          
            dataSave = {
                'asin': currentAsin,
                'title': currentTitle,
                'image': currentImage,
                'model': currentModel,
                'brand': currentBrand,
                'rank': rank,
                'price_new': price_new,
                'price_used': price_used,
                'price_amazon': price_amazon,
                'upc': upc,
                'isbn': isbn
            };            
            $(this).addClass("sucees-saved");

            setTimeout(function() {
                $(".saveToTopList").removeClass("sucees-saved");
            }, 1000);

            $.ajax({
                url: 'https://app.lacroi.co/api/v1/toplist',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + api_token,
                },
                dataType: 'json',
                data: dataSave,
                success: function(data, textStatus, xhr) {                                  
                    populateTabTopList();
                },
                error: function(xhr, textStatus, errorThrown) {
                    $("#msj-error").html("search error");                  
                    $(this).removeClass("sucees-saved");
                }
            }); //Ajax-Api-save        
        });
    }

    const loadLastSearch = () => {
        chrome.storage.local.get(["search_result"], function(dataSaved) {
            if (dataSaved.search_result.data.products != undefined) {              
                populateProductTable(dataSaved.search_result.data.products)

                $("#nextpage").attr("data-nextpage", dataSaved.search_result.nextpage);
                $("#nextpage").attr("data-searchid", dataSaved.search_result.search_id);

                $("#previuspage").attr("data-previuspage", dataSaved.search_result.prevpage);
                $("#previuspage").attr("data-searchid", dataSaved.search_result.search_id);
            }
        });
    }

    $("#cleanresults").click(function(e) {
        e.preventDefault();
        chrome.storage.local.set({
            "search_result": ""
        }, function() {
            $("#searchTableBody").empty();
        })
        chrome.storage.local.set({
            'page': '',
            'searchid': ''
        }, function() {});
    });

    $("#next").click(function() {
        chrome.storage.local.get(["formInfo"], function(formInfo) {          

            page = $("#next").data('page');
            searchPage(formInfo.formInfo, page)
            page = page + 1;

            $('#next').attr("data-page", page);
        })
    });
    const populateTabTopList = () => {
        let asinsList = "";
        chrome.storage.local.get({
            lacroi_user: ""
        }, function(auth) {
            api_token = auth.lacroi_user.api_token;
            loadOptions()

            $.ajax({
                url: 'https://app.lacroi.co/api/v1/toplist',
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + api_token,
                },
                success: function(data, textStatus, xhr) {                     
                    console.log("**get")                                    
                    $("#toplistExtTbody").empty();
                    $.each(data, function(i, value) {                                                     
                        $('#toplistExtTbody').append(/*html*/`            
                        <tr>
                        <td>
                            <img data-model="${value.model}" data-rank="${value.rank}" data-image="${value.image}" data-price_new="${value.price_new}" data-price_used="${value.price_used}" data-price_amazon="${value.price_amazon}" data-brand="${value.brand}" data-asin="${value.asin}" data-image="${value.image}" data-title="${value.title}" class="productOpen" style="max-width:100px;max-height:100px;" src="https://images-na.ssl-images-amazon.com/images/I/${value.image}">
                            <div class="action_Buttons">                                
                                <span id="note_${value.asin}" class="active_notes note${value.asin}" data-toggle="modal" data-target=".modalNotes" title="Add Note" data-asin="${value.asin}" title="Add Note"><i class="fas fa-sticky-note"></i></span>
                                <span class="edit_Info" data-toggle="modal" data-asin="${value.asin}" data-target=".modalInfo" title="Edit_Info">
                                    <i class="fas fa-pencil-alt"></i>
                                </span>                                   
                                <span id="delete_item" data-asin="${value.asin}" title="Delete Item">
                                    <i class="far fa-trash-alt"></i>
                                </span>
                            </div>                                                        
                        </td>
                       
                        <td>
                            <div class="group_name">
                                <span>Group Name: </span>
                                <span id="topList_group_${value.asin}"> ${value.groupname}</span>
                            </div>                           
                            <a href="#"  class="searchByTitle" data-title="${value.title}" data-price_new="${value.price_new}" data-price_used="${value.price_used}" data-brand="${value.brand}" data-model="${value.model}">
                                <span id="topList_title_${value.asin}">${value.title}</span> 
                            </a>
                            <br>
                            <span data-model="${value.model}" data-rank="${value.rank}" data-image="${value.image}" data-price_new="${value.price_new}" data-price_used="${value.price_used}" data-price_amazon="${value.price_amazon}" data-brand="${value.brand}" data-asin="${value.asin}" data-image="${value.image}" data-title="${value.title}">
                            <ul class="info_Prod">
                                <span class="gotoebayTopList" data-price_new="${value.price_new}" data-price_used="${value.price_used}" data-brand="${value.brand}" data-model="${value.model}">
                                    <li>
                                        <span> Brand: </span>
                                        <span id="topList_brand_${value.asin}"> ${value.brand}</span>
                                    </li>
                                    <li>
                                        <span>Model: </span>
                                        <span id="topList_model_${value.asin}">${value.model}</span>
                                    </li>
                                </span>
                                <li>
                                    <span>Rank: </span>
                                    <span id="topList_rank_${value.asin}">${value.rank}</span> 
                                </li>
                                <li>
                                    <span>New Price: </span>
                                    <span id="topList_pricenew_${value.asin}">${value.price_new}</span>
                                </li>
                                <li>
                                    <span>Used Price: </span> 
                                    <span id="topList_usedprice_${value.asin}">${value.price_used}</span>
                                </li>
                                <li>
                                    <span>Amazon Price: </span> 
                                    <span id="topList_amazon_${value.asin}">${value.price_amazon}</span>
                                </li>
                                <li class="styleUpc searchByUPC" data-price_new="${value.price_new}" data-price_used="${value.price_used}" data-brand="${value.brand}" data-model="${value.model}" data-upc="${value.upc}">
                                    <span>UPC: </span> 
                                    <span class="" id="topList_upc_${value.asin}">${value.upc}</span>
                                </li>
                                <li class="searchByIsbn" data-price_new="${value.price_new}" data-price_amazon="${value.price_amazon}" data-price_used="${value.price_used}" data-brand="${value.brand}" data-model="${value.model}" data-isbn="${value.isbn}" data-upc="${value.upc}">
                                    <span>EAN/ISBN:</span>
                                    <span id="topList_isbn_${value.asin}">${value.isbn}</span>                                    
                                </li>
                            </ul>    
                            </span>
                        </td>  
                        <td>                                                  
                            <div class="container_dots">
                                <div class="more">
                                    <button id="more-btn" class="more-btn">
                                        <span class="more-dot"></span>
                                        <span class="more-dot"></span>
                                        <span class="more-dot"></span>
                                    </button>
                                    <div class="more-menu">
                                        <div class="more-menu-caret">
                                            <div class="more-menu-caret-outer"></div>
                                            <div class="more-menu-caret-inner"></div>
                                        </div>
                                        <ul class="more-menu-items" tabindex="-1" role="menu" aria-labelledby="more-btn" aria-hidden="true">
                                            <li class="more-menu-item" role="presentation">
                                                <span class="more_option" data-model="${value.model}" data-brand="${value.brand}" data-price_new="${value.price_new}" data-price_used="${value.price_used}" data-condition="new">Deals New</span>
                                            </li>
                                            <li class="more-menu-item" role="presentation">
                                                <span class="more_option" data-model="${value.model}" data-brand="${value.brand}" data-price_new="${value.price_new}" data-price_used="${value.price_used}" data-condition="used">Deals Used</span>                                                
                                            </li>                                                                                       
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="container_asin"> 
                                <a target="_blank" href="https://www.amazon.com/dp/${value.asin}" data-asin="${value.asin}" class="" >${value.asin}</a>
                                <a target="_blank" href="https://sellercentral.amazon.com/productsearch?q="+value.asin>Sell New?</a>                                         
                            </div>
                        </td>                            
                    </tr>                                
                        `);
                        asinsList = asinsList + "," + value.asin;             
                    });                    

                    table = $('#toplist').DataTable({
                        'columnDefs': [
                            {'max-width': '20%', 'targets': 0}
                        ],
                    });
                    loadNotes(asinsList);
                    table.destroy();
                    $('#toplistExt').DataTable();

                    $("#hide_msj").hide();
                    $(".back-product").hide();
                    $(document).on("click", ".productOpen", function(e){
                        e.preventdefault
                        $("#toplistExt_wrapper").hide()
                        $(".add-asin").hide();
                        $("#toplistExt").hide();
                        $(".back-product").fadeIn();
                        $("#viewProduct").fadeIn();
                        var currentAsin = $(this).data("asin")
                        var currentImage = $(this).data("image")
                        var currentTitle = $(this).data("title")
                        var currentModel = $(this).data("model")
                        var currentBrand = $(this).data("brand")
                        var rank = $(this).data("rank")
                        var price_new = $(this).data("price_new")
                        var price_used = $(this).data("price_used")
                        var price_amazon = $(this).data("price_amazon")
                        $("#viewProduct").empty()
                        var ProductHtmlTopList = /*html*/
                            `
                            <img class="backTo" src="img/go.png" alt="">
                                <div id="img-content">
                                    <img src="https://images-na.ssl-images-amazon.com/images/I/${currentImage}">  
                                </div>
                                <div class="tittle">
                                    <a class="gotoebay" href="#" data-price_amazon="${price_amazon}" data-price_used="${price_used}" data-price_new="${price_new}" data-brand="${currentBrand}" data-model="${currentModel}">
                                        <h4>${currentTitle}</h4>
                                    </a>                                
                                </div>
                            <ul>                                                      
                                <li> SalesRank <span> ${rank}</span></li>
                                <a target="_blank" href="https://www.amazon.com/dp/${currentAsin}" data-asin="${currentAsin}" class="">                                
                                    <li> Asin <span> ${currentAsin}</span></li>
                                </a>
                                <li> Brand  <span>${currentBrand}</span></li>
                                <li> Model <span> ${currentModel}</span></li>
                                <li class="price"> Amazon Price <span> ${price_amazon}</span></li>
                                <li class="price"> New Price  <span>${price_new}</span></li>
                                <li class="price"> Used Price <span> ${price_used}</span></li>
                                <span class="loadImage">Load graph</span>                    
                                <img class="graph" src="">
                                <div class="container_notes">
                                    <p>Notes :</p>
                                    <span></span>                                                       
                                </div>   
                            </ul>
                            <span class="backTo">Back</span>
                        `
                        $("#viewProduct").append(ProductHtmlTopList)
                        $.ajax({
                            url: 'https://app.lacroi.co/api/v1/notes/' + currentAsin,
                            type: 'GET',
                            headers: {
                                'Authorization': 'Bearer ' + api_token,
                            },
                            success: function(result, textStatus, xhr) {                         
                                if (result.content != "") {
                                    $(".container_notes span").html(result.content);
                                    var respLoad = result.content;

                                    chrome.storage.local.set({
                                        'respLoad': respLoad
                                    }, function() {                                      
                                    });
                                }
                            },
                            error: function(xhr, textStatus, errorThrown) {                              
                            }
                        }); //Ajax-Api-notes-load  


                        chrome.storage.local.set({
                            'ProductHtmlTopList': ProductHtmlTopList
                        }, function() {});
                        $(".loadImage").click(function() {                  
                            chrome.tabs.executeScript(null, {
                                code: 'var currentAsin = "' + currentAsin + '"'
                            }, function() {
                                chrome.tabs.executeScript(null, {
                                    file: 'js/modalbox.js'
                                });
                            });
                        });

                    });
                        
                        $(document).on("click",".gotoebayTopList", function(e){

                            e.preventDefault();
                            var currentModel = $(this).attr("data-model")
                            var currentBrand = $(this).attr("data-brand")
                            var price_new = $(this).attr("data-price_new")
                            var price_used = $(this).attr("data-price_used")
                            var price_amazon = $(this).attr("data-price_amazon")
                     
                            if(currentModel != null){

                                if (!isNaN(currentModel)) {
                                    currentModel = currentModel.toString()                             
                                }
    
                                if (currentModel.indexOf('#') != -1) {
                                    currentModel = currentModel.replace('#', '')
                                } else if (currentModel.indexOf('&') != -1) {
                                    currentModel = currentModel.replace('&', '')
                                } else if (currentBrand.indexOf('#') != -1) {
                                    currentBrand = currentBrand.replace('#', '')
                                } else if (currentBrand.indexOf('&') != -1) {
                                    currentBrand = currentBrand.replace('&', '')
                                }
                            }else{
                                currentModel = ""
                            }

                            let condition;
                            let ValCondition = $(".valCondition").val()
                                                        
                            if (ValCondition == "new"){
                                condition = "&rt=nc&LH_ItemCondition=1000"
                            }else if (ValCondition == "used"){
                                condition = "&rt=nc&LH_ItemCondition=3000"
                            }

                            var query = encodeURI(currentBrand + " " + currentModel);
                            urlLink = "https://www.ebay.com/sch/?_nkw=" + query + condition;
                            chrome.tabs.update({
                                url: urlLink,
                                active: true
                            });
                            extractpage(currentBrand, currentModel, price_new, price_used, price_amazon,show_affiliate);
                        });

                        $("#inlineRadio1").prop("checked", true).addClass("valCondition")
                        $(document).on("click", ".form-check-input", function(){                         
                            $(".form-check-input").removeClass("valCondition")
                            $(this).addClass("valCondition")
                        });
                       
                        $(document).on("click",".searchByTitle",function(e){
                            e.preventDefault();
                            var currentModel = $(this).data("model")
                            var currentBrand = $(this).data("brand")
                            var price_new = $(this).data("price_new")
                            var price_used = $(this).data("price_used")
                            var price_amazon = $(this).data("price_amazon")
                            let titleProd = $(this).attr("data-title");                            
                            conditionValidate(titleProd)
                            extractpage(currentBrand, currentModel, price_new, price_used, price_amazon,show_affiliate);                                                                                   
                        })

                        $(document).on("click",".searchByUPC",function(e){
                            e.preventDefault();
                            var currentModel = $(this).data("model")
                            var currentBrand = $(this).data("brand")
                            var price_new = $(this).data("price_new")
                            var price_used = $(this).data("price_used")
                            var price_amazon = $(this).data("price_amazon")
                            extractpage(currentBrand, currentModel, price_new, price_used, price_amazon,show_affiliate);
                            let upcProd = $(this).attr("data-upc");
                            conditionValidate(upcProd)                                                                               
                        })

                        $(document).on("click",".searchByIsbn",function(e){
                            e.preventDefault();                         
                            let currentModel = $(this).data("model")
                            let currentBrand = $(this).data("brand")
                            let price_new = $(this).data("price_new")
                            let price_used = $(this).data("price_used")
                            let price_amazon = $(this).data("price_amazon")                            
                            let isbnProd = $(this).attr("data-isbn");

                            let condition;
                            let ValCondition = $(".valCondition").val()
                                                        
                            if (ValCondition == "new"){
                                condition = "&rt=nc&LH_ItemCondition=1000"
                            }else if (ValCondition == "used"){
                                condition = "&rt=nc&LH_ItemCondition=3000"
                            }
                            
                            if(typeof isbnProd != 'undefined' || isbnProd != null){
                                let query = encodeURI(isbnProd);
                                urlLink = "https://www.ebay.com/sch/?_nkw=" + query + condition;
                                chrome.tabs.update({
                                    url: urlLink,
                                    active: true
                                });
                                extractpage(currentBrand, currentModel, price_new, price_used, price_amazon,show_affiliate);
                            }                            
                        })

                        $(".delete-item").click(function(e) {
                            e.preventDefault();
                            var currentAsin = $(this).data("asin")
                            deleteAsin(currentAsin);
                        });
                    },
                    error: function(xhr, textStatus, errorThrown) {                
                    }
            }); //Ajax-Api-toplist
        });
        console.log(api_token)
        $(document).on("click", "#new_Job", function(){  
            $(this).attr("disabled", true);
            $(this).text("Loading...");          
            createJob(api_token)           
        })
        $(document).on("click", "#new_refesh", function(){
            $(this).attr("disabled", true);
            $(this).text("Loading...");
            createRefresh(api_token)   
         })
    }
    const singInClick = () => {
        $("#sign-in").click(function(e) {
            e.preventDefault()                       
            var email = $("#email").val();
            var validMail = $("#email").val().indexOf('@', 0) == -1 || $("#email").val().indexOf('.', 0) == -1;
            var password = $("#password").val()

            $.ajax({
                url: 'https://app.lacroi.co/api/login',
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                dataType: 'json',
                data: JSON.stringify({
                    "email": email,
                    "password": password
                }),
                success: function(data, textStatus, xhr) {                  
                    $("#type-Account").html("");                                                            
                    $("#sign-in").attr("disabled", false);
                    $("#sign-in").text("Log In");
                    $("#result").html("");
                    chrome.storage.local.set({
                        "lacroi_user": data                          
                    }, function() {
                        $("#lacRoi_ext").show();
                        $("#frm-login").hide();
                        loadOptions();                       
                        populateTabTopList();                       

                        let numberDays = data.subscription_trial_left;
                        let subscriptionType = data.subscription_type;
                        let status = data.subscription_status;

                        if(subscriptionType == "trial" && status == "active"){
                            $("#type-Account").append(/*html*/
                            `                    
                                <span class="badge badge-primary">${subscriptionType+" "+ numberDays } <i class="far fa-smile"></i></span>
                            
                            `)
                            $("#type-Account").attr("title", "Get Your Premium account")
                            $("#type-Account").click(function(){                      
                                toSuscribe();
                            })
                            console.log(auth.lacroi_user.subscription_status)
                        }else if(subscriptionType == "trial" && status == "expired"){                                                           
                            $("#type-Account").append(/*html */
                            `
                                <span class="badge badge-danger">${subscriptionType +" "+status} <i class="far fa-smile"></i></span>
                            `) 
                            $("#type-Account").attr("title", "Get Your Premium account")
                            $("#type-Account").click(function(){                      
                                toSuscribe();
                            })
                            $("#days-free").click() 
                            disableButtons();              
                        }else if(subscriptionType == "premium"){
                            $("#type-Account").append(/*html*/
                            `
                                <span class="badge badge-success">${subscriptionType} Account <i class="fas fa-crown"></i></span>
                            `)
                            $(".controls-right").html("")
                            $(".controls-right").html('<span id="logOut">Log Out</span>')                                   
                        }                                          
                    })                        
                    show_affiliate = data.show_affiliate;
                },
                error: function(xhr, textStatus, errorThrown) {                     
                    $("#sign-in").attr("disabled", false);
                    $("#sign-in").text("Log In");
                    $("#result").fadeIn();
                    $("#result").html("Invalid user or password");
                }
            }); //Ajax-Api-login           
        });
    }    
    $("#saveaddasin").click(function(e) {
        e.preventDefault()
        if ($("#asinval").val().trim() != "") {
            $(this).attr("disabled", true);
            $(this).text("Loading");          
            var asin = $("#asinval").val().trim();
            $.ajax({
                url: 'https://app.lacroi.co/api/v1/addasin',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + api_token,
                },
                dataType: 'json',
                data: {
                    "asin": asin
                },
                success: function(data, textStatus, xhr) {                
                    populateTabTopList();
                    $("#saveaddasin").attr("disabled", false);
                    $("#saveaddasin").text("Add Asin");
                },
                error: function(xhr, textStatus, errorThrown) {
                    $("#saveaddasin").attr("disabled", false);
                    $("#saveaddasin").text("Add Asin");
                }
            }); //Ajax-Api-addasin  
        }
    });

    const searchPage = (formInfo, page, api_token) => {
        $.ajax({
            url: 'https://app.lacroi.co/api/v1/extfinder2?page=' + page,
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + api_token,
            },
            dataType: 'json',
            data: formInfo,
            beforeSend: function() {
                chrome.storage.local.set({
                    "search_result": ""
                }, function() {})
            },
            success: function(dataResult, textStatus, xhr) {
                chrome.storage.local.set({
                    "search_result": dataResult
                }, function() {})
                populateProductTable(dataResult.data.products)
                $("#searchOptions").text("Search");
                $("#searchOptions").attr("disabled", false);

                $("#results-tab").click();

                $("#nextpage").attr("data-nextpage", dataResult.nextpage);
                $("#nextpage").attr("data-searchid", dataResult.search_id);

                $("#previuspage").attr("data-previuspage", dataResult.prevpage);
                $("#previuspage").attr("data-searchid", dataResult.search_id);
            },
            error: function(xhr, textStatus, errorThrown) {           
                $("#searchOptions").text("Search");
                $("#searchOptions").attr("disabled", false);
                $("#errorSearch").html("Search error");
            }
        }); //Ajax-Api-search   
    }

    $("#previuspage").click(function(e) {
        e.preventDefault();
        var page = $(this).attr("data-previuspage");
        var searchid = $(this).attr("data-searchid");     
        searchPagePaginated(page, searchid)
        $("#loading").html("Loading...")

        chrome.storage.local.set({
            'page': page
        }, function() {
                    
        });
    });
    $("#nextpage").click(function(e) {
        e.preventDefault();
        var page = $(this).attr("data-nextpage");
        var searchid = $(this).attr("data-searchid");     
        searchPagePaginated(page, searchid)
        $("#loading").html("Loading...")
        chrome.storage.local.set({
            'page': page,
            'searchid': searchid
        }, function() {

        });
    });
    chrome.storage.local.get({
        'page': '',
        'searchid': ''
    }, function(result) {
        if (result.page != "" && result.searchid != "") {
            searchPagePaginated(result.page, result.searchid)
            $("#results-tab").click();
        }
    });

    const searchPagePaginated = (page, searchid) => {

        $("#previuspage").attr("disabled", true);
        $("#nextpage").attr("disabled", true);

        $.ajax({
            url: 'https://app.lacroi.co/api/v1/extfinderpaginated?page=' + page + '&search_id=' + searchid,
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + api_token,
            },
            dataType: 'json',
            beforeSend: function() {},
            success: function(dataResult, textStatus, xhr) {
                $("#loading").html("");

                populateProductTable(dataResult.data.products)

                $("#nextpage").attr("data-nextpage", dataResult.nextpage);
                $("#nextpage").attr("data-searchid", dataResult.search_id);

                $("#previuspage").attr("data-previuspage", dataResult.prevpage);
                $("#previuspage").attr("data-searchid", dataResult.search_id);

                $("#previuspage").attr("disabled", false);
                $("#nextpage").attr("disabled", false);
            },
            error: function(xhr, textStatus, errorThrown) { 
                            
            }
        }); //Ajax-Api-search   
    }
    
    $(document).on('click', '.edit_Info', function(e) {        
        $(".resultNote").hide()
        e.preventDefault();
        let asinEdit = $(this).data("asin");
        
        $("#save_info").attr("data-asin",asinEdit)
                
        $.ajax({
            url: 'https://app.lacroi.co/api/v1/producttoplist/'+asinEdit,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + api_token,
            },
            success: function(data, textStatus, xhr) {
                $("#edit_group").val(data.data.groupname)
                $("#edit_name").val(data.data.title)
                $("#edit_brand").val(data.data.brand)
                $("#edit_model").val(data.data.model)
                $("#edit_rank").val(data.data.rank)
                $("#edit_new_price").val(data.data.price_new)
                $("#edit_used_price").val(data.data.price_used)
                $("#edit_amazon_price").val(data.data.price_amazon)
                $("#edit_upc").val(data.data.upc)
                $("#edit_isbn").val(data.data.isbn)
                $("#edit_group_").val(data.data.groupname)                        
            },
            error: function(xhr, textStatus, errorThrown) {   
                          
            }
        }); //Ajax-Api-toplist 
    });

    $(document).on('click', '#save_info', function(e) { 
        e.preventDefault();
        let asinEdit = $(this).attr("data-asin")      

        let valName = $("#edit_name").val();                                                
        let valbrand = $("#edit_brand").val();
        let valModel = $("#edit_model").val();
        let groupName = $("#edit_group").val()
      
        let valRank = $("#edit_rank").val();
        let valNewPrice = $("#edit_new_price").val();
        let valPriceUsed = $("#edit_used_price").val();
        let valAmazonPrice = $("#edit_amazon_price").val();
        let valUpc = $("#edit_upc").val()
        let valIsbn = $("#edit_isbn").val()
        

        $("#topList_brand_"+asinEdit).closest(".gotoebayTopList").attr("data-price_new", valNewPrice)
        $("#topList_brand_"+asinEdit).closest(".gotoebayTopList").attr("data-price_used", valPriceUsed)
        $("#topList_brand_"+asinEdit).closest(".gotoebayTopList").attr("data-brand", valbrand) 
        $("#topList_brand_"+asinEdit).closest(".gotoebayTopList").attr("data-model", valModel)  

        $("#topList_title_"+asinEdit).closest(".searchByTitle").attr("data-price_used", valPriceUsed)
        $("#topList_title_"+asinEdit).closest(".searchByTitle").attr("data-price_new", valNewPrice)
        $("#topList_title_"+asinEdit).closest(".searchByTitle").attr("data-title", valName)
        
        $("#topList_upc_"+asinEdit).closest(".searchByUPC").attr("data-upc", valUpc)
        $("#topList_upc_"+asinEdit).closest(".searchByUPC").attr("data-price_used", valPriceUsed)     
        $("#topList_upc_"+asinEdit).closest(".searchByUPC").attr("data-price_new", valNewPrice)
        
        $("#topList_isbn_"+ asinEdit).closest(".searchByIsbn").attr("data-isbn", valIsbn)
        $("#topList_isbn_"+ asinEdit).closest(".searchByIsbn").attr("data-price_used", valPriceUsed)  
        $("#topList_isbn_"+ asinEdit).closest(".searchByIsbn").attr("data-price_new", valNewPrice)

        $("#topList_title_"+asinEdit).html(valName);
        $("#topList_brand_"+ asinEdit).html(valbrand);
        $("#topList_model_"+ asinEdit).html(valModel);
        $("#topList_rank_"+ asinEdit).html(valRank);
        $("#topList_pricenew_"+ asinEdit).html(valNewPrice);
        $("#topList_usedprice_"+ asinEdit).html(valPriceUsed);
        $("#topList_amazon_"+ asinEdit).html(valAmazonPrice);
        $("#topList_upc_"+ asinEdit).html(valUpc);
        $("#topList_isbn_"+ asinEdit).html(valIsbn);
        $("#topList_group_"+asinEdit).html(groupName)
        
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
                "groupname" : groupName
            },
            success: function(data, textStatus, xhr) {                             
                $(".resultNote").html("Saved").removeClass("alert-danger").fadeIn()              
                $("#topList_title_"+asinEdit).val(valName);
                $("#topList_brand_"+asinEdit).val(valbrand);
                $("#topList_model_"+asinEdit).val(valModel);
                $("#topList_rank_"+asinEdit).val(valRank);
                $("#topList_pricenew_"+ asinEdit).val(valNewPrice);
                $("#topList_usedprice_"+ asinEdit).val(valPriceUsed);
                $("#topList_amazon_"+ asinEdit).val(valAmazonPrice);
                $("#topList_upc_"+ asinEdit).val(valUpc);
                $("#topList_isbn_"+ asinEdit).val(valIsbn); 
                $("#topList_group_"+asinEdit).val(groupName)                                                      
            },
            error: function(xhr, textStatus, errorThrown) {   
                console.log(xhr)             
            }
        }); //Ajax-Api-toplist
        
    });

    $(document).on('click', '.backTo', function() {
        $("#toplistExt_wrapper").fadeIn()
        $("#toplistExt").fadeIn();
        $("#back").hide();
        $("#viewProduct").hide();
        $(".add-asin").fadeIn();
        $("#tab__results").fadeIn();
        $("#back").hide();
        $("#viewProduct1").hide();
        $(".pagination").fadeIn();

        chrome.storage.local.set({
            'openProductHtml': ''
        }, function() {
            
        });
        chrome.storage.local.set({
            'ProductHtmlTopList': ''
        }, function() {
            
        });
    });

    $(document).on('click', '.gotoamazon', function(e) {
        e.preventDefault();
        var currentAsin = $(this).data("asin")
        amazonLink = "https://www.amazon.com/dp/" + currentAsin;
        chrome.tabs.update({
            url: amazonLink,
            active: true
        });
    });

    $(document).on('click', '.gotoebay', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var currentBrand = $(this).data("brand")
        var currentModel = $(this).data("model")
        var query = encodeURI(currentBrand + " " + currentModel);
        urlLink = "https://www.ebay.com/sch/?_nkw=" + query;
        chrome.tabs.update({
            url: urlLink,
            active: true
        });
        var currentModel = $(this).data("model")
        var currentBrand = $(this).data("brand")
        var price_new = $(this).data("price_new")
        var price_used = $(this).data("price_used")
        var price_amazon = $(this).data("price_amazon")
        extractpage(currentBrand, currentModel, price_new, price_used, price_amazon, show_affiliate);
    });

    $(document).on('click', '.active_notes', function(e) {    
        var newAsin = $(this).data("asin")

        $("#save_note_update").attr("data-asin",newAsin)        
                
            $.ajax({
                url: 'https://app.lacroi.co/api/v1/notes/' + newAsin,
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + api_token,
                },
                success: function(result, textStatus, xhr) {                       
                    $("#note").val(result.content);                                            
                },
                error: function(xhr, textStatus, errorThrown) {       
                    $(".resultNote").fadeIn();
                    $(".resultNote").html("Error");
                }
            }); //Ajax-Api-load-notes  
    }); //click active_notes 

    $(document).on('click', '#save_note_update', function(e) {
        e.preventDefault();
        $(".resultNote").hide();
        var content = $("#note").val();
        var asinUpdate = $("#save_note_update").attr("data-asin") 
      
        $(".save_Note").attr("disabled", true);
        $(".save_Note").text("Saving...");

        if (content != "") {
            $.ajax({
                url: 'https://app.lacroi.co/api/v1/notes/' + asinUpdate,
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + api_token,
                },
                dataType: 'json',
                data: {
                    "content": content
                },
                success: function(result, textStatus, xhr) {                     
                    $(".save_Note").attr("disabled", false);
                    $(".save_Note").text("Save");
                    $(".resultNote").html("Note Saved");
                    $(".resultNote").removeClass("alert-danger");
                    $(".resultNote").addClass("alert-success");
                    $(".resultNote").fadeIn();
                    setTimeout(function() {
                        $(".resultNote").hide();
                    }, 2000);
                },
                error: function(xhr, textStatus, errorThrown) {                    
                    $(".save_Note").attr("disabled", false);
                    $(".save_Note").text("Save");
                    $("resultNote").fadeIn();
                    $("#resultNote").html("Error");
                }
            }); //Ajax-Api-notes-saved      
        } else {
            $(".save_Note").attr("disabled", false);
            $(".save_Note").text("Save");
            $(".resultNote").html("Fill the field");
            $(".resultNote").fadeIn();
            $(".resultNote").focus();
        }
    }); //click save_Note

  /*Delete Top List*/
    $(document).on('click', '#delete_item', function(e) {
        e.preventDefault();
        var deleteAsin = $(this).data("asin")        
        var confirmText = "Are you sure you want to delete this item?";
        if(confirm(confirmText)) {            
            $(this).closest('tr').remove();
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
                        "asin": deleteAsin
                    },
                    success: function(data, textStatus, xhr) {
                        
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        $("#msj-error").html("search error");                                           
                    }
                }); //Ajax-Api-save
            })
        }   
    })
    const loadNotes = (asinsList) => {
        $.ajax({
            url: 'https://app.lacroi.co/api/v1/noteslist?asin=' + asinsList,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + api_token,
            },
            success: function(result, textStatus, xhr) {                     
                              
                if(result.data.length){                  
                    $.each(result.data,function(index, notaVal){                        
                        $("#note_"+ notaVal.asin).attr("title",notaVal.content);
                        $(".note"+ notaVal.asin).attr("title",notaVal.content);
                        
                        $("#note_"+ notaVal.asin +"> i").css({"color":"#8bc34a"})                       
                    });
                }                        
            },
            error: function(xhr, textStatus, errorThrown) {

            }
        }); //Ajax-Api-Asin-List
    }           
    $("button").click(function(){
        let label = $(this).text()
        ga('send', 'event', 'Button', 'Click ', label);
    });
       
    let counterClick = 0;
    $(document).on('click', '#random-search', function(){
        
        counterClick++           
        $(this).attr("disabled", true);
        $(this).text("Searching..");

        let random_min_price = $("#value-random").val()      
        let type_search = $("input[name='inlineRadioOptions']:checked").val();
        let manufacturer = $("#search_manufacturated").val();
        let brand = $("#search_brand").val();
        let model = $("#search_model").val();
        let title = $("#search_title").val();
        let minimum_roi = $("#minimum_roi").val();
        let category = $("#category").val();
        let max_search_price_new = $("#max_search_price_new").val();
        let max_search_price_used = $("#max_search_price_used").val();
        let sales_rank_min = $("#sales_rank_min").val();
        let sales_rank_max = $("#sales_rank_max").val();
        let min_sellers_new = $("#min_sellers_new").val();
        let min_sellers_used = $("#min_sellers_used").val();
        let min_search_price_new = $("#min_search_price_new").val();
        let min_search_price_used = $("#min_search_price_used").val()
        let page = $("#page").val();

        formInfo = {
            "type_search": type_search,
            "manufacturer": manufacturer,
            "brand": brand,
            "model": model,
            "title": title,
            "minimum_roi": minimum_roi,
            "category": category,
            "max_search_price_new": max_search_price_new,
            "max_search_price_used": max_search_price_used,
            "sales_rank_min": sales_rank_min,
            "sales_rank_max": sales_rank_max,
            "min_sellers_new": min_sellers_new,
            "min_sellers_used": min_sellers_used,
            "page": page,
            "min_search_price_new": random_min_price,
            "min_search_price_used": random_min_price            
        }
        $('#next').attr("data-page", page);
        $('#next').attr("data-page", page);

        chrome.storage.local.set({
            "formInfo": formInfo,
            "page": page
        }, function() {

        })
        $.ajax({
            url: 'https://app.lacroi.co/api/v1/randomsearch?page=' + page,
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + api_token,
            },
            dataType: 'json',
            data: formInfo,
            beforeSend: function() {
                chrome.storage.local.set({
                    "search_result": ""
                }, function() {})
            },
            success: function(dataResult, textStatus, xhr) {                   
                if(dataResult.totalResults <= 1){              
                    $("#random-search").html("<i class='fas fa-random'></i>Random");
                    $("#random-search").attr("disabled", false);
                    
                    if(counterClick < 2){
                        $("#random-search").click();
                    }                                    
                }else if(dataResult.totalResults > 2){                                            
                    chrome.storage.local.set({
                        "search_result": dataResult
                    }, function() {})
                    populateProductTable(dataResult.data.products)
                    $("#random-search").html("<i class='fas fa-random'></i>Random");
                    $("#random-search").attr("disabled", false);

                    $("#results-tab").click();

                    $("#nextpage").attr("data-nextpage", dataResult.nextpage);
                    $("#nextpage").attr("data-searchid", dataResult.search_id);

                    $("#previuspage").attr("data-previuspage", dataResult.prevpage);
                    $("#previuspage").attr("data-searchid", dataResult.search_id);
                }
            },
            error: function(xhr, textStatus, errorThrown) {           
                $("#random-search").text("Random Search");
                $("#random-search").attr("disabled", false);
                $("#errorSearch").html("Search error");
            }
        }); //Ajax-Api-search    
    })

    $(document).on("click", "#save_cupon", function(){
        let coupon = $("#cupon").val()
        console.log(coupon)
        if(cupon == ""){
            $(".modalCupon .resultNote").html("Invalid code")
            $(".modalCupon .resultNote").fadeIn()
            $("#cupon").on("keydown", function() {
                $(".modalCupon .resultNote").hide();
            });
            setTimeout(function() {
                $(".modalCupon .resultNote").hide();
            }, 2000);
        }else{           
            $.ajax({
                url: 'https://app.lacroi.co/api/v1/extensubscription',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + api_token,
                },
                dataType: 'json',
                data: {
                    "coupon": coupon
                },
                success: function(result, textStatus, xhr) {                     
                    console.log(result)
                    $(".modalCupon .resultNote").html("coupon successfully applied")
                    $(".modalCupon .resultNote").removeClass("alert-danger")
                    $(".modalCupon .resultNote").addClass("alert-success")
                    $(".modalCupon .resultNote").fadeIn()
                    $("#cupon").on("keydown", function() {
                        $(".modalCupon .resultNote").hide();
                    });
                    setTimeout(function() {
                        $(".modalCupon .resultNote").hide();
                    }, 2000);
                },
                error: function(xhr, textStatus, errorThrown) {                    
                    console.log(xhr.responseJSON.message)                    
                    $(".modalCupon .resultNote").html(xhr.responseJSON.message)                   
                    $(".modalCupon .resultNote").addClass("alert-danger")
                    $(".modalCupon .resultNote").fadeIn()
                    $("#cupon").on("keydown", function() {
                        $(".modalCupon .resultNote").hide();
                    });
                    setTimeout(function() {
                        $(".modalCupon .resultNote").hide();
                    }, 3000);
                }
            }); //Ajax-Api-notes-saved  
        }
    })

    $(document).on("click", ".allJobs", function(){
        let jobId = $(this).attr("data-id")
        console.log(jobId)
        window.open(chrome.runtime.getURL(`jobs.html?id=${jobId}`));        
    })      
    
}); //on.Ready

/* ************ Functions ****************/

const conditionValidate = (searchType) => {
                              
    let condition;
    let ValCondition = $(".valCondition").val()
                                
    if (ValCondition == "new"){
        condition = "&rt=nc&LH_ItemCondition=1000"
    }else if (ValCondition == "used"){
        condition = "&rt=nc&LH_ItemCondition=3000"
    }else if( ValCondition == "both"){
        condition = ""
    }
    
    var query = encodeURI(searchType);
    urlLink = "https://www.ebay.com/sch/?_nkw=" + query + condition;
    chrome.tabs.update({
        url: urlLink,
        active: true
    });  
}

const extractpage = (currentBrand, currentModel, price_new, price_used, price_amazon, show_affiliate) => {
    chrome.tabs.onUpdated.addListener(function(tabId, info) {
        let ValCondition = $(".valCondition").val()  
        if (info.status === 'complete') {              
            chrome.tabs.executeScript(tabId, {
                code: 'var price_amazon = "' + price_amazon + '"; var currentBrand = "' + currentBrand + '"; var currentModel = "' + currentModel + '"; var price_new = ' + price_new + '; var price_used = ' + price_used + '; var show_affiliate = '+show_affiliate+ '; var searchingFor = "'+ValCondition+'";'
            }, function() {
                chrome.tabs.executeScript(tabId, {
                    file: 'js/page.js'
                });
            });
        }
    });
}

const toSuscribe = () =>{
    chrome.tabs.update({
        url: "https://app.lacroi.co/settings#/subscription",
        active: true
    });
}
const checkSuscription = (api_token) => { 
    $.ajax({
        url: 'https://app.lacroi.co/api/v1/checksubscription',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + api_token,
        },
        success: function(result, textStatus, xhr) {                         
            $("#type-Account").html("");

            let numberDays = result.subscription_trial_left;
            let subscriptionType = result.subscription_type;
            let status = result.subscription_status;

            if(subscriptionType == "trial" && status == "active"){
                $("#type-Account").append(
                `                    
                    <span class="badge badge-primary">${subscriptionType+" "+ numberDays } <i class="far fa-smile"></i></span>
                
                `)
                $("#type-Account").attr("title", "Get Your Premium account")
                $("#type-Account").click(function(){                      
                    toSuscribe();
                })               
            }else if(subscriptionType == "trial" && status == "expired"){                                                           
                $("#type-Account").append(
                `
                    <span class="badge badge-danger">${subscriptionType +" "+status} <i class="far fa-smile"></i></span>
                `)   
                $("#type-Account").attr("title", "Get Your Premium account")
                $("#type-Account").click(function(){                      
                    toSuscribe();
                })
                 $("#days-free").click()
                 disableButtons()

            }else if(subscriptionType == "premium"){
                $("#type-Account").append(
                `
                    <span class="badge badge-success">${subscriptionType} Account <i class="fas fa-crown"></i></span>
                `)                 
                $(".controls-right").html("")
                $(".controls-right").html('<span id="logOut">Log Out</span>')   
            }                                      
        },
        error: function(xhr, textStatus, errorThrown) {       
            
            console.log(xhr)
            console.log(textStatus)
           
        }
    }); //Ajax-Api-load-notes  
}

const disableButtons = (idButton) => {
    $("#searchOptions").attr("disabled", true);
    $("#random-search").attr("disabled", true);
    $("#saveaddasin").attr("disabled", true);
}


$(document).on("click",".more-btn",function(e){
    e.preventDefault();
    $(this).parent(".more").toggleClass("show-more-menu")
})


$(document).on("click",".more_option",function(e){
    e.preventDefault();
    let model = $(this).attr("data-model")
    let brand =$(this).attr("data-brand")
    let newPrice = $(this).attr("data-price_new")
    let usedPrice = $(this).attr("data-price_used")
    let condition = $(this).attr("data-condition")
    let query = encodeURI(model+' '+brand);
    window.open(chrome.runtime.getURL(`bestdeals.html?query=${query}&newprice=${newPrice}&usedprice=${usedPrice}&condition=${condition}`));    
})

const loadJobs = (api_token) => {    
    $.ajax({
        url: 'https://app.lacroi.co/api/v1/jobs',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + api_token,
        },
        success: function(result, textStatus, xhr) {                                 
            if(result.data == ""){
                $('#jobs_tab  .jobs_info').html("<span>Jobs Empty, pls go to Toplist to run a new job</span>")
            }else{
                $('#jobs_tab  .jobs_info').empty()
                              
                $.each(result.data, function(i, value) {                                   
                   let dateCreated = value.created_at.split(" ")
                   dateCreated = dateCreated[0]  
                   dateCreated = dateCreated.split("-")
                   
                   let hourCreated = value.created_at.split(" ")
                   hourCreated = hourCreated[1]

                   let dateUpdated = value.updated_at.split(" ")
                   dateUpdated = dateUpdated[0]  
                   dateUpdated = dateUpdated.split("-")
                   
                   let hourUpdated = value.updated_at.split(" ")
                   hourUpdated = hourUpdated[1]

                   let statusJob = "";
                   if(value.status == "finished"){
                        statusJob = `<span class="badge badge-secondary">${value.status}</span>`
                   }else if(value.status == "running"){
                        statusJob = `<span class="badge badge-success">${value.status}</span>`
                   }                                                            
                    $('#jobs_tab .jobs_info').append(
                    `                      
                        <div>
                            <ul>
                                <li>
                                    Id: <span>${value.id}</span>
                                </li>
                                <li class="status_job">
                                    Status: ${statusJob}
                                </li>
                                <li>
                                    Percentage: <span>${value.porcentage}%</span>
                                </li>
                                <li>
                                    Created at: <span>${dateCreated[2]+"/"+dateCreated[1]+"/"+dateCreated[0]+" "+hourCreated}</span>
                                </li>
                                <li>
                                    Updated at: <span>${dateUpdated[2]+"/"+dateUpdated[1]+"/"+dateUpdated[0]+" "+hourUpdated}</span>
                                </li>                           
                                <li>
                                    Products with roi: <span>${value.products_with_roi}</span>
                                </li>
                            </ul>
                            <div>
                                <span id="allJobs" data-id="${value.id}" class="allJobs btn btn-outline-primary btn-sm">Get Report</span>
                            </div>                    
                        </div>
                    `)
                })
                $('#title_jobs').html("Products Ebay Jobs").addClass("title_jobs")                                           
            }            
        },        
        error: function(xhr, textStatus, errorThrown) {                   
            console.log(xhr)
            console.log(textStatus)                  
        }
    }); //Ajax-Api-load-jobs
}
const createJob = (api_token) => {
    $.ajax({
        url: 'https://app.lacroi.co/api/v1/jobs',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + api_token,
        },
        success: function(result, textStatus, xhr) {                     
            console.log(result)
            console.log("post")
            if(result.message == "Active job running"){
                $("#msj-job").removeClass("alert-success")
                $("#msj-job").addClass("alert-danger")
            }
            $("#msj-job").html(result.message).fadeIn()
            $(".hide-msj-job").click(function(){
                $("#msj-job").hide()
            })
            $("#new_Job").attr("disabled", false);
            $("#new_Job").text("Create Job");
        },
        error: function(xhr, textStatus, errorThrown) {                    
            console.log(xhr)
            $("#new_Job").attr("disabled", false);
            $("#new_Job").text("Create Job");
        }
    }); //Ajax-Api-notes-saved  
}

const createRefresh = (api_token) => {
    $.ajax({
        url: 'https://app.lacroi.co/api/v1/refreshtoplist',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + api_token,
        },
        success: function(result, textStatus, xhr) {
            if(result.message == "Active job refresh toplist running"){
                $("#msj-refresh").removeClass("alert-success")
                $("#msj-refresh").addClass("alert-danger")
            }
            $("#msj-refresh").html(result.message).fadeIn() 
            
            $(".hide-msj-refresh").click(function(){
                $("#msj-refresh").hide()
            }) 
            $("#new_refesh").attr("disabled", false);
            $("#new_refesh").text("Refresh");           
        },
        error: function(xhr, textStatus, errorThrown) {                    
            console.log(xhr)
            $("#new_refesh").attr("disabled", false);
            $("#new_refesh").text("Refresh");
        }
    }); //Ajax-Api-notes-saved  
}

const loadRefresh = (api_token) => {
    
    $.ajax({
        url: 'https://app.lacroi.co/api/v1/refreshtoplist',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + api_token,
        },
        success: function(result, textStatus, xhr) {                                 
            console.log(result)
            console.log(result.data)
            if(result.data == ""){
                $('#jobs_tab  .refresh_info').html("<span></span>")
                $('#title_refresh').html("").removeClass("title_jobs")
            }else{
                $('#jobs_tab  .refresh_info').empty()
                $.each(result.data, function(i, value) {                                   
                   let dateCreated = value.created_at.split(" ")
                   dateCreated = dateCreated[0]  
                   dateCreated = dateCreated.split("-")
                   
                   let hourCreated = value.created_at.split(" ")
                   hourCreated = hourCreated[1]

                   let dateUpdated = value.updated_at.split(" ")
                   dateUpdated = dateUpdated[0]  
                   dateUpdated = dateUpdated.split("-")
                   
                   let hourUpdated = value.updated_at.split(" ")
                   hourUpdated = hourUpdated[1]

                   let statusJob = "";
                   if(value.status == "finished"){
                        statusJob = `<span class="badge badge-secondary">${value.status}</span>`
                   }else if(value.status == "running"){
                        statusJob = `<span class="badge badge-success">${value.status}</span>`
                   }                                                            
                    $('#jobs_tab .refresh_info').append(
                    `                        
                        <div>                        
                            <ul>
                                <li>
                                    Id: <span>${value.id}</span>
                                </li>
                                <li class="status_job">
                                    Status: ${statusJob}
                                </li>
                                <li>
                                    Percentage: <span>${value.percentage}%</span>
                                </li>
                                <li>
                                    Created at: <span>${dateCreated[2]+"/"+dateCreated[1]+"/"+dateCreated[0]+" "+hourCreated}</span>
                                </li>
                                <li>
                                    Updated at: <span>${dateUpdated[2]+"/"+dateUpdated[1]+"/"+dateUpdated[0]+" "+hourUpdated}</span>
                                </li>                                                      
                            </ul>                                            
                        </div>
                    `)
                }) 
                $('#title_refresh').html("Toplist Refresh Job ").addClass("title_jobs")                                        
            };
        },        
        error: function(xhr, textStatus, errorThrown) {                   
            console.log(xhr)
            console.log(textStatus)                      
        }
    }); //Ajax-Api-load-jobs
}

