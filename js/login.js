$("form").submit(function(e){
    e.preventDefault();

    var user = $("input[name=username]").val();
    var pwd = $("input[name=password]").val();


    sessionStorage.setItem("quitWithUsLogin", "YouFreeToGo");
    // redirect
    window.location.href = "./index.html";

}); 


