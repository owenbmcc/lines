class Texture {
	constructor(params, debug) {
		this.params = params;
		this.label = params.label;
		this.scenes = params.scenes;
		this.locations = params.locations;
		this.items = [];
		this.frame = params.frame || 'index';

		if (params.x && !params.locations) {
			this.locations = [{x: params.x, y: params.y}];
		}

		this.ui = {};
		this.uiAdded = false;

		if (params.src) {
			fetch(params.src)
				.then(response => { return response.json(); })
				.then(json => {
					this.json = json;
					for (let i = 0; i < this.locations.length; i++) {
						this.addItem(i, this.locations[i]);
					}
			});
		}
	}

	addJSON(json) {
		this.json = json;
		for (let i = 0; i < this.locations.length; i++) {
			this.addItem(i, this.locations[i]);
		}
	}

	/* doesn't start over if more locations */
	addItem(index, location) {
		console.log(location);
		const item = new Item({...this.params, x: location.x, y: location.y});
		item.label += ` ${index}`;
		item.addJSON(this.json);
		if (this.frame == 'index') item.animation.createNewState('still', index, index);
		else if (this.frame == 'random') item.animation.randomFrames = true;
		this.items.push(item);
	}

	addLocation(x, y) {
		this.addItem(this.locations.length, { x: Math.round(x), y: Math.round(y) }, this.params);		
		this.locations.push({ x: Math.round(x), y: Math.round(y) });
		this.removeUI();
		this.createUI();
	}

	display(view) {
		for (let i = 0; i < this.items.length; i++) {
			this.items[i].display(view);
		}
	}

	mouseOver(x, y, zoom) {
		let item = false;
		for (let i = 0; i < this.items.length; i++) {
			item = this.items[i].mouseOver(x, y, zoom);
			if (item) return item;
		}
		return item;
	}

	/* fucked up repeating this shit ... */
	addUI() {
		if (!this.row) this.row = edi.ui.panels.textures.addRow();
		if (this.ui.label && !this.uiAdded) {
			this.uiAdded = true;
			for (const key in this.ui) {
				const ui = this.ui[key];
				if (Array.isArray(ui)) {
					for (let i = 0; i < ui.length; i++) {
						edi.ui.panels.textures.add(ui[i], this.row);
					}
				} else {
					edi.ui.panels.textures.add(ui, this.row);
				}
			}
		} else if (!this.ui.label) {
			this.createUI();
		}
	}

	createUI() {
		const self = this;

		/* repeated in item */
		this.ui.label = new UIText({
			title: this.label,
			block: true,
			callback: function(value) {
				self.label = value;
			}
		});

		this.ui.add = new UIButton({
			title: "Add",
			callback: function() {
				edi.tool.set('location');
				edi.tool.callback = function(x, y) {
					self.addLocation(x, y);
					delete edi.tool.callback;
					edi.tool.set('zoom');
				}
			}
		});

		this.ui.frame = new UISelect({
			options: [ 'index', 'random' ],
			selected: self.frame,
			callback: function(value) {
				self.frame = value;
				for (let i = 0; i < self.items.length; i++) {
					if (self.items[i].animation.randomFrames != value) {
						if (value == 'random') {
							self.items[i].animation.randomFrames = true;
							self.items[i].animation.createNewState('random', 0, self.items[i].animation.numFrames);
						} else {
							self.items[i].animation.randomFrames = false;
							self.items[i].animation.createNewState('still', i, i);
						}
					}
				}
				/* item method ? */
			}
		});

/* can just add don't need to fuck with positions
		this.ui.locations = new UIDisplay({
			text: `${this.label} locations`,
			block: true
		}); // hide and show locations
		
		for (let i = 0; i < this.items.length; i++) {
			
			const label = this.items[i].label;
			const position = this.items[i].position;

			this.ui[`${label}-x`] = new UIText({
				label: `x`,
				value: position.x,
				callback: function(value) {
					position.x = +value;
				}
			});

			this.ui[`${label}-y`] = new UIText({
				label: `y`,
				value: position.y,
				callback: function(value) {
					position.y = +value;
				}
			});
		}
*/
		
		this.addUI();
	}

	removeUI() {
		edi.ui.panels.textures.clearComponents(this.row);
		this.uiAdded = false;
	}

	get data() {
		console.log(this.params.src);
		return {
			src: this.params.src,
			locations: this.items.map(item => item.position),
			scenes: this.scenes,
			tags: this.tags
		};
	}
}