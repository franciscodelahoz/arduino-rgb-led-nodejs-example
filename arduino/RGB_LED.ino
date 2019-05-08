#include <Arduino.h>
#include <EEPROM.h>

// PWM pins for red, green, blue leds respectively
const byte pins[] = {9, 10, 11};

// Initial Address Memory Position for RGB values
const byte rgb_addrs[] = {0, 1, 2};

int rgb[] = { 0, 0, 0 };

// Temporary variables
char inChar;
String input = "";

void setup() {
	Serial.begin(115200);
	rgb[0] = EEPROM.read(rgb_addrs[0]);
	rgb[1] = EEPROM.read(rgb_addrs[1]);
	rgb[2] = EEPROM.read(rgb_addrs[2]);
	input.reserve(256);
}

void loop() {
	for (int i = 0; i < 3; i++) {
		analogWrite(pins[i], rgb[i]);
	}

	Serial.print("R" + String(rgb[0]) + "G" + String(rgb[1]) + "B" + String(rgb[2]) + "\n");
	delay(20);
}

// This function is called when data is available
void serialEvent() {
	while(Serial.available()) {
		inChar = (char) Serial.read();
		input += inChar;

		// Verify if the readed line is completed
		if (inChar == '\n' && (input.indexOf("R") > -1 && input.indexOf("G") > -1 && input.indexOf("B") > -1)) {
			rgb[0] = input.substring(input.indexOf("R") + 1, input.indexOf("G")).toInt();
			rgb[1] = input.substring(input.indexOf("G") + 1, input.indexOf("B")).toInt();
			rgb[2] = input.substring(input.indexOf("B") + 1, input.indexOf("\n")).toInt();

			EEPROM.write(rgb_addrs[0], rgb[0]);
			EEPROM.write(rgb_addrs[1], rgb[1]);
			EEPROM.write(rgb_addrs[2], rgb[2]);

			input.remove(0);
		}
	}
}
