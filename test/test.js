var assert = require('assert');
var History = require('../');
var Immutable = require('immutable');

describe('History', function() {
  it('accepts a js object or an Immutable sequence', function() {
    var h = new History([1,2,3,4], function() {});
    var hImmutable = new History(Immutable.fromJS([1,2,3,4]), function(){});
  });

  it('exposes a cursor to the data', function() {
    var data = Immutable.fromJS([1,2,3,4]);
    var h = new History(data, function() {});
    var state = h.cursor;
    assert(state.deref() == data);
  });

  describe('.history', function() {
    it('contains the original data when the history starts', function() {
      var data = Immutable.fromJS([1,2,3,4]);
      var h = new History(data, function() {});
      assert.equal(h.history.get(0), data);
      assert.equal(h.history.length, 1);
    });
  });

  it('appends to this.history when the cursor is changed', function() {
  });
});
//var data = Immutable.fromJS({a: 1, b: 2, c: [1,2,3]});

//var history = new History(data, render);
//var state = history.cursor;

//var hist = history(data, render)
//hist = history.undo(hist)

//function render(cursor) {
  //console.log(cursor.deref());
//}

//state.cursor(['c']).update(function(val) {
  //return Immutable.fromJS([1,2]);
//});

//history.undo()
