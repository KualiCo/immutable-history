var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');
var events = require('events')

var EVENT_CHANGE = 'change'

function isImmutable(obj) {
  return (obj instanceof Immutable.Seq);
}

function History(immutableCollection, changed) {

  // if constructor wasn't called with new, call it with new!
  if (!this instanceof History) {
    return new History(immutableCollection, changed);
  }

  // accept an immutablejs object or js object
  if (!isImmutable(immutableCollection)) {
    immutableCollection = Immutable.fromJS(immutableCollection);
  }

  // Immutable.List will coerce other data types to a list, and will
  // silently fail to wrap a List in another list, so we do it ourselves
  this.history = Immutable.List([immutableCollection]);
  this.emitter = new events.EventEmitter();
  this.changed = changed;
  var self = this;

  this._onChange = function(newData, oldData, path) {
    self.history = self.history.push(newData);
    self.cursor = Cursor.from(newData, [], self._onChange);
    self._emitChange()
  }

  // allows this to be passed around
  this.onChange = this.onChange.bind(this)

  this.cursor = Cursor.from(immutableCollection, [], self._onChange);
  this._emitChange()
}

History.prototype._emitChange = function() {
  this.changed(this.cursor);
  this.emitter.emit(EVENT_CHANGE, this.cursor)
}


History.prototype.at = function(index) {
  return this.history.get(this.history.count() + index - 1);
};

History.prototype.previousVersion = function() {
  return this.at(-1);
}

History.prototype.undoUntilData = function(data) {
  this.history = this.history.takeWhile(function(v) {
    return v != data;
  }).toList().push(data);
  var newData = data;
  this.cursor = Cursor.from(data, [], this._onChange);
  self._emitChange()
  return data;
}

History.prototype.undo = function() {
  return this.undoUntilData(this.previousVersion());
}

History.prototype.onChange = function(handler) {
  return this.emitter.on(EVENT_CHANGE, handler);
}

module.exports = History;
