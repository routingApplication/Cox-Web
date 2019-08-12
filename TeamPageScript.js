var firebaseConfig = {
	apiKey: "AIzaSyA57nMPqm6bHkyBbm0x_zHeBhIB9vVNgHI",
	authDomain: "cox-routing-application.firebaseapp.com",
	databaseURL: "https://cox-routing-application.firebaseio.com",
	projectId: "cox-routing-application",
	storageBucket: "",
	messagingSenderId: "577935096428",
	appId: "1:577935096428:web:8f061e558a1ab0f8"
};

var messagesRef = new Firebase('https://cox-routing-application.firebaseio.com/GlobalValues/editPageCurrentFeature');
var keys;

var feature;			

var teamList = []; 
var teamListName = [];
var tierTwoReasonList = [];

var teamMap = new Map();
var display = true;
var save = true;
var deletePosition = 0;
var dCount;
var resCount = 0;
var criCount = 0;
var newSceneArray=[];
var isOther = false;
var teamOptionName;

function loadPage(){
	document.getElementById("otherTeam").style.display = "none";
	document.getElementById("Tier2").style.display="none";
	document.getElementById("teamNameInput").style.visibility="hidden";
	resCount=0;
	criCount=0;
	newSceneArray=[];
	newResolutionArray=[];
	isOther = false;

	var resolutionSectionHTML = document.getElementById("resolutionSection");
	while (resolutionSectionHTML.firstChild) {
		resolutionSectionHTML.removeChild(resolutionSectionHTML.firstChild);
	}
	
	var criteriaSectionHTML = document.getElementById("pSection")
	while (criteriaSectionHTML.firstChild) {
		criteriaSectionHTML.removeChild(criteriaSectionHTML.firstChild);
	}

}

var teamMenuRef = new Firebase('https://cox-routing-application.firebaseio.com/GlobalValues/TeamDropDownMenu');
teamMenuRef.on("value", gotDataMenu, errData);
var teamsMenuList = [];
var teamsMenu = [];
var index = 0;
function gotDataMenu(data) {
	
	teamsMenu = data.val();
	teamsMenuList=teamsMenu;
	index = teamsMenu.length - 1;
				
	console.log(teamsMenu);
	
	var selectGroup = document.getElementById("teamDropDown");
	
	while (selectGroup.firstChild) {
		selectGroup.removeChild(selectGroup.firstChild);
	}
	
	for (var n = 0; n < teamsMenu.length; n++) {
		
		var team = teamsMenu[n];
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
		teamNameInput = teamsMenu[0];
	
}

messagesRef.on("value", gotDataFeature, errData);

function errData(){
	console.log("Error");
	console.log(err);
}

function gotDataFeature(data) {

	feature = data.val();
	document.getElementById("heading").innerHTML = feature;	
	
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
			
		}
		
		if(display){
			display=false;
			displayTeams();
		}
		
	}, function(error){
		console.log("Error: "+ error.code);
	}); 
	
}

function displayTeams(){
	var selectGroup = document.getElementById("cardView");
	while (selectGroup.firstChild) {
		selectGroup.removeChild(selectGroup.firstChild);
	}

	console.log("Card is being created");
	for(a = 0; a < teamListName.length; a++){
		
		var teamSection = createTeamCard(teamListName[a]);
		
		var teamScenerioList = teamMap.get(teamListName[a])
		
		for(c = 0; c < teamScenerioList.length; c++){
			var sceneName = "Scenario "+(c+1);
			if((teamListName[a].localeCompare("Tier 2"))!=0){
				teamSection.append(createSceneCard(teamScenerioList[c],sceneName, teamListName[a] ));
			}
			else{
				teamSection.append(createTier2SceneCard(teamScenerioList[c],sceneName, teamListName[a] ));
			}
			var sceneDivider = document.createElement("br");
			teamSection.append(sceneDivider);
		}
		
		document.getElementById("cardView").appendChild(teamSection);
		
	}
	
}

function createTeamCard(teamName){
	
	var teamSection = document.createElement("div");
	teamSection.className = "card";
	teamSection.id=teamName;
	
	var teamTitle = document.createElement("h1");
	var teamTitleTextNode = document.createTextNode(teamName);
	teamTitle.appendChild(teamTitleTextNode);
	teamTitle.className = "title";
	
	var topSection = document.createElement("div");
	topSection.className = "topSection";
	topSection.appendChild(teamTitle);
	topSection.appendChild(deleteTeamBtn(teamName));
	
	teamSection.appendChild(topSection);
	var teamDivider = document.createElement("br");
	teamSection.append(teamDivider);
	
	return teamSection;

}

function createSceneCard(sceneCriteria, sceneName, teamName){
	
	var sceneSection= document.createElement("div");
	sceneSection.className = "card2";
	sceneSection.id=sceneName;
	
	var sceneTitle = document.createElement("h2");
	sceneTitleTextNode = document.createTextNode(sceneName);
	sceneTitle.appendChild(sceneTitleTextNode);
	sceneSection.appendChild(sceneTitle);

	var criteriaHeading = document.createElement("h3");
	criteriaHeadingTextNode = document.createTextNode("Criteria: ");
	criteriaHeading.appendChild(criteriaHeadingTextNode);
	sceneSection.appendChild(criteriaHeading);
	
	var criteriaSectionList = document.createElement("div");
	criteriaSectionList.id = teamName+" "+ sceneName;

	for(b = 0; b < sceneCriteria.length; b++ ){
		var criteria = sceneCriteria[b];
		var textArea = document.createElement("textarea");
		textArea.value = criteria;
		textArea.rows = "2";
		textArea.cols = "50";
		textArea.name = teamName+" "+ sceneName;
		textArea.className = "deleteTextArea";
		
		
		//Displays the TextArea and delete Button on the same row. 
		var deleteTextAreaDiv = document.createElement("div");
		deleteTextAreaDiv.className = "deleteSceneDiv";
		deleteTextAreaDiv.id=(teamName+" "+ sceneName)+" "+b;
	
		deleteTextAreaDiv.appendChild(textArea);
		deleteTextAreaDiv.appendChild(createDeleteBtn(teamName+" "+ sceneName, b, teamName, sceneName));
		deleteTextAreaDiv.appendChild(document.createElement("br"));
		deleteTextAreaDiv.appendChild(document.createElement("br"));
		//
		criteriaSectionList.appendChild(deleteTextAreaDiv);

	}
	sceneSection.appendChild(criteriaSectionList);
	sceneSection.appendChild(document.createElement("br"));
	sceneSection.appendChild(addSceneCriteriaBtn(teamName+" "+ sceneName, teamName, sceneName));
	sceneSection.appendChild(saveSceneCriteriaBtn(teamName+" "+ sceneName, teamName, sceneName));
	sceneSection.appendChild(createDeleteSceneBtn(teamName+" "+ sceneName,teamName, sceneName, c))
	
	return sceneSection;
	
}

function addSceneCriteriaBtn(sectionId, teamName, sceneName){
	
	var addBtn = document.createElement("button");
	var textNode = document.createTextNode("Add");
	
	addBtn.appendChild(textNode);
	addBtn.className = "button";
	
	addBtn.addEventListener("click", function(){
		var criteriaSection = document.getElementById(sectionId);
		var newTextArea = document.createElement("textarea");
		newTextArea.value ="";
		newTextArea.rows = "2";
		newTextArea.cols = "50";
		newTextArea.name = sectionId;
		newTextArea.className = "deleteTextArea";
		
		var pos = document.getElementsByName(sectionId).length;		
		var deleteTextAreaDiv = document.createElement("div");
		deleteTextAreaDiv.className = "deleteSceneDiv";
		deleteTextAreaDiv.id=sectionId+" "+pos;

		deleteTextAreaDiv.appendChild(newTextArea);

		console.log(pos);
		deleteTextAreaDiv.appendChild(createDeleteBtn(sectionId, (pos), teamName, sceneName));
		deleteTextAreaDiv.appendChild(document.createElement("br"));
		deleteTextAreaDiv.appendChild(document.createElement("br"));

		criteriaSection.appendChild(deleteTextAreaDiv);
		
	});
	
	return addBtn;
}

function saveSceneCriteriaBtn(sectionId, teamName, teamSectionName){
	display = false;
	var saveBtn = document.createElement("button");
	var textNode = document.createTextNode("Save");
	
	saveBtn.appendChild(textNode);
	saveBtn.className = "button";
	
	saveBtn.addEventListener("click", function(){
		var criteriaList = getTextAreaElements(sectionId);
		
		var newCriteriaPath = 'https://cox-routing-application.firebaseio.com/Features/'+feature+"/"+teamName+"/"+teamSectionName;
		var newCriteriaRef = new Firebase(newCriteriaPath);
		newCriteriaRef.set(criteriaList);

	});
	return saveBtn;
	
}

function createTier2SceneCard(scenerio, sceneName, teamName){
	
	var sceneSection= document.createElement("div");
	sceneSection.className = "card2";
	
	var sceneTitle = document.createElement("p2");
	sceneTitleTextNode = document.createTextNode(sceneName+": "+scenerio.Question);
	sceneTitle.appendChild(sceneTitleTextNode);
	var sceneTitleHolderId = "Scene Question Holder "+teamName+" "+ sceneName;
	sceneTitle.id=sceneTitleHolderId;
	sceneSection.appendChild(sceneTitle); 
	
	sceneSection.appendChild(editScenerioBtnFunction(sceneName, sceneTitleHolderId, scenerio.Question, sceneSection));

	sceneSection.appendChild(document.createElement("br"));
	
	var resolutionHeading = document.createElement("p3");
	resolutionHeadingTextNode = document.createTextNode("Resolution: ");
	resolutionHeading.appendChild(resolutionHeadingTextNode);
	sceneSection.appendChild(resolutionHeading);
	
	var resolutionSectionList = document.createElement("div");
	resolutionSectionList.id = teamName+" "+ sceneName;
	
	var resolutions = scenerio.Resolution;
	dCount=0;
	for(d = 0; d < resolutions.length; d++ ){
		var resolution = resolutions[d];
		var textArea = document.createElement("textarea");
		textArea.value = resolution;
		textArea.rows = "2";
		textArea.cols = "50";
		textArea.name = teamName+" "+ sceneName;
		textArea.className = "deleteTextArea";

		var sectionId = teamName+" "+ sceneName;
		console.log(sectionId);
		//Places Delete Button and Text Area on the same row. 
		
		var deleteTextAreaDiv = document.createElement("div");
		deleteTextAreaDiv.className = "deleteSceneDiv";
		deleteTextAreaDiv.id=sectionId+" "+d

		deleteTextAreaDiv.appendChild(textArea);
		deleteTextAreaDiv.appendChild(createDeleteBtn(sectionId, d, teamName, sceneName));
		deleteTextAreaDiv.appendChild(document.createElement("br"));
		deleteTextAreaDiv.appendChild(document.createElement("br"));
		//
		resolutionSectionList.appendChild(deleteTextAreaDiv);
	}
	sceneSection.appendChild(resolutionSectionList);
	sceneSection.appendChild(document.createElement("br"));
	sceneSection.appendChild(addSceneCriteriaBtn(teamName+" "+ sceneName, teamName, sceneName));
	sceneSection.appendChild(saveSceneResolutionBtn(teamName+" "+ sceneName, teamName, sceneName));
	sceneSection.appendChild(createDeleteSceneBtn(teamName+" "+ sceneName,teamName, sceneName, c))
	
	return sceneSection;
	
}

function createDeleteBtn(sectionId, position, teamName, sceneName){
	
	var deleteTextAreaBtn = document.createElement("button");
	deleteTextAreaBtn.className = "deleteSceneButton";
	deleteTextAreaBtn.appendChild(document.createTextNode("Delete"));
	deleteTextAreaBtn.addEventListener("click", function(){
	
		deleteTextArea(sectionId, position, teamName, sceneName);
		console.log(position);
	});
	
	return deleteTextAreaBtn;
	
}
function saveSceneResolutionBtn(sceneId, teamName, sceneName){
	display=false;
	var saveBtn = document.createElement("button");
	var textNode = document.createTextNode("Save");
	
	saveBtn.appendChild(textNode);
	saveBtn.className = "button";
	
	saveBtn.addEventListener("click", function(){
		var newResolutionList = getTextAreaElements(sceneId);
		
		var newResolutionPath = 'https://cox-routing-application.firebaseio.com/Features/'+feature+"/"+teamName+"/"+sceneName+"/Resolution";
		var newResolutionRef = new Firebase(newResolutionPath);

		newResolutionRef.set(newResolutionList);
	});
	return saveBtn;
	
}

function deleteTextArea(sectionId, position, teamName, sceneName){
	console.log(position);
	var oldSceneCriteriaList = getTextAreaElements(sectionId);
	var newSceneCriteriaList = [];
	
	for(f = 0; f < oldSceneCriteriaList.length; f++){
		if(f!= position){
			newSceneCriteriaList.push(oldSceneCriteriaList[f]);
		}
	}
	
	if((teamName.localeCompare("Tier 2"))!=0){
		var newPath = 'https://cox-routing-application.firebaseio.com/Features/'+feature+"/"+teamName+"/"+sceneName;
	}
	else{
		var newPath = 'https://cox-routing-application.firebaseio.com/Features/'+feature+"/"+teamName+"/"+sceneName+"/Resolution";

	}
	var newRef = new Firebase(newPath);
	newRef.set(newSceneCriteriaList);
	
	var delElement = document.getElementById(sectionId+" "+position);
	delElement.parentNode.removeChild(delElement);
	
}


function getTextAreaElements(sceneId){
	
	var textAreaValues = [];
	var divElements = document.getElementsByName(sceneId);//Stores all of the textArea from a specified scene in a form of an array.

	for(z = 0; z < divElements.length; z++){
		if(divElements[z].length != 0){
			textAreaValues.push(divElements[z].value+"");
		}
	}
	
	return textAreaValues;
	
}
function deleteTeamBtn(teamName){
	var deleteHeading = document.createElement("h2");
	deleteHeading.innerHTML = "   <u>Delete Team</u>";
	deleteHeading.style.color = "#00a1e6";
	deleteHeading.className="delete";
	
	deleteHeading.addEventListener("click", function(){
		var newFirePath = 'https://cox-routing-application.firebaseio.com/Features'+"/"+feature+"/"+teamName;
		var newRef = new Firebase(newFirePath)
		newRef.set(null);
		alert(teamName);
		var delElement = document.getElementById(teamName);
		delElement.parentNode.removeChild(delElement);
		
	}); 
	return deleteHeading;
	
}

function openTier2(){
	document.getElementById("Tier2").style.display="block";
}

function openOtherTeam(){
	document.getElementById("otherTeam").style.display="block";
}
//Function called when creating a new tier 2 secenerio. Manages the add Resolution button.
function addResolution(){
	resCount++;
	var resolution = document.getElementById("resolutionInput");
	var resolutionInput = resolution.value;
	resolution.value = "";
	newResolutionArray.push(resolutionInput);
	
	//Html Code
	var pTag = document.createElement("p3");
	var textNode = document.createTextNode(resCount+". "+resolutionInput);
	pTag.appendChild(textNode);
	document.getElementById("resolutionSection").appendChild(pTag);
	document.getElementById("resolutionSection").appendChild(document.createElement("br"));
	//End of Html Code
}

function submitTier2Scenerio(){

	var tierScenerio = document.getElementById("tierScenerio").value;
	console.log(tierScenerio);
	
	var tier2Count = 0;
	if(teamMap.has("Tier 2")){
		tier2Count = teamMap.get("Tier 2").length;
	}

	if(tierScenerio.length == 0){
		alert("Please enter a Scenerio for Tier 2");
	}	
	else if(newResolutionArray.length == 0){
		alert("Please enter atleast one Resolution");
	}
	else{
		var newFirePath = 'https://cox-routing-application.firebaseio.com/Features'+"/"+feature+"/Tier 2"+"/"+"Scenario "+(tier2Count+1)+"/Resolution";
		var newRef = new Firebase(newFirePath)
		newRef.set(newResolutionArray);
		newFirePath = 'https://cox-routing-application.firebaseio.com/Features'+"/"+feature+"/Tier 2"+"/"+"Scenario "+(tier2Count+1)+"/Question";
		newRef = new Firebase(newFirePath)
		newRef.set(tierScenerio);
		
		var tier2SceneObject = {Question:tierScenerio, Resolution:newResolutionArray};
		
		var teamSection = document.getElementById("Tier 2");
		if(teamSection!=null){
			teamSection.appendChild(createTier2SceneCard(tier2SceneObject,"Scenario "+(tier2Count+1), "Tier 2"));
		}
		else{
			
			var newTeamSection = createTeamCard("Tier 2");
			newTeamSection.appendChild(createTier2SceneCard(tier2SceneObject,"Scenario "+(tier2Count+1), "Tier 2"));
			document.getElementById("cardView").appendChild(newTeamSection);
			
		}
		
		loadPage();
		document.getElementById("tierScenerio").value = "";
	}
}

//Function called when creating a new Team. Manages the add criteria button. 
function addSceneCriteria(){
	criCount++;
	var criteria = document.getElementById("teamCriteria");
	var criteriaInput = criteria.value;
	criteria.value = "";
	newSceneArray.push(criteriaInput);
	
	//Html Code
	
	var pTag = document.createElement("p3");
	var textNode = document.createTextNode(criCount+". "+criteriaInput);
	pTag.appendChild(textNode);
	
	document.getElementById("pSection").appendChild(pTag);
	document.getElementById("pSection").appendChild(document.createElement("br"));
	//End of Html Code
	
}

function submitNewTeamScene(){
	
	var teamNameInput = teamsMenuList[0];
	
	if(isOther){
		teamNameInput = document.getElementById("teamNameInput").value;
		//var index = teamsMenu.length - 1;
		var newTeamRef = new Firebase('https://cox-routing-application.firebaseio.com/GlobalValues/TeamDropDownMenu'+"/"+index);
		newTeamRef.set(teamNameInput);
		index++;
	}
	else{	
		if(teamOptionName!=null){
		   teamNameInput = teamOptionName;
		   }
		   
		
			
	}
	
	var tCount = 0;
	if(teamMap.has(teamNameInput)){
		tCount = teamMap.get(teamNameInput).length;
	}
	
	if(teamNameInput.length == 0){
		alert("Please add a team name for the new Feature Created");
	}
	else{
		
		var sceneId = "Scenerio "+(tCount+1);
		var newTeamCriteriaPath = 'https://cox-routing-application.firebaseio.com/Features/'+feature+"/"+(teamNameInput)+("/"+sceneId);
		var newTeamRef = new Firebase(newTeamCriteriaPath);
		newTeamRef.set(newSceneArray);
		document.getElementById("teamNameInput").value = "";
		
		var teamSection = document.getElementById(teamNameInput);
		if(teamSection!=null){
			teamSection.appendChild(createSceneCard(newSceneArray,sceneId, teamNameInput));
		}
		else{
			var newTeamSection = createTeamCard(teamNameInput);
			newTeamSection.appendChild(createSceneCard(newSceneArray,sceneId, teamNameInput));
			document.getElementById("cardView").appendChild(newTeamSection);
			
		}
		loadPage();
		
	}
	
}

function editScenerioBtnFunction(sceneId, questionHolderID, message, elementParent){
	var editBoolean = false;
	
	var editHeading = document.createElement("p2");
	editHeading.innerHTML = "   <u>Edit</u>";
	editHeading.style.color = "#00a1e6";
	
	var scenerioEditHolder = document.createElement("textarea");
	scenerioEditHolder.value = message;
	scenerioEditHolder.rows = "2";
	scenerioEditHolder.cols = "50";
	
	editHeading.addEventListener("click", function(){
		
		var questionPlaceHolder = document.getElementById(questionHolderID);
		
		if(editBoolean == false){

			elementParent.replaceChild(scenerioEditHolder, questionPlaceHolder);
			editHeading.innerHTML = "   <u>Save</u>";
			editBoolean = true;
			
		}else{
			
			editBoolean=false;
			var newFirePath = 'https://cox-routing-application.firebaseio.com/Features'+"/"+feature+"/Tier 2"+"/"+sceneId+"/Question";
			var newRef = new Firebase(newFirePath)
			newRef.set(null);
			newRef.set(scenerioEditHolder.value);
			
			editHeading.innerHTML = "   <u>Edit</u>";
			var newSceneTitle = document.createElement("p2");
			newSceneTitle.id = questionHolderID;
			newSceneTitle.appendChild(document.createTextNode(sceneId+": "+scenerioEditHolder.value));
			elementParent.replaceChild(newSceneTitle, scenerioEditHolder);
			
		}
		
	}); 
	
	return editHeading;
}

function createDeleteSceneBtn(sectionId, teamName, sceneName, scenePosition){
	
	var deleteSceneBtn = document.createElement("delButton");
	deleteSceneBtn.appendChild(document.createTextNode("Delete Scene"));
	deleteSceneBtn.className="delButton";
	
	deleteSceneBtn.addEventListener("click", function(){
		deleteScene(sectionId, teamName, sceneName, scenePosition);
	});
	
	return deleteSceneBtn;
}

function deleteScene(sectionId, teamName, sceneName, scenePosition){
	
	alert(teamName+" "+sceneName);
	var newFirePath = 'https://cox-routing-application.firebaseio.com/Features/'+feature+"/"+teamName+"/"+sceneName;
	var newRef = new Firebase(newFirePath)
	newRef.set(null);
	
	var teamScenerios = teamMap.get(teamName);
	var num = teamScenerios.length;
	
	for(h = scenePosition; h <= num; h++){
		var newSceneName = "Scenerio "+(h+1);
		var newFirePath = 'https://cox-routing-application.firebaseio.com/Features/'+feature+"/"+teamName+"/"+newSceneName;
		var newRef = new Firebase(newFirePath)
		
		if(h==num){
			newRef.set(null);
		}
		else{
			newRef.set(teamScenerios[h]);
		}

	}

	var teamSection = document.getElementById(teamName);
	//Erases all of the content inside a card. 
	while (teamSection.firstChild) {
		teamSection.removeChild(teamSection.firstChild);
	}
	
	var teamTitle = document.createElement("h1");
	var teamTitleTextNode = document.createTextNode(teamName);
	teamTitle.appendChild(teamTitleTextNode);
	teamTitle.className = "title";
	
	var topSection = document.createElement("div");
	topSection.className = "topSection";
	topSection.appendChild(teamTitle);
	topSection.appendChild(deleteTeamBtn(teamName));
	
	teamSection.appendChild(topSection);
	var teamDivider = document.createElement("br");
	teamSection.append(teamDivider);
	
	var teamScenerioList = teamMap.get(teamName)
		
	for(z = 0; z < teamScenerioList.length; z++){
		var sceneName = "Scenario "+(z+1);
		//teamSection.removeChild(document.getElementById(sceneName));
		if((teamName.localeCompare("Tier 2"))!=0){
			teamSection.append(createSceneCard(teamScenerioList[z],sceneName, teamName ));
		}
		else{
			teamSection.append(createTier2SceneCard(teamScenerioList[z],sceneName, teamName ));
		}
		var sceneDivider = document.createElement("br");
		teamSection.append(sceneDivider);
	}
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
		for(var c = 0; c < teamsMenuList.length; c++){
			
			if (evt.target.value === teamsMenuList[c]) {
				teamOptionName = teamsMenuList[c];
			}
		}
	}
  
}















