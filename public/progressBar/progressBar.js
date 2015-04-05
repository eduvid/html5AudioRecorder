/**
 * Created by narendra on 14/3/15.
 */


choona.registerElement(choona.ElementView.extend({
  tagName: "boot-progressbar",
  events:{
  },
  template: '<div class="progress"><div class="progress-bar" role="progressbar"><span class="status"><span class="percentage"></span><span class="value"></span></span></div></div>',
  accessors: {
    active:{
      type:"boolean"
    },
    striped:{
      type:"boolean"
    },
    intermediate:{
      type:"boolean"
    },
    showActualValue:{
      type:"boolean"
    },
    showStatus:{
      type:"boolean"
    },
    value: {
      default: 0,
      type: "int",
      onChange: "render"
    },
    min: {
      default: 0,
      type: "int",
      onChange: "render"
    },
    max: {
      default: 100,
      type: "int",
      onChange: "render"
    },
    type: {
      default: "defaults",
      type:"string"
    }
  },
  initialize: function () {
    this.constructor.parent.apply(this, arguments);
  },
  createdCallback: function () {

  },
  attachedCallback: function () {
    this.render();
  },
  detachedCallback: function () {
    console.log("I am ending " + this.tagName);
  },
  attributeChangedCallback: function (attrName, oldVal, newVal) {

  },
  render: function () {
    console.log("Rendering " + this.$);
    var value = this.$.value;
    var min = this.$.min;
    var max = this.$.max;

    var p = ((value - min)/(max - min) * 100);
    if(p>100){
      p = 100;
    }
    if(p<0){
      p = 0;
    }
    this.$.querySelector(".progress-bar").style.width = p + "%";
    this.$.querySelector("span.status").innerHTML = '<span class="percentage">'+ p +'%</span><span class="value">'+ value + '</span>';
  }
}));