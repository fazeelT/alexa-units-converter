/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.aff87ec3-202f-4c78-b9c7-3da65d21a7c7'; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Units converter',
            WELCOME_MESSAGE: "Welcome to Units Converter. You can ask a question like, convert 100 meters to centimeter",
            WELCOME_REPROMT: 'You can ask a question like, convert 100 meters to centimeter.',
            HELP_MESSAGE: "You can ask questions such as, convert 100 meters to centimeter",
            STOP_MESSAGE: 'Goodbye!',
        },
    },
};

var distanceUnits = ['millimeters', 'millimeters', 
                    'centimeter', 'centimeters',
                    'yard', 'yards',
                    'mile', 'miles',
                    'kilometer', 'kilometers',
                    'light year', 'light years',
                    'meter', 'meters'];

var handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'unitsConverter': function () {
        if (this.event.request.dialogState === "STARTED") {
            console.log("in Beginning");
            var updatedIntent=this.event.request.intent;
            //optionally pre-fill slots: update the intent object with slot values for which
            //you have defaults, then return Dialog.Delegate with this updated intent
            // in the updatedIntent property
            this.emit(":delegate", updatedIntent);
        } else if (this.event.request.dialogState !== "COMPLETED") {
            console.log("in not completed");
            // return a Dialog.Delegate directive with no updatedIntent property.
            this.emit(":delegate");
        } else {
            console.log("in completed");
            console.log("returning: "+ JSON.stringify(this.event.request.intent));
           // Dialog is now complete and all required slots should be filled,
           // so call your normal intent handler.
            const toUnitSlot = this.event.request.intent.slots.toUnit;
            const fromUnitSlot = this.event.request.intent.slots.fromUnit;
            const fromValueSlot = this.event.request.intent.slots.fromValue;

            let toUnit = toUnitSlot.value;
            let fromUnit = fromUnitSlot.value;
            let fromValue = fromValueSlot.value;

            if(distanceUnits.indexOf(fromUnit) > -1) {
                var finalValueToConvert;
                if(fromUnit == 'meter' || fromUnit == 'meters') {
                    finalValueToConvert = fromValue;
                } else if(fromUnit == 'centimeter' || fromUnit == 'centimeters') {
                    finalValueToConvert = fromValue * 0.01;
                }else if(fromUnit == 'millimeter' || fromUnit == 'millimeters') {
                    finalValueToConvert = fromValue * 0.001;
                }else if(fromUnit == 'kilometer' || fromUnit == 'kilometers') {
                    finalValueToConvert = fromValue * 1000;
                }else if(fromUnit == 'mile' || fromUnit == 'miles') {
                    finalValueToConvert = fromValue * 1609.34;
                }else if(fromUnit == 'yard' || fromUnit == 'yards') {
                    finalValueToConvert = fromValue * 0.9144;
                }else if(fromUnit == 'light year' || fromUnit == 'light years') {
                    finalValueToConvert = fromValue * 9.461e+15;
                }

                console.log("From Value: " + finalValueToConvert);
                console.log("From Unit: " + fromUnit);

                var outputVal;
                if(toUnit == 'meter' || toUnit == 'meters') {
                    outputVal = finalValueToConvert;
                } else if(toUnit == 'centimeter' || toUnit == 'centimeters') {
                    outputVal = finalValueToConvert * 100;
                }else if(toUnit == 'millimeter' || toUnit == 'millimeters') {
                    outputVal = finalValueToConvert * 1000;
                }else if(toUnit == 'kilometer' || toUnit == 'kilometers') {
                    outputVal = finalValueToConvert * 0.001;
                }else if(toUnit == 'mile' || toUnit == 'miles') {
                    outputVal = finalValueToConvert * 0.000621371;
                }else if(toUnit == 'yard' || toUnit == 'yards') {
                    outputVal = finalValueToConvert * 1.09361;
                }else if(toUnit == 'light year' || toUnit == 'light years' || toUnit == 'light-years' || toUnit == 'light-year' ) {
                    outputVal = finalValueToConvert * 1.057e-16;
                }

                console.log("To Unit: " + toUnit);
                console.log("To Value: " + outputVal);

                this.attributes.speechOutput = outputVal + " " + toUnit.toString();
                this.emit(':tell', this.attributes.speechOutput, this.t('WELCOME_REPROMT'));
            } else {
                this.attributes.speechOutput = "Unit is not recognized. I have limitations";
                this.emit(':ask', this.attributes.speechOutput, this.t('WELCOME_REPROMT'));
            }
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.CancelIntent': function () {
         this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

// 3. Helper Function  =================================================================================================

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
  if (this.event.request.dialogState === "STARTED") {
    console.log("in Beginning");
    var updatedIntent=this.event.request.intent;
    //optionally pre-fill slots: update the intent object with slot values for which
    //you have defaults, then return Dialog.Delegate with this updated intent
    // in the updatedIntent property
    this.emit(":delegate", updatedIntent);
  } else if (this.event.request.dialogState !== "COMPLETED") {
    console.log("in not completed");
    // return a Dialog.Delegate directive with no updatedIntent property.
    this.emit(":delegate");
  } else {
    console.log("in completed");
    console.log("returning: "+ JSON.stringify(this.event.request.intent));
    // Dialog is now complete and all required slots should be filled,
    // so call your normal intent handler.
    return this.event.request.intent;
  }
}
