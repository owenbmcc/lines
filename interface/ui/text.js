class UIText extends UIInput {
	constructor(params) {
		super(params);
		this.el.type = "text";
		this.el.placeholder = this.el.placeholder || params.placeholder || params.text || params.value;

		this.el.addEventListener('focus', ev => {
			this.el.select();
		});

		this.el.addEventListener('keyup', ev => {
			if (ev.which == 13) this.update(ev.target.value);
		});


		this.el.onblur = ev => {
			this.value = this.el.placeholder;
			/* shows that value wasn't taken without enter */
		};
	}

	handler(ev, me) {
		me.update(ev.target.value || prompt(me.prompt));
	}

	update(value) {
		this.callback(value);
		this.value = value;
		this.el.blur(); // keep going back and forth on this??
		// 11.27.2019 to prevent settings not saving when something focused
	}

	set value(_value) {
		this.el.value = this.el.placeholder = _value;
		this.el.blur();
	}

	get value() {
		return super.value;
	}
}