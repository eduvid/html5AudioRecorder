/**
 * Created by narendra on 3/4/15.
 */


choona.registerElement(choona.ElementView.extend({
  tagName: "audio-recorder",
  template:'',
  accessors:{
    status: {
      type: "string",
      default:""
    }
  },
  events:{
    "click #record":"onRecordStart",
    "click #stop":"onRecordStop"
  },
  initialize: function () {
    choona.ElementView.apply(this, arguments);
    this.state = new Enum("RECORDING", "PAUSED", "STOPPED");
    this.state.setInitialState("STOPPED");

  },
  render: function () {
    this.$.innerHTML = '<div><button title="Record" id="record"></button><button title="STOP" class="pulsate" id="stop"></button><timeblock></timeblock><a title="Download" id="save"></a></div>' +
    '<audio controls>Your browser does not support the audio element.</audio>';
  },
  createdCallback: function () {
    this.render();
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
      var ele = self.$.querySelector("audio");
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
      self.$.status = "recorded";
      self.$.querySelector("timeblock").innerHTML = "";
    }, "URL");
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
      //Add Classed recording
      this.$.status = "recording";
      this.$.querySelector("timeblock").innerHTML = "<stop-watch></stop-watch>";
    }
  },
  serverRecordStart: function () {
    var self = this;
    if(this.permissionGiven === false){
      this.audioRecorder.askPermissionAndSetup(function () {
        self.permissionGiven = true;
        //self.audioStreamer = new AudioStreamer(self.audioRecorder);
        self.serverRecordStart();
      });
    }else{
      this.audioRecorder.startRecording();
      //this.audioStreamer.init();
    }
  },
  serverRecordStop: function () {
    this.audioRecorder.stopRecording();
    //this.audioStreamer.clear();
  },
  onRecordStop: function () {
    this.$.status = "processing";
    this.audioRecorder.stopRecording();
    this.createDownloadLink();
    this.createPlayback();
    this.uploadBlobToServer();

  },
  uploadBlobToServer: function () {
    //var audioStreamer = new AudioStreamer(this.audioRecorder, function () {
    //  audioStreamer.uploadLatestBlobToServer();
    //});
  }
}));