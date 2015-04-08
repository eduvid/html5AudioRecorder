/**
 * Created by narendra on 4/4/15.
 */

var BinaryServer = require('binaryjs').BinaryServer;

var fs = require('fs');

var binaryServer = BinaryServer({port: 9001});

binaryServer.on('connection', function(client) {
  console.log("new connection");

  var fileWriter = fs.createWriteStream("recording-"+ (new Date).getTime() +".ogg");

  client.on('stream', function(stream, meta) {
    console.log('Got a Stream from Client');
    stream.pipe(fileWriter);
    stream.on('end', function() {
      fileWriter.end();
    });
  });
  
  client.on('close', function() {
    if (fileWriter != null) {
      fileWriter.end();
    }
  });
});