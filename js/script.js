// Instantiate the Bloodhound suggestion engine
var users = new Bloodhound({
    datumTokenizer: function(datum) {
        return Bloodhound.tokenizers.whitespace(datum.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: "https://quitsmoking-app.herokuapp.com/?q=%QUERY",
        wildcard: "%QUERY",
        filter: function(items) {
            // Map the remote source JSON array to a JavaScript object array
            return $.map(items, function(item) {
                return {
                    id: item.ID,
                    name: item.name,
                    username: item.username,
                    reason: item.reason,
                    gender: item.gender,
                    yearsold: item.yearsold,
                    disease: item.disease,
                    allergy: item.allergy,
                    bloodpressure: item.bloodpressure,
                    diabetes: item.diabetes,
                    depress: item.depress,
                    dyslipidemia: item.dyslipidemia,
                    asthma: item.asthma,
                    otherds: item.otherds,
                    startsmoke: item.startsmoke,
                    countsmoke: item.countsmoke,
                    cost: item.cost,
                    whenstart: item.whenstart,
                    offensmoke: item.offensmoke,
                    aftereating: item.aftereating,
                    drink: item.drink,
                    party: item.party
                };
            });
        }
    },
    limit: 10
});

// Initialize the Bloodhound suggestion engine
users.initialize();

// Instantiate the Typeahead UI
$("#custom-templates .typeahead")
    .typeahead(null, {
        displayKey: "username",
        source: users.ttAdapter(),
        templates: {
            suggestion: function(data) {
                return (
                    "<p><strong>" +
                    data.name +
                    "</strong> – " +
                    data.username +
                    "</p>"
                );
            },
            footer: function(data) {
                return (
                    '<p class="type__description">Searched for ' +
                    "'" +
                    data.query +
                    "'</p>"
                );
            },
            empty: function(data) {
                return (
                    '<p class="type__description">Not found for ' +
                    "'" +
                    data.query +
                    "'</p>"
                );
            }
        }
    })
    .on("typeahead:asyncrequest", function() {
        $(".Typeahead-spinner").show();
    })
    .on("typeahead:asynccancel typeahead:asyncreceive", function() {
        $(".Typeahead-spinner").hide();
    })
    .on("typeahead:selected", function(obj, datum) {
        //datum will be the object that is selected
        console.log(datum);
        showMainDetail(datum);
        showDetail(datum);
    });

function showMainDetail(data) {
    
    var elems = $("#detail_main");
        $(elems).empty();

    var gender = ''; 

    if ( data.gender === 0 ) { 

        gender = `<div class="card gender male">
                    <h2 class="card__text">
                        Male
                    </h2>
                    <span class="card__subtext">Gender</span>
                    <i class="card__icon fas fa-mars"></i>
                </div> `;
    }else { 

        gender = `
            <div class="card gender female">
                <h2 class="card__text">
                    Female
                </h2>
                <span class="card__subtext">Gender</span>
                <i class="card__icon fas fa-venus"></i>
            </div>
        `;
    }

    var string = `
        <div class="col-md-2">
            <div class="card id">
                <h2 class="card__text">
                    ${ data.id }
                </h2>
                <span class="card__subtext">ID</span>
                <i class="card__icon fas fa-id-card-alt"></i>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card name">
                <h2 class="card__text">
                    ${ data.name }
                </h2>
                <span class="card__subtext">@${ data.username }</span>
                <i class="card__icon fas fa-user"></i>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card yearsold">
                <h2 class="card__text">
                    ${ data.yearsold }
                </h2>
                <span class="card__subtext">Years Old</span>
                <i class="card__icon fas fa-birthday-cake"></i>
            </div>
        </div>
        <div class="col-md-3"> 
            ${ 
                gender
            }
        </div>
    `;
    
    $(elems).append(string);
}


function showDetail(data) {


    
}
