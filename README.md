# VocalwareNodeClient
A Nodejs Client for Vocalware 

Node client for the [Vocalware](https://www.vocalware.com/) REST API.

You will need your account number, your api number and secret information from your account at www.vocalware.com

## Install

Run `npm install vocalwarenodeclient`.

## Usage


```js
var vocalwareClient = require('vocalwarenodeclient');

var vClient = new vocalwareClient({ACC: '526972X', API: '243XXX', SECRET: 'ea7793b4XXXXXXa098d91046924aa'});

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
```
