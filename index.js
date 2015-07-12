/**
 * Created by Damian on 7/11/2015.
 */
var request = require('superagent');
var extend = require('extend');
var assert = require('assert');
var md5 = require('MD5');
var querystring = require('querystring');
var q = require('q');
var Buffer = require('Buffer');
var fs = require('fs');

function voalwareClient(args)
{
    this.options = {
        EID: '3',
        LID: '1',
        VID: '3',
        EXT: 'mp3'
    };

    extend(false, this.options, args);
    assert(args.ACC,'The account (ACC) option must be defined');
    assert(args.API,'The API option must be defined');
    assert(args.SECRET,'The SECRET option must be defined');

    //EID=3&LID=1&VID=3&EXT=mp3&FX_TYPE=&FX_LEVEL=&ACC=5269727&API=2439098&SESSION=&HTTP_ERR=&
}

voalwareClient.prototype.WriteAudioToFile = function(buffer, filename)
{
    var deferred = q.defer();
    fs.open(filename, 'w', function(err, fd) {
        if (err) {
            deferred.reject(new Error('error opening file: ' + err));
            return;
        }

        fs.write(fd, buffer, 0, buffer.length, null, function(err) {
            if (err) deferred.reject(new Error('error writing file: ' + err));
            fs.close(fd, function() {
                deferred.resolve('file written');
                console.log('file written');
            })
        });
    });
    return deferred.promise;
};

voalwareClient.prototype.TextToSpeech = function(text) {
    var self= this;
    var deferred = q.defer();

    var qryStr = querystring.stringify({
        EID: self.options.EID,
        LID: self.options.LID,
        VID: self.options.VID,
        EXT: self.options.EXT,
        ACC: self.options.ACC,
        API: self.options.API,
        HTTP_ERR: '1',
        TXT: text
    });


    var CS = md5(self.options.EID + self.options.LID + self.options.VID + text + self.options.EXT + self.options.ACC + self.options.API + '1' + self.options.SECRET);
    qryStr = qryStr + '&CS=' + CS;

    function binaryParser(res, callback) {
        res.setEncoding('binary');
        res.data = '';
        res.on('data', function (chunk) {
            res.data += chunk;
        });
        res.on('end', function () {
            callback(null, new Buffer(res.data, 'binary'));
        });
    }


    request
        .get('http://www.vocalware.com/tts/gen.php')
        .query(qryStr)
        .parse(binaryParser)
        .buffer()
        .end(function(err, res){

            var isBuffer = Buffer.isBuffer(res.body);
            if(!isBuffer)
            {
                deferred.reject(new Error("respose was not an audio file"));
                return;
            }

            var buffer = res.body;
            if(err || (res.status !== 200))
            {
                deferred.reject(new Error(buffer.toString('utf-8')));
                return;
            }

            deferred.resolve(buffer);
        });

    return deferred.promise;
};

module.exports = voalwareClient;