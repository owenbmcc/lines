function Files(params) {
	const self = this;

	this.saveFilesEnabled = false;
	this.saveOnUnload = params.save || false;
	this.fileName = undefined;

	this.toggleSaveSettings = function() {
		self.saveOnUnload = !self.saveOnUnload;
	};

	/* s key - shift-s for single */
	this.saveFramesToFile = function(title, single, callback) {
		lns.data.saveLines();

		if (params.fit && confirm("Fit canvas?"))
			lns.canvas.fitCanvasToDrawing();

		const json = {};
		json.v = "2.2";
		json.w = Math.floor(+lns.canvas.width);
		json.h = Math.floor(+lns.canvas.height);
		json.fps = +lns.render.fps;
		if (params.bg) json.bg = lns.bgColor.color;
		// what if one color isn't used ?
		json.mc = lns.lineColor.colors.length > 1 ? true : false;

		/* save current frame */
		let frames;
		if (single && lns.frames[lns.currentFrame])
			frames = [lns.frames[lns.currentFrame]];
		else
			frames = lns.frames;
		json.f = frames;

		/* search frames for layers and drawings used */
		const drawingIndexes = [], layerIndexes = [];
		for (let i = 0; i < frames.length; i++) {
			const frame = frames[i];
			for (let j = 0; j < frame.length; j++) {
				const layerIndex = frame[j].l;
				const drawingIndex =  lns.layers[layerIndex].d;
				if (!layerIndexes.includes(layerIndex))
					layerIndexes.push(layerIndex);
				if (!drawingIndexes.includes(drawingIndex))
					drawingIndexes.push(drawingIndex);
			}
		}

		json.l = []; /* add layers */
		for (let i = 0; i < layerIndexes.length; i++) {
			const index = layerIndexes[i];
			json.l[index] = lns.layers[index];
		}

		json.d = [];
		for (let i = 0; i < drawingIndexes.length; i++) {
			const index = drawingIndexes[i];
			json.d[index] = lns.drawings[index];
		}

		const jsonfile = JSON.stringify(json);
		const filename = title || prompt("Name this file:");

		if (filename) {
			const blob = new Blob([jsonfile], { type: "application/x-download;charset=utf-8" });
			saveAs(blob, `${filename}.json`);
		}

		/* to set values ... */
		if (callback) callback(filename);
	};

	/* o key */
	this.loadFramesFromFile = function(filename, callback) {
		self.fileName = filename || prompt("Open file:");
		if (self.fileName) {
			if (callback) callback(self.fileName);
			fetch(self.fileName + '.json')
				.then(response => { return response.json() })
				.then(data => {
					lns.frames = data.f;
					lns.drawings = data.d;
					lns.layers = data.l;
					for (let i = 0; i < lns.frames.length; i++) {
						const fr = lns.frames[i];
						for (let j = 0; j < fr.length; j++) {
							lns.lineColor.addColorBtn(fr[j].c);
						}
					}
					/* set interface values */
					lns.canvas.setWidth(data.w);
					lns.canvas.setHeight(data.h);
					lns.render.setFps(data.fps);
					if (data.bg) lns.bgColor.set(data.bg);
					lns.render.reset();

					if (lns.interface) {
						lns.interface.title.setValue(self.fileName.split('/').pop());
						lns.interface.faces.width.set(data.w);
						lns.interface.faces.height.set(data.h);
						let color;
						lns.layers.some(layer => {
							if (layer) {
								color = layer.c;
								return true;
							}
						});
						lns.layers.forEach(layer => {
							if (layer)
								lns.interface.faces.lineColor.setValue(layer.c);
						});

						if (data.bg) lns.interface.faces.bgColor.setValue(data.bg);
						lns.interface.faces.fps.setValue(data.fps);
					}
				})
				.catch(error => {
					alert('File not found: ' + error.message);
					console.log(error);
				});
		}
	};

	this.reOpenFile = function() {
		if (self.fileName) localStorage.setItem('re-open', self.fileName);
		location.reload();
	};

	if (window.File && window.FileReader && window.FileList && window.Blob) {
		self.saveFilesEnabled = true;
		console.log("%c Save file enabled ", "color:lightgreen;background:black;");
	}

	window.addEventListener("beforeunload", function(ev) {
		if (self.saveOnUnload) lns.interface.saveSettings();
		if (params.reload) ev.returnValue = 'Did you save dumbhole?';
	});
}
