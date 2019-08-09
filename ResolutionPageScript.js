var firebaseConfig = {
	apiKey: "AIzaSyA57nMPqm6bHkyBbm0x_zHeBhIB9vVNgHI",
	authDomain: "cox-routing-application.firebaseapp.com",
	databaseURL: "https://cox-routing-application.firebaseio.com",
	projectId: "cox-routing-application",
	storageBucket: "",
	messagingSenderId: "577935096428",
	appId: "1:577935096428:web:8f061e558a1ab0f8"
};


var messagesRef = new Firebase('https://cox-routing-application.firebaseio.com/GlobalValues/Resolution List');
var keys;
var resolutionString = "";
			
messagesRef.on("value", gotData, errData);

function errData(){
	console.log("Error");
	console.log(err);
}

function gotData(data) {

	var resolution = data.val();
	
	for(x = 0; x < resolution.length; x++){
		resolutionString = resolutionString+(x+1)+". "+resolution[x]+"<br>";
	}
	
	document.getElementById("destination").innerHTML = resolutionString;
	
}

function homePage(){
	window.location.href = "index.html";
}