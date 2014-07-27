'use strict';

function Renter(name, age, gender, profession){
  this.name = name;
  this.age = parseInt(age);
  this.gender = gender;
  this.profession = profession;

  this._isEvicted = false;
  this._cash = Math.floor(Math.random() * 4901) + 100;
}

Renter.prototype.work = function(){
  switch(this.profession){
    case 'movie star':
      this._cash += Math.floor(Math.random() * 7001) + 3000;
      break;
    case 'coder':
      this._cash += Math.floor(Math.random() * 6001) + 1000;
      break;
    case 'waiter':
      this._cash += Math.floor(Math.random() * 201) + 50;
      break;
    case 'social worker':
      this._cash += Math.floor(Math.random() * 601) + 150;
  }
};

Renter.prototype.payRent = function(rent){
  if(this.isEvicted){return 0;}

  rent = parseInt(rent);
  this._isEvicted = this._cash < rent;

  if(!this._isEvicted){
    this._cash -= rent;
    return rent;
  }

  return 0;
};

Renter.prototype.party = function(){
  if(this._isEvicted){
    return;
  }

  var volume = Math.floor(Math.random() * 10) + 1;
  this._isEvicted = volume > 8;
};

module.exports = Renter;
