class UI {
	constructor(params) {
		this.el = document.getElementById(params.id); // attempt to find elem in html
		if (!this.el) { // if not in html create it
			if (params.tag) this.el = document.createElement(params.tag);
			else this.el = document.createElement("div");
			if (params.id) this.el.id = params.id;
		}

		if (params.callback) this.callback = params.callback;
		if (params.label) this.label = params.label;
		if (params.arguments) this.arguments = params.arguments;
		if (params.prompt) this.prompt = params.prompt;
		if (params.value != undefined) this.el.value = params.value;
		if (params.key) this.setKey(params.key);
		
		if (params.css) {
			for (const key in params.css) {
				this.el.style[key] = params.css[key];
			}
		}
	}

	press() {
		this.el.classList.add('press');
		this.el.addEventListener('transitionend', function() {
			this.el.classList.remove('press');
		}.bind(this));
	}

	setKey(key) {
		this.el.title = key; // hover title key text
	}
	
	addClass(c) {
		this.el.classList.add(c);
	}
	
	setId(id) {
		this.el.id = id;
	}
	
	setValue(value) {
		this.el.value = value;
	}
	
	getValue() {
		return this.el.value;
	}
	
	addLabel(key) {
		const label = document.createElement("label");
		label.textContent = this.label;
		if (this.el.title) label.title = this.el.title;
		this.el.parentNode.insertBefore(label, this.el);
	}
	
	append(elem) {
		this.el.appendChild(elem);
	}
}