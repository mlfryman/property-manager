/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

var expect = require('chai').expect;
var Apartment = require('../../app/models/apartment');
var Room = require('../../app/models/room');
var Renter = require('../../app/models/renter');
var connect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');

var a1, a2, a3;//creates global apartment variables

describe('Apartment', function(){
  before(function(done){
    connect('property-manager-test', function(){
      Apartment = require('../../app/models/apartment');
      done();
    });
  });

  beforeEach(function(done){
    global.mongodb.collection('apartments').remove(function(){
      a1 = new Apartment('A1');
      a2 = new Apartment('A2');
      a3 = new Apartment('A3');
      //area = 610
      var r1 = new Room('bedroom', '11', '13');
      var r2 = new Room('bedroom', '11', '13');
      var r3 = new Room('living room', '16', '13');
      var r4 = new Room('kitchen', '10', '8');
      var r5 = new Room('bathroom', '6', '6');
      //area = 451
      var r6 = new Room('bedroom', '11', '13');
      var r7 = new Room('living room', '19', '12');
      var r8 = new Room('kitchen', '8', '8');
      var r9 = new Room('bathroom', '4', '4');
      //area = 619
      var r10 = new Room('bedroom', '10', '14');
      var r11 = new Room('bedroom', '10', '14');
      var r12 = new Room('living room', '15', '15');
      var r13 = new Room('kitchen', '8', '8');
      var r14 = new Room('bathroom', '5', '5');
      var r15 = new Room('bathroom', '5', '5');

      var willow = new Renter('willow', '25', 'f', 'coder');
      var buffy = new Renter('buffy', '35', 'f', 'movie star');
      var dawn = new Renter('dawn', '19', 'f', 'waiter');
      var anya = new Renter('anya', '45', 'f', 'social worker');
      var xander = new Renter('xander', '55', 'm', 'waiter');

      a1.rooms.push(r1, r2, r3, r4, r5);
      a1.renters.push(anya, xander);
      a2.rooms.push(r6, r7, r8, r9);
      a2.renters.push(willow);
      a3.rooms.push(r10, r11, r12, r13, r14, r15);
      a3.renters.push(buffy, dawn);
      a1.save(function(){
        a2.save(function(){
          a3.save(function(){
            done();
          });
        });
      });
    });
  });

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
      var r1 = new Room('bedroom', '11', '13');
      var r2 = new Room('bedroom', '11', '13');
      var r3 = new Room('living room', '16', '13');
      var r4 = new Room('kitchen', '10', '8');
      var r5 = new Room('bathroom', '6', '6');
      a1.rooms.push(r1, r2, r3, r4, r5);

      expect(a1.area()).to.equal(610);
    });
  });

  describe('#cost', function(){
    it('should calculate the cost of the apartment', function(){
      var a1 = new Apartment('A1');
      var r1 = new Room('bedroom', '11', '13');
      var r2 = new Room('bedroom', '11', '13');
      var r3 = new Room('living room', '16', '13');
      var r4 = new Room('kitchen', '10', '8');
      var r5 = new Room('bathroom', '6', '6');
      a1.rooms.push(r1, r2, r3, r4, r5);

      expect(a1.cost()).to.equal(3050);
    });
  });

  describe('#bedrooms', function(){
    it('should return the number of bedrooms in the apartment', function(){
      var a1 = new Apartment('A1');
      var r1 = new Room('bedroom', '11', '13');
      var r2 = new Room('bedroom', '11', '13');
      var r3 = new Room('living room', '16', '13');
      var r4 = new Room('kitchen', '10', '8');
      var r5 = new Room('bathroom', '6', '6');
      a1.rooms.push(r1, r2, r3, r4, r5);

      expect(a1.bedrooms()).to.equal(2);
    });
  });

  describe('#isAvailable', function(){
    it('should notify manager if an apartment bedroom is available to sublet', function(){
      var a1 = new Apartment('A1');
      var r1 = new Room('bedroom', '11', '13');
      var r2 = new Room('bedroom', '11', '13');
      var r3 = new Room('living room', '16', '13');
      var r4 = new Room('kitchen', '10', '8');
      var r5 = new Room('bathroom', '6', '6');
      var anya = new Renter('anya', '45', 'f', 'social worker');
      a1.rooms.push(r1, r2, r3, r4, r5);
      a1.renters.push(anya);

      expect(a1.isAvailable()).to.be.true;
    });
  });

  describe('#purgeEvicted', function(){
    it('should remove evicted tenents from apartment renters array', function(){
      var a1 = new Apartment('A1');
      var willow = new Renter('willow', '25', 'f', 'coder');
      var buffy = new Renter('buffy', '35', 'f', 'movie star');
      var dawn = new Renter('dawn', '19', 'f', 'waiter');
      dawn._isEvicted = true;
      a1.renters.push(willow, buffy, dawn);

      expect(a1.renters).to.have.length(3);//before purge
      a1.purgeEvicted();
      expect(a1.renters).to.have.length(2);//after purge
    });
  });

  describe('#collectRent', function(){
    it('should deduct rent from each tenent\'s cash', function(){
      var a1 = new Apartment('A1');
      // Apartment rent = $4500
      var r1 = new Room('bedroom', '10', '11');
      var r2 = new Room('bedroom', '10', '11');
      var r3 = new Room('bedroom', '16', '12');
      var r4 = new Room('living room', '14', '22');
      var r5 = new Room('kitchen', '9', '12');
      var r6 = new Room('bathroom', '6', '6');
      var r7 = new Room('bathroom', '6', '6');
      var willow = new Renter('willow', '25', 'f', 'coder');
      var buffy = new Renter('buffy', '35', 'f', 'movie star');
      var dawn = new Renter('dawn', '19', 'f', 'waiter');
      willow._cash = 4000;
      buffy._cash = 4000;
      dawn._cash = 4000;
      a1.rooms.push(r1, r2, r3, r4, r5, r6, r7);
      a1.renters.push(willow, buffy, dawn);
      a1.collectRent();

      expect(willow._cash).to.be.closeTo(2500, 0.02);
      expect(willow._isEvicted).to.be.false;
      expect(buffy._cash).to.be.closeTo(2500, 0.02);
      expect(buffy._isEvicted).to.be.false;
      expect(dawn._cash).to.be.closeTo(2500, 0.02);
      expect(dawn._isEvicted).to.be.false;
    });

    it('should evict renters who cannot pay', function(){
      var a1 = new Apartment('A1');
      // Apartment rent = $4500
      var r1 = new Room('bedroom', '10', '11');
      var r2 = new Room('bedroom', '10', '11');
      var r3 = new Room('bedroom', '16', '12');
      var r4 = new Room('living room', '14', '22');
      var r5 = new Room('kitchen', '9', '12');
      var r6 = new Room('bathroom', '6', '6');
      var r7 = new Room('bathroom', '6', '6');
      var willow = new Renter('willow', '25', 'f', 'coder');
      var buffy = new Renter('buffy', '35', 'f', 'movie star');
      var dawn = new Renter('dawn', '19', 'f', 'waiter');
      willow._cash = 4000;
      buffy._cash = 4000;
      dawn._cash = 1000;
      a1.rooms.push(r1, r2, r3, r4, r5, r6, r7);
      a1.renters.push(willow, buffy, dawn);
      a1.collectRent();

      expect(willow._cash).to.be.closeTo(2500, 0.01);
      expect(willow._isEvicted).to.be.false;
      expect(buffy._cash).to.be.closeTo(2500, 0.01);
      expect(buffy._isEvicted).to.be.false;
      expect(dawn._cash).to.equal(1000);
      expect(dawn._isEvicted).to.be.true;
    });
  });

  // begin ASYNC tests

  describe('#save', function(){
    it('should save an apartment to the mongo database', function(done){
      var a1 = new Apartment('A1');
      var r1 = new Room('bedroom', '11', '13');
      var r2 = new Room('bedroom', '11', '13');
      var r3 = new Room('living room', '16', '13');
      var r4 = new Room('kitchen', '10', '8');
      var r5 = new Room('bathroom', '6', '6');
      a1.rooms.push(r1, r2, r3, r4, r5);
      a1.save(function(){
        expect(a1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.find', function(){
    it('should find all apartments in database', function(done){
      Apartment.find({}, function(apts){
        expect(apts).to.have.length(3);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find 1 apartment in database by it\'s id', function(done){
      Apartment.find({}, function(apts){
        Apartment.findById(apts[0]._id, function(apt){
          expect(apt.unit).to.equal('A1');
          expect(apt).to.be.instanceof(Apartment);
          done();
        });
      });
    });
  });

  describe('.deleteById', function(){
    it('should remove 1 apartment in database by it\'s id', function(done){
      Apartment.find({}, function(apts){
        Apartment.deleteById(apts[0]._id, function(){
          Apartment.find({}, function(apts2){
            expect(apts2).to.have.length(2);
            done();
          });
        });
      });
    });
  });

  describe('#area', function(){
    it('should return the total area of the apartment complex', function(done){
      Apartment.area(function(area){
        expect(area).to.equal(1680);
        done();
      });
    });
  });

  describe('#cost'. function(){
    it('should return the total cost of the apartment complex', function(done){
      Apartment.cost(function(cost){
        expect(cost).to.equal(8400);
        done();
      });
    });
  });

 /* describe('#tenents', function(){
   it('should return the number of tenents in the apartment complex', function(done){
   });
  });

 describe('#revenue', function(){
   it('should find revenue for all apartments with at least 1 renter', function(done){
   });
 }); */
});
