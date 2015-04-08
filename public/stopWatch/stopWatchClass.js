/**
 * Created by narendra on 5/4/15.
 */


var stopWatchClass = klass({
  initialize: function () {
    this.state = "inactive";
  },
  start: function () {
    this.state = "running";
    this.startTime = performance.now();
  },
  pause: function () {
    this.pausedTime = this.getTime();
    this.state = "paused";
  },
  resume: function () {
    this.startTime = performance.now() - this.pausedTime;
    this.state = "running";
  },
  stop: function () {
    this.stoppedTime  = this.getTime();
    this.state = "stopped";
  },
  getTime: function () {
    if(this.state === "inactive"){
      return 0;
    }
    if(this.state === "stopped"){
      return this.stoppedTime;
    }
    if(this.state === "running"){
      return performance.now() - this.startTime;
    }
    if(this.state === "paused"){
      return this.pausedTime;
    }
  }
});