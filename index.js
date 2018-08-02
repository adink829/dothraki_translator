const Alexa = require('ask-sdk')
import axios from 'axios'

const LaunchHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request //gets input from the request
        return request.type === 'Launch Request'
    },
    handle(handlerInput) {
        const speechOutput = `What would you like to translate?`

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse()
    }
}

const TranslateHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request //gets input from the request
        return request.type === 'Intent Request' && request.intent.name === 'translate'
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
    LaunchHandler,
    TranslateHandler,
    HelpHandler,
    FallbackHandler,
    StopHandler,
)
    .addErrorHandlers(ErrorHandler)
    .lambda()