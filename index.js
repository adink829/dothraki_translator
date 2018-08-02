const Alexa = require('alexa-sdk');
// const RapidAPI = require('rapidapi-connect');
// const rapid = new RapidAPI("Your Rapid projectName", "Your Rapid Project Key");

var handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', "Welcome to the Dothraki translate skill. What would you like to translate?");
    },

    'Translate': function () {
        const langCodes = {
            "Dothraki": "dt",
            // "Valyrian": "vl",
        };

        let language = this.event.request.intent.slots.Language.value;
        let phrase = this.event.request.intent.slots.PhraseToTranslate.value;
        let langCode = langCodes[language];

        // rapid.call('GoogleTranslate', 'translateAutomatic', {
        //     'apiKey': 'Your Google API key',
        //     'string': word,
        //     'targetLanguage': langCode

    }).on('success', (payload) => {
    const translation = payload.contents.translated
    this.emit(":tell", `${phrase} is ${translation} in ${language}`);
}).on('error', (payload) => {
    this.emit(":tell", "Sorry, translation was unsuccessful. Want to try a different phrase?");
});

}
};

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};