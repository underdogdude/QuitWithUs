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
			}
			
			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
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


function save(username){

	/* original data */
    var userinfo_data = [
        ["หัวข้อ"],
        ["วันที่เริ่มเข้าใช้งาน" ," วัน", "เดือน", "ปี"],
        ["ชื่อที่ใช้สร้างบัญชี"],
        ["เลิกบุหรี่เพื่อ"],
        ["เพศ"],
        ["อายุ", "ปี"],
        ["โรคประจำตัว (มี/ ไม่มี)"],
        ["(ถ้ามี) โรคประจำตัว"],
        ["อายุที่เริ่มสูบบุหรี่", "ปี"],
        ["จำนวนบุหรี่ที่สูบต่อวัน", "มวน"],
        ["เวลาที่สูบบุหรี่มวนแรก"],
        ["ความต้องการเลิกสูบบุหรี่"],
    ];

    var canquit_data = [
        ["หัวข้อ"],
        ["สูบบุหรี่มาแล้ว" ,"มวน"],
        ["เสียเงินให้บุหรี่" ,"บาท"],
        ["ชีวิตที่สั้นลงจากการสูบบุหรี่" ,"ปี", "วัน"],
        ["สาเหตุการสูบบุหรี่" ,"มี7แบบ"],
        ["ระดับการติดสารนิโคตินในบุหรี่" ,"3ระดับ"],
        ["เวลาที่กำหนดเลิกบุหรี่ครั้งล่าสุด" ," วัน", "เดือน", "ปี"],
        ["จำนวนครั้งที่เคยกำหนดวันเลิกบุหรี่นับรวมครั้งล่าสุดด้วย" ],
        ["เลิกสูบบุหรี่ได้" ,"มวน"],
        ["มีเงินเก็บเพิ่มขึ้น" ,"บาท"],
        ["มีชีวิตยืนยาวขึ้น" ,"วัน", "ชั่วโมง"],
        ["รายการรางวัลในการเก็บเงิน" ],
        ["มูลค่ารางวัล", "บาท" ]
    ];

    var oursuccess_data = [
        ["หัวข้อ"],
        ["วันที่บันทึก" ," วัน", "เดือน", "ปี"],
        ["ความอยากบุหรี่(1-10)"],
        ["ความรู้สึก"],
        ["สูบบุหรี่หรือไม่ (ไม่สูบ/ สูบ)"],
        ["ข้อความความสำเร็จของเรา"],
        ["(ถ้าสูบ)จำนวนบุหรี่ที่สูบ"],
        ["(ถ้าสูบ)กิจกรรมที่ทำขณะสูบบุหรี่"],
        ["(ถ้าสูบ)บุคคลที่อยู่ด้วยขณะสูบบุหรี่"],
        ["ข้อความเราเรียนรู้"],
        ["จำนวนวันในกราฟความสำเร็จของเรา"],
    ];

    var ourpill_data = [
        ["หัวข้อ"],
        ["ชื่อยา"],
        ["ขนาดยา"],
        ["ครั้งละ"],
        ["วิธีใช้"],
        ["เวลาใช้ยา"],
        ["ความถี่ในการใช้ยา"],
        ["เริ่มใช้ยา"],
        ["ถึงวันที่"],
    ];

    var like_data = [
        ["หัวข้อ", "สถิติการกด Like"],
        ["บทความต่างๆ หน้าเราแนะนำ"],
        ["บทความต่างๆ หน้าให้เราช่วย"],
        ["คำตอบต่างๆ หน้าพูดคุยกับเรา"],
        ["ข้อความจูงใจให้เลิกบุหรี่"],
        ["ข้อความให้กำลังใจในการเลิกบุหรี่"],
        ["ข้อความให้กำลังใจเมื่ออยากสูบบุหรี่"],
        ["ข้อความเสริมกำลังใจเมื่อเผลอสูบบุหรี่"],
    ]

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
	saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), username + ".xlsx")
}