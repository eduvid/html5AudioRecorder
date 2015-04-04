/**
 * Created by narendra on 3/4/15.
 */


choona.registerElement(choona.ElementView.extend({
  tagName: "audio-recorder",
  template:'<button id="uprecord">Server Upload Start</button> <button id="upstop">Server Upload Stop</button> <button id="record">Record</button> <button id="stop">Stop</button><br/><a id="save">Save</a>',
  events:{
    "click #record":"onRecordStart",
    "click #stop":"onRecordStop",
    "click #uprecord":"serverRecordStart",
    "click #upstop":"serverRecordStop"
  },
  initialize: function () {
    choona.ElementView.apply(this, arguments);
    this.state = new Enum("RECORDING", "PAUSED", "STOPPED");
    this.state.setInitialState("STOPPED");

  },
  createdCallback: function () {

  },
  attachedCallback: function () {
    //this.render();
    this.audioRecorder = new AudioRecorder();
    this.permissionGiven = false;
  },
  detachedCallback: function () {
    console.log("I am ending " + this.tagName);
  },
  attributeChangedCallback: function (attrName, oldVal, newVal) {
    //if(attrName === "value" || attrName === "min" || attrName === "max"){
    //  this.render();
    //}
  },
  createPlayback: function () {
    var self = this;
    this.audioRecorder.export(function (url) {
      var ele = document.getElementById(self.$.getAttribute("playbackSource"));
      ele.src = url;
    }, "URL");
  },
  getBlob: function (cb) {
    this.audioRecorder.export(function (blob) {
      cb(blob);
    }, "blob");
  },
  createDownloadLink: function () {
    var self = this;
    this.audioRecorder.export(function (url) {
      var filename = 'recording-' + (new Date).getTime() + '.wav';
      var link = self.$.querySelector("#save");
      link.href = url;
      link.download = filename;
    }, "URL");
  },
  render: function () {
    //this.$.innerHTML = '<button id="record">Record</button> <button id="pause">Pause</button> <button
    // id="stop">Stop</button> <a id="save">Save</a>';
  },
  onRecordStart: function () {
    var self = this;
    if(this.permissionGiven === false){
      this.audioRecorder.askPermissionAndSetup(function () {
        self.permissionGiven = true;
        self.onRecordStart();
      });
    }else{
      this.audioRecorder.startRecording();
    }
  },
  serverRecordStart: function () {
    var self = this;
    if(this.permissionGiven === false){
      this.audioRecorder.askPermissionAndSetup(function () {
        self.permissionGiven = true;
        self.audioStreamer = new AudioStreamer(self.audioRecorder);
        self.serverRecordStart();
      });
    }else{
      this.audioRecorder.startRecording();
      this.audioStreamer.init();
    }
  },
  serverRecordStop: function () {
    this.audioRecorder.stopRecording();
    this.audioStreamer.clear();
  },
  onRecordStop: function () {
    this.audioRecorder.stopRecording();
    this.createDownloadLink();
    this.createPlayback();
    this.uploadBlobToServer();
  },
  uploadBlobToServer: function () {
    var audioStreamer = new AudioStreamer(this.audioRecorder, function () {
      audioStreamer.uploadLatestBlobToServer();
    });
  }
}));