pitana.register({
  tagName: "eduvid-player",
  accessors: {
    href: {

    }
  },
  //template: document._currentScript.ownerDocument.querySelector("template"),
  attachedCallback: function() {
    console.log(this.$.href);
    this.loadData();
  },
  loadData: function() {
    var self = this;
    var req = new XMLHttpRequest();
    var url = this.$.href + "/index.json";
    req.open("GET", url);
    req.onload = function(e) {
      if (req.status == 200) {
        try {
          self.data = JSON.parse(req.responseText);
          self.render();
        } catch (ex) {
          window.alert("Unable to parse index.json");
        }
      }
    };
    req.onerror = function() {
      window.alert("Unable to load - " + url);
    };
    req.send();
  },
  render: function() {

  }
});
