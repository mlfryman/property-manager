/*jshint expr:true*/
/*global describe, it */
'use strict';

var expect = require('chai').expect;
var Room = require('../../app/models/room.js');

describe('Room', function(){
  describe('constructor', function(){
    it('should create a new room', function(){
      var kitchen = new Room('kitchen', '10', '12');

      expect(kitchen).to.be.instanceof(Room);
      expect(kitchen.name).to.equal('kitchen');
      expect(kitchen.width).to.equal(10);
      expect(kitchen.length).to.equal(12);
    });
  });
  
  describe('#area', function(){
    it('should calculate the area of a room', function(){
      var kitchen = new Room('kitchen', '10', '12');
     
      expect(kitchen._area).to.equal(120);
      expect(kitchen._area).to.be.a('number');
     });
  });
  describe('#cost', function(){
    it('should calculate the cost of a room', function(){
      var kitchen = new Room('kitchen', '10', '12');
      var price = 5;

      var total = kitchen.cost(price);
      expect(total).to.equal(600);
      expect(total).to.be.a('number');
    });
  });
});
