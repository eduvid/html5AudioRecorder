/**
 * Created by narendra on 4/4/15.
 */


var AudioStreamer = klass({
  initialize: function (audioRecorder, cb) {
    this.config = {
      interval: 2000
    };
    this.client = new BinaryClient('ws://localhost:9001');
    var self = this;
    this.audioRecorder = audioRecorder;
    this.client.on('open', function() {
      cb();
    });
  },
  init: function () {
    var self = this;
    this.id = window.setInterval(function () {
      self.getDataFromAudioInstance();
    }, this.config.interval);
  },
  clear: function () {
    window.clearInterval(this.id);
  },
  getDataFromAudioInstance: function () {
    var self = this;
    this.audioRecorder.stopRecording();
    this.audioRecorder.export(function (blob) {
      self.sendDataToServer(blob);
      self.audioRecorder.startRecording();
    }, "blob");
  },
  sendDataToServer: function (data) {
    var stream = this.client.createStream();
    stream.write(data);
    stream.end();
  },
  uploadLatestBlobToServer: function () {
    var self = this;
    this.audioRecorder.export(function (blob) {
      self.sendDataToServer(blob);
    }, "blob");
  }
});