'use strict';
//var Room = require('./room.js');

function Apartment(unit){
  this.unit = unit;
  this.rooms = [];
  this.renters = [];
}

Apartment.prototype.area = function(){
  var total = 0;
  for(var i = 0; i < this.rooms.length; i++){
    total += (this.rooms[i].length * this.rooms[i].width);
  }
  return total;
};

Apartment.prototype.cost = function(){
  return this.area() * 5;
};

module.exports = Apartment;
