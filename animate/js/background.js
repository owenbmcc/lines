function Background() {
	const self = this;

	this.show = true;
	this.img = new Image();
	this.x = 0;
	this.y = 0;
	this.size = 0;
	this.ratio = 1;

	/* this is the only sprite-like thing in here
	game engine version might need sprite module... */

	this.loadImage = function(ev) {
		if (ev.which == 13) {
			self.img.src = this.value;
			self.img.onload = function() {
				/* set img size */
				self.size = self.img.width;
				self.ratio = self.img.width / self.img.height;
				/* set uis */
				self.xRange.setRange(-self.img.width, self.img.height);
				self.yRange.setRange(-self.img.height, self.img.height);
				self.sizeRange.setRange(self.img.width / 4, self.img.width * 4);
				self.sizeRange.setValue(self.img.width);
			}
		}
	};

	/* b key */
	this.toggle = function() {
		self.show = !self.show;
	}

	/* interface  */
	const panel = new Panel("background", "Background Image");
	Lines.interface.panels["background"] = panel;

	/* this doesn't really need key command bc have copy/paste anyway */
	panel.add( new UIText({
		id:"bkg-img", 
		title: "Add image URL hit enter",
		callback: this.loadImage
	}) );
	
	panel.addRow();
	panel.add( new UIToggleButton({
		id:"bkg-toggle",
		callback: this.toggle, 
		key: "b", 
		on: "Hide", 
		off: "Show" 
	}) );
	
	panel.addRow();
	this.xRange = new UIRange({
		id: "bkg-x", 
		label: "X", 
		callback: function() {
			self.x = this.value;
		}
	});
	panel.add(this.xRange);
	
	panel.addRow();
	this.yRange = new UIRange({
		id:"bkg-y", 
		label: "Y", 
		callback: function() {
			self.y = this.value;
		}
	});
	panel.add(this.yRange);
	
	panel.addRow();
	this.sizeRange = new UIRange({
		id: "bkg-size", 
		label: "Size", 
		callback: function() {
			self.size = this.value;
		}
	});
	panel.add(this.sizeRange);
	
}