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
var messagesRef = new Firebase('https://cox-routing-application.firebaseio.com/Features/');
var path = 'https://cox-routing-application.firebaseio.com/Features';
var keys;
var featureList = [];
var teamMap = new Map();
var teamListName = [];
			
messagesRef.on("value", gotData, errData);
			
function gotData(data) {

	feature = data.val();
	
	var features = Object.keys(data.val());
	
	for(a = 0; a < features.length; a++){
		
		var featureCard = document.createElement("div");
		featureCard.className = "card";
		
		var featureTitle = document.createElement("h1");
		featureTitle.appendChild(document.createTextNode(features[a]));
		
		featureCard.appendChild(featureTitle);
	
		var teamsPath = 'https://cox-routing-application.firebaseio.com/Features/'+features[a];
		
		var teamFirePath = new Firebase(teamsPath);
		
		teamFirePath.on("value", function(snapshot){
		
			var obj = snapshot.val();
			var teams = Object.keys(obj);
			
			for(i = 0; i < teams.length; i++){
				//scenerioList = teamMap.get(teamName);
				
				var teamCard = document.createElement("div");
				teamCard.className = "card2";
				
				var teamTitle = document.createElement("h1");
				var titleTextNode = document.createTextNode(teams[i]);
				teamTitle.appendChild(titleTextNode);
				teamCard.appendChild(teamTitle);
				
				teamListName.push(teams[i]);
				var newPath = teamsPath+"/"+teams[i];
				var newFirePath = new Firebase(newPath);
				
				newFirePath.on("value", function(snapshot){
					var scenerioNameList = Object.keys(snapshot.val());

					for(x = 0; x < scenerioNameList.length; x++){
						
						var scenerioPath = newPath+"/"+scenerioNameList[x];
						var newFireScenerioPath = new Firebase(scenerioPath);
						
						newFireScenerioPath.on("value", function(snapshot){
							var scenerio = snapshot.val();
							//console.log(scenerio);
							if((teams[i].localeCompare("Tier 2"))!=0){
								teamCard.appendChild(createTeamCard(scenerioNameList[x], scenerio));
							}
							else{
								teamCard.appendChild(createTeamTier2Card(scenerioNameList[x], scenerio));
								
							}

					
						});
						
					}
						
				});
				
				featureCard.appendChild(teamCard);
				featureCard.appendChild(document.createElement("br"));
				
			}
			document.getElementById("cardView").appendChild(featureCard);
			document.getElementById("cardView").appendChild(document.createElement("br"));

			//createCards();
			
		}, function(error){
			console.log("Error: "+ error.code);
		}); 
	
	}
	
}

function createTeamCard(scenarioName, scenerioList){
	
	var section = document.createElement("div");
	var scenerioHeading = document.createElement("h2");
	scenerioHeading.style.fontWeight="500";
	var scenerioHeadingTextNode = document.createTextNode(scenarioName+":");
	scenerioHeading.appendChild(scenerioHeadingTextNode);
	section.appendChild(scenerioHeading);
	
	var criteriaList = scenerioList;
	criteriaPara = document.createElement("p");
	
	for(d = 0; d < scenerioList.length; d++){
		var criteriaTextNode = document.createTextNode((d+1)+". "+criteriaList[d]);
		criteriaPara.appendChild(criteriaTextNode);
		criteriaPara.appendChild(document.createElement("br"));
	}
	section.appendChild(criteriaPara);
	return section;

}

function createTeamTier2Card(scenarioName, scenerioObj){

	var section = document.createElement("div");
	
	var scenerioHeading = document.createElement("h2");
	var scenerioHeadingTextNode = document.createTextNode(scenarioName+": "+scenerioObj.Question );
	scenerioHeading.style.fontWeight="500";
	scenerioHeading.appendChild(scenerioHeadingTextNode);
	section.appendChild(scenerioHeading);
	
	var resolutionHeading = document.createElement("h3");
	resolutionHeading.appendChild(document.createTextNode("Resolution: "));
	section.appendChild(resolutionHeading);
	
	var resolutionList = scenerioObj.Resolution;
	resolutionPara = document.createElement("p");
	
	for(j = 0; j < resolutionList.length; j++){
		var resolutionTextNode = document.createTextNode((j+1)+". "+resolutionList[j]);
		//console.log(resolutionLi)
		resolutionPara.appendChild(resolutionTextNode);
		resolutionPara.appendChild(document.createElement("br"));
	}
	section.appendChild(resolutionPara);
	return section;

}

function errData(){
	console.log("Error");
	console.log(err);
}


function openNav() {
  document.getElementById("mySideNav").style.width = "12%";
}

function closeNav() {
  document.getElementById("mySideNav").style.width = "0";
}






