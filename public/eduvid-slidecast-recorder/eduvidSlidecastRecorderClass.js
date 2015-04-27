/**
 * Created by narendra on 26/4/15.
 */

var eduvidSlidecastRecorder = pitana.klass({
  initialize: function() {
    this.pdfMediaIndex = 1;
    this.data = {
      "format": {
        "type": "eduvid",
        "version": "1.0.1"
      },
      "type": {
        "seekBarType": "audio",
        "seekBarMediaIndex": 0,
        "length": "0:0:60:0"
      },
      "media": [{
        "type": "audio",
        "src": "voice.ogg"
      }, {
        "type": "pdf",
        "src": "slides.pdf"
      }],
      "layout": {},
      "events": []
    };
  },
  save: function() {

  },
  getData: function() {
    return this.data;
  },
  updateTotalLength: function(ms) {
    this.data.type.length = this.humanReadableTime(ms);
  },
  updateSlideName: function(pdfName) {
    this.data.media[1].src = pdfName;
  },
  updateAudioFileName: function(audioFileName) {
    this.data.media[0].src = audioFileName;
  },
  humanReadableTime: function(ms) {
    var s = parseInt(ms / 1000);
    var m = parseInt(s / 60);
    var h = parseInt(m / 60);
    return h + ":" + m % 60 + ":" + s % 60 + ":" + ms % 1000;
  },
  slideChange: function(slideNum, timeMs) {
    this.data.events.push({
      time: this.humanReadableTime(timeMs),
      show: this.pdfMediaIndex + "#" + slideNum
    });
  }
});
