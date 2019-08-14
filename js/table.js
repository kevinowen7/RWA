//define table to work with jquery datatables
var table = $('#tableSpread').DataTable({
	"aLengthMenu": [[10, 20, -1], [10, 20, "All"]],
	"iDisplayLength": 10,
	"columnDefs": [
	{
		targets: 0,
		width: "20%",
	},
	{
		targets: 1,
		width: "20%",
	},
	{
		targets: -1,
		width: "5%",
	},
	]
});

function send(){
	$("#send").prop("disabled",true)
		.removeClass("btn-success")
		.addClass("btn");
	$("#loader").fadeIn(250, function() {
		$(this).show();
	})
	// firebase auth
	var user = firebase.auth().currentUser;
	var uid = user.uid;
	var email = user.email;
	
	//membangunkan heroku
	var xhr0 = new XMLHttpRequest();
	xhr0.open('GET', "https://send-remainder-wa.herokuapp.com", true);
	xhr0.send();
	xhr0.onreadystatechange = processRequest;
	 //kondisi ketika webhook selesai di buka
	function processRequest(e) {
		if (xhr0.readyState == 4) {
			//mengirim email
			var xhr = new XMLHttpRequest();
			xhr.open('GET', "https://send-remainder-wa.herokuapp.com/webhook?db="+uid, true);
			xhr.send();
		 
			xhr.onreadystatechange = processRequest;
			 //kondisi ketika webhook selesai di buka
			function processRequest(e) {
				if (xhr.readyState == 4) {
					//reload
					window.location.href="table.html"
				}
			}
		}
	}
	
}

function deleteID(refCode){
	// firebase auth
	var user = firebase.auth().currentUser;
	var uid = user.uid;
	var email = user.email;
	
	const data = firebase.database().ref("data").child(uid+"/"+refCode);
	data.once('value', function(snapshot) {
		var r = confirm("Are you sure want to delete "+refCode+" ?");
		if (r == true) {
			data.set({"a":null});
			window.location.reload();
		}
	});
}


const data = firebase.database().ref("data");
data.once('child_added', function(snapshot) {
	var user = firebase.auth().currentUser;
	var uidc = user.uid;
	const data1 = firebase.database().ref("data/"+uidc);
	data1.on('child_added', function(snapshot) {
		var id = String(snapshot.key);
		var link_ss = snapshot.child("link_ss").val().split("/d/").join("/d/</br>");;
		var nomor_tujuan = snapshot.child("nomor_tujuan").val();
		var stat = snapshot.child("stat").val();
		if (stat==null){
			stat="Not Active"
		} else if(stat=="on"){
			stat="<span class='status--process'>Active</span>"
		} else {
			stat="<span class='status--denied'>None</span>"
		}
		var remind_time = snapshot.child("remind_time").val().split("//").join(" , ");
		
		var waktu = snapshot.child("waktu").val();
		table.row.add([id,link_ss,remind_time,waktu,stat,"<div class='table-data-feature'><button class='item' data-toggle='tooltip' data-placement='top' title='Delete' onclick=deleteID("+id+")><i class='zmdi zmdi-delete'></i></button></div>"]);	
		table.draw();
		$("table tr").hide();
		$("table tr").each(function(index){
			$(this).delay(index*100).show(150);
		});
	});
});