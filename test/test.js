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

  it('calls the callback with a cursor', function(done) {
    var data = Immutable.fromJS([1,2,3,4]);
    var h = new History(data, function(c) {
      assert.equal(c.deref(), data);
      done();
    });
  });

  describe('when updating the cursor', function() {
    it('calls the callback passed in to the constructor', function(done) {
      var data = Immutable.fromJS([1,2,3,4]);
      var i = 0;
      var h = new History(data, function(c) {

        // only do it the second time around, b/c the constructor calls
        // this callback
        if (i == 1) {
          assert.equal(c.deref().get(0), 100);
          done();
        }
        i++;
      });
      h.cursor.update([0], function(old) {
        return 100;
      });
    });
  });

  describe('.history', function() {
    it('contains the original data when the history starts', function() {
      var data = Immutable.fromJS([1,2,3,4]);
      var h = new History(data, function() {});
      assert.equal(h.history.get(0), data);
      assert.equal(h.history.count(), 1);
    });
  });

  it('appends to this.history when the cursor is changed', function() {
  
  });

  it('emits an update event', function(done) {
    var data = Immutable.fromJS({key:"value"})
    var h = new History(data, function() {});
    h.onChange(function(cursor) {
      assert.equal(cursor.get('key'), "newValue");
      done();
    })
    h.cursor.cursor('key').update(function(v) {
      return "newValue";
    })
  });

  it('undo/redo works', function() {
      var data = Immutable.fromJS({key:"value"})
      var h = new History(data, function() {});
      h.cursor.cursor('key').update(function(v) {
        return "newValue";
      })
      h.cursor.cursor('key').update(function(v) {
        return "newValue1";
      })
      h.cursor.cursor('key').update(function(v) {
        return "newValue2";
      })
      assert.equal(h.cursor.get('key'), "newValue2");
      h.undo();
      assert.equal(h.cursor.get('key'), "newValue1");
      h.redo();
      assert.equal(h.cursor.get('key'), "newValue2");
      h.undo();
      assert.equal(h.cursor.get('key'), "newValue1");
      h.undo();
      assert.equal(h.cursor.get('key'), "newValue");
      h.redo();
      assert.equal(h.cursor.get('key'), "newValue1");
      h.cursor.cursor('key').update(function(v) {
        return "newValue3";
      })
      assert.equal(h.cursor.get('key'), "newValue3");
      h.undo();
      assert.equal(h.cursor.get('key'), "newValue1");
  });



});


