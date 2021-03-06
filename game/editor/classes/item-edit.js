class ItemEdit extends Item {
	constructor(params, src, debug) {
		super(params, src, debug);
		this.origin = params.src || src;
		this.displayLabel = false;
		this.outline = false;
		this.label = params.label;
		this.ui = new ItemEditUI(this, edi.ui.panels.items);
		this.locked = false;
	}

	display(view) {
		 // game colors ???
		if (!this.remove) {
			super.display(this.isInMapBounds(view));
			if (this.displayLabel) this.drawLabel();
			if (this.outline) this.drawOutline();
		}
	}

	isInMapBounds(view) {
		if (this.position.x + this.width > view.x - Game.width/2 &&
			this.position.x < view.x + view.width + Game.width/2 &&
			this.position.y + this.height > view.y - Game.height/2 &&
			this.position.y < view.y + view.height + Game.height/2 ) {
			return true;
		} else {
			return false;
		}
	}

	drawLabel() {
		Game.ctx.fillText(this.label, this.xy.x, this.xy.y);
	}

	drawOutline() {
		Game.ctx.strokeStyle = '#000000';
		Game.ctx.strokeRect(this.xy.x, this.xy.y, this.width, this.height);
		Game.ctx.strokeStyle = this.ui.color; /* ? */
		Game.ctx.beginPath();
		Game.ctx.arc(this.position.x, this.position.y, 5, 0, 2 * Math.PI, false);
		Game.ctx.stroke();
	}

	mouseOver(x, y, zoom) {
		if (this.isInMapBounds(zoom.view) && !this.locked) {
			const xy = zoom.translate(x, y);
			if (xy.x > this.xy.x &&
				xy.x < this.xy.x + this.width &&
				xy.y > this.xy.y &&
				xy.y < this.xy.y + this.height) {
				this.displayLabel = true;
				this.outline = true;
				return this;
			} else {
				if (!this.selected) {
					this.displayLabel = false;
					this.outline = false;
					return false;
				}
			}
		}
	}

	/* isSelected ? */
	set selected(select) {
		this._selected = select;
		this.displayLabel = select;
		this.outline = select;
		if (select) this.ui.add();
		else this.ui.remove();
		if (this.texture && select) this.texture.ui.add();
		else if (this.texture) this.texture.ui.remove();

		if (select) {
			if (!edi.tool.items.includes(this))
				edi.tool.items.push(this);
		} else {
			if (edi.tool.items.includes(this))
				edi.tool.items.splice(edi.tool.items.indexOf(this), 1);
		}
	}

	get selected() {
		return this._selected;
	}

	update(offset) {
		this.position.add(offset);
		this.ui.update({ x: this.position.x, y: this.position.y });
	}

	get data() {
		return {
			src: this.origin,
			x: this.position.x,
			y: this.position.y,
			scenes: this.scenes
		};
	}

	lock(lockState) {
		// console.log(this.origin, lockState);
		if (lockState !== undefined) this.locked = lockState;
		else this.locked = !this.locked;
		// console.log(this.locked);
	}
}