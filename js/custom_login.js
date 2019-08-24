document.onkeypress = keyPress;

function keyPress(e){
  var x = e || window.event;
  var key = (x.keyCode || x.which);
  if(key == 13 || key == 3){
   //  myFunc1();
   $("#btn-login").click();
  }
}
$("#btn-login").click(function(e){
    const email = $("#email").val();
    const pass =$("#pass").val();
    const auth = firebase.auth()
    $("#loadingUserHead").fadeIn(250, function() {
        $(this).removeClass("hide");
    })
    auth.signInWithEmailAndPassword(email,pass);
    setTimeout(() => {
        window.location.href="form.html"
    }, 2000);
    
})

   
