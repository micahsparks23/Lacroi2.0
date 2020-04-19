    $("body").append(            
        `
        <script>
            
            var labelID;
            $('label').click(function() {
            labelID = $(this).attr('for');
            $('#' + labelID).toggleClass('active');
            }); 
            $('#boton' ).click();

            $(".graph").attr("src","https://app.lacroi.co/api/v1/getgraph?asin=${currentAsin}");
            $(".graph").fadeIn();
        </script>

        
        <style>
          
        .modal-container {
            margin: 60px auto;
            padding-top: 0px;
            position: relative;
            width: 160px;
          }

          .modal-container .modal-content,
          .modal-container .modal-backdrop {
            height: 0;
            width: 0;
            opacity: 0;
            visibility: hidden;
            overflow: hidden;
            cursor: pointer;
            transition: opacity 0.2s ease-in;
          }
          .modal-container .modal-close {
            color: #aaa;
            position: absolute;
            right: 5px;
            top: 5px;
            padding-top: 3px;
            background: #fff;
            font-size: 16px;
            width: 25px;
            height: 25px;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
          }
          .modal-container .modal-close:hover {
            color: #333;
          }
          .modal-container .modal-content-btn {
            position: absolute;
            text-align: center;
            cursor: pointer;
            bottom: 20px;
            right: 30px;
            background: #446CB3;
            color: #fff;
            width: 50px;
            border-radius: 2px;
            font-size: 14px;
            height: 32px;
            padding-top: 9px;
            font-weight: normal;
          }
          .modal-container .modal-content-btn:hover {
            color: #fff;
            background: #365690;
          }
          .modal-container #modal-toggle {
            display: none;
          }
          .modal-container #modal-toggle.active ~ .modal-backdrop, .modal-container #modal-toggle:checked ~ .modal-backdrop {
            background-color: rgba(0, 0, 0, 0.6);
            width: 100vw;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 9;
            visibility: visible;
            opacity: 1;
            transition: opacity 0.2s ease-in;
          }
          .modal-container #modal-toggle.active ~ .modal-content, .modal-container #modal-toggle:checked ~ .modal-content {
            opacity: 1;
            background-color: #fff;
            max-width: 600px;
            width: 600px;
            height: 350px;
            padding: 0 30px;
            position: fixed;
            left: calc(43% - 200px);
            top: 18%;
            border-radius: 4px;
            z-index: 999;
            pointer-events: auto;
            cursor: auto;
            visibility: visible;
            box-shadow: 0 3px 7px rgba(0, 0, 0, 0.6);
          }
          @media (max-width: 400px) {
            .modal-container #modal-toggle.active ~ .modal-content, .modal-container #modal-toggle:checked ~ .modal-content {
              left: 0;
            }
          }          
          #boton {
            display: none;
          }
          .graph{
            width:100%;
          }
        </style>
    
    
        <div class="modal-container">
            <input id="modal-toggle" type="checkbox">
            <label id="boton" class="modal-btn" for="modal-toggle">Click me</label> 
            <label class="modal-backdrop" for="modal-toggle"></label>
            <div class="modal-content">
              <label class="modal-close" for="modal-toggle">&#x2715;</label>
                <h2>Asin: ${currentAsin}</h2><hr />
                <img class="graph" src="">                            
            </div>          
        </div>  
          
    
      `)