class Toggle extends UI {
	constructor(params, debug) {
		super(params, debug);
		this.toggled = false;
		this.on = "idle",
		this.off = "active";
	}

	setOnOff() {
		if (this.toggled) this.animation.state = this.on;
		else this.animation.state = this.off;
	}

	over(x, y) {
		if (this.tap(x,y)) {
			this.animation.state = 'over';
			return true;
		} else {
			this.setOnOff();
			this.clickStart = false;
			return false;
		}
	}

	down(x, y) {
		if (this.tap(x,y)) {
			this.animation.state = 'selected';
			document.body.style.cursor = 'pointer';
			this.clickStart = true;
		}
	}
	
	up(x, y) {
		if (this.tap(x,y) && this.clickStart) {
			this.toggled = !this.toggled;
			this.setOnOff();
			document.body.style.cursor = 'pointer';
			if (this.func) this.func();
		}
		this.clickStart = false;
	}
}