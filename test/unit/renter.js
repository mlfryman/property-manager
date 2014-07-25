/*jshint expr:true*/
/*global describe, it */
'use strict';

var expect = require('chai').expect;

var Renter = require('../../app/models/renter.js');

describe('Renter', function(){
  describe('constructor', function(){
    it('should create a renter', function(){
      var melanie  = new Renter ('Melanie', '29', 'female', 'movie star');

      expect(melanie).to.be.instanceof(Renter);
      expect(melanie.name).to.equal('Melanie');
      expect(melanie.age).to.equal(29);
      expect(melanie.gender).to.equal('female');
      expect(melanie._cash).to.be.within(100, 5000);
      expect(melanie._isEvicted).to.be.false;
      expect(melanie.profession).to.equal('movie star');
    });
  });

  describe('#work', function(){
    it('should increase cash for the renter', function(){
      var melanie  = new Renter ('Melanie', '29', 'female', 'movie star');
      melanie._cash = 0;
      melanie.work();

      expect(melanie._cash).to.be.within(3000, 10000);
    });
  });

  describe('#payRent', function(){
    it('should pay the rent', function(){
      var melanie  = new Renter ('Melanie', '29', 'female', 'movie star');
      melanie._cash = 2000;
      melanie.payRent(1500);

      expect(melanie._cash).to.equal(500);
      expect(melanie._isEvicted).to.be.false;
    });

    it('should NOT pay the rent - not enough money', function(){
      var liza = new Renter('Liza', '25', 'female', 'waiter');
      liza._cash = 1000;
      liza.payRent(1500);

      expect(liza._cash).to.equal(1000);
      expect(liza._isEvicted).to.be.true;
    });
  });

  describe('#party', function(){
    it('should cause no disturbance - party on', function(){
      var melanie;

      while(true){
        melanie  = new Renter ('Melanie', '29', 'female', 'movie star');
        melanie.party();

        if(!melanie._isEvicted){
          break;
        }
      }

      expect(melanie._isEvicted).to.be.false;
    });

    it('should cause police to be called', function(){
      var melanie;

      while(true){
        melanie  = new Renter ('Melanie', '29', 'female', 'movie star');
        melanie.party();

        if(melanie._isEvicted){
          break;
        }
      }

      expect(melanie._isEvicted).to.be.true;
    });
  });
});
