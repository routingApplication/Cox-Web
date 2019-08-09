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
//var teamMenuRef = new Firebase('https://cox-routing-application.firebaseio.com/GlobalValues/TeamDropDownMenu');
var keys;
var criteriaList = [];
var resolutionList=[];
var count = 0
var teamNameInput = "BIS Team";
var teamsList=[];
var isOther=false;

			
messagesRef.on("value", gotData, errData);

function loadPage(){
	var x = document.getElementById("newFeatureClass");
	x.style.display = "none";	
	var z = document.getElementById("otherTeam");
	z.style.display = "none";
	document.getElementById("Tier2").style.display="none";
	document.getElementById("teamNameInput").style.visibility="hidden";
	document.getElementById("chooseTeamBtns").style.display="block";
	document.getElementById("teamNameInput").value="";
	criteriaList = [];
	resolutionList=[];
	count = 0;
	isOther =false;
}

var teamMenuRef = new Firebase('https://cox-routing-application.firebaseio.com/GlobalValues/TeamDropDownMenu');
teamMenuRef.on("value", gotDataMenu, errData);

function gotDataMenu(data) {
	
	var teams = data.val();
	teamsList=teams;
				
	console.log(teams)
	
	var selectGroup = document.getElementById("teamDropDown");
	
	while (selectGroup.firstChild) {
		selectGroup.removeChild(selectGroup.firstChild);
	}
	
	for (var n = 0; n < teams.length; n++) {
		
		var team = teams[n];
		var option = document.createElement("OPTION");
		option.text = team;
		option.value= team;
		//option.name = "selectCheck";
		selectGroup.add(option);
			
	}
		//var team = teams[n];
		var option = document.createElement("OPTION");
		option.text = "Other";
		option.value= "Other";
		//option.name = "selectCheck";
		selectGroup.add(option);
		teamNameInput = teams[0];
	
}
		
function gotData(data) {
	
	var features = data.val();
	featureKeys = Object.keys(features);
				
	console.log(featureKeys)
	
	var selectGroup = document.getElementById("featureList");
	
	while (selectGroup.firstChild) {
		selectGroup.removeChild(selectGroup.firstChild);
	}
	
	for (var i = 0; i < featureKeys.length; i++) {
		

		var feature = featureKeys[i];
		var option = document.createElement("OPTION");
		option.text = feature;
		option.name = "selectCheck";
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

function setTeamPage(){
	count = 0;
	var selectGroup = document.getElementById("featureList");
	var opt  = getSelectedOption(selectGroup);
	console.log(opt.value);
	feature = opt.value; 
	

	var path = new Firebase('https://cox-routing-application.firebaseio.com/GlobalValues');
	path.update({
		editPageCurrentFeature: feature
	});
	
	window.location.href = "TeamPage.html";

}


function addFeature(){
	
	var x = document.getElementById("newFeatureClass");
	if(x.style.display === "none"){

		x.style.display = "block"
		document.getElementById("Tier2").style.display="none";
		document.getElementById("otherTeam").style.display="none";
		document.getElementById("chooseTeamBtns").style.display="block";
		
	}else{
		x.style.display = "none";
		loadPage();
	}
	
	var teamSectionDiv = document.getElementById("pSection");
	while (teamSectionDiv.firstChild) {
		teamSectionDiv.removeChild(teamSectionDiv.firstChild);
	}
	
	var teamSectionDiv = document.getElementById("resolutionSection");
	while (teamSectionDiv.firstChild) {
		teamSectionDiv.removeChild(teamSectionDiv.firstChild);
	}
	
	document.getElementById("featureName").value = "";
	document.getElementById("teamCriteria").value = "";

}


function addCriteria(){
	count++;
	var criteria = document.getElementById("teamCriteria");
	var criteriaInput = criteria.value;
	criteria.value = "";
	criteriaList.push(criteriaInput);
	
	//Html Code
	
	var pTag = document.createElement("p3");
	var textNode = document.createTextNode(count+". "+criteriaInput);
	pTag.appendChild(textNode);
	
	document.getElementById("pSection").appendChild(pTag);
	document.getElementById("pSection").appendChild(document.createElement("br"));
	//End of Html Code
}

function addResolution(){
	count++;
	var resolution = document.getElementById("resolutionStep");
	var resolutionInput = resolution.value;
	resolution.value = "";
	resolutionList.push(resolutionInput);
	
	//Html Code
	
	var pTag = document.createElement("p3");
	var textNode = document.createTextNode(count+". "+resolutionInput);
	pTag.appendChild(textNode);
	
	document.getElementById("resolutionSection").appendChild(pTag);
	document.getElementById("resolutionSection").appendChild(document.createElement("br"));
	//End of Html Code
	
}

function submitOtherFeature(){
	
	var featureNameInput = document.getElementById("featureName").value;
	//var teamNameInput = document.getElementById("featureTeam").value
	var teamName = "";
	
	if(isOther){
		teamName = document.getElementById("teamNameInput").value;
		var position = teamsList.length - 1 
		var newTeamRef = new Firebase('https://cox-routing-application.firebaseio.com/GlobalValues/TeamDropDownMenu'+"/"+position);
		newTeamRef.set(teamName);
	}
	else{
		teamName = teamNameInput;
			
	}
	
	console.log(teamName);
	
	if(featureNameInput.length == 0){
		alert("Please add the new feature Name");
	}	
	else if(teamName.length == 0){
		alert("Please add a team name for the new Feature Created");
	}
	else{
		
		var newFirePath = 'https://cox-routing-application.firebaseio.com/Features'+"/"+featureNameInput+"/"+teamName+"/Scenario 1";
		var newRef = new Firebase(newFirePath)
		
		newRef.set(criteriaList);
	
		loadPage();
		messagesRef.on("value", gotData, errData);
		document.getElementById("featureName").value = "";
		document.getElementById("featureTeam").value = "";
		document.getElementById("teamNameInput").value = "";
	}
	
}

function submitTier2Feature(){
	
	var featureNameInput = document.getElementById("featureName").value;
	var tierScenerio = document.getElementById("tierScenerio").value;
	
	if(tierScenerio.length == 0){
		alert("Please the a Scenerio for Tier 2");
	}	
	else if(resolutionList.length == 0){
		alert("Please enter atleast one Resolution");
	}
	else{
		var newFirePath = 'https://cox-routing-application.firebaseio.com/Features'+"/"+featureNameInput+"/Tier 2"+"/"+"Scenario 1"+"/Resolution";
		var newRef = new Firebase(newFirePath);
		newRef.set(resolutionList);
		
		newFirePath = 'https://cox-routing-application.firebaseio.com/Features'+"/"+featureNameInput+"/Tier 2"+"/"+"Scenario 1"+"/Question";
		newRef = new Firebase(newFirePath);
		newRef.set(tierScenerio);
	
		loadPage();
		messagesRef.on("value", gotData, errData);
		document.getElementById("featureName").value = "";
		document.getElementById("tierScenerio").value = "";
	}
	
}

function deleteFeature(){
	
	var selectGroup = document.getElementById("featureList");
	var opt  = getSelectedOption(selectGroup);
	var featureName = opt.value;
	

	if(opt.selected === true){
		
		var message = "Are you sure you want to delete "+ featureName+" Feature?";
		var r = confirm(message);
		
		if (r == true) {
		  
			var newFirePath = 'https://cox-routing-application.firebaseio.com/Features'+"/"+featureName;
			var newRef = new Firebase(newFirePath)
			
			newRef.set(null);
			console.log("Here!!"+opt.selected);
		
			for (var a = 0; a < selectGroup.length; a++){
			
			selectGroup.options[a].selected = false;
			console.log("Here!!!!!!!"+selectGroup.options[a].selected);

			}
		
			messagesRef.on("value", gotData, errData);
			document.getElementById("featureName").value = "";
			document.getElementById("featureTeam").value = "";  
		  
		  
		}

	}
	
}

function tierBtnFunction(){
	
	document.getElementById("chooseTeamBtns").style.display="none";
	document.getElementById("Tier2").style.display="block";
}

function otherTeamBtnFunction(){
	document.getElementById("chooseTeamBtns").style.display="none";
	document.getElementById("otherTeam").style.display="block";
	
}
function checkAlert(evt) {
	
	if(evt.target.value === "Other"){

		isOther = true;
		document.getElementById("teamNameInput").style.visibility="visible";

	}
	else{
		isOther = false;
		document.getElementById("teamNameInput").value = "";
		document.getElementById("teamNameInput").style.visibility="hidden";
		for(var c = 0; c < teamsList.length; c++){
			
			if (evt.target.value === teamsList[c]) {
				teamNameInput = teamsList[c];
			}
		}
	}
  
}













