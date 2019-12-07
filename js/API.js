var get = {
    drug: function(param) {
        return (
            $.ajax({
                url: "https://quitsmoking-app.herokuapp.com/drug?f=owner&q=" + param ,
                method: "GET"
            })
        )
    }
};
