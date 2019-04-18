function DrawingInterface() {
	const self = this;

	/* play back menu */
	const panel = new Panel("play-back-menu", "Play Back");

	/* play */
	panel.add(new UIToggleButton({
		id:"play", 
		callback: Lines.draw.toggle, 
		key: "space", 
		on: "Play", 
		off: "Pause"
	}));

	this.frameNumDisplay = new UIDisplay({
		id: "frame", 
		label: "Frame: ", 
		initial: "0"
	});
	panel.add(this.frameNumDisplay); 

	/* f - go to frame */
	panel.add(new UIButton({
		title: "Go To Frame",
		callback: function() {
			const f = prompt("Frame:");
			Lines.interface.beforeFrame();
			Lines.draw.setFrame(f);
			Lines.interface.afterFrame();
		},
		key: "f"
	}));

	panel.addRow();

	/* prev frame */
	panel.add(new UIButton({
		title: "Prev",
		callback: Lines.interface.prevFrame,
		key: "w"
	}));

	/* next frame */
	panel.add(new UIButton({
		title: "Next",
		callback: Lines.interface.nextFrame,
		key: "e"
	}));

	panel.addRow();

	/* l key - onion skin num */
	panel.add(new UISelect({
		options: [0,1,2,3,4,5,6,7,8,9,10],
		selected: 0,
		label: "Onion Skin",
		callback: function(ev) {
			if (ev.type == "change") {
				Lines.draw.onionSkinNum = +this.value;
				this.blur();
			} else if (ev.type == "keydown") {
				const n = prompt("How many onion skin frames?");
				Lines.draw.onionSkinNum = +n;
				this.setValue(+n);
			}
		},
		key: "l"
	}));

	/* shift l - toggle onion visibility */
	panel.add(new UIToggleButton({
		on: "Hide Onion",
		off: "Show Onion",
		callback: function() {
			Lines.draw.onionSkinIsVisible = !Lines.draw.onionSkinIsVisible;
		},
		key: "shift-l"
	}));

	panel.addRow();

	/* ; key - fps */
	this.fpsSelect = new UISelect({
		label: "FPS",
		options: [1,2,5,10,12,15,24,30,60],
		selected: Lines.draw.fps,
		callback: function(ev) {
			if (ev.type == "change") {
				Lines.draw.setFps(+this.value);
				this.blur();
			} else if (ev.type == "keydown") {
				const n = prompt("FPS?");
				Lines.draw.setFps(+n);
				self.fpsSelect.setValue(+n);
			}
		},
		key: ";"
	});
	panel.add(this.fpsSelect);

	panel.addRow();
	/* ' key - ' lines per second */
	panel.add(new UISelect({
		label: "Lines/Second",
		options: [1,2,5,10,12,15,24,30,60],
		selected: 10,
		callback: function(ev) {
			if (ev.type == "change") {
				Lines.draw.setLps(this.value);
				this.blur();
			} else {
				const n = prompt("Lines per second?");
				Lines.draw.setLps(n);
				this.setValue(n);
			}
		},
		key: "'"
	}));

	const capturePanel = new Panel("capture-menu", "Capture");
	/* crtl k - capture cycle */
	capturePanel.add(new UIButton({
		title: "Capture Cycle",
		callback: Lines.draw.captureCycle,
		key: "ctrl-k"
	}));

	/* k -  capture frames with no functions */
	capturePanel.add(new UIButton({
		title: "Capture Frame",
		callback: function() {
			Lines.draw.captureFrames = 1;
		},
		key: "k"
	}));

	/* n - capture bg */
	capturePanel.add(new UIToggleButton({
		title: "Capture BG Color",
		on: "Capture BG",
		off: "Capture BG",
		callback: function() {
			Lines.draw.captureWithBackground = !Lines.draw.captureWithBackground;
		},
		key: "n"
	}));

	/* shift-k - capture multiple frames */
	capturePanel.add(new UIButton({
		title: "Capture Multiple Frames",
		callback: function() {
			Lines.draw.captureFrames = prompt("Capture how many frames?");
		},
		key: "shift-k"
	}));

	/* alt k */
	capturePanel.add(new UIToggleButton({
		title: "Video Capture",
		on: "Start Video",
		off: "Stop Video",
		callback: Lines.canvas.videoCapture,
		key: "alt-k"
	}));

	/* brush menu */
	const brushPanel = new Panel("brush-menu", "Brush");
	
	this.brushElem = new UIRange({
		label: "Brush",
		value: 0,
		min: 0,
		max: 10,
		input: "brush-range",
		callback: function(ev) {
			/* not dry */
			if (ev.type == 'keyup') {
				self.brushElem.setValue(+ev.target.value);
				Lines.drawEvents.brush = +ev.target.value;
			} else {
				Lines.drawEvents.brush = +this.value;
			}
		}
	});
	brushPanel.add(this.brushElem);

	this.brushSpreadElem = new UIRange({
		label: "Brush Spread",
		value: 1,
		min: 1,
		max: 5,
		input: "brush-spread-range",
		callback: function(ev) {
			/* not dry */
			if (ev.type == 'keyup') {
				self.brushElem.setValue(+ev.target.value);
				Lines.drawEvents.brushSpread = +ev.target.value;
			} else {
				Lines.drawEvents.brushSpread = +this.value;
			}
		}
	});
	brushPanel.add(this.brushSpreadElem);

	this.dotsElem = new UIRange({
		label: "Dots",
		value: 10,
		min: 10,
		max: 50,
		input: "dots-range",
		callback: function(ev) {
			/* not dry */
			if (ev.type == 'keyup') {
				self.dotsElem.setValue(+ev.target.value);
				Lines.drawEvents.dots = +ev.target.value;
			} else {
				Lines.drawEvents.dots = +this.value;
			}
		}
	});
	brushPanel.add(this.dotsElem);

	this.grassElem = new UIRange({
		label: "Grass",
		value: 0,
		min: 0,
		max: 20,
		input: "grass-range",
		callback: ev => {
			if (ev.type == 'keyup') {
				self.grassElem.setValue(+ev.target.value);
				Lines.drawEvents.grass = +ev.target.value;
			} else {
				Lines.drawEvents.grass = +ev.target.value;
			}
		}
	});
	brushPanel.add(this.grassElem);


	/* lines panel */
	const linesPanel = new Panel("lines-menu", "Lines");

	/* reset defaults */
	linesPanel.add(new UIButton({
		title: "Reset Defaults",
		callback: function() {
			Lines.drawEvents.setDefaults();
			self.segNumElem.setValue(Lines.drawEvents.defaults.n);
			self.jiggleElem.setValue(Lines.drawEvents.defaults.r);
			self.wiggleElem.setValue(Lines.drawEvents.defaults.w);
			self.wiggleSpeedElem.setValue(Lines.drawEvents.defaults.v);
		}
	}));

	/* h - segment number per line */
	this.segNumElem = new UIRange({
		label: "Segments",
		value: Lines.drawEvents.segNumRange,
		input: "num-range",
		min: 1,
		max: 20,
		callback: function(ev) {
			/* this is not DRY  but more acceptable than it was */
			let value = +(ev.target.value || prompt("Segment num?"));
			self.segNumElem.setValue(value);
			Lines.drawEvents.segNumRange = value;
			if (self.layers.length > 0) {
				self.updateLayerProperty('n', value);
			}
		},
		key: "h"
	});
	linesPanel.add(this.segNumElem);

	/* j - jiggle amt */
	this.jiggleElem = new UIRange({
		label: "Jiggle",
		value: Lines.drawEvents.jiggleRange,
		min: 0,
		max: 10,
		input: "jiggle-range",
		callback: function(ev) {
			/* not dry */
			let value = +(ev.target.value || prompt("Jiggle num?"));
			self.jiggleElem.setValue(value);
			Lines.drawEvents.jiggleRange = value;
			if (self.layers.length > 0) {
				self.updateLayerProperty('r', value);
			}
		},
		key: "j"
	});
	linesPanel.add(this.jiggleElem);

	this.wiggleElem = new UIRange({
		label: "Wiggle",
		value: Lines.drawEvents.wiggleRange,
		min: 0,
		max: 15,
		input: "wiggle-range",
		callback: function(ev) {
			/* not dry */
			let value = +ev.target.value;
			self.wiggleElem.setValue(value);
			Lines.drawEvents.wiggleRange = value;
			if (self.layers.length > 0) {
				self.updateLayerProperty('w', value);
			}
		}
	});
	linesPanel.add(this.wiggleElem);

	this.wiggleSpeedElem = new UIRange({
		label: "Wiggle Amt",
		value: Lines.drawEvents.wiggleSpeed,
		min: 0,
		max: 5,
		step: 0.005,
		input: "wiggle-speed-range",
		callback: function(ev) {
			/* not dry */
			let value = +ev.target.value;
			Lines.drawEvents.wiggleSpeed = value;
			self.wiggleSpeedElem.setValue(value);
			if (self.layers.length > 0) {
				self.updateLayerProperty('v', value);
			}
		}
	});
	linesPanel.add(this.wiggleSpeedElem);

	this.lineWidth = new UIRange({
		label: "Line Width",
		value: 1,
		min: 0.25,
		max: 4,
		step: 0.25,
		input: "line-width-range",
		callback: function(ev) {
			let value = +ev.target.value;
			Lines.canvas.ctx.lineWidth = value;
			self.lineWidth.setValue(value);
		}
	});
	linesPanel.add(this.lineWidth);

	/* layer panel */
	this.layerPanel = new Panel("layer-menu", "Layer");
	this.frameRow = this.layerPanel.addRow();
	this.layerPanel.addRow();
	this.layers = [];

	this.updateLayerProperty = function(prop, value) {
		for (let i = 0; i < self.layers.length; i++) {
			if (self.layers[i].toggled)
				self.layers[i][prop] = value;
		}
	};

	this.resetLayers = function() {
		while (self.layers.length > 0) {
			self.layerToggle(self.layers[0]);
		}
		self.layerPanel.clearComponents(self.frameRow);
		self.layers = [];
		while (self.drawingPanel.rows.length > 1) {
			self.drawingPanel.removeRow(self.drawingPanel.rows[self.drawingPanel.rows.length - 1]);
		}
	};

	this.layerToggle = function(layer) {
		if (!layer.toggled) {
			layer.prevColor = layer.c;
			layer.c = "00CC96";
			layer.toggled = true;
		} else {
			layer.c = layer.prevColor;
			delete layer.prevColor;
			delete layer.toggled;
			const index = self.layers.indexOf(layer);
			if (index != -1) self.layers.splice(index, 1);
		}
	};

	this.killLayer = function() {
		const layers = self.layers.filter(l => l.toggled);
		
		// remove frames
		for (let i = Lines.frames.length - 1; i >= 0; i--) {
			const frame = Lines.frames[i];
			for (let j = frame.length - 1; j >= 0; j--) {
				if (Lines.layers[frame[j].l].toggled)
					frame.splice(j, 1);
			}
		}

		// remove layers
		for (let i = Lines.layers.length - 1; i >= 0; i--) {
			console.log(i, Lines.layers[i])
			if (Lines.layers[i].toggled)
				Lines.layers[i].remove = true; // remove in fio
			// this is dumb right?  structure depends on index like drawing
		}
	};

	this.displayLayers = function() {
		self.resetLayers();
		if (Lines.frames[Lines.currentFrame]) {
			for (let i = 0; i < Lines.frames[Lines.currentFrame].length; i++) {
				const layer = Lines.frames[Lines.currentFrame][i];
				const index = Lines.layers[layer.l].d;
				self.layers.push(layer);
				layer.toggled = false;
				const toggleLayer = new UIToggleButton({
					on: index,
					off: index,
					callback: function() {
						self.layerToggle(layer);
					}
				});
				self.layerPanel.add(toggleLayer, self.frameRow);
			}
		}
	};

	this.cutLayerSegment = function() {
		for (let i = 0; i < self.layers.length; i++) {
			const layer = self.layers[i];
			const drawing = Lines.drawings[layer.d];
			drawing.pop(); /* remove "end" */
			drawing.pop(); /* remove segment */
			drawing.push('end'); /* new end */
			layer.e = drawing.length; /* update layer end num */
		}
	};

	this.updateLayerColor = function(ev) {
		for (let i = 0; i < self.layers.length; i++) {
			if (self.layers[i].toggled) {
				self.layers[i].c = self.layers[i].prevColor = ev.target.value;
			}
		}
	};

	this.layerPanel.add(new UIButton({
		title: "Update Layers",
		callback: self.displayLayers
	}));

	/* maybe use regular cut here? */
	this.layerPanel.add(new UIButton({
		"title": "Cut Selected Segment",
		key: "alt-z",
		callback: self.cutLayerSegment
	}));

	/* kill layer */
	this.layerPanel.add(new UIButton({
		"title": "Kill Layer",
		callback: self.killLayer
	}));

	/* change color */
	this.layerPanel.add(new UIText({
		label: "Change Color",
		value: Lines.lineColor.color,
		callback: self.updateLayerColor
	}));

	/* drawing panel */
	this.drawingPanel = new Panel("drawing-menu", "Drawings");

	this.drawingPanel.add(new UIButton({
		title: "Update Drawings",
		callback: function() {
			/* have to regenerate this stuff to work with other frames */
			self.resetLayers();
			for (let i = 0; i < Lines.drawings.length; i++) {
				let layer; /* check if layer is in frame already */
				let layerIndex;
				const frame = Lines.frames[Lines.currentFrame];
				if (frame) {
					for (let k = 0; k < frame.length; k++) {
						if (i == Lines.layers[frame[k].l].d)
							layer =  Lines.layers[frame[k].l];
					}
				}
				
				if (!layer) { /* then check existing layers */
					for (let j = 0; j < Lines.layers.length; j++) {
						const layers = Lines.layers[j];
						for (let k = 0; k < layers.length; k++) {
							if (i == Lines.layers[k].d) {
								layer = Lines.layers[k];
								layerIndex = k;
								break;
							}
						}
					}
				}
				
				if (!layer) { /* then create a layer*/
					const drawing = Lines.drawings[i];
					if (drawing != null) {
						layer = {
							d: i,
							s: 0,
							e: drawing.length,
							c: '000000',
							...Lines.drawEvents.defaults,
							x: 0,
							y: 0
						};
					}
					Lines.layers.push(layer);
					layerIndex = Lines.layers.length - 1;
				}

				if (layer) self.layers.push(layer);

				const row = self.drawingPanel.addRow(i + '-drawing-row');
					
				self.drawingPanel.add(new UIToggleButton({
					title: i,
					on: i,
					off: i,
					callback: function() {
						if (layer) Lines.drawingInterface.layerToggle(layer);
					}
				}), row);

				self.drawingPanel.add(new UIButton({
					title: "+",
					callback: function() {
						Lines.data.saveLines();
						if (Lines.frames[Lines.currentFrame] == undefined) 
							Lines.frames[Lines.currentFrame] = [];
						console.log(layer);
						if (layer) Lines.frames[Lines.currentFrame].push({ l: layerIndex });
						else console.log('%c no drawing', 'color:white;background:hotpink;');
					}
				}), row);

				self.drawingPanel.add(new UIButton({
					title: "-",
					callback: function() {
						Lines.data.saveLines();
						const frame = Lines.frames[Lines.currentFrame];
						if (frame) {
							for (let i = frame.length - 1; i >= 0; i--) {
								if (frame[i].l == layerIndex) frame.splice(i, 1);
							}
						}
					}
				}), row);
			}
		}
	}));

	/* u - change mouse timer */
	const mousePanel = new Panel("mouse-menu", "Mouse");
	this.mouseElem = new UIRange({
		label: "Mouse Time",
		value: Lines.drawEvents.mouseInterval,
		min: 0,
		max: 100,
		input: "mouse-range",
		callback: function(ev) {
			/* not dry */
			if (ev.type == 'keyup') {
				Lines.drawEvents.mouseInterval = +ev.target.value;
				self.mouseElem.setValue(+ev.target.value);
			} else if (ev.type == "input") {
				Lines.drawEvents.mouseInterval = +this.value;
			} else if (ev.type == "keydown") {
				const n = prompt("Mouse move?");
				Lines.drawEvents.mouseInterval = +n;
			}
		},
		key: "u"
	});
	mousePanel.add(this.mouseElem);
}