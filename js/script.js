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
                    item
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
                    data.item.name +
                    "</strong> – " +
                    data.item.username +
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
        console.log(datum.item);
        showMainDetail(datum.item);
        showDetail(datum.item);
        showDateDetail(datum.item);
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
                    <span class="card__subtext">เพศ</span>
                    <i class="card__icon fas fa-mars"></i>
                </div> `;
    }else { 

        gender = `
            <div class="card gender female">
                <h2 class="card__text">
                    Female
                </h2>
                <span class="card__subtext">เพศ</span>
                <i class="card__icon fas fa-venus"></i>
            </div>
        `;
    }

    var string = `
        <div class="col-md-2">
            <div class="card id">
                <h2 class="card__text">
                    ${ data.ID }
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
                <span class="card__subtext">อายุ (ปี)</span>
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


    var elems = $("#detail");
        $(elems).empty();

    var string = `
    
        <div class="col-md-4">
            <div class="card">
                <div class="card-title">
                    <h3>
                        <i class="fas fa-heartbeat text__blue"></i> โรคประจำตัว
                    </h3>
                    <hr />
                </div>

                <div class="card-content">
                    <ul class="list-group list-group-flush detail__list">
                        <li class="list-group-item">
                            <b>Allergy</b> : ${data.allergy}
                        </li>
                        <li class="list-group-item">
                            <b>Asthma</b> : ${data.asthma}
                        </li>
                        <li class="list-group-item">
                            <b>Blood Pressure</b> : ${data.bloodpressure}
                        </li>
                        <li class="list-group-item">
                            <b>Depress</b> : ${data.depress}
                        </li>
                        <li class="list-group-item">
                            <b>Diabetes</b> : ${data.diabetes}
                        </li>
                        <li class="list-group-item">
                            <b>Disease</b> : ${data.disease}
                        </li>
                        <li class="list-group-item">
                            <b>Dyslipidemia</b> : ${data.dyslipidemia}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-md-8">
            <div class="card">
                <div class="card-title">
                    <h3>
                        <i class="fas fa-clipboard-list text__blue"></i> พฤติกรรมการสูบบุหรี่
                    </h3>
                    <hr />
                </div>

                <div class="card-content">
                    <ul class="list-group list-group-flush detail__list">
                        <li class="list-group-item">
                            <b>อายุที่เริ่มสูบบุหรี่ (ปี)</b> : ${ data.startsmoke }
                        </li>
                        <li class="list-group-item">
                            <b>จำนวนบุหรี่ที่สูบต่อวัน (มวน)</b> : ${data.countsmoke}
                        </li>
                        <li class="list-group-item">
                            <b>ราคาบุหรี่ที่สูบต่อมวน (บาท)</b> : ${data.cost}
                        </li>
                        <li class="list-group-item">
                            <b>เวลาที่สูบบหุรี่มวนแรก(ตัวเลือก4ข้อ)</b> : ${ data.whenstart }
                        </li>
                        
                        
                        <li class="list-group-item">
                            <b>เหตุผล</b> : ${ data.reason }
                        </li>
                        <li class="list-group-item">
                            <b>Often Smoke</b> : ${ data.offensmoke }
                        </li>
                       
                        <li class="list-group-item">
                            <b>After Eating</b> : ${ data.aftereating }
                        </li>
                        <li class="list-group-item">
                            <b>Party</b> : ${ data.party }
                        </li>
                        <li class="list-group-item">
                            <b>Drink</b> : ${data.drink}
                        </li>
                        <li class="list-group-item">
                            <b>Free Times</b> : ${data.freetime}
                        </li>
                        <li class="list-group-item">
                            <b>Concentration</b> : ${data.concentration}
                        </li>
                        <li class="list-group-item">
                            <b>Stress</b> : ${data.stress}
                        </li>
                        <li class="list-group-item">
                            <b>Wake Up</b> : ${data.wakeup}
                        </li>
                        <li class="list-group-item">
                            <b>Tired</b> : ${data.tired}
                        </li>
                        <li class="list-group-item">
                            <b>When Depress</b> : ${data.whendepress}
                        </li>
                       
                        <li class="list-group-item">
                            <b>Other</b> : ${ data.otherds || "-"}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `; 
    $(elems).append(string);
    $("#last_modify").empty();
    $("#last_modify").append(`
        <small>
            <i class="text-secondary" id="last_modify">
                Last Modified : ${ timestampToDate(data.timestamp) } 
            </i>
            <button class="btn btn-link btn__export" data-toggle="tooltip" data-placement="bottom" title="Export as Excel" onclick="exportExcel()">
                <i class="far fa-file-excel"></i>
            </button>
        </small>
    `)
    $('html, body').animate({
        scrollTop: $("#detail_main").offset().top
    }, 500);
    $('[data-toggle="tooltip"]').tooltip()

}


function showDateDetail (data) {

    var elems = $("#detail_date");
        $(elems).empty();

    var string = `
        <div class="col-md-4">
            <div class="card date">
                <h2 class="card__text">
                    ${ data.demandquit }
                </h2>
                <span class="card__subtext">ระดับความต้องการเลิกบุหรี่</span>
                <i class="card__icon fas fa-smoking-ban"></i>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card date">
                <h2 class="card__text">
                    ${ timestampToDate(data.startquitsmoke) }
                </h2>
                <span class="card__subtext">Start Quit Smoke</span>
                <i class="card__icon far fa-calendar-alt"></i>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card date">
                <h2 class="card__text">
                    ${ timestampToDate(data.endquitsmoke) }
                </h2>
                <span class="card__subtext">End Quit Smoke</span>
                <i class="card__icon fas fa-calendar-alt"></i>
            </div>
        </div>
    `;
    $(elems).append(string);
    timestampToDate(data.endquitsmoke);
}


function timestampToDate(unix_timestamp) { 
    
    if(unix_timestamp === 0) { 
        return '-';
    }
    var a = new Date(unix_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var fullDate = date + ' ' + month + ' ' + year ;
    return fullDate;
}

function exportExcel() { 
    alert('export excel currently in on instructure. Hang in there');
}
