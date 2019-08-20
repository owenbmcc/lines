const edi = {}; /* editor app */
edi.ui = new Interface(edi);
edi.ui.load('interface.json');
edi.ui.settings = new Settings(edi, 'edi');
edi.ui.displayTextures = function() {
	for (const key in Game.sprites.textures) {
		Game.sprites.textures[key].ui.removeUI();
		Game.sprites.textures[key].ui.createUI();
	}
}; /* needs to go in module */
edi.ui.markers = {};

edi.zoom = new Zoom();

edi.ruler = new Ruler();
edi.tool = {
	set: function(_toolName) {
		const toolName = _toolName.toolName || _toolName;
		edi.tool.current = toolName;
		edi.ui.selectTool.setValue(toolName);
		Game.canvas.className = '';
		Game.canvas.classList.add(`${toolName}-tool`);
	}
}; /* tools: zoom/pan, transform, ruler - modulize if it gets complicated */
/* move this somewhere else eventually ... */
edi.ui.selectTool = new UISelect({
	id: "select-tool",
	options: [ "zoom", "transform", "ruler", "location" ],
	label: "tool:",
	selected: edi.tool.current,
	callback: edi.tool.set
});
edi.ui.reset = function() {
	for (const key in Game.sprites) {
		Game.sprites[key].removeUI();
	}
	for (const key in Game.ui) {
		Game.ui[key].removeUI();
	}
};


Game.sprites = {};
Game.ui = {};
Game.scenes = [];
Game.init({
	canvas: "map",
	width: 1000,
	height: 600,
	lps: 12,
	mixedColors: true
});

edi.data = new Data(Game, { save: false, path: '/drawings' }); 
Game.load({ ui: "/data/ui.json", sprites: "/data/sprites.json" }, { ui: GUI, scenery: ItemEdit, textures: TextureEdit }, Game.start);

function start() {
	edi.zoom.canvas.width = edi.zoom.view.width = Game.width;
	edi.zoom.canvas.height = edi.zoom.view.height = Game.height;
	edi.zoom.load();
	edi.tool.set('zoom');
	edi.ui.markers.center = new Marker(0, 0);

	Game.canvas.addEventListener("mousewheel", function(ev) {
		edi.zoom.wheel(ev, function() {
			Game.ctx.miterLimit = 1;
		});
	}, false);

	Game.scene = 'game';

	edi.ui.selectScene = new UISelect({
		id: "select-scene",
		label: "scene:",
		options: Game.scenes.length ? Game.scenes : [ 'game' ],
		selected: Game.scene,
		callback: function(value) {
			Game.scene = value;
			edi.ui.reset();
		}
	});

	//  document.oncontextmenu = function() { return false; } 
	/* maybe dont need with tool selector */
}

function draw() {

	edi.zoom.clear(Game.ctx);
	edi.zoom.set(Game.ctx, { x: Game.width/2, y: Game.height/2 });

	// const view = edi.zoom.view;
	// Game.ctx.fillRect(view.x - Game.width/2, view.y - Game.height/2,view.width + Game.width, view.height + Game.height);

	/* not sure where to put this .... */
	Game.ctx.font = '16px monaco';
	Game.ctx.fillStyle = '#bb11ff';

	for (const key in edi.ui.markers) {
		edi.ui.markers[key].display();
	}

	/* draw sprites -- data, scenes? */
	for (const type in Game.sprites) {
		for (const key in Game.sprites[type])
			if (Game.sprites[type][key].scenes.includes(Game.scene)) 
				Game.sprites[type][key].display(edi.zoom.view);
	}

	if (edi.tool.current == 'ruler') edi.ruler.display();

	edi.zoom.clear(Game.ctx);
	
	for (const key in Game.ui) {
		if (Game.ui[key].scenes.includes(Game.scene)) 
			Game.ui[key].display(edi.zoom.view);
	}
}

/* what module would this be in? */
function mouseMoved(x, y, button) {
	if (button == 1) {
		/* does button exist if no mouse down? */
		if (edi.zoom.mouseDown) {
			const delta = edi.zoom.getDelta(x, y);
			if (edi.tool.current == 'transform' && edi.tool.item) 
				edi.tool.item.update({ x: Math.round(delta.x), y: Math.round(delta.y) });
			else 
				edi.zoom.updateView(delta.x, delta.y);
		}
	}

	edi.zoom.updatePrevious(x, y);
	if (!edi.tool.item) intersectItems(x, y, false);
}

function mouseDown(x, y, button) {
	if (button == 1) {
		if (edi.tool.current == 'location') {
			const xy = edi.zoom.translate(x, y);
			edi.tool.callback(xy.x, xy.y);
		} else {
			const item = intersectItems(x, y);
			if (edi.tool.item) {
				if (item && edi.tool.item != item) {
					edi.tool.item.selected = false;
					edi.tool.item = item;
					edi.tool.item.selected = true;
				} else if (!item) {
					edi.tool.item.selected = false;
					edi.tool.item = undefined;
				}
			} else if (item) {
				edi.tool.item = item;
				edi.tool.item.selected = true;
			}
			
			edi.zoom.mouseDown = true;
	
			/* can this happen in zoom module probably */
			if (!edi.zoom.previous.x) edi.zoom.previous.x = x;
			if (!edi.zoom.previous.y) edi.zoom.previous.y = y;
		}
	}
}

/* does button matter ?? */
function mouseUp(x, y, button) {
	if (button == 1) edi.zoom.mouseDown = false;
} 

/* what module should this be in??? */
function intersectItems(x, y, move) {
	for (const type in Game.sprites) {
		for (const key in Game.sprites[type]) {
			if (Game.sprites[type][key].scenes.includes(Game.scene)) {
				const intersect = Game.sprites[type][key].mouseOver(x, y, edi.zoom);
				if (intersect) return intersect;
			}
		}
	}

	for (const key in Game.ui) {
		if (Game.ui[key].scenes.includes(Game.scene)) {
			const intersect = Game.ui[key].mouseOver(x, y);
			if (intersect) return intersect;
		}
	}

	return false;
}