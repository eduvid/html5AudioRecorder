/**
 * Created by narendra on 3/4/15.
 */

choona.registerElement(choona.ElementView.extend({
  tagName: "pdf-slideshow",
  template:'',
  accessors:{
    src:{
      type: "string"
    }
  },
  events:{
    "click #next":"onNextPage",
    "click #prev":"onPrevPage"
  },
  initialize: function () {
    choona.ElementView.apply(this, arguments);

  },
  createdCallback: function () {

  },
  attachedCallback: function () {
    this.render();

    this.pdfDoc = null;
    this.pageNum = 1;
    this.pageRendering = false;
    this.pageNumPending = null;
    this.scale = 1;
    this.canvas = this.$.querySelector('#the-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.loadPdf();
  },
  detachedCallback: function () {
    console.log("I am ending " + this.tagName);
  },
  attributeChangedCallback: function (attrName, oldVal, newVal) {
    console.log(arguments);
  },
  createPlayback: function () {

  },
  render: function () {
    this.$.innerHTML = '<h1>Pdf Slideshow</h1><div>' +
    '<button id="prev">Previous</button>' +
    '<button id="next">Next</button>&nbsp; &nbsp;' +
    '<span>Page: <span id="page_num"></span> / <span id="page_count"></span></span>' +
    '</div><div><canvas id="the-canvas" style="border:1px solid black"></canvas></div>';

  },
  loadPdf: function () {
    var self = this;
    PDFJS.getDocument(this.$.src).then(function (pdfDoc) {
      self.pdfDoc = pdfDoc;
      self.$.querySelector('#page_count').textContent = self.pdfDoc.numPages;
      // Initial/first page rendering
      self.renderPage(self.pageNum);
    });
  },
  renderPage: function (num) {
    this.pageRendering = true;
    // Using promise to fetch the page
    var self = this;
    this.pdfDoc.getPage(num).then(function(page) {
      var viewport = page.getViewport(self.scale);
      self.canvas.height = viewport.height;
      self.canvas.width = viewport.width;

      // Render PDF page into canvas context
      var renderTask = page.render({
        canvasContext: self.ctx,
        viewport: viewport
      });

      // Wait for rendering to finish
      renderTask.promise.then(function () {
        self.pageRendering = false;
        if (self.pageNumPending !== null) {
          // New page rendering is pending
          self.renderPage(self.pageNumPending);
          self.pageNumPending = null;
        }
      });
    });

    // Update page counters
    this.$.querySelector('#page_num').textContent = num;
  },
  onNextPage: function () {
    if (this.pageNum >= this.pdfDoc.numPages) {
      return;
    }
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  },
  onPrevPage: function () {
    if (this.pageNum <= 1) {
      return;
    }
    this.pageNum--;
    this.queueRenderPage(this.pageNum);
  },
  queueRenderPage: function (num) {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      this.renderPage(num);
    }
  }
}));