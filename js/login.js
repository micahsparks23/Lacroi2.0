$(document).ready(function() {
    $("#msj-error").hide();
    $("#create__account").click(function(event) {
        event.preventDefault();
        var name = $("#nameCreate").val();
        var createMail = $("#createMail").val().indexOf('@', 0) == -1 || $("#createMail").val().indexOf('.', 0) == -1;
        var passw = $("#passw").val();
        var confirmPassw = $("#confirmPasww").val();

        var noespacios = /^\s+$/;
   
        if (name == "" || name === 0 || name === undefined || noespacios.test(name) || name.length < 3) {
            $("#msj-error").html("invalid name").fadeIn();       
            $("#nameCreate").focus();
            $("#nameCreate").on("keydown", function() {
                $("#msj-error").hide();
            });
        } else if (createMail) {
            $("#msj-error").html("Invalid email").fadeIn();            
            $("#createMail").focus();
            $("#createMail").on("keydown", function() {
                $("#msj-error").hide();
            });
        } else if (passw != confirmPassw || passw == "" || confirmPassw == "") {
            $("#msj-error").html("The password confirmation does not match.").fadeIn();            
            $("#passw").focus();
            $("#passw").on("keydown", function() {
                $("#msj-error").hide();
            });
        } else if (!$('#customCheck1').prop('checked')) {
            $("#msj-error").html("The terms must be accepted").fadeIn();            
            $("#customCheck1").focus();
            $("#customCheck1").on("change", function() {
                $("#msj-error").hide();
            });
        } else {
            $("#msj-error").html("");
            var dataForm = $("#register").serialize();
            
            $.ajax({
                url: 'https://app.lacroi.co/api/v1/register',
                type: 'POST',
                dataType: 'json',
                data: dataForm,
                success: function(data, textStatus, xhr) {
                    
                    $("#register")[0].reset();
                    $("#msj-error").removeClass("alert-danger").addClass("alert-info");              
                    $("#msj-error").html("Account created succesfully, please sign in with your credentials").css({
                        "color": "#00a006"
                    });
                    $("#msj-error").fadeIn();
                },
                error: function(xhr, textStatus, errorThrown) {                 
                    $("#msj-error").html(xhr.responseJSON.message[0]);
                    $("#msj-error").fadeIn();
                }
            }); //Ajax-Api-create__account
        }
    })

    //----------------------------- Reset Your Password ---------------------------------
    $("#msj-reset").hide();
    $("#reset__account").click(function(event) {
        event.preventDefault();

        var validMail = $("#email_reset").val().indexOf('@', 0) == -1 || $("#email_reset").val().indexOf('.', 0) == -1;
        if (validMail) {
            $("#msj-reset").html("Invalid email").fadeIn();           
            $("#email_reset").focus();
            $("#email_reset").on("keydown", function() {
                $("#msj-reset").hide();
            });
        } else {
            $("#msj-reset").html("");
            var recoverForm = $("#reset-form").serialize();
            $.ajax({
                url: 'https://app.lacroi.co/api/v1/recover',
                type: 'POST',
                dataType: 'json',
                data: recoverForm,
                success: function(data, textStatus, xhr) {                   
                    $("#reset-form")[0].reset();
                    $("#msj-reset").html("please check your inbox").removeClass("alert-danger").addClass("alert-info");                   
                    $("#msj-reset").fadeIn();
                },
                error: function(xhr, textStatus, errorThrown) {
                   
                }
            }); //Ajax-Api-recover__account
        }
    });
});