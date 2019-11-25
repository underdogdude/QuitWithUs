$("form").submit(function(e){
    e.preventDefault();

    var user = $("input[name=username]").val();
    var pwd = $("input[name=password]").val();
    
    // redirect
    window.location.href = "./index.html";
}); 