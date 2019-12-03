window.addEventListener("load", function() {

	window.lns = {};

	// modules
	lns.canvas = new Canvas("lines", 512, 512, "#ffffff", true);
	lns.render = new Render(10); // (lps)

	lns.lines = new Animation(lns.canvas.ctx);
	lns.anim = new Animation(lns.canvas.ctx);
	lns.lines.debug = true;

	lns.draw = new Draw(lns.lines, { n: 2, r: 1, w: 1, v: 0.1, c: '#000000' }); // defaults
	lns.bgImage = new Background();
	lns.data = new Data(lns.anim);
	lns.files = new Files({
		fit: false, /* fit to canvas when saving */
		save: false, /* save settings on unload  */
		load: true, /* load setttings after file load */
		reload: false, /* confirm reload */
		bg: true /* bg color */
	});
	
	lns.ui = new Interface(lns);
	lns.ui.capture = new Capture();
	lns.ui.states = new States();
	lns.ui.palette = new Palette();
	lns.ui.layers = new Layers();
	lns.ui.drawings = new Drawings();
	lns.ui.fio = new FilesInterface(lns.ui);
	animateInterface(lns.ui);
	lns.ui.settings = new Settings(lns, 'lns', appSave, appLoad);

	lns.ui.settings.canvasLoad = function() {
		if (localStorage['settings-lns']) {
			const settings = JSON.parse(localStorage['settings-lns']);

			/* wtf */
			if (settings) lns.canvas.setLineWidth(settings.lineWidth); 
		}
	};
	
	lns.ui.load('./interface/interface.json', function() {
		const url = location.search.split('=')[1]
		if (url) lns.files.loadFile(url.split('.')[0], lns.ui.fio.update);
		lns.render.start();
	});
});

function appSave() {
	return {
		canvasColor: lns.canvas.bgColor,
		lineWidth: lns.canvas.ctx.lineWidth,
		c: lns.draw.layer.c,
		width: lns.canvas.width,
		height: lns.canvas.height,
		fps: lns.anim.fps,
		lps: lns.render.lps,
		onionSkinIsVisible: lns.render.onionSkinIsVisible,
		onionSkinNum: lns.render.onionSkinNum,
		mouseInterval: lns.draw.mouseInterval,
		palettes: lns.ui.palette.palettes,
		rl: lns.ui.rl.isOn
		// displayLayers: lns.ui.layers.canvas.canvas.style.display
	};
}

function appLoad(settings) {

	/* still annoying to have "faces" but better than using both 
		maybe call faces props */
	
	/* environment */
	// lns.render.onionSkinIsVisible = settings.onionSkinIsVisible;

	/* environment + ui + lns.anim */
	lns.ui.faces.lps.update(settings.lps); // not lns.lines bc only in one frame 

	/* environment + ui */
	// lns.ui.faces.onionSkinIsVisible.update(settings.onionSkinIsVisible);
	/* in new ui maybe the toggle knows the property and can check to update ... ? 
		also don't really need this ... */
	lns.ui.faces.onionSkinNum.update(settings.onionSkinNum);
	lns.ui.faces.mouseInterval.update(settings.mouseInterval);
	lns.ui.faces.width.update(settings.width);
	lns.ui.faces.height.update(settings.height);
	lns.ui.faces.bgColor.update(settings.canvasColor);
	// has to be called last bc of reset ... 
	// update ui from canvas, or callback ... fml
	lns.ui.faces.lineWidth.update(settings.lineWidth);

	/* lns.anim + ui */
	lns.ui.faces.fps.update(settings.fps);

	/* lns.lines + ui */
	lns.ui.faces.c.update(settings.c);

	// palettes - no need to separate module from ui bc its all ui - only one not a ui with update ... 
	lns.ui.palette.load(settings.palettes);

	/* ui only */
	lns.ui.rl.update(settings.rl);  // toggle not dependent on another value
}
