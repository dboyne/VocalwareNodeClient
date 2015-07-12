var vocalwareClient = require('./../index.js');

var vClient = new vocalwareClient({ACC: 'XXXX', API: 'XXX', SECRET: 'XXXX'});

vClient.TextToSpeech("This is a test string test")
    .then(function (audioBuffer) {
        // Eventhing went well so lets save the audio to a file.
        vClient.WriteAudioToFile(audioBuffer, "/temp/newFile.mp3")
            .then(function() {
                console.log("File werite completed");
            }
        );
    }, function (error) {
        // An error occured print it to console.
        console.error(error);
    });