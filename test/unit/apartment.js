/*jshint expr:true*/
/*global describe, it */

'use strict';

var expect = require('chai').expect;
var Apartment = require('../../app/models/apartment.js');
var Room = require('../../app/models/room.js');
//var Renter = require('../../app/models/renter.js');

describe('Apartment', function(){
  describe('constructor', function(){
    it('should create a new apartment', function(){
      var a1 = new Apartment('A1');

      expect(a1).to.be.instanceof(Apartment);
      expect(a1.unit).to.equal('A1');
      expect(a1.rooms).to.have.length(0);
      expect(a1.renters).to.have.length(0);
    });
  });
  
  describe('#area', function(){
    it('should calculate the area of the apartment', function(){
      var a1 = new Apartment('A1');
      var br1 = new Room('bedroom', '50', '10');
      var br2 = new Room('bedroom', '75', '30');
      var br3 = new Room('bedroom', '30', '15');
      var ba1 = new Room('bathroom', '10', '15');
      var ba2 = new Room('bathroom', '25', '12');
      a1.rooms.push(br1, br2, br3, ba1, ba2);

      expect(a1.rooms).to.have.length(5);
      expect(a1.area()).to.equal(3650);
    });
  });
  describe('#cost', function(){
    it('should calculate the cost of the apartment', function(){
      var a1 = new Apartment('A1');
      var br1 = new Room('bedroom', '50', '10');
      var br2 = new Room('bedroom', '75', '30');
      var br3 = new Room('bedroom', '30', '15');
      var ba1 = new Room('bathroom', '10', '15');
      var ba2 = new Room('bathroom', '25', '12');
      a1.rooms.push(br1, br2, br3, ba1, ba2);
     
      expect(a1.cost()).to.equal(18250);
    });
  });
});
