function GameController(canvas, ctx) {
	this.canvas = canvas;
	this.ctx = ctx;
	this.inputController = new InputController(this);
	this.inputController.init();
	this.player = new Player(100, 300, this);
	this.clearColor = "#08183d";
	this.walls = [
		new Wall(new Point(0,0), new Point(1000,0)),
		new Wall(new Point(0,0), new Point(0,400)),
		new Wall(new Point(1000,0), new Point(1000,400)),
		new Wall(new Point(0,400), new Point(1000,400))
	];
	this.blocks = [];
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

	// Draw walls
	this.ctx.beginPath();
	for(var i = 0; i < this.walls.length; i++){
		var wall = this.walls[i];
		this.ctx.moveTo(wall.p1.x + 0.5, wall.p1.y + 0.5);
		this.ctx.lineTo(wall.p2.x + 0.5, wall.p2.y + 0.5);
	}
	this.ctx.stroke();

	// Draw blocks
	this.ctx.beginPath();
	for (var i = 0; i < this.blocks.length; i++) {
		var block = this.blocks[i];
		block.map(this.ctx);
	}
	this.ctx.fill();

	// Ray tracing
	var intersects = findRays(this);
	this.ctx.fillStyle = "rgba(255,255,255,0.5)";
	this.ctx.beginPath();
	this.ctx.moveTo(intersects[0].x,intersects[0].y);
	for(var i=1;i<intersects.length;i++){
		var intersect = intersects[i];
		this.ctx.lineTo(intersect.x,intersect.y);
	}
	this.ctx.fill();
	this.player.render();
	this.ctx.restore();
}