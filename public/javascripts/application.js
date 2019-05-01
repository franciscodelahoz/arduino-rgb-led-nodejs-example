import { Color } from './libraries/color.js';

const redSlider   = document.getElementById('red');
const greenSlider = document.getElementById('green');
const blueSlider  = document.getElementById('blue');
const redInput    = document.getElementById('redInput');
const greenInput  = document.getElementById('greenInput');
const blueInput   = document.getElementById('blueInput');
const colorInput  = document.getElementById('colorInput');
const colorShowed = document.getElementById('color');

var theColor = new Color(0, 0, 0);
const socket = io();

function sendColor() {
	socket.emit('Arduino::color', theColor.getRGBvalue());
}

function setSlidersValue() {
	redSlider.value   = theColor.getRedValue();
	greenSlider.value = theColor.getGreenValue();
	blueSlider.value  = theColor.getBlueValue();
}

function setInputValues() {
	redInput.value   = theColor.getRedValue();
	greenInput.value = theColor.getGreenValue();
	blueInput.value  = theColor.getBlueValue();

	redInput.style.borderColor   = `rgb(${theColor.getRedValue()}, 0, 0)`;
	greenInput.style.borderColor = `rgb(0, ${theColor.getGreenValue()}, 0)`;
	blueInput.style.borderColor  = `rgb(0, 0, ${theColor.getBlueValue()})`;
}

function setValueByComponent(component, value) {
	if (component === 'red')   { theColor.setRedValue(value);   }
	if (component === 'green') { theColor.setGreenValue(value); }
	if (component === 'blue')  { theColor.setBlueValue(value);  }
}

function setColorShowed() {
	colorShowed.style.backgroundColor = theColor.getRGBstring();
}

function setValueBySlider(slider, component) {
	setValueByComponent(component, slider.value);
	setInputValues();
	setColorShowed();
	colorInput.value = theColor.getHEXstring();
	sendColor();
}

function setValueByInput(component, value) {
	setValueByComponent(component, value);
	setSlidersValue();
	setColorShowed();
	colorInput.value = theColor.getHEXstring();
	sendColor();
}

function correctInputValue(input, component) {
	if (input.value < 0) {
		input.value = 0;
		setValueByInput(component, input.value);

	} else if (input.value > 255) {
		input.value = 255;
		setValueByInput(component, input.value);

	} else if (input.value.trim() === '') {
		setTimeout(() => {
			if (input.value.trim() === '') { input.value = 0; }
			setValueByInput(component, input.value);
		}, 1500);

	} else {
		setValueByInput(component, input.value);
	}
}

socket.on('connect', () => {
	redSlider.addEventListener('input', function() {
		setValueBySlider(this, 'red');
	});

	greenSlider.addEventListener('input', function() {
		setValueBySlider(this, 'green');
	});

	blueSlider.addEventListener('input', function() {
		setValueBySlider(this, 'blue');
	});

	redInput.addEventListener('input', function() {
		correctInputValue(this, 'red');
	});

	greenInput.addEventListener('input', function() {
		correctInputValue(this, 'green');
	});

	blueInput.addEventListener('input', function() {
		correctInputValue(this, 'blue');
	});

	colorInput.addEventListener('change', function() {
		theColor.setColorFromHex(this.value);
		setColorShowed();
		setSlidersValue();
		setInputValues();
		sendColor();
	});

	colorShowed.addEventListener('click', function() {
		colorInput.click();
	});

	socket.on('Color', (message) => {
		const { r: red, g: green, b: blue } = message;
		theColor.setColorFromRGB(red, green, blue);

		setSlidersValue();
		setInputValues();
		setColorShowed();
	});

	document.addEventListener('DOMContentLoaded', function() {
		setSlidersValue();
		setInputValues();
		setColorShowed();
	});
});
