
function loadPage(){
	var section = document.getElementById("section");
	var btn  = document.createElement("button");
	var textNode = document.createTextNode("sample");


	btn.appendChild(textNode);
	
	btn.addEventListener("click", function(){
		write("1");
	});
	
	section.appendChild(btn);
	
	
	var btn2 = document.createElement("button");
	var textNode2 = document.createTextNode("sample2");
	btn2.appendChild(textNode2);
	
	btn2.addEventListener("click", function(){
		write("2");
	});
	section.appendChild(btn2);
	
	var textBox = document.createElement("textarea");
	textBox.value = "Hello There!!!!!!!!!!!!!!!!!!!!!!!!!!";
	textBox.rows="2";
	textBox.cols = "40"
	
	
	section.appendChild(textBox);
	
	var y = document.getElementById("demo");
	y.innerHTML = "<u>This is a demo </u>";
	y.addEventListener("click", function(){
		write("Hellooo Thereeee!!!!!!!!");
	});
}

function write(number){
	
	document.getElementById("demo").innerHTML = "This is a demo "+number;
	alert("Helllooooo "+number);
}