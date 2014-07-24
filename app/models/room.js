'use strict';

function Room(name, width, length){
  this.name = name;
  this.width = parseInt(width);
  this.length = parseInt(length);
  this._area = this.length * this.width;
}

Room.prototype.area = function(){
  return this._area;
};



module.exports = Room;
