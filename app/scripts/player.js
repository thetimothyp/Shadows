function Player(x, y, game) {
	this.x = x;
	this.y = y;
	this.resetCollisions();
	this.game = game;
	this.input = this.game.inputController;
	this.lantern = new Lantern(this);
}

Player.prototype.update = function() {
	this.input.setVelocity();
	this.input.setGravity();
	if (!this.collisions.right && this.input.xVel > 0)
		this.x += this.input.xVel;
	if (!this.collisions.left && this.input.xVel < 0)
		this.x += this.input.xVel;
	if (this.input.yVel != 0)
		this.input.jumping = true;
	this.y += this.input.yVel;
	this.lantern.update();
	this.resetCollisions();
	this.detectCollisions();
}

Player.prototype.render = function() {
	this.game.ctx.save();
	this.game.ctx.fillStyle = "#FF0000";
	this.game.ctx.fillRect(this.x - 5, this.y - 5, 10, 10);
	this.game.ctx.restore();
	this.lantern.render();
}

Player.prototype.resetCollisions = function() {
	this.collisions = {
		"top": false,
		"right": false,
		"bottom": false,
		"left": false
	}
}

Player.prototype.detectCollisions = function() {
	for (var i = 0; i < this.game.blocks.length; i++) {
		var block = this.game.blocks[i];
		if (this.x - 5.01 <= block.p2.x &&
			this.x + 5.01 >= block.p1.x &&
			this.y - 5.01 <= block.p2.y &&
			this.y + 5.01 >= block.p1.y) {
			if (Math.abs(this.x + 5 - block.p1.x) < 2.7) {
				this.collisions.right = true;
				this.x = block.p1.x - 5.01;
			}
			if (Math.abs(this.x - 5 - block.p2.x) < 2.7) {
				this.collisions.left = true;
				this.x = block.p2.x + 5.01;
			}
			if (this.y - 5 < block.p1.y && !this.collisions.right && !this.collisions.left) {
				this.collisions.bottom = true;
				if (this.input.jumping)
					this.input.jumping = false;
				if (!this.input.jumping) {
					this.y = block.p1.y - 5.01;
				}
			}
		}
	}
}

function Lantern(player) {
	this.player = player;
	this.game = this.player.game;
	this.attachedToPlayer = true;
	this.x = this.player.x + 10;
	this.y = this.player.y;
	this.xVel = this.player.input.xVel;
	this.yVel = this.player.input.yVel;
}

Lantern.prototype.render = function() {
	this.game.ctx.save();
	this.game.ctx.fillStyle = "#f4cb42";
	this.game.ctx.fillRect(this.x - 5, this.y - 5, 10, 10);
	this.game.ctx.restore();
}

Lantern.prototype.update = function() {
	if (this.attachedToPlayer) {
		if (this.player.input.facingRight)
			this.x = this.player.x + 10;
		else
			this.x = this.player.x - 10;
		this.y = this.player.y;
		this.xVel = this.player.input.xVel;
		this.yVel = this.player.input.yVel;
	} else {
		this.setVelocity();
		this.setGravity();
		this.y += this.yVel;
		this.x += this.xVel * 2;
	}
	this.resetCollisions();
	this.detectCollisions();
}

Lantern.prototype.resetCollisions = function() {
	this.collisions = {
		"top": false,
		"right": false,
		"bottom": false,
		"left": false
	}
}

Lantern.prototype.detectCollisions = function() {
	for (var i = 0; i < this.game.blocks.length; i++) {
		var block = this.game.blocks[i];
		if (this.x - 5.01 <= block.p2.x &&
			this.x + 5.01 >= block.p1.x &&
			this.y - 5.01 <= block.p2.y &&
			this.y + 5.01 >= block.p1.y) {
			if (Math.abs(this.x + 5 - block.p1.x) < 2.7) {
				this.collisions.right = true;
				this.x = block.p1.x - 5.01;
			}
			if (Math.abs(this.x - 5 - block.p2.x) < 2.7) {
				this.collisions.left = true;
				this.x = block.p2.x + 5.01;
			}
			if (this.y - 5 < block.p1.y && !this.collisions.right && !this.collisions.left) {
				this.collisions.bottom = true;
				this.y = block.p1.y - 5.01;
			}
		}
	}
}

Lantern.prototype.toggleCarried = function() {
	if (Math.abs(this.x - this.player.x) < 15 &&
		Math.abs(this.y - this.player.y) < 15)
		this.attachedToPlayer = !this.attachedToPlayer;
}

Lantern.prototype.setVelocity = function() {
	if (this.xVel > -0.1 && this.xVel < 0.1) {
		this.xVel = 0;
	} else if (this.xVel > 0) {
		this.xVel -= 0.1;
	} else if (this.xVel < 0) {
		this.xVel += 0.1;
	}
}

Lantern.prototype.setGravity = function() {
	var gravity = 0.4;
	if (this.collisions.bottom)
		this.yVel = 0;
	else
		this.yVel += gravity;
}