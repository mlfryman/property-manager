/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

var expect = require('chai').expect;
var Apartment = require('../../app/models/apartment');
var Room = require('../../app/models/room');
var Renter = require('../../app/models/renter');
var connect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');

var a1, a2;//creates global apartment variables

describe('Apartment', function(){
  //The 'before' block connects to the MongoDB database before any tests are run.
  //'Before' uses a callBack function, which halts the script until the db is connected.
  before(function(done){
    connect('property-manager-test', function(){
      done();
    });
  });

  //The 'beforeEach' block clears the db and adds data before each test runs.
  //This ensures that we know what data our db has prior to any test.
  beforeEach(function(done){
    global.mongodb.collection('apartments').remove(function(){
      //area = 753; cost = $3,765
      a1 = new Apartment('A1');
      var r1 = new Room('bedroom', '11', '13');
      var r2 = new Room('bedroom', '11', '13');
      var r3 = new Room('bedroom', '11', '13');
      var r4 = new Room('living room', '16', '13');
      var r5 = new Room('kitchen', '10', '8');
      var r6 = new Room('bathroom', '6', '6');
      var buffy = new Renter('buffy', '35', 'f', 'movie star');
      var willow = new Renter('willow', '25', 'f', 'coder');
      a1.rooms.push(r1, r2, r3, r4, r5, r6);
      a1.renters.push(buffy, willow);

      //area = 451; cost = $2,255
      a2 = new Apartment('A2');
      var r7 = new Room('bedroom', '11', '13');
      var r8 = new Room('living room', '19', '12');
      var r9 = new Room('kitchen', '8', '8');
      var r10 = new Room('bathroom', '4', '4');
      a2.rooms.push(r7, r8, r9, r10);

      a1.save(function(){
        a2.save(function(){
          done();
        });
      });
    });
  });

  describe('constructor', function(){
    it('should create a new apartment', function(){
      var a2 = new Apartment('A2');
      expect(a2).to.be.instanceof(Apartment);
      expect(a2.unit).to.equal('A2');
      expect(a2.rooms).to.have.length(0);
      expect(a2.renters).to.have.length(0);
    });
  });

  describe('#area', function(){
    it('should calculate the area of the apartment', function(){
      expect(a1.area()).to.equal(753);
    });
  });

  describe('#cost', function(){
    it('should calculate the cost of the apartment', function(){
      expect(a1.cost()).to.equal(3765);
    });
  });

  describe('#bedrooms', function(){
    it('should count the number of bedrooms in an apartment', function(){
      expect(a1.bedrooms()).to.equal(3);
    });
  });

  describe('#isAvailable', function(){
    it('should determine if there are any bedrooms in an apartment - to sublet', function(){
      expect(a1.isAvailable()).to.be.true;
    });

    it('should determine if there are open bedrooms in an apartment - none available', function(){
      var dawn = new Renter('dawn', '19', 'f', 'waiter');
      a1.renters.push(dawn);
      expect(a1.isAvailable()).to.be.false;
    });
  });

  describe('#purgeEvicted', function(){
    it('should purge evicted tenents from apartment', function(){
      var dawn = new Renter('dawn', '19', 'f', 'waiter');
      dawn._isEvicted = true;
      a1.renters.push(dawn);

      expect(a1.renters).to.have.length(3);//before purge
      a1.purgeEvicted();
      expect(a1.renters).to.have.length(2);//after purge
    });
  });

  describe('#collectRent', function(){
    it('should collect rent from tenents', function(){
      a1.renters[0]._cash = 10000;
      a1.renters[1]._cash = 7000;
      var collected = a1.collectRent();
      console.log('Cost of A1: ' + a1.cost());
      console.log('Renters in A1: ' + a1.renters.length);
      console.log('Rent collected from A1: ' + a1.collectRent());
      expect(collected).to.be.closeTo(3765, 1);

      a1.renters[0]._cash = 10000;
      a1.renters[1]._cash = 300;
      collected = a1.collectRent();
      expect(collected).to.be.closeTo(1882, 1);
      expect(a1.renters[0]._isEvicted).to.be.false;
      expect(a1.renters[1]._isEvicted).to.be.true;
    });
  });

  // begin ASYNC tests

  describe('#save', function(){
    it('should insert a new apartment into the Mongo database', function(){
      expect(a1._id).to.be.instanceof(Mongo.ObjectID);
    });

    it('should update an exiting apartment from the database', function(done){
      a1.unit = 'A1*';
      a1.save(function(){
        Apartment.findById(a1._id, function(err, apt){
          expect(apt.unit).to.equal('A1*');
          done();
        });
      });
    });
  });

  describe('.find', function(){
    it('should find all apartments in the Mongo DB', function(done){
      Apartment.find({}, function(err, apts){
        expect(apts).to.have.length(2);
        expect(apts[0]).to.respondTo('area');
        expect(apts[0].rooms[0]).to.respondTo('area');
        expect(apts[0].renters[0]).to.respondTo('work');
        done();
      });
    });

    it('should find some apartments in the Mongo DB', function(done){
      Apartment.find({unit:'A1'}, function(err, apts){
        expect(apts).to.have.length(1);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find an apartment by unique ID', function(done){
      Apartment.findById(a1._id, function(err, apt){
        expect(apt.unit).to.equal('A1');
        expect(apt).to.respondTo('area');
        expect(apt.rooms[0]).to.respondTo('area');
        expect(apt.renters[0]).to.respondTo('work');
        done();
      });
    });
  });

  describe('.deleteById', function(){
    it('should delete an apartment', function(done){
      Apartment.deleteById(a1._id, function(){
        Apartment.find({}, function(err, apts){
          expect(apts).to.have.length(1);
          done();
        });
      });
    });
  });

  describe('.area', function(){
    it('should return the total area of the apartment complex', function(done){
      Apartment.area(function(aptArea){
        expect(aptArea).to.equal(1204);
        done();
      });
    });
  });

  describe('.cost', function(){
    it('should return the total cost of the apartment complex (assumes $5/sq.ft.)', function(done){
      Apartment.cost(function(aptCost){
        expect(aptCost).to.equal(6020);
        done();
      });
    });
  });

  describe('.revenue', function(){
    it('should find revenue for all apartments with at least 1 renter', function(done){
      Apartment.revenue(function(revenue){
        expect(revenue).to.equal(3765);
        done();
      });
    });
  });

  describe('.tenents', function(){
    it('should find all tenents in apartment complex', function(done){
      Apartment.tenents(function(tenents){
        expect(tenents).to.equal(2);
        done();
      });
    });
  });
});
