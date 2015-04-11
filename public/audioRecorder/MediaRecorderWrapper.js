//Narendra Sisodiya

var MediaRecorderWrapper = pitana.klass({
  initialize: function () {
    this.__status__ = "inactive";
    this.__permissionGiven__ = false;
  },
  start: function (timeInterval) {
    var self = this;
    if(this.__permissionGiven__ === false){
      if (navigator.getUserMedia) {
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
            self.__status__ = "recorded";

            // ============= Fire some EVent or Callback to get the Data ====
            self.ondataavailable(e);
            //var url = window.URL.createObjectURL(e.data);
            //self.createDownloadLink(url);
            //self.createPlayback(url);
          };
          self.start(timeInterval);
        }, function (err) {
          window.alert("Error " + err);
          console.log("The following error occured: " + err);
        });
      }
    }else{
      this.__status__ = "recording";
      this.mediaRecorder.start();
      //Add Classed recording
    }
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
  },
  getStatus: function () {
    return this.__status__;
  }
});
