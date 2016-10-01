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
	this.ctx.strokeStyle = "#FF0000";
	var intersects = this.findRays();
	for(var i=0;i<intersects.length;i++){
		var intersect = intersects[i];
		// Draw red laser
		this.ctx.beginPath();
		this.ctx.moveTo(this.player.x + 5,this.player.y + 5);
		this.ctx.lineTo(intersect.x,intersect.y);
		this.ctx.stroke();
	}
	this.player.render();
	this.ctx.restore();
}

GameController.prototype.findRays = function() {
	var intersects = [];
	for(var angle = 0; angle < Math.PI*2; angle += (Math.PI*2)/50) {
		var dx = Math.cos(angle);
		var dy = Math.sin(angle);

		var ray = new Wall(new Point(this.player.x, this.player.y),
			new Point(this.player.x + dx, this.player.y + dy));

		// Find CLOSEST intersection
		var closestIntersect = null;
		for(var i=0;i<this.walls.length;i++){
			var intersect = getIntersection(ray,this.walls[i]);
			if(!intersect) continue;
			if(!closestIntersect || intersect.param<closestIntersect.param){
				closestIntersect=intersect;
			}
		}
		// Add to list of intersects
		intersects.push(closestIntersect);
	}
	return intersects;
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

function getIntersection(ray,segment){
	// RAY in parametric: Point + Delta*T1
	var r_px = ray.p1.x;
	var r_py = ray.p1.y;
	var r_dx = ray.p2.x-ray.p1.x;
	var r_dy = ray.p2.y-ray.p1.y;
	// SEGMENT in parametric: Point + Delta*T2
	var s_px = segment.p1.x;
	var s_py = segment.p1.y;
	var s_dx = segment.p2.x-segment.p1.x;
	var s_dy = segment.p2.y-segment.p1.y;
	// Are they parallel? If so, no intersect
	var r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
	var s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
	if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){
		// Unit vectors are the same.
		return null;
	}
	// SOLVE FOR T1 & T2
	// r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
	// ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
	// ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
	// ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
	var T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
	var T1 = (s_px+s_dx*T2-r_px)/r_dx;
	// Must be within parametic whatevers for RAY/SEGMENT
	if(T1<0) return null;
	if(T2<0 || T2>1) return null;
	// Return the POINT OF INTERSECTION
	var pt = new Point(r_px+r_dx*T1, r_py+r_dy*T1);
	pt.param = T1;
	return pt;
}


