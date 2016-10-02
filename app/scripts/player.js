function Player(x, y, game) {
	this.x = x;
	this.y = y;
	this.resetCollisions();
	this.game = game;
	this.input = this.game.inputController;
}

Player.prototype.update = function() {
	this.input.setVelocity();
	if (this.input.jumping)
		this.input.jump();
	this.input.setGravity();
	this.x += this.input.xVel;
	this.y += this.input.yVel;
	this.resetCollisions();
	for (var i = 0; i < this.game.blocks.length; i++) {
		var block = this.game.blocks[i];
		if (this.x - 5 < block.p2.x &&
			this.x + 5 > block.p1.x &&
			this.y - 5 < block.p2.y &&
			this.y + 5 > block.p1.y) {
			if (this.x - 5 < block.p1.x) {
				this.collisions.right = true;
				this.x = block.p1.x - 5;
			}
			if (this.x + 5 > block.p2.x) {
				this.collisions.left = true;
				if (!this.collisions.bottom)
					this.x = block.p2.x + 5;
			}
			if (this.y - 5 < block.p1.y) {
				this.collisions.bottom = true;
				this.y = block.p1.y - 5;
			}
		}
	}
}

Player.prototype.render = function() {
	this.game.ctx.save();
	this.game.ctx.fillStyle = "#FF0000";
	this.game.ctx.fillRect(this.x - 5, this.y - 5, 10, 10);
	this.game.ctx.restore();
}

Player.prototype.resetCollisions = function() {
	this.collisions = {
		"top": false,
		"right": false,
		"bottom": false,
		"left": false
	}
}