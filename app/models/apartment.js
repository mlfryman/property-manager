'use strict';

function Apartment(unit){
  this.unit = unit;
  this.rooms = [];
  this.renters = [];
}

Apartment.prototype.area = function(){
  return this.length * this.width;
};

Apartment.prototype.cost = function(){
  return this.area() * 5;
};

module.exports = Apartment;
