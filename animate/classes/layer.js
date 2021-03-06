class Layer {
	constructor(params) {
		this.d =  params.d;
		this.x =  params.x || 0;
		this.y =  params.y || 0;
		this.f =  params.f;
		this.t =  params.t || [];
		this.n =  params.n;
		this.r =  params.r;
		this.w =  params.w;
		this.v =  params.v;
		this.c =  params.c;

		this.toggled = false;
		this.resetTweens();
	}

	clean() {
		delete this.toggled;
		delete this.pc;
	}

	toggle() {
		if (!this.toggled) {
			this.pc = this.c;
			this.c = "#00CC96";
		} else if (this.c == "#00CC96") {
			this.c = this.pc;
		}
		this.toggled = !this.toggled;
	}

	remove() {
		lns.anim.layers.splice(lns.anim.layers.indexOf(this), 1);
	}

	addTween(tween) {
		this.t.push(tween);
		if (tween.sf < this.startFrame) this.startFrame = tween.sf;
		if (tween.ef > this.endFrame) this.endFrame = tween.ef;
	}

	get startFrame() {
		return this.f.s;
	}

	set startFrame(f) {
		this.f.s = Math.max(0, +f);
		this.resetTweens();
	}

	get endFrame() {
		return this.f.e;
	}

	set endFrame(f) {
		this.f.e = Math.max(0, +f);
		this.resetTweens();
	}

	addIndex(index) {
		if (!this.isInFrame(index)) {
			if (this.f.s - 1 == index) this.f.s -= 1;
			else if (this.f.e + 1 == index) this.f.e += 1;
			else {
				return new Layer({
					...this,
					f: { s: index, e: index }
				});
			}
		}
		return this;
	}

	removeIndex(index) {
		if (this.startFrame == index && this.endFrame == index) return undefined;
		else if (this.startFrame == index) this.startFrame += 1;
		else if (this.endFrame == index) this.endFrame -= 1;
		else if (index > this.startFrame && index < this.endFrame) {
			const layer = _.cloneDeep(this);
			layer.startFrame = index + 1;
			layer.endFrame = this.endFrame;
			layer.resetTweens();

			this.endFrame = index - 1;
			this.resetTweens();

			return layer;
		}
		
		this.resetTweens();
		return this;
	}

	shiftIndex(index, n) {
		if (!n) n = -1;	/* n is shift num, negative or positive */

		/* what about insert ... */
		if (this.startFrame == index && this.startFrame == index)
			return this.removeIndex(index);

		if (this.startFrame >= index) this.startFrame += n;
		if (this.endFrame >= index) this.endFrame += n;

		this.resetTweens();
		return this;
	}

	isInFrame(index) {
		if (lns.anim.layers.indexOf(this) == -1) return false
		else if (index >= this.f.s && index <= this.f.e) return true;
		else return false;
	}

	get props() {
		return {
			n: this.n,
			r: this.r,
			w: this.w,
			v: this.v
		}
	}

	resetTweens() {
		for (let i = 0; i < this.t.length; i++) {
			const tween = this.t[i];
			if (tween.sf < this.startFrame) tween.sf = this.startFrame;
			if (tween.ef > this.endFrame) tween.ef = this.endFrame;
		}
	}
}