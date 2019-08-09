var firebaseConfig = {
	apiKey: "AIzaSyA57nMPqm6bHkyBbm0x_zHeBhIB9vVNgHI",
	authDomain: "cox-routing-application.firebaseapp.com",
	databaseURL: "https://cox-routing-application.firebaseio.com",
	projectId: "cox-routing-application",
	storageBucket: "",
	messagingSenderId: "577935096428",
	appId: "1:577935096428:web:8f061e558a1ab0f8"
};
// Initialize Firebase
		  
firebase.initializeApp(firebaseConfig);
var messagesRef = new Firebase('https://cox-routing-application.firebaseio.com/Features');
var keys;
//var selectGroup = document.getElementById("featureSelectGroup");

			
messagesRef.on("value", gotData, errData);
			
function gotData(data) {
	
	//var selectGroup = document.getElementById("featureSelectGroup");

	var features = data.val();
	featureKeys = Object.keys(features);
				
	console.log(featureKeys)
			  
	for (var i = 0; i < featureKeys.length; i++) {
		var selectGroup = document.getElementById("featureSelectGroup");

		var feature = featureKeys[i];
		var option = document.createElement("OPTION");
		option.text = feature;
		selectGroup.add(option);
			
	}
			
}

function errData(){
	console.log("Error");
	console.log(err);
}



function getSelectedOption(sel) {
    var opt;
    for ( var i = 0, len = sel.options.length; i < len; i++ ) {
        opt = sel.options[i];
        if ( opt.selected === true ) {
			break;
        }
    }
    return opt;
}


var feature;

function setRoutingPage(){
	var selectGroup = document.getElementById("featureSelectGroup");
	var opt  = getSelectedOption(selectGroup);
	console.log(opt.value);
	feature = opt.value; 
	window.location.href = "RoutePage.html";
	
	document.getElementById("title").innerHTML = feature + "Feature";

	var path = new Firebase('https://cox-routing-application.firebaseio.com/GlobalValues');
	path.update({
		"currentFeature": feature
	});

}