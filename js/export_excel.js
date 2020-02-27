function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}
 
function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			
			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';
			
			if(R == 0){
				cell.s={
					font:{
						bold:true
					},
					alignment: {
						vertical: "center",
						horizontal: "center"
					},
				}
			}else { 
                cell.s={
					alignment: {
						wrapText: true,
					}
                }
            }
			
			ws[cell_ref] = cell;
		}
	}
    if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    var wscols = [
        {wch:30},
        {wch:60},
        {wch:20},
    ];
    
    ws['!cols'] = wscols;
	return ws;
}
 

function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}
 

function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}


function save(data){

	/* original data */
    var userinfo_data = [
        ["หัวข้อ"],
        ["วันที่เริ่มเข้าใช้งาน" , data.userinfo_data.date],
        ["ชื่อที่ใช้สร้างบัญชี", data.userinfo_data.name ],
        ["เลิกบุหรี่เพื่อ", data.userinfo_data.quit_for],
        ["เพศ", data.userinfo_data.gender],
        ["อายุ", data.userinfo_data.age + " ปี"],
        ["โรคประจำตัว (มี/ ไม่มี)" , data.userinfo_data.has_personal_disease ],
        ["(ถ้ามี) โรคประจำตัว", data.userinfo_data.personal_disease],
        ["อายุที่เริ่มสูบบุหรี่", data.userinfo_data.age_start_smoke + " ปี"],
        ["จำนวนบุหรี่ที่สูบต่อวัน",data.userinfo_data.count_smoke + " มวน"],
        ["เวลาที่สูบบุหรี่มวนแรก" ,data.userinfo_data.time_smoke],
        ["ความต้องการเลิกสูบบุหรี่" ,data.userinfo_data.want_smoke],
    ];

    var canquit_data = [
        ["หัวข้อ"],
        ["สูบบุหรี่มาแล้ว"  , data.canquit_data.all_smoke + " มวน"],
        ["เสียเงินให้บุหรี่" , data.canquit_data.money_on_smoke + " บาท"],
        ["ชีวิตที่สั้นลงจากการสูบบุหรี่" , data.canquit_data.life_decrease],
        ["สาเหตุการสูบบุหรี่" , data.canquit_data.reason_smoke],
        ["ระดับการติดสารนิโคตินในบุหรี่" , data.canquit_data.nicotine_level],
        ["เวลาที่กำหนดเลิกบุหรี่ครั้งล่าสุด" , data.canquit_data.date_quite],
        ["เลิกสูบบุหรี่ได้"  , data.canquit_data.many_quit ],
        ["มีเงินเก็บเพิ่มขึ้น" , data.canquit_data.money ],
        ["มีชีวิตยืนยาวขึ้น" , data.canquit_data.lifelong],
        ["รายการรางวัลในการเก็บเงิน" , data.canquit_data.reward],
        ["มูลค่ารางวัล", data.canquit_data.reward_price]
    ];

    // var oursuccess_data = [
    //     ["หัวข้อ"],
    //     ["วันที่บันทึก", data.oursuccess_data.date_memo],
    //     ["ความอยากบุหรี่(1-10)", data.oursuccess_data.want_smoke_level],
    //     ["ความรู้สึก", data.oursuccess_data.emotion],
    //     ["สูบบุหรี่หรือไม่ (ไม่สูบ/ สูบ)", data.oursuccess_data.smoking],
    //     ["ข้อความความสำเร็จของเรา", data.oursuccess_data.oursuccess_data],
    //     ["(ถ้าสูบ)จำนวนบุหรี่ที่สูบ", data.oursuccess_data.smoke_count],
    //     ["(ถ้าสูบ)กิจกรรมที่ทำขณะสูบบุหรี่", data.oursuccess_data.smoke_activity],
    //     ["(ถ้าสูบ)บุคคลที่อยู่ด้วยขณะสูบบุหรี่", data.oursuccess_data.smoke_with],
    //     ["ข้อความเราเรียนรู้" , data.oursuccess_data.message],
    //     ["จำนวนวันในกราฟความสำเร็จของเรา" , data.oursuccess_data.date_in_graph],
    // ];

    var oursuccess_data = data.oursuccess_data;

    // var ourpill_data = [
    //     ["หัวข้อ"],
    //     ["ชื่อยา"   , data.ourpill_data.pill_name],
    //     ["ขนาดยา" , data.ourpill_data.pill_size],
    //     ["ครั้งละ"  , data.ourpill_data.pill_per_time] ,
    //     ["วิธีใช้"   , data.ourpill_data.howto],
    //     ["เวลาใช้ยา"  , data.ourpill_data.time_to_use],
    //     ["ความถี่ในการใช้ยา" , data.ourpill_data.frequenzy_pill],
    //     ["เริ่มใช้ยา" , data.ourpill_data.date_start_pill],
    //     ["ถึงวันที่" , data.ourpill_data.date_end_pill],
    // ];
    var ourpill_data = data.ourpill_data;

    var like_data = data.like_data;

	var wb = new Workbook(); 
	var ws1 = "ข้อมูลผู้ใช้งาน";
	var ws2 = "เราเลิกได้";
	var ws3 = "ความสำเร็จของเรา";
	var ws4 = "ยาของเรา";
	var ws5 = "การกด Like";
    
	/* add worksheet to workbook */
    wb.SheetNames.push(
        ws1,
        ws2,
        ws3,
        ws4,
        ws5
    );
    
	wb.Sheets[ws1] = sheet_from_array_of_arrays(userinfo_data);
	wb.Sheets[ws2] = sheet_from_array_of_arrays(canquit_data);
	wb.Sheets[ws3] = sheet_from_array_of_arrays(oursuccess_data);
    wb.Sheets[ws4] = sheet_from_array_of_arrays(ourpill_data);
    wb.Sheets[ws5] = sheet_from_array_of_arrays(like_data);
    
    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
    
    // Get current date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hour = today.getHours();
        hour = ("0" + hour).slice(-2);
    var minute = today.getMinutes();
        minute = ("0" + minute).slice(-2);
        

        today = dd + mm + yyyy;
        time = hour + minute;
    
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), data.filename + "_" + today + "_" + time + ".xlsx")
    
}
