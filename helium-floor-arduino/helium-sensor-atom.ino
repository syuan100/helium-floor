/*
 * Copyright 2017, Helium Systems, Inc.
 * All Rights Reserved. See LICENCE.txt for license information
 */

#include "Arduino.h"
#include "Board.h"
#include "Helium.h"
#include "HeliumUtil.h"

// Declare the channel name that maps to the channel in Helium
#define CHANNEL_NAME "Google IoT Cloud Core"

Helium  helium(&atom_serial);
Channel channel(&helium);

// Library of int to chars
char digits[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '9' };

// Create array to hold 10 sets of readings (with 6 sensors) that will be sent to Helium every second
char char_arr[61];

// Stepper
int stepper = 0;

// Helium specific config
uint16_t token;
int8_t result;
boolean SENT_ACK = true;

// Pin assignments
int FSR_Pin_0 = A0; //analog pin 0
int FSR_Pin_1 = A1; //analog pin 1
int FSR_Pin_2 = A2; //analog pin 2
int FSR_Pin_3 = A3; //analog pin 3
int FSR_Pin_4 = A4; //analog pin 4
int FSR_Pin_5 = A5; //analog pin 5

void
setup()
{
    Serial.begin(9600);
    DBG_PRINTLN(F("Starting"));

    // Begin communication with the Helium Atom
    // The baud rate differs per supported board
    // and is configured in Board.h
    helium.begin(HELIUM_BAUD_RATE);

    // Connect the Atom to the Helium Network
    helium_connect(&helium);

    // Begin communicating with the channel. This should only need to
    // be done once. The HeliumUtil functions add simple retry logic
    // to re-create a channel if it disconnects.
    channel_create(&channel, CHANNEL_NAME);
}

void
loop()
{
    /*
     * Within this loop we will take readings from the
     * six sensors every 1/10th of a second. Each reading
     * is appended to the last. After one second has elpased
     * (when stepper == 10), broad cast the reading string
     * to Helium and reset the stepper.
     */
     
    if (stepper == 10) {

      // '\0' indicates the end of a string
      char_arr[61] = '\0';
      Serial.println(char_arr);

      // Send to channel and then reset the stepper
      channel.send(char_arr, strlen(char_arr), &token);

      // Reset the stepper
      stepper = 0;
      
    } else {
      // Read sensors and place into char_arr to be sent later
      char_arr[(stepper%10) * 6] = digits[int(analogRead(FSR_Pin_0) / 100)];
      char_arr[(stepper%10) * 6 + 1] = digits[int(analogRead(FSR_Pin_1) / 100)];
      char_arr[(stepper%10) * 6 + 2] = digits[int(analogRead(FSR_Pin_2) / 100)];
      char_arr[(stepper%10) * 6 + 3] = digits[int(analogRead(FSR_Pin_3) / 100)];
      char_arr[(stepper%10) * 6 + 4] = digits[int(analogRead(FSR_Pin_4) / 100)];
      char_arr[(stepper%10) * 6 + 5] = digits[int(analogRead(FSR_Pin_5) / 100)];
      
      // Increase stepper by 1
      stepper++;
    }

    // Set 1/10th second delay
    delay(100);
}
