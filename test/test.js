var History = require('../');
var Immutable = require('immutable');

var data = Immutable.fromJS({a: 1, b: 2, c: [1,2,3]});

var history = new History(data, render);
var state = history.cursor;

var hist = history(data, render)
hist = history.undo(hist)

function render(cursor) {
  console.log(cursor.deref());
}

state.cursor(['c']).update(function(val) {
  return Immutable.fromJS([1,2]);
});

history.undo()
