function Point(x, y) {
	this.x = x;
	this.y = y;
	this.parent = null;
}

function Wall(p1, p2){
	this.p1 = p1;
	this.p2 = p2;
}

function Block(p1, p2){
	this.p1 = p1;
	this.p2 = p2;

	this.init = function(game) {
		game.walls.push(new Wall(new Point(p1.x,p1.y), new Point(p2.x,p1.y)));
		game.walls.push(new Wall(new Point(p2.x,p1.y), new Point(p2.x,p2.y)));
		game.walls.push(new Wall(new Point(p2.x,p2.y), new Point(p1.x,p2.y)));
		game.walls.push(new Wall(new Point(p1.x,p1.y), new Point(p1.x,p2.y)));
	}

	this.map = function(ctx) {
		ctx.moveTo(p1.x + 0.5,p1.y + 0.5);
		ctx.lineTo(p2.x + 0.5,p1.y + 0.5);
		ctx.lineTo(p2.x + 0.5,p2.y + 0.5);
		ctx.lineTo(p1.x + 0.5,p2.y + 0.5);
	}
}