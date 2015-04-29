/**
 * Created by narendra on 26/4/15.
 */


pitana.register({
  tagName: "Eduvid-Slidecast-Recorder",
  events: {
    "actionEvent Action-Menu": "onAction",
    "pageChangeEvent PT-Pdfslideshow": "onPageChange"
  },
  template: document._currentScript.ownerDocument.querySelector("template"),
  accessors: {},
  methods: [],
  attachedCallback: function() {
    this.eduvidRecorder = new EduvidSlidecastRecorder();
    this.eduvidRecorder.updateSlideName("asd.pdf"); //TODO
    this.eduvidRecorder.updateAudioFileName("voice.ogg"); //TODO
    this.stopWatchEle = this.$.querySelector("stop-watch");
    this.lastAction = "inactive";
  },
  onPageChange: function(e) {
    if (this.lastAction === "start" || this.lastAction === "resume") {
      this.eduvidRecorder.addSlideChange(e.detail, this.stopWatchEle.getTime());
      console.log("Slide add", e.detail, this.stopWatchEle.getTime());
    }
  },
  onAction: function(e) {
    this.lastAction = e.detail.action;
    if (this.lastAction === "start" || this.lastAction === "resume") {
      this.onPageChange({
        detail: this.$.querySelector("pt-pdfslideshow").currentPage
      });
    }
    if (this.lastAction === "stop") {
      this.eduvidRecorder.updateLength(this.stopWatchEle.getTime());
      this.saveRecording();
    }
  },
  saveRecording: function() {
    this.eduvidRecorder.save();
  }
});
