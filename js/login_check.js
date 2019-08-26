firebase.auth().onAuthStateChanged(function(user) {
	winLoc = String(window.location).split("/")
	winLoc = winLoc[winLoc.length-1]
    if (user) { // User signed in
		if(winLoc=="index.html"){
			window.location = "form.html";
		}
        var userEmail = user.email;
        $("#account").html(userEmail)
    }
    else {
		if(winLoc!="index.html"){
			window.location = "index.html";
		}
	}
})

function signOut(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
}
