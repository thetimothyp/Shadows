function InputController(game) {
	this.game = game;
	this.xVel = 0;
	this.yVel = 0;
	this.right = false;
	this.left = false;
	this.jumping = false;

	var maxSpeed = 2.5;
	var gravity = 0.4;
	var jumpForce = 5;

	this.setVelocity = function() {
		if (this.right && this.xVel < maxSpeed) {
			this.xVel += 0.3;
			if (this.game.player.collisions.right)
				this.xVel = 0;
		} else if (this.left && this.xVel > -1 * maxSpeed) {
			this.xVel -= 0.3;
			if (this.game.player.collisions.left)
				this.xVel = 0;
		} else {
			if (this.xVel > -0.3 && this.xVel < 0.3) {
				this.xVel = 0;
			} else if (this.xVel > 0) {
				this.xVel -= 0.3;
			} else if (this.xVel < 0) {
				this.xVel += 0.3;
			}
		}
	}

	this.setGravity = function() {
		if (this.game.player.collisions.bottom && !this.jumping)
			this.yVel = 0;
		else
			this.yVel += gravity;
	}

	this.jump = function() {
		var jumpVel = -1 * jumpForce;
		this.yVel = jumpVel;
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
		if (!this.jumping) {
			this.jumping = true;
			this.jump();
		}
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
		case 65:
		this.left = false;
		break;
		case 68:
		this.right = false;
		break;
	}
}