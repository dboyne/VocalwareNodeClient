# VocalwareNodeClient
A Nodejs Client for Vocalware 

Sample Code:

var vocalwareClient = require('./../index.js');

var vClient = new vocalwareClient({ACC: '5269727', API: '2439098', SECRET: 'ea7793b4a5d697256a098d91046924aa'});

vClient.TextToSpeech("This is a test string test", "test.mp3")
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
