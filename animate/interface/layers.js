function Layers() {
	const self = this;
	
 	/* these are still */
	this.layers = [];
	
	this.updateProperty = function(prop, value) {
		for (let i = 0; i < lns.anim.layers.length; i++) {
			const layer = lns.anim.layers[i];
			if (layer.toggled) layer[prop] = value;
		}
	};

	/* z */ 
	this.cutLayerSegment = function() {
		for (let i = 0; i < lns.anim.layers.length; i++) {
			const layer = lns.anim.layers[i];
			if (layer.toggled) {
				const drawing = lns.anim.drawings[layer.d];
				drawing.pop(); /* remove "end" */
				drawing.pop(); /* remove segment */
				drawing.push('end'); /* new end */
			}
		}
	};
	/* all fucked */
	
	this.cutLayerLine = function() {
		for (let i = 0; i < lns.anim.layers.length - 1; i++) {
			const layer = lns.anim.layers[i];
			if (layer.toggled) {
				const drawing = lns.anim.drawings[layer.d];
				drawing.pop(); /* remove "end" */
				for (let i = drawing.length - 1; i > 0; i--) {
					if (drawing[i] != 'end') drawing.pop();
					else break;
				}
			}
		}
		/* what about when there's no more lines ?? */
	}; /* shift z */
	
	this.clone = function() { 
		for (let i = 0; i < lns.anim.layers.length; i++) {
			const layer = lns.anim.layers[i];
			if (layer.toggled) {
				layer.toggle();
				layer.ui.toggle.on(); /* ick */
				
				const n = new Layer(_.cloneDeep(layer));
				delete n.ui;
				n.startFrame = n.endFrame = layer.endFrame + 1;
				lns.anim.layers.push(n);
				self.update();
				layer.ui.update();
				n.ui.update();
				lns.ui.setFrame(layer.endFrame + 1);
			}
		}
	};

	this.split = function() { 
		for (let i = 0; i < lns.anim.layers.length; i++) {
			const layer = lns.anim.layers[i];
			if (layer.toggled && layer.isInFrame(lns.anim.currentFrame)) {
				layer.toggle();
				layer.ui.toggle.on(); /* ick */
				const n = new Layer(_.cloneDeep(layer), lns.anim.layers.length);
				n.startFrame = lns.anim.currentFrame + 1;
				delete n.ui;
				layer.endFrame = lns.anim.currentFrame;
				lns.anim.layers.push(n);
				self.update();
				n.ui.update();
				layer.ui.update();
				lns.ui.setFrame(layer.endFrame + 1);
			}
		}
	};

	this.addTween = function() {

		const tween = {
			prop: 'e',
			sf: lns.anim.currentFrame,
			ef: lns.anim.currentFrame + 10,
			sv: 0,
			ev: 'end'
		};

		const modal = new UIModal('Add Animation', lns, this.position, function() {
			for (let i = 0; i < lns.anim.layers.length; i++) {
				const layer = lns.anim.layers[i];
				if (layer.toggled) {
					if (tween.ev == 'end') tween.ev = lns.anim.drawings[layer.d].length;
					layer.addTween(tween);
					layer.ui.update();
					layer.ui.addTween(tween);
					layer.toggle();
					layer.ui.toggle.on(); /* ick */
					lns.ui.update();
				}
			}
		});

		modal.add(new UILabel({ text: 'Property:' }));
		modal.add(new UISelect({
			options: ['e', 's', 'n', 'r', 'w', 'v'],
			value: 'e',
			selected: 'e',
			callback: function(value) {
				tween.prop = value;
			}
		}));

		modal.add(new UILabel({ text: 'Start:' }));

		modal.add(new UIBlur({
			value: tween.sf,
			callback: function(value) {
				tween.sf = +value;
			}
		}));

		modal.add(new UILabel({ text: 'End:' }));
		modal.add(new UIBlur({
			value: tween.ef,
			callback: function(value) {
				tween.ef = +value;
			}
		}));

		modal.add(new UILabel({ text: 'Begin:' }));
		modal.add(new UIBlur({
			value: tween.sv,
			callback: function(value) {
				tween.sv = +value;
			}
		}));

		modal.add(new UILabel({ text: 'End:' }));
		modal.add(new UIBlur({
			value: tween.ev,
			callback: function(value) {
				tween.ev = +value;
			}
		}));
	};

	this.selectedAll = false;
	this.selectAll = function() {
		for (let i = 0; i < lns.anim.layers.length; i++) {
			const layer = lns.anim.layers[i];
			if (layer.isInFrame(lns.anim.currentFrame)) {
				if (layer.toggled != self.selectedAll) layer.toggle();
				layer.toggle();
			}
		}
		self.selectedAll = !self.selectedAll;
	};

	/* this doesn't get called anywhere else ... can be in update */
	this.addUI = function(layer, index) {
		layer.ui = new UILayer({
			type: 'layer',
			index: index,
			callback: function() {
				layer.toggle();
				lns.draw.setProperties(layer.props);
			}
		}, layer);
		self.panel.layers.append(layer.ui);
	};

	this.update = function() {
		// is this crazy ? 
		self.panel.layers.el.style.width = `${lns.ui.list[0].el.getBoundingClientRect().width * (lns.anim.endFrame + 1)}px`
		
		/* -1 to not show draw layer */
		for (let i = 0; i < lns.anim.layers.length - 1; i++) {
			const layer = lns.anim.layers[i];
			if (!layer.ui) self.addUI(layer, i);
			else layer.ui.update();

			if (!document.body.contains(layer.ui.el)) {
				self.panel.layers.append(layer.ui);
			}
			/* gotta be a better way to organize this so layer creates its own ui */
		}
	};
}