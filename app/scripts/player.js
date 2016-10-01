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
	this.game.ctx.fillRect(this.x - 5, this.y - 5, 10, 10);
	this.game.ctx.restore();
}