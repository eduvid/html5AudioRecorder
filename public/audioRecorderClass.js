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

var AudioRecorder = klass({
  initialize: function () {
    this.init();
  },
  init: function () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    var audioInput = null,
        realAudioInput = null,
        inputPoint = null;
    var rafID = null;
    var analyserContext = null;
    var recIndex = 0;
    if (!navigator.getUserMedia){
      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    }
    if (!navigator.cancelAnimationFrame){
      navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    }
    if (!navigator.requestAnimationFrame){
      navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;
    }
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
      }, function(e) {
        alert('Error getting audio');
        console.log(e);
      });
  },
  gotStream: function (stream) {
    inputPoint = this.audioContext.createGain();
    // Create an AudioNode from the stream.
    realAudioInput = this.audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);
    analyserNode = this.audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect( analyserNode );

    this.config = {};
    var bufferLen = this.config.bufferLen || 4096;
    this.context = inputPoint.context;
    if(!this.context.createScriptProcessor){
      this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
    } else {
      this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
    }

    this.worker = new Worker(this.config.workerPath || WORKER_PATH);
    this.worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate
      }
    });
    var self = this;
    this.worker.onmessage = function(e){
      var blob = e.data;
      self.currCallback(blob);
    };
    this.recording = false;

    this.node.onaudioprocess = function(e){
      if (!self.recording) return;
      console.log("Recoding, onaudioprocess");
      self.worker.postMessage({
        command: 'record',
        buffer: [
          e.inputBuffer.getChannelData(0),
          e.inputBuffer.getChannelData(1)
        ]
      });
    };
    inputPoint.connect(this.node);
    this.node.connect(this.context.destination);
    zeroGain = this.audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect( zeroGain );
    zeroGain.connect( this.audioContext.destination );
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
    this.currCallback = cb || this.config.callback;
    this.worker.postMessage({ command: 'getBuffers' })
  },
  export: function (callback, type) {
    this.exportWAV(function (blob) {
      if (type == "" || type == "blob") {
        callback(blob);
      } else if (type == "URL") {
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        callback(url);
      }
    });
  },

  exportWAV : function(cb, type){
    this.currCallback = cb || this.config.callback;
    type = type || this.config.type || 'audio/wav';
    if (!this.currCallback) throw new Error('Callback not set');
    this.worker.postMessage({
      command: 'exportWAV',
      type: type
    });
  },
  exportMonoWAV : function(cb, type){
    this.currCallback = cb || this.config.callback;
    type = type || this.config.type || 'audio/wav';
    if (!this.currCallback) throw new Error('Callback not set');
    this.worker.postMessage({
      command: 'exportMonoWAV',
      type: type
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


