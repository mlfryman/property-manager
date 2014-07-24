/*jshint expr:true*/
/*global describe, it */

'use strict';

var expect = require('chai').expect;
var Apartment = require('../../app/models/apartment.js');
//var Room = require('../../app/models/room.js');
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
});
