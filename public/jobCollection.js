/**
 * Created by narendra on 3/4/15.
 */

var JobCollection = klass({
  initialize: function () {
    this.jobId = 0;
    this.callbacks = {};
  },
  addJob: function (cb) {
    this.jobId = this.jobId + 1;
    this.callbacks[this.jobId] = cb;
    return this.jobId;
  },
  executeJob: function (jobId, data) {
    var cb = this.callbacks[jobId];
    if(typeof cb === "function"){
      cb(data);
    }
    delete this.callbacks[jobId];
  }
});
