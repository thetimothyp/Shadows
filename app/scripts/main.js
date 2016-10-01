var canvas;
var ctx;
var canvasWidth = 1000;
var canvasHeight = 400;

window.onload = function() {
	canvas = document.getElementById("canvas");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	ctx = canvas.getContext("2d");
	var game = new GameController(canvas, ctx);
	game.start();
}

function GameController(canvas, ctx) {
	this.canvas = canvas;
	this.ctx = ctx;
	this.inputController = new InputController(this);
	this.inputController.init();
	this.player = new Player(10, 300, this, this.inputController);
	this.clearColor = "#FFFFFF";
}

GameController.prototype.start = function() {
	this.update();
	this.render();
	window.requestAnimationFrame(this.start.bind(this));
}

GameController.prototype.clear = function() {
	this.ctx.save();
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.ctx.fillStyle = this.clearColor;
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.ctx.restore();
}

GameController.prototype.update = function() {
	this.player.update();
}

GameController.prototype.render = function() {
	this.clear();
	this.ctx.save();
	// for (var i = 0; i < this.canvas.width / 10; i++) {
	// 	this.ctx.moveTo(i * 10, 0);
	// 	this.ctx.lineTo(i * 10, this.canvas.height);
	// }
	// for (var i = 0; i < this.canvas.height / 10; i++) {
	// 	this.ctx.moveTo(0, i * 10);
	// 	this.ctx.lineTo(this.canvas.width, i * 10);
	// }
	// this.ctx.lineWidth = 1;
	// this.ctx.strokeStyle = "#EEEEEE";
	// this.ctx.stroke();
	this.player.render();
	this.ctx.restore();
}

function Point(x, y) {
	this.x = x;
	this.y = y;
	this.parent = null;
}

function Player(x, y, game, input) {
	this.x = x;
	this.y = y;
	this.game = game;
	this.input = input;
}

Player.prototype.update = function() {
	this.input.setVelocity();
	this.x += this.input.xVel;
}

Player.prototype.render = function() {
	this.game.ctx.fillRect(this.x, this.y, 25, 25);
}

function InputController(game) {
	this.game = game;
	this.xVel = 0;
	this.yVel = 0;
	this.right = false;
	this.left = false;
}

InputController.prototype.init = function() {
	document.addEventListener("keydown",
		this.onKeyDown.bind(this), false);
	document.addEventListener("keyup",
		this.onKeyUp.bind(this), false);
}

InputController.prototype.onKeyDown = function(e) {
	switch(e.keyCode) {
		case 87:
		console.log("up pressed");
		break;
		case 65:
		this.left = true;
		console.log(this.xVel);
		break;
		case 68:
		this.right = true;
		console.log(this.xVel);
		break;
	}
}

InputController.prototype.onKeyUp = function(e) {
	switch(e.keyCode) {
		case 87:
		console.log("up released");
		break;
		case 65:
		this.left = false;
		break;
		case 68:
		this.right = false;
		break;
	}
}

InputController.prototype.setVelocity = function() {
	if (this.right && this.xVel < 3) {
		this.xVel += 0.1;
	} else if (this.left && this.xVel > -3) {
		this.xVel -= 0.1;
	} else {
		if (this.xVel > -0.1 && this.xVel < 0.1) {
			this.xVel = 0;
		} else if (this.xVel > 0) {
			this.xVel -= 0.1;
		} else if (this.xVel < 0) {
			this.xVel += 0.1;
		}
	}
}