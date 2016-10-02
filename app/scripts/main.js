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
	game.blocks.push(new Block(new Point(200,200),new Point(400,205)));
	game.blocks.push(new Block(new Point(400,350),new Point(500,370)));
	game.blocks.push(new Block(new Point(700,100),new Point(720,120)));
	game.blocks.push(new Block(new Point(600,240),new Point(620,260)));
	game.blocks.push(new Block(new Point(300,290),new Point(320,310)));
	game.blocks.push(new Block(new Point(80,360),new Point(140,370)));
	for (var i = 0; i < game.blocks.length; i++) {
		var block = game.blocks[i];
		block.init(game);
	}
	game.start();
}


