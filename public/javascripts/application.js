import { Color } from './libraries/color.js';

const redSlider   = document.getElementById('red');
const greenSlider = document.getElementById('green');
const blueSlider  = document.getElementById('blue');
const redInput    = document.getElementById('redInput');
const greenInput  = document.getElementById('greenInput');
const blueInput   = document.getElementById('blueInput');
const colorInput  = document.getElementById('colorInput');
const colorShowed = document.getElementById('color');
const aboutButton = document.getElementById('about');

var theColor = new Color(0, 0, 0);
const socket = io();

function emitColorToArduino() {
	socket.emit('Arduino::color', theColor.getRGBvalue());
}

function emitColorFromPickers() {
	socket.emit('picker', theColor.getRGBvalue());
}

function emitColorFromInputs(component, value) {
	socket.emit(`input_${component}`, value);
}

function emitColorFromSliders(component, value) {
	socket.emit(`slider_${component}`, value);
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
	emitColorToArduino();
	emitColorFromSliders(component, slider.value);
}

function setValueByInput(component, value) {
	setValueByComponent(component, value);
	setSlidersValue();
	setColorShowed();
	colorInput.value = theColor.getHEXstring();
	emitColorToArduino();
	emitColorFromInputs(component, value);
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
		emitColorToArduino();
		emitColorFromPickers();
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

	socket.on('s_picker', (color) => {
		theColor.setColorFromRGB(color.r, color.g, color.b);
		setSlidersValue();
		setInputValues();
		setColorShowed();
	});

	socket.on('s_slider_red', (color) => {
		theColor.setRedValue(color);
		setSlidersValue();
		setInputValues();
		setColorShowed();
	});

	socket.on('s_slider_green', (color) => {
		theColor.setGreenValue(color);
		setSlidersValue();
		setInputValues();
		setColorShowed();
	});

	socket.on('s_slider_blue', (color) => {
		theColor.setBlueValue(color);
		setSlidersValue();
		setInputValues();
		setColorShowed();
	});

	socket.on('s_input_red', (color) => {
		theColor.setRedValue(color);
		setSlidersValue();
		setInputValues();
		setColorShowed();
	});

	socket.on('s_input_green', (color) => {
		theColor.setGreenValue(color);
		setSlidersValue();
		setInputValues();
		setColorShowed();
	});

	socket.on('s_input_blue', (color) => {
		theColor.setBlueValue(color);
		setSlidersValue();
		setInputValues();
		setColorShowed();
	});

	aboutButton.addEventListener('click', function() {
		return alert('Project to control a common cathode RGB led.');
	});

	document.addEventListener('DOMContentLoaded', function() {
		setSlidersValue();
		setInputValues();
		setColorShowed();
	});
});
