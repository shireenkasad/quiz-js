window.onload = function () {
	var questionArea = document.getElementsByClassName('question')[0];
	var answerArea = document.getElementsByClassName("answers")[0];
	var messageArea = document.getElementById("message-area");
	var submitAreaBtn = document.getElementById("submit");
	var backBtn = document.getElementById('back');
	var current;
	var score;
	var wasCorrect;  	
	
	var allQuestions = [
		{ question: "Who wrote 'Alice in Wonderland'?", 
		  answers: ["A.A. Milne", "C.S. Lewis", "Lewis Carol", "Margery Williams"],
		  correctAnswer:2 },
		{ question: "What year did Abraham Lincoln deliver The Gettysburg Address?", 
		  answers: ["1857", "1859", "1861", "1863"],
		  correctAnswer:3 },
		{ question: "What is the world's largest freshwater lake, by volumn?", 
		  answers: ["Lake Superior", "Lake Victoria", "Lake Ontario", "Lake Michigan"],
		  correctAnswer:0 }
		];

	var totalQuestions = allQuestions.length;
		
	function loadQuestion(a) {
		var question = allQuestions[a].question;
		questionArea.innerHTML = '';
		questionArea.innerHTML = question; 
	 }
	
	 function loadAnswers(b) {
		answerArea.innerHTML = '';
		var answerList = allQuestions[b].answers; 
		for (var i = 0; i < answerList.length; i++) {
		  var text = answerList[i];
		  var div = document.createElement("div");
		  var radio = document.createElement("input");
	
		  radio.type = "radio";
		  radio.name = "answer";
		  radio.value = i;
		  radio.id = "answer" + (i+1);
		  
		  div.appendChild(radio);
		  div.appendChild(document.createTextNode(text));
		  answerArea.appendChild(div);
		}

		// check to see if there is a value for this answer in local storage, 
		// if so, show the button as selected

		var currentNumber = b;	
		var selected = document.querySelectorAll('input');

		if(localStorage.getItem(currentNumber) !== null){
			var wasSelected = localStorage.getItem(currentNumber);
			
			for(var i = 0; i<selected.length; i++){
				 if(selected[i] == selected[wasSelected]){
					selected[i].checked =  true;
				 }
			} 
		}
		else{
			selected.checked =  false;
		}

		// check if a back button should be shown

		if(b > 0){
			showThis(backBtn);
		}
		else{
			hideThis(backBtn);
		}
	 }
	 
	function showThis(element){
		element.classList.remove('hidden');
	} 

	function hideThis(element){
		element.classList.add('hidden');
	}

	// swap the text between submit and restart

	function makeSubmit(element){
		element.innerHTML = "submit";
	} 

	function makeRestart(element){
		element.innerHTML = "restart";
	}
	
	function checkAnswer(c){
		var submitted = document.querySelector('input[type="radio"]:checked');
		if(submitted === null){
			showThis(messageArea);
		}
		else{

			// save the answer in local storage

			var keyName = c;
			localStorage.setItem(keyName, submitted.value); 

			// check to see if answer is correct, if so add to score

			var correct = allQuestions[c].correctAnswer;
			if(submitted.value == correct){
				score++;
				wasCorrect = true;
			}
			else{
				wasCorrect = false;
			}

			// check to see if this is the last question, 
			// if not, update 'current', load next

			if(c < allQuestions.length-1)
			{
				c++;
				current = c;
				loadQuestion(current);
				loadAnswers(current);
				checkSelected();
			}

			// if last, load final score text, restart button

			else{
				var finalScore = '<span class="highlight">' + score + '/' + totalQuestions + '</span>';
				questionArea.innerHTML = 'You have completed the quiz! <br> Your total score is ' + finalScore + '.';
				answerArea.innerHTML = '';
				makeRestart(submitAreaBtn);
				hideThis(backBtn);
			}
		}
		return current;
		return wasCorrect;
		return score;
	}
	
	// add an event listener to all the radio buttons to know if an answer has been selected

	function checkSelected(){
		 var selected = document.querySelectorAll('input');
		 for(var i = 0; i<selected.length; i++){
			 selected[i].addEventListener("click", function(){
			 	hideThis(messageArea)
			 }, false);
		 }   
	 } 

	function onBack(d){		

		// on back, decrease current, load previous question, 
		// show previously chosen answer as selected

		d--;
		current = d;
		loadQuestion(current);
		loadAnswers(current);

		var currentNumber = d;		
		var wasSelected = localStorage.getItem(currentNumber);
		var selected = document.querySelectorAll('input');
		for(var i = 0; i<selected.length; i++){
			 if(selected[i] == selected[wasSelected]){
				selected[i].checked =  true;
			 }
		}  
		if(wasCorrect){
			score--;	
		}
		hideThis(messageArea);
		return current;	
		return score;
	}
	
	function onload(){
		current = 0;
		score = 0;
		wasCorrect = false;
		localStorage.clear();
		
		loadQuestion(current);
		loadAnswers(current);
		checkSelected();

		makeSubmit(submitAreaBtn);
		hideThis(backBtn);
		hideThis(messageArea);
		
	}
	
	onload();
	
	submitAreaBtn.addEventListener("click", function(){

		// check to see what the current text for the button is, 
		// load corresponding function

		if(this.innerHTML === "submit"){
			checkAnswer(current);
		}
		else {
			onload();
		}
	}, false); 
	
	backBtn.addEventListener("click", function(){
		onBack(current);
	}, false);
	

};