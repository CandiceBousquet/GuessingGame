$(document).ready(function () {
	var game = newGame();
	
	$("#submit").on("click", function() {
		submitGuess(game);
	});

	$("#player-input").keypress(function(event) {
		if(event.which == 13){
			submitGuess(game);
		}
	});

	$("#reset").on("click", function() {
		game = newGame();
		$("h1").html("Play the Guessing Game!");
		$("h2").html("Guess a number between 1 - 100");
		$("#reset").prop("disabled", false);
		$("#hint").prop("disabled", false);
		$("#previousGuessList li").html("-");
	});

	$("#hint").on("click", function() {
		var hints = game.provideHint();
		$("h1").html("Here are some hints: " + hints.toString());
	});

});


function submitGuess(game) {
	var guess = parseFloat($("#player-input").val());
	var output = game.playersGuessSubmission(guess);
	console.log(output);
	updateDisplay(game, output);
}

function updateDisplay(game, result) {
	$("#player-input").val("");
	if(result === "You have already guessed that number."){
		$("h1").html("Guess again!");
	}else {
		if(result === "You Win!" || result === "You Lose."){
			handleWinOrLoss(result);
		}else{
			handleOtherGuess(game, result);
		}
	}
}

function handleWinOrLoss(result){
	$("h1").html(result);
	$("h2").html("Click the Reset button to replay.");
	$("#submit").prop("disabled", true);
	$("#hint").prop("disabled", true);
}

function handleOtherGuess(game, result){
	$("h1").html(result);
	var goHigher = game.isLower(), detail;
	if(goHigher){
		detail = "You need to guess higher!";
	}else{
		detail = "You need to guess lower!";
	}
	$("h2").html(detail);
	setGuesses(game);
}

function setGuesses(game) {
	var i = game.pastGuesses.length;
	var guessElements = $("#previousGuessList li");
	$(guessElements[i-1]).html(game.playersGuess);
}

function Game () {
 	this.playersGuess = null;
 	this.pastGuesses = [];
 	this.winningNumber = generateWinningNumber();
 }
 Game.prototype.playersGuessSubmission = function (num) {
 	if(num < 1 || num > 100 || !Number.isInteger(num)){
 		throw "That is an invalid guess.";
 	}
 	this.playersGuess = num;
 	return this.checkGuess();
 }
 Game.prototype.checkGuess = function(){
 	//return this.playersGuess;
 	if(this.winningNumber === this.playersGuess){
 		return "You Win!";
 	}else if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
 		return "You have already guessed that number.";
 	}else{
 		this.pastGuesses.push(this.playersGuess);
 		if(this.pastGuesses.length >= 5) {
 			return "You Lose.";
 		}else{
 			var diff = this.difference();
 			if(diff < 10){
 				return "You\'re burning up!";
 			}
 			if(diff < 25){
 				return "You\'re lukewarm.";
 			}
 			if(diff < 50){
 				return "You\'re a bit chilly.";
 			}
 			return "You\'re ice cold!";
 		}

 	}
 }
 Game.prototype.difference = function(){
 	return Math.abs(this.winningNumber-this.playersGuess)
 }
 Game.prototype.isLower = function(){
 	return this.playersGuess < this.winningNumber;
 }
 Game.prototype.provideHint = function(){
 	var hintArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
 	return shuffle(hintArr);
 }
 function generateWinningNumber () {
 	var num = Math.floor(Math.random() * 100)+1;
 	return num === 0 ? 1 : num;
 }
 function newGame (){
 	return new Game();
 }
 function shuffle (arr){
 	var m = arr.length, i, t;
 	while(m){
 		i = Math.floor(Math.random() * m--);
 		t = arr[i]; // random number from array
 		arr[i] = arr[m]; // move number in back to random spot
 		arr[m] = t;
 	}
 	return arr;
 }