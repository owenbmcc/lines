function FilesInterface(ui) {
	const self = this;

	this.title = new UIText({ 
		id:"title",
		callback: function() {
			lns.files.saveFile(self.title.getValue());
		}
	});

	ui.keys['s'] = new UIButton({
		id: "save",
		callback: function() {
			lns.files.saveFile(self.title.getValue(), false, function(title) {
				self.title.setValue(title);
			});
		},
		key: "s"
	});

	ui.keys['shift-s'] = new UIButton({
		id: "save-frame",
		callback: function() {
			lns.files.saveFile(self.title.getValue(), true, function(filename) {
				self.title.setValue(filename.split("/").pop());
			});
		},
		key: "shift-s"
	});

	ui.keys['o'] = new UIButton({
		id: "open",
		callback: function() {
			lns.files.loadFile(undefined, self.updateInterface);
		},
		key: "o"
	});

	ui.keys['shift-o'] = new UIButton({
		id: 're-open',
		callback: lns.files.reOpenFile,
		key: 'shift-o'
	});

	this.updateInterface = function(data, params) {
		self.title.setValue(lns.files.fileName.split('/').pop());
		ui.faces.fps.setValue(data.fps);

		lns.anim.layers.forEach(layer => {
			if (layer) {
				ui.faces.c.addColor(layer.c);
				ui.faces.c.setValue(layer.c);
			}
		});

		if (data.bg) lns.ui.faces.bgColor.setValue(data.bg);
		if (params.load) lns.ui.settings.canvasLoad();
		ui.updateInterface();
	};
}