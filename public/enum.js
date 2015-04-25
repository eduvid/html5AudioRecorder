var Enum = pitana.klass({
  initialize: function() {
    this.currentState = undefined;
    this.allStates = Array.prototype.slice.call(arguments);
  },
  setInitialState: function(state) {
    if (this.allStates.indexOf(state) !== -1) {
      this.currentState = state;
    } else {
      console.log("Unknown State", state);
    }
  },
  is: function(state) {
    return this.currentState === state;
  }
});
