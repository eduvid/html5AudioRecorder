/**
 * Created by narendra on 4/4/15.
 */


/*
*     It take Stream from MediaRecorder API and upload to Server using Binary Socket.
* */

window.AudioContext = window.AudioContext || window.webkitAudioContext;

navigator.getUserMedia = (navigator.getUserMedia ||
navigator.mozGetUserMedia ||
navigator.msGetUserMedia ||
navigator.webkitGetUserMedia);


var MediaStreamStreamer = pitana.klass({
  initialize: function (config) {

    this.__status__ = "inactive";
    this.__permissionGiven__ = false;

    if(config !== undefined){
      this.config = config;
    }else{
      this.config = {};
    }
    if(this.config.interval === undefined){
      this.config.interval = 3000;
    }
    this.client = new BinaryClient("ws://localhost:9001");
    this.audioRecorderElement = document.createElement("audio-recorder");
    var self = this;
    this.client.on("open", function() {
      if(typeof self.config.ready === "function"){
        console.log("ready to upload");
        self.config.ready();
      }
    });
  },
  start: function () {
    var self = this;
    if(this.__permissionGiven__ === false){
      if (navigator.getUserMedia !== undefined) {
        var constraints = { audio: true };
        navigator.getUserMedia(constraints, function (stream) {
          self.__permissionGiven__ = true;
          self.stream = stream;
          if(window.MediaRecorder === undefined) {
            window.alert("MediaRecorder API not present on your Browser, Please use Firefox 25+");
            return;
          }
          self.mediaRecorder = new MediaRecorder(stream);
          self.mediaRecorder.ondataavailable = function (e) {
            // ============= Fire some Event or Callback to get the Data ====
            if(typeof self.ondataavailable ==="function"){
              self.ondataavailable(e);
            }
            self.uploadBlobToServer(e.data);
          };
          self.start();
        }, function (err) {
          window.alert("Error " + err);
          console.log("The following error occured: " + err);
        });
      }else{
        window.alert("navigator.getUserMedia is undefined");
      }
    }else{
      console.log("recoding Started");
      this.__status__ = "recording";
      this.mediaRecorder.start(this.config.interval);
      this.upstream = this.client.createStream();
    }
  },
  uploadBlobToServer: function (blob) {
    console.log("uploading Data to server");
    this.upstream.write(blob);
    //this.upstream.end();
  },
  pause: function () {
    this.__status__ = "paused";
    this.mediaRecorder.pause();
  },
  resume: function () {
    this.__status__ = "recording";
    this.mediaRecorder.resume();
  },
  stop: function () {
    var self = this;
    this.__status__ = "processing";
    this.mediaRecorder.stop();
    //this.upstream.end();
  },
  getStatus: function () {
    return this.__status__;
  }
});