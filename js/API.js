var get = {
    drug: function() {
        $.ajax({
            url: "https://quitsmoking-app.herokuapp.com/drug",
            method: "GET"
        });
    }
};
