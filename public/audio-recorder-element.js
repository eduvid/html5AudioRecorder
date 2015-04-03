/**
 * Created by narendra on 3/4/15.
 */


choona.registerElement(choona.ElementView.extend({
  tagName: "audio-recorder",
  template:'<button id="record">Record</button> <button id="stop">Stop</button><br/><a id="save">Save</a>',
  events:{
    "click #record":"onRecordStart",
    "click #stop":"onRecordStop"
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
    this.audioRecorder.startRecording();
  },
  onRecordStop: function () {
    this.audioRecorder.stopRecording();
    this.createDownloadLink();
    this.createPlayback();
  }


}));