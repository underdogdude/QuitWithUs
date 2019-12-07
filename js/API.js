var get = {
    drug: function(param) {
        return (
            $.ajax({
                url: "https://quitsmoking-app.herokuapp.com/drug?f=owner&q=" + param ,
                method: "GET"
            })
        )
    },
    diary: function(param) {
        return (
            $.ajax({
                url: "https://quitsmoking-app.herokuapp.com/diary?f=owner&q=" + param ,
                method: "GET"
            })
        )
    }
};
