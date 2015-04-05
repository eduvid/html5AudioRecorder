/**
 * Created by narendra on 5/4/15.
 */


choona.registerElement(choona.ElementView.extend({
  tagName: "stop-watch",
  events:{
  },
  template: '',
  accessors: {
  },
  methods: ["start", "stop", "pause"],
  initialize: function () {
    this.constructor.parent.apply(this, arguments);
  },
  createdCallback: function () {
  },
  attachedCallback: function () {
    this.start();
  },
  start: function () {
    this.startTime = (new Date()).getTime();
    var self = this;
    if(this.id !== undefined){
      window.clearInterval(this.id);
    }
    self.$.textContent = "00:00";
    this.id = window.setInterval(function () {
      var d = (new Date()).getTime() - self.startTime;
      self.$.textContent = self.convertToTime(d);
    }, 1000);
  },
  convertToTime: function (ms) {
    var s = Math.floor(ms/1000);
    return this.appendFrontZero(Math.floor(s/60)) + ":" + this.appendFrontZero(s%60);
  },
  appendFrontZero: function (n) {
    if(n<10){
      return "0" + n;
    }else{
      return n;
    }
  },
  stop: function () {
    window.clearInterval(this.id);
    this.id = undefined;
  },
  detachedCallback: function () {
    this.stop();
    console.log("I am ending " + this.tagName);
  },
  attributeChangedCallback: function (attrName, oldVal, newVal) {
  }
}));