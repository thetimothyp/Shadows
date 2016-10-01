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
	game.walls.push(new Wall(new Point(200,200), new Point(400,200)));
	game.start();
}

function GameController(canvas, ctx) {
	this.canvas = canvas;
	this.ctx = ctx;
	this.inputController = new InputController(this);
	this.inputController.init();
	this.player = new Player(100, 300, this);
	this.clearColor = "#FFFFFF";
	this.walls = [
		new Wall(new Point(0,0), new Point(1000,0)),
		new Wall(new Point(0,0), new Point(0,400)),
		new Wall(new Point(1000,0), new Point(1000,400)),
		new Wall(new Point(0,400), new Point(1000,400))
	];
}

GameController.prototype.start = function() {
	this.update();
	this.render();
	window.requestAnimationFrame(this.start.bind(this));
}

GameController.prototype.clear = function() {
	this.ctx.save();
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.ctx.restore();
}

GameController.prototype.update = function() {
	this.player.update();
}

GameController.prototype.render = function() {
	this.clear();
	var foreground = new Image();
	this.ctx.save();
	this.ctx.beginPath();
	for(var i = 0; i < this.walls.length; i++){
		var wall = this.walls[i];
		this.ctx.moveTo(wall.p1.x, wall.p1.y);
		this.ctx.lineTo(wall.p2.x, wall.p2.y);
	}
	this.ctx.stroke();
	this.player.render();
	this.ctx.restore();
}

function Point(x, y) {
	this.x = x;
	this.y = y;
	this.parent = null;
}

function Player(x, y, game) {
	this.x = x;
	this.y = y;
	this.game = game;
	this.input = this.game.inputController;
}

Player.prototype.update = function() {
	this.input.setVelocity();
	this.x += this.input.xVel;
}

Player.prototype.render = function() {
	this.game.ctx.save();
	this.game.ctx.fillStyle = "#FF0000";
	this.game.ctx.fillRect(this.x, this.y, 10, 10);
	this.game.ctx.restore();
}

function InputController(game) {
	this.game = game;
	this.xVel = 0;
	this.yVel = 0;
	this.right = false;
	this.left = false;

	this.setVelocity = function() {
		if (this.right && this.xVel < 3) {
			this.xVel += 0.1;
		} else if (this.left && this.xVel > -3) {
			this.xVel -= 0.1;
		} else {
			if (this.xVel > -0.2 && this.xVel < 0.2) {
				this.xVel = 0;
			} else if (this.xVel > 0) {
				this.xVel -= 0.2;
			} else if (this.xVel < 0) {
				this.xVel += 0.2;
			}
		}
	}
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
		break;
		case 68:
		this.right = true;
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


function Wall(p1, p2){
	this.p1 = p1;
	this.p2 = p2;
	this.p1.parent = this;
	this.p2.parent = this;
	this.points = [p1, p2];

	this.length = function(){
		return Math.sqrt(Math.pow(p2.x-p1.x, 2)+Math.pow(p2.y-p1.y, 2));
	}
}


