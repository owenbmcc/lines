/*
	just an example to set up a game file
	not necessarily best approach
*/
Game.init({
	width: window.innerWidth, 
	height: window.innerHeight, 
	lps: 10,
	stats: true,
	debug: false,
	mixedColors: true,
	checkRetina: true
});
/* scenes 0: move character around */
Game.scenes = {
	'walk': {},
	'drag': {} /* not implemented */
};
Game.currentScene = 'walk';
Game.initLettering('letters.json'); // create letters for each game

/* usually in spearate data files */
const title = new Text(10, 40, "welcome to the game", 10, Game.letters);
const joinGame = new Button({
	x: 400,
	y: 100,
	src: 'join_game.json',
	states: {
		"idle": { "start": 0, "end": 0 },
		"over": { "start": 1, "end": 1 },
		"selected": { "start": 2, "end": 2 },
		"active": { "start": 3, "end": 3 }
	},
	state: 'idle'
});
joinGame.callback = function() {
	console.log('join game');
}; /* weird */

/* separate classes in files */
class Character extends Sprite {
	constructor(x, y) {
		super(x, y);
		this.speed = new Cool.Vector(0, 0); /* sprite physics has velocity ... */
		this.addAnimation('sprite.json');
	}

	update() {
		this.position.x += this.speed.x;
		this.position.y += this.speed.y;
	}
}

const char = new Character(300, 300);
Game.scenes.walk.characters = [];
Game.scenes.walk.characters.push(char);

const waves = new Sprite(400, 400);
waves.addAnimation('waves.json', function() {
	waves.animation.randomFrames = true;
});

// const trees = new Texture();

function start() {
	console.log("game start");
	/* there's sort of no point of this function */
}

function draw() {
	for (let i = 0; i < Game.scenes[Game.currentScene].characters.length; i++) {
		Game.scenes[Game.currentScene].characters[i].display();
	}

	waves.display();
	title.display(); // lettering example
	joinGame.display(); // ui example
}

function update() {
	for (let i = 0; i < Game.scenes[Game.currentScene].characters.length; i++) {
		Game.scenes[Game.currentScene].characters[i].update();
	}
}

Game.start();

/* events */
function keyDown(key) {
	switch (key) {
		case 'a':
		case 'left':
			char.speed.x = -5;
			break;
		case 'd':
		case 'right':
			char.speed.x = 5;
			break;
		case 'w':
		case 'up':
			char.speed.y = -5;
			break;
		case 's':
		case 'down':
			char.speed.y = 5;
			break;
	}
}

function keyUp(key) {
	switch (key) {
		case 'a':
		case 'left':
			char.speed.x = 0;
			break;
		case 'd':
		case 'right':
			char.speed.x = 0;
			break;
		case 'w':
		case 'up':
			char.speed.y = 0;
			break;
		case 's':
		case 'down':
			char.speed.y = 0;
			break;
	}
}

function mouseMoved(x, y) {
	joinGame.over(x, y);
}

function mouseDown(x, y) {
	joinGame.down(x, y);
}

function mouseUp(x, y) {
	if (joinGame.up(x, y)) return;
}