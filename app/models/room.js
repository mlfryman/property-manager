'use strict';

function Room(name, width, length){
  this.name = name;
  this.width = parseInt(width);
  this.length = parseInt(length);
  this.isBedroom = (this.name === 'bedroom');
}

Room.prototype.area = function(){
  return this.length * this.width;
};

Room.prototype.cost = function(){
  return this.area() * 5;
};

module.exports = Room;
