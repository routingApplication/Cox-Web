var firebaseConfig = {
	apiKey: "AIzaSyA57nMPqm6bHkyBbm0x_zHeBhIB9vVNgHI",
	authDomain: "cox-routing-application.firebaseapp.com",
	databaseURL: "https://cox-routing-application.firebaseio.com",
	projectId: "cox-routing-application",
	storageBucket: "",
	messagingSenderId: "577935096428",
	appId: "1:577935096428:web:8f061e558a1ab0f8"
};

var messagesRef = new Firebase('https://cox-routing-application.firebaseio.com/GlobalValues/currentFeature');
var keys;

var feature;			

var teamList = []; 
var teamListName = [];
var tierTwoReasonList = [];

var tierTwoReasonCount = 0;
var teamCount = 0;
var criteriaCount = 0;
var scenerioCount = 0;
var noCount = 0;
var noCountMax = 0;
var teamMap = new Map();
var yesCount = 0;
messagesRef.on("value", gotDataFeature, errData);

function errData(){
	console.log("Error");
	console.log(err);
}

function gotDataFeature(data) {


	feature = data.val();
	document.getElementById("title").innerHTML = feature	
	
	var teamsPath = 'https://cox-routing-application.firebaseio.com/Features/'+feature;
	console.log(teamsPath);
	
	var firePath = new Firebase(teamsPath);
	
	firePath.on("value", function(snapshot){
	
		var obj = snapshot.val();
		var teams = Object.keys(obj);
		
		
		for(i = 0; i < teams.length; i++){
		
			teamListName.push(teams[i]);
			newPath = teamsPath+"/"+teams[i];
			var newFirePath = new Firebase(newPath);
			
			var ScenerioList=[];
			
			newFirePath.on("value", function(snapshot){
				var scenerioNameList = Object.keys(snapshot.val());

				
				for(x = 0; x < scenerioNameList.length; x++){
					
					var scenerioPath = newPath+"/"+scenerioNameList[x];
					var newFireScenerioPath = new Firebase(scenerioPath);
					
					newFireScenerioPath.on("value", function(snapshot){
						var scenerio = snapshot.val();
						ScenerioList.push(scenerio);
						//console.log("Reason:  "+scenerio);
				
					});
					
				}
					
			});

			teamMap.set(teams[i], ScenerioList);
			console.log(teamMap);
			setQuestion(teamCount, scenerioCount, criteriaCount);
		}
		
	}, function(error){
		console.log("Error: "+ error.code);
	}); 
	

}

function checkRadioInput(){

	var  input;
	yesInput = document.getElementById("yes").checked;
	noInput = document.getElementById("no").checked;
	
	var teamName = teamListName[teamCount];
	var scenerioList = teamMap.get(teamName);
	console.log("Here!!!!!!!!: "+scenerioList);
	var criteriaList = scenerioList[scenerioCount];
	
	
	if(yesInput){
		document.getElementById("yes").checked = false;
		if(teamListName[teamCount].localeCompare("Tier 2")!=0){
			
			criteriaCount++;
			yesCount++;
			
			if(yesCount == criteriaList.length){
				
				var fireGlobalValueDestinationPath = new Firebase('https://cox-routing-application.firebaseio.com/GlobalValues')
				fireGlobalValueDestinationPath.update({
					"destination": teamListName[teamCount]
				});
				window.location.href = "DestinationPage.html";
				
			}
			else{
				setQuestion(teamCount, scenerioCount, criteriaCount);
				
			}
		}
		else{
			
			var fireGlobalValueDestinationPath = new Firebase('https://cox-routing-application.firebaseio.com/GlobalValues')
			fireGlobalValueDestinationPath.update({
				"Resolution List": scenerioList[scenerioCount].Resolution
			});
			window.location.href = "ResolutionPage.html";
		}
		
	
	}
	
	else if(noInput){
		
		yesCount = 0;
		criteriaCount = 0;
		scenerioCount++;
		document.getElementById("no").checked = false;
		if(scenerioCount== scenerioList.length){
			
			scenerioCount=0;
			teamCount++;
			
			if(teamCount == teamMap.size){
				var fireGlobalValueDestinationPath = new Firebase('https://cox-routing-application.firebaseio.com/GlobalValues')
				fireGlobalValueDestinationPath.update({
					"destination": "Unable to Locate Result. Please Try Again"
				});
				window.location.href = "DestinationPage.html";
				
			}
		}
		
		setQuestion(teamCount, scenerioCount, criteriaCount);
		
	}
	
}

function setQuestion(tCount, sCount, cCount){
	
	var teamName = teamListName[tCount];
	var scenerioList = teamMap.get(teamName);

	if(teamListName[tCount].localeCompare("Tier 2")==0){
		
		var scenerioObject = scenerioList[sCount];
		var criteria = scenerioObject.Question;
		document.getElementById("question").innerHTML = criteria;
	}
	else{
		var criteriaList = scenerioList[sCount];
		var criteria = criteriaList[cCount];
		document.getElementById("question").innerHTML = criteria;
	}
	
}







			