const Alexa = require('ask-sdk')
const axios = require('axios')

const LaunchHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request //gets input from the request
        return request.type === 'LaunchRequest'
    },
    handle(handlerInput) {
        const speechOutput = `What would you like to translate?`
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(`What would you like to translate?`)
            .getResponse()
    }
}

const TranslateHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
        return request.type === 'IntentRequest' && request.intent.name === 'translate'
    },
    async handle(handlerInput) {
        const phrase = handlerInput.requestEnvelope.request.intent.slots.phraseToTranslate.value
        try {
            const req = { 'text': phrase }
            const config = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'X-Funtranslations-Api-Secret': process.env.API_KEY
                }
            }
            const { data } = await axios.post('http://api.funtranslations.com/translate/dothraki.json', req, config)
            const translation = data.contents.translated
            const speechOutput = `${phrase} is ${translation} in Dothraki`

            return handlerInput.responseBuilder
                .speak(speechOutput)
                .withSimpleCard(`Dothraki Translator`, `${phrase} is ${translation} `)
                .reprompt(`Would you like to translate something else?`)
                .getResponse()
        } catch (err) {
            console.log(err)
        }
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
            .reprompt(`What would you like to translate ? `)
            .getResponse()
    },
}

const FallbackHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request
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
        console.log(`Error handled: ${error.message}`)

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
    StopHandler
)
    .addErrorHandlers(ErrorHandler)
    .lambda()