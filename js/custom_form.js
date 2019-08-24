remindTime=""
kolomR=""
$("form").submit(function(){
    $("#loadingUserHead").fadeIn(250, function() {
        $(this).removeClass("hide");
    })
    var user = firebase.auth().currentUser;
    var uid = user.uid
    var idReminder = $("#id-remainder").val();
    var nomorTujuan = $("#nomor-tujuan").val();
    var waktu = $("#waktu").val();
    var linkSs = $("#link-ss").val();
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
        "waktu": waktu
    })

    setTimeout(() => {
        window.location.href="table.html"
    }, 2000);
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

