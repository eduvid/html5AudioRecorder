/*License (MIT)

 Copyright © 2013 Matt Diamond
 Copyright © 2015 Narendra Sisodiya

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 DEALINGS IN THE SOFTWARE.
 */

//This will be audio recorder file
var WORKER_PATH = 'recorderWorker.js';

if (!navigator.cancelAnimationFrame){
  navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
}
if (!navigator.requestAnimationFrame){
  navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;
}
var AudioRecorder = klass({
  initialize: function () {
    this.audioContext = new AudioContext();
    var self = this;
    this.config = {
      bufferLen: 4096
    };
    this.jobs = new JobCollection();
    this.recording = false;
  },
  askPermissionAndSetup: function (cb) {
    var self = this;
    navigator.getUserMedia(
      {
        "audio": {
          "mandatory": {
            "googEchoCancellation": "false",
            "googAutoGainControl": "false",
            "googNoiseSuppression": "false",
            "googHighpassFilter": "false"
          },
          "optional": []
        }
      }, function (stream) {
        self.gotStream(stream);
        cb();
      }, function(e) {
        alert('Error getting audio');
        console.log(e);
      });
  },
  gotStream: function (stream) {
    var self = this;
    var audioInput = this.audioContext.createMediaStreamSource(stream);
    var node = this.audioContext.createScriptProcessor(this.config.bufferLen, 2, 2);
    audioInput.connect(node);
    node.connect(this.audioContext.destination);
    node.onaudioprocess = function(e){
      self.onAudioProcess(e);
    };

    this.worker = new Worker(this.config.workerPath || WORKER_PATH);
    this.worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.audioContext.sampleRate
      }
    });
    this.worker.onmessage = function(e){
      self.jobs.executeJob(e.data.jobId, e.data.blobOrBuffer);
    };
  },
  pause: function () {
    this.node.disconnect();
  },
  onAudioProcess: function (e) {
    if (!this.recording){
      return;
    }
    console.log("Recoding, onaudioprocess");
    this.worker.postMessage({
      command: 'record',
      buffer: [
        e.inputBuffer.getChannelData(0),
        e.inputBuffer.getChannelData(1)
      ]
    });
  },
  startRecording: function () {
    this.clear();
    this.record();
  },
  stopRecording: function () {
    this.stop();
  },
  record : function(){
    this.recording = true;
  },

  stop : function(){
    this.recording = false;
  },

  clear : function(){
    this.worker.postMessage({ command: 'clear' });
  },

  getBuffers : function(cb) {
    this.worker.postMessage({
      command: 'getBuffers',
      jobId: this.jobs.addJob(cb)
    });
  },
  export: function (callback, type) {
    this.exportWAV(function (blob) {
      if (type === "" || type === "blob") {
        callback(blob);
      } else if (type === "URL") {
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        callback(url);
      }
    });
  },

  exportWAV : function(cb){
    this.worker.postMessage({
      command: 'exportWAV',
      type: 'audio/wav',
      jobId: this.jobs.addJob(cb)
    });
  },
  exportMonoWAV : function(cb){
    this.worker.postMessage({
      command: 'exportMonoWAV',
      type: 'audio/wav',
      jobId: this.jobs.addJob(cb)
    });
  },
  configure : function(cfg){
    for (var prop in cfg){
      if (cfg.hasOwnProperty(prop)){
        this.config[prop] = cfg[prop];
      }
    }
  }
});
