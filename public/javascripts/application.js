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

function showSlidersValue() {
	redSlider.value   = theColor.getRedValue();
	greenSlider.value = theColor.getGreenValue();
	blueSlider.value  = theColor.getBlueValue();
}

function showNumberInputsValue() {
	redInput.value   = theColor.getRedValue();
	greenInput.value = theColor.getGreenValue();
	blueInput.value  = theColor.getBlueValue();

	redInput.style.borderColor   = `rgb(${theColor.getRedValue()}, 0, 0, 0.8)`;
	greenInput.style.borderColor = `rgb(0, ${theColor.getGreenValue()}, 0, 0.8)`;
	blueInput.style.borderColor  = `rgb(0, 0, ${theColor.getBlueValue()}, 0.8)`;
}

function setValueByComponent(component, value) {
	if (component === 'red')   { theColor.setRedValue(value);   }
	if (component === 'green') { theColor.setGreenValue(value); }
	if (component === 'blue')  { theColor.setBlueValue(value);  }
}

function showColorInBox() {
	colorShowed.style.backgroundColor = theColor.getRGBstring();
}

function setColorInputValue() {
	colorInput.value = theColor.getHEXstring();
}

function setValueBySlider(slider, component) {
	setValueByComponent(component, slider.value);
	showNumberInputsValue();
	showColorInBox();
	setColorInputValue();
	emitColorToArduino();
	emitColorFromSliders(component, slider.value);
}

function setValueByInput(component, value) {
	setValueByComponent(component, value);
	showSlidersValue();
	showColorInBox();
	setColorInputValue();
	emitColorToArduino();
	emitColorFromInputs(component, value);
}

function correctInputValue(input, component) {
	if (input.value < 0) {
		input.value = 0;
		setValueByInput(component, input.value);
		showNumberInputsValue();

	} else if (input.value > 255) {
		input.value = 255;
		setValueByInput(component, input.value);
		showNumberInputsValue();

	} else if (input.value.trim() === '') {
		setTimeout(() => {
			if (input.value.trim() === '' || isNaN(input.value)) { input.value = 0; }
			setValueByInput(component, input.value);
			showNumberInputsValue();
		}, 1500);

	} else if (isNaN(input.value)) {
		input.value = 0;
		setValueByInput(component, input.value);
		showNumberInputsValue();

	} else {
		setValueByInput(component, input.value);
		showNumberInputsValue();
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
		showColorInBox();
		showSlidersValue();
		showNumberInputsValue();
		emitColorToArduino();
		emitColorFromPickers();
	});

	colorShowed.addEventListener('click', function() {
		colorInput.click();
	});

	socket.on('Color', (message) => {
		const { r: red, g: green, b: blue } = message;
		theColor.setColorFromRGB(red, green, blue);

		showSlidersValue();
		showNumberInputsValue();
		showColorInBox();
		setColorInputValue();
	});

	socket.on('s_picker', (color) => {
		theColor.setColorFromRGB(color.r, color.g, color.b);
		showSlidersValue();
		showNumberInputsValue();
		showColorInBox();
		setColorInputValue();
	});

	socket.on('s_slider_red', (color) => {
		theColor.setRedValue(color);
		showSlidersValue();
		showNumberInputsValue();
		showColorInBox();
		setColorInputValue();
	});

	socket.on('s_slider_green', (color) => {
		theColor.setGreenValue(color);
		showSlidersValue();
		showNumberInputsValue();
		showColorInBox();
		setColorInputValue();
	});

	socket.on('s_slider_blue', (color) => {
		theColor.setBlueValue(color);
		showSlidersValue();
		showNumberInputsValue();
		showColorInBox();
		setColorInputValue();
	});

	socket.on('s_input_red', (color) => {
		theColor.setRedValue(color);
		showSlidersValue();
		showNumberInputsValue();
		showColorInBox();
		setColorInputValue();
	});

	socket.on('s_input_green', (color) => {
		theColor.setGreenValue(color);
		showSlidersValue();
		showNumberInputsValue();
		showColorInBox();
		setColorInputValue();
	});

	socket.on('s_input_blue', (color) => {
		theColor.setBlueValue(color);
		showSlidersValue();
		showNumberInputsValue();
		showColorInBox();
		setColorInputValue();
	});

	aboutButton.addEventListener('click', function() {
		return alert('Project to control a common cathode RGB led.');
	});

	document.addEventListener('DOMContentLoaded', function() {
		showSlidersValue();
		showNumberInputsValue();
		showColorInBox();
	});
});
