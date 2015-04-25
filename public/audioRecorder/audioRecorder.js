/**
 * Created by narendra on 3/4/15.
 */


window.AudioContext = window.AudioContext || window.webkitAudioContext;

navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia ||
  navigator.webkitGetUserMedia);


pitana.registerElement(pitana.HTMLElement.extend({
  tagName: "audio-recorder",
  template: "",
  accessors: {
    status: {
      type: "string",
      default: ""
    }
  },
  methods: ["start, stop, pause, resume"],
  events: {
    "click #record": "start",
    "click #stop": "stop",
    "click #pause": "pause",
    "click #resume": "resume"
  },
  initialize: function() {
    pitana.HTMLElement.apply(this, arguments);
  },
  render: function() {
    this.$.innerHTML = '<div><button title="Record" id="record"></button><button title="STOP" class="pulsate" id="stop"></button><timeblock></timeblock><a title="Download" id="save"></a></div>' +
      '<audio controls>Your browser does not support the audio element.</audio>';
  },
  createdCallback: function() {
    this.$.status = "inactive";
    this.permissionGiven = false;
  },
  attachedCallback: function() {
    this.render();
  },
  detachedCallback: function() {
    console.log("I am ending " + this.tagName);
  },
  attributeChangedCallback: function(attrName, oldVal, newVal) {
    //if(attrName === "value" || attrName === "min" || attrName === "max"){
    //  this.render();
    //}
  },
  createPlayback: function(url) {
    var ele = this.$.querySelector("audio");
    ele.src = url;
  },
  createDownloadLink: function(url) {
    var filename = "recording-" + (new Date()).getTime() + ".ogg";
    var link = this.$.querySelector("#save");
    link.href = url;
    link.download = filename;
    this.$.status = "recorded";
    this.$.querySelector("timeblock").innerHTML = "";
  },
  start: function() {
    var self = this;
    if (this.permissionGiven === false) {
      this.askPermissionAndSetup(function(stream) {
        self.permissionGiven = true;
        if (window.MediaRecorder === undefined) {
          window.alert("MediaRecorder API not present on your Browser, Please use Firefox 25+");
          return;
        }
        self.mediaRecorder = new MediaRecorder(stream);
        self.mediaRecorder.ondataavailable = function(e) {
          self.$.status = "recorded";
          var url = window.URL.createObjectURL(e.data);
          self.createDownloadLink(url);
          self.createPlayback(url);
        };
        self.start();
      });
    } else {
      this.$.status = "recording";
      this.$.querySelector("timeblock").innerHTML = "<stop-watch autoStart></stop-watch>";
      this.stopWatch = this.$.querySelector("stop-watch");
      this.mediaRecorder.start();
      //Add Classed recording
    }
  },
  askPermissionAndSetup: function(cb) {
    if (navigator.getUserMedia) {
      var constraints = {
        audio: true
      };
      navigator.getUserMedia(constraints, function(stream) {
        cb(stream);
      }, function(err) {
        window.alert("Error " + err);
        console.log("The following error occured: " + err);
      });
    }
  },
  pause: function() {
    this.$.status = "paused";
    this.mediaRecorder.pause();
    this.stopWatch.pause();
  },
  resume: function() {
    this.$.status = "recording";
    this.mediaRecorder.resume();
    this.stopWatch.resume();
  },
  stop: function() {
    var self = this;
    this.$.status = "processing";
    this.mediaRecorder.stop();
    this.stopWatch.stop();
  }
}));
