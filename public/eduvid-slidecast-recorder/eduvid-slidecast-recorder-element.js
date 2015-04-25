/**
 * Created by narendra on 26/4/15.
 */


pitana.register({
  tagName: "Eduvid-Slidecast-Recorder",
  events: {},
  template: document._currentScript.ownerDocument.querySelector("template"),
  accessors: {},
  methods: [],
  attachedCallback: function() {
    this.audioStreamer = new MediaStreamStreamer({
      ready: function() {
        alert("Now binary socket is available");
      }
    });
  }
});
