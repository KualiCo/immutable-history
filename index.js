var Immutable = require('immutable');

function isImmutable(obj) {
  return (obj instanceof Immutable.Sequence);
}

function History(immutableCollection, changed) {
  // accept an immutablejs object or js object
  if (!isImmutable(immutableCollection)) {
    immutableCollection = Immutable.fromJS(immutableCollection);
  }

  this.history = Immutable.Vector(immutableCollection)
  this.changed = changed;
  var self = this;

  this.onChange = function(newData, oldData, path) {
    self.history = self.history.push(newData);
    self.cursor = newData.cursor([], self.onChange);
    self.changed(self.cursor);
  }

  this.cursor = immutableCollection.cursor([], self.onChange);
  this.changed(self.cursor);
}

History.prototype.at = function(index) {
  return this.history.get(this.history.length + index - 1);
};

History.prototype.previousVersion = function() {
  return this.at(-1);
}

History.prototype.undoUntilData = function(data) {
  this.history = this.history.takeWhile(function(v) {
    return v != data;
  }).toVector().push(data);
  var newData = data;
  this.cursor = data.cursor([], this.onChange);
  this.changed(this.cursor);
  return data;
}

History.prototype.undo = function() {
  return this.undoUntilData(this.previousVersion());
}

module.exports = History;
