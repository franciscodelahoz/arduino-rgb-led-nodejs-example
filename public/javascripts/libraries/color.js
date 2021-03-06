export class Color {
	constructor(red = 0, green = 0, blue = 0) {
		this.red   = red;
		this.green = green;
		this.blue  = blue;
	}

	getRedValue() {
		return this.red;
	}

	getGreenValue() {
		return this.green;
	}

	getBlueValue() {
		return this.blue;
	}

	setRedValue(value) {
		this.red = value;
	}

	setGreenValue(value) {
		this.green = value;
	}

	setBlueValue(value) {
		this.blue = value;
	}

	getRGBvalue() {
		return { r: this.red, g: this.green, b: this.blue };
	}

	getRGBstring() {
		return `rgb(${this.red}, ${this.green}, ${this.blue})`;
	}

	colorComponentToHEX(component) {
		var hex = Number(component).toString(16).toUpperCase();
		return hex.length === 1 ? `0${hex}` : hex;
	}

	getHEXstring() {
		const redComponent   = this.colorComponentToHEX(this.red);
		const greenComponent = this.colorComponentToHEX(this.green);
		const blueComponent  = this.colorComponentToHEX(this.blue);

		return `#${redComponent}${greenComponent}${blueComponent}`;
	}

	HEXtoRGB(hexColor) {
		var redComponent, greenComponent, blueComponent;
		var toConvertColor = hexColor.replace(/\#/g, '');

		if (toConvertColor.length === 3) {
			redComponent   = parseInt(toConvertColor.substring(0, 1), 16);
			greenComponent = parseInt(toConvertColor.substring(1, 2), 16);
			blueComponent  = parseInt(toConvertColor.substring(2, 3), 16);
		} else {
			redComponent   = parseInt(toConvertColor.substring(0, 2), 16);
			greenComponent = parseInt(toConvertColor.substring(2, 4), 16);
			blueComponent  = parseInt(toConvertColor.substring(4, 6), 16);
		}

		return { r: redComponent, g: greenComponent, b: blueComponent };
	}

	setColorFromRGB(red, green, blue) {
		this.red   = red;
		this.green = green;
		this.blue  = blue;
	}

	setColorFromHex(colorHEXvalue) {
		const RGBcolor = this.HEXtoRGB(colorHEXvalue);

		this.red   = RGBcolor.r;
		this.green = RGBcolor.g;
		this.blue  = RGBcolor.b;
	}
}
