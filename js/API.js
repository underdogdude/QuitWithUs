var get = {
    user: function () { 
        return (
            $.ajax({
                url: "https://quitsmoking-app.herokuapp.com/users",
                method: "GET"
            })
        )
    },
    userData: function (param) { 
        return (
            $.ajax({
                url: "https://quitsmoking-app.herokuapp.com/userdata?q=" + param,
                method: "GET"
            })
        )
    },
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
    },
    wallet: function(param) {
        return (
            $.ajax({
                url: "https://quitsmoking-app.herokuapp.com/wallet?f=username&q=" + param ,
                method: "GET"
            })
        )
    },
    information: function(param) { 
        return (
            $.ajax({
                url: "https://quitsmoking-app.herokuapp.com/informations" ,
                method: "GET"
            })
        )
    },
    sosArticle: function () {
        return (
            $.ajax({
                url: "https://quitsmoking-app.herokuapp.com/sosarticles" ,
                method: "GET"
            })
        )
    },
    topic: function () {
        return (
            $.ajax({
                url: "https://quitsmoking-app.herokuapp.com/topics" ,
                method: "GET"
            })
        )
    },
    comment: function () {
        return (
            $.ajax({
                url: "https://quitsmoking-app.herokuapp.com/comments" ,
                method: "GET"
            })
        )
    },
    cheerup: function () {
        return (
            $.ajax({
                url: "https://quitsmoking-app.herokuapp.com/cheerups" ,
                method: "GET"
            })
        )
    },
    favData: function(param) { 
        return (
            $.ajax({
                url: "https://quitsmoking-app.herokuapp.com/favdatas" ,
                method: "GET"
            })
        )
    }
};
