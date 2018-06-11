export class Color {

	constructor(red = 0, green = 0, blue = 0) {
		this.red = red;
		this.green = green;
		this.blue = blue;
	}
	
	setRedValue(value)   { this.red = value   }
	setGreenValue(value) { this.green = value }
	setBlueValue(value)  { this.blue = value  }

	getRedValue()   { return this.red   }
	getGreenValue() { return this.green }
	getBlueValue()  { return this.blue  }

	getColor() {
		return { r: this.red, g: this.green, b: this.blue };
	}

	getRGBvalue() {
		return `rgb(${this.red}, ${this.green}, ${this.blue})`;
	}

	componentToHEX(component) {
		var hex = Number(component).toString(16).toUpperCase();
		return hex.length === 1 ? `0${hex}` : hex;
	}

	getHEXvalue() {
		const redComponent   = this.componentToHEX(this.red);
		const greenComponent = this.componentToHEX(this.green);
		const blueComponent  = this.componentToHEX(this.blue);

		return `#${redComponent}${greenComponent}${blueComponent}`;
	}

	HEXtoRGB(hexColor) {
		hexColor = hexColor.replace(/\#/g, '');
	
		if (hexColor.length == 3) {
			var redComponent   = parseInt(hexColor.substring(0, 1), 16);
			var greenComponent = parseInt(hexColor.substring(1, 2), 16);
			var blueComponent  = parseInt(hexColor.substring(2, 3), 16);
		} else {
			var redComponent   = parseInt(hexColor.substring(0, 2), 16);
			var greenComponent = parseInt(hexColor.substring(2, 4), 16);
			var blueComponent  = parseInt(hexColor.substring(4, 6), 16);
		}
	
		return { r: redComponent, g: greenComponent, b: blueComponent }
	}

	setValueFromHex(colorHEXvalue) {
		const RGBcolor = this.HEXtoRGB(colorHEXvalue);

		this.red   = RGBcolor.r;
		this.green = RGBcolor.g;
		this.blue  = RGBcolor.b;
	}

}