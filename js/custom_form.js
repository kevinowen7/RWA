function thisDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!

	var yyyy = today.getFullYear();
	if (dd < 10) {
	  dd = '0' + dd;
	} 
	if (mm < 10) {
	  mm = '0' + mm;
	} 
	var today = mm + '/' + dd + '/' + yyyy;
	return today;
}

remindTime=""
kolomR=""
$("form").submit(function(){
	
    var linkSs = $("#link-ss").val();
	//validasi spreadsheet link
	var validasiLink = linkSs.split("docs.google.com/spreadsheets/d/").length
	if (validasiLink==2){
		
		var nomorTujuan = $("#nomor-tujuan").val();
		var jumlahDigit = nomorTujuan.length
		//validasi nomor tujuan
		var validasiNomor = nomorTujuan.split("628").length
		if (validasiNomor==2 && jumlahDigit<=13 && jumlahDigit>=9){
			$("#loadingUserHead").fadeIn(250, function() {
				$(this).removeClass("hide");
			})
			var user = firebase.auth().currentUser;
			var uid = user.uid
			var idReminder = $("#id-remainder").val();
			var waktu = $("#waktu").val();
			$("input[name='inline-checkbox']:checked").each(function(){
				remindTime += $(this).val()+"//"
			});
			
			$("input[name='inline-checkbox1']:checked").each(function(){
				kolomR += $(this).val()+"//"
			});
			usRef = firebase.database().ref("data").child(uid+"/"+idReminder);
			
			usRef.update({
				"nomor_tujuan" : nomorTujuan,
				"link_ss": linkSs,
				"remind_time": remindTime,
				"kolom": kolomR,
				"waktu": waktu,
				"reminderDate" : thisDate(),
				"reminderTime" :9
			})
			
			window.location.href="table.html"
		} else {
			alert("Masukan Nomor Yang Valid dengan Format 628xxxxxxx")
		}
	} else {
		alert("Masukan Link Spread Yang Valid")
	}
});


const listCode=[];
const data = firebase.database().ref("data");
data.once('child_added', function(snapshot) {
	var user = firebase.auth().currentUser;
	var uid = user.uid
	data.child(uid).on('child_added', function(snapshot) {
		listCode.push(snapshot.key);
	});
});

$('#id-remainder').on('keypress', function(e) {
	if (e.which == 32)
		return false;
});

$('#link-ss').on('change keypress', function(e) {
	$('#link-ss').val($('#link-ss').val().split(" ").join(""));
});

//check code ke firebase
$('#id-remainder').on('keyup click', function () {
	for (var i=0;i<listCode.length;i++){
		$('#checkerData').empty();
		if ($("#id-remainder").val()==listCode[i] || $("#id-remainder").val()==""){
			var c = `<i class="fa fa-times-circle" style="color:red"></i><span> data sudah di gunakan</span>`
			$('#checkerData').append(c);
			$("#btn-submit").prop("disabled",true)
						.removeClass("btn-success")
						.addClass("btn-black");
			break
		} else {
			var c = `<i class="fa fa-check-circle" style="color:green"></i>`
			$('#checkerData').append(c);
			$("#btn-submit").prop("disabled",false)
				.removeClass("btn-success")
				.addClass("btn-black");
		}
	}
});

