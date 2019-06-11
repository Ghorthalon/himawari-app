'use strict';

class Config {
	static get(key) {
		return JSON.parse(localStorage.getItem(key));
	}

	static set(key, value) {
		return localStorage.setItem(key, JSON.stringify(value));
	}

	static checkInitialConfig() {
		if (this.get('high-quality')) {
			this.set('high-quality', 0);
		}
	}
}

export default Config;

Config.checkInitialConfig();
