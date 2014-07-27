/*jshint expr:true*/
/*global describe, it */
'use strict';

var expect = require('chai').expect;
var Renter = require('../../app/models/renter.js');

describe('Renter', function(){
  describe('constructor', function(){
    it('should create a new Renter object', function(){
      var buffy = new Renter('Buffy Summers', '35', 'f', 'movie star');

      expect(buffy).to.be.instanceof(Renter);
      expect(buffy.name).to.equal('Buffy Summers');
      expect(buffy.age).to.equal(35);
      expect(buffy.gender).to.equal('f');
      expect(buffy._cash).to.be.within(100, 5000);
      expect(buffy._isEvicted).to.be.false;
      expect(buffy.profession).to.equal('movie star');
    });
  });

  describe('#work', function(){
    it('should increase cash for the renter', function(){
      var buffy = new Renter('Buffy Summers', '35', 'f', 'movie star');
      buffy._cash = 0;
      buffy.work();

      expect(buffy._cash).to.be.within(3000, 10000);
    });
  });

  describe('#payRent', function(){
    it('should pay the rent', function(){
      var buffy = new Renter('Buffy Summers', '35', 'f', 'movie star');
      buffy._cash = 2000;
      buffy.payRent('1500');

      expect(buffy._cash).to.equal(500);
      expect(buffy._isEvicted).to.be.false;
    });

    it('should NOT pay the rent - not enough money', function(){
      var buffy = new Renter('Buffy Summers', '35', 'f', 'movie star');
      buffy._cash = 1000;
      buffy.payRent('1500');

      expect(buffy._cash).to.equal(1000);
      expect(buffy._isEvicted).to.be.true;
    });
  });

  describe('#party', function(){
    it('should cause no disturbance - party on', function(){
      var buffy;

      while(true){
        buffy = new Renter('Buffy Summers', '35', 'f', 'movie star');
        buffy.party();

        if(!buffy._isEvicted){
          break;
        }
      }

      expect(buffy._isEvicted).to.be.false;
    });

    it('should cause police to be called & evict renter', function(){
      var buffy;

      while(true){
        buffy = new Renter('Buffy Summers', '35', 'f', 'movie star');
        buffy.party();

        if(buffy._isEvicted){
          break;
        }
      }

      expect(buffy._isEvicted).to.be.true;
    });
  });
});
