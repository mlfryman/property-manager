/*jshint expr:true*/
/*global describe, it */

'use strict';

var expect = require('chai').expect;
var Room = require('../../app/models/room.js');

describe('Room', function(){
  describe('constructor', function(){
    it('should create a new Room object', function(){
      var living = new Room('living room', '19', '12');

      expect(living).to.be.instanceof(Room);
      expect(living.name).to.equal('living room');
      expect(living.width).to.equal(19);
      expect(living.length).to.equal(12);
    });
  });

  describe('#area', function(){
    it('should calculate the area of a room', function(){
      var living = new Room('living room', '19', '12');
      expect(living.area()).to.equal(228);
     });
  });

  describe('#cost', function(){
    it('should calculate the cost per sq. ft. of a room (assumes $5/sq.ft.)', function(){
      var living = new Room('living room', '19', '12');
      expect(living.cost()).to.equal(1140);
    });
  });
});
