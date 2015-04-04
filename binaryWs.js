/**
 * Created by narendra on 4/4/15.
 */

var BinaryServer = require('binaryjs').BinaryServer;

var fs = require('fs');

var binaryServer = BinaryServer({port: 9001});

binaryServer.on('connection', function(client) {
  console.log("new connection");
  client.on('stream', function(stream, meta) {
    console.log('Got a Stream from Client');
    var file = fs.createWriteStream("recording-"+ (new Date).getTime() +".wav");
    stream.pipe(file);
  });
});