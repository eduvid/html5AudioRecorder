/**
 * Created by narendra on 5/4/15.
 */


choona.registerElement(choona.ElementView.extend({
  tagName: "stop-watch",
  events:{
  },
  template: '',
  accessors: {
    autoStart: {
      type:"boolean",
      default: false
    }
  },
  methods: ["start", "stop", "pause", "resume"],
  initialize: function () {
    this.constructor.parent.apply(this, arguments);
  },
  createdCallback: function () {
  },
  attachedCallback: function () {
    if(this.$.autoStart === true){
      this.start();
    }
  },
  pause: function () {
    this.pausedTime = (new Date()).getTime();
    window.clearInterval(this.id);
    this.id = undefined;
  },
  resume: function () {
    var t = (new Date()).getTime();
    var d = t - this.pausedTime;
    this.startTime = this.startTime + d;
    this.startInterval();
  },
  startInterval: function () {
    var self = this;
    this.id = window.setInterval(function () {
      var d = (new Date()).getTime() - self.startTime;
      self.$.textContent = self.convertToTime(d);
    }, 1000);
  },
  start: function () {
    this.startTime = (new Date()).getTime();
    var self = this;
    if(this.id !== undefined){
      window.clearInterval(this.id);
    }
    this.$.textContent = "00:00";
    this.startInterval();
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