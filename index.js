const Alexa = require('ask-sdk-core')
import axios from 'axios'

const TranslateHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request //gets input from the request
        return request.type === 'Launch Request' || (request.type === 'Intent Request' && request.intent.name === 'translate') //returns if intent is launch request (open Dothraki translator) or intent + translate (translate x to Dothraki)
    },
    handle(handlerInput) {
        // let language = this.event.request.intent.slots.Language.value
        const phrase = this.event.request.intent.slots.PhraseToTranslate.value
        const translation = await axios.post('http://api.funtranslations.com/translate/dothraki.json', phrase)
        const speechOutput = `${phrase} is ${translation} in Dothraki`

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withSimpleCard(`Dothraki Translator`, `${phrase}`is`${translation}`)
            .getResponse()

    }
}

// 'LaunchRequest': function () {
//     this.emit(':ask', 'Welcome to the Dothraki translate skill. What would you like to translate?')
// },

// 'Translate': async function () {
//     let language = this.event.request.intent.slots.Language.value
//     let phrase = this.event.request.intent.slots.PhraseToTranslate.value

//     await axios.post('http://api.funtranslations.com/translate/dothraki.json', phrase)
//         .on('success', (payload) => {
//             const translation = payload.contents.translated
//             this.emit(':tell', `${phrase} is ${translation} in ${language} `)
//         }).on('error', (payload) => {
//             this.emit(':tell', 'Sorry, translation was unsuccessful. Want to try a different phrase?')
//         })
// }
// }

const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent' //returns if there is a intent request for help
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(`You can tell me a phrase to translate, or say exit.`)
            .reprompt(`What would you like to translate?`)
            .getResponse();
    },
}

const FallbackHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(`I can't translate that phrase. Would you like to try another?`)
            .reprompt(`What would you like to translate?`)
            .getResponse()
    },
}

const StopHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent')
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(`See you later!`)
            .getResponse()
    },
}

const ErrorHandler = {
    canHandle() {
        return true
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak(`Sorry, we're having some trouble right now.`)
            .reprompt(`Sorry, we're having some trouble right now.`)
            .getResponse()
    },
}

const skillBuilder = Alexa.SkillBuilders.custom()

exports.handler = skillBuilder.addRequestHandlers(
    TranslateHandler,
    HelpHandler,
    FallbackHandler,
    StopHandler,
)
    .addErrorHandlers(ErrorHandler)
    .lambda()