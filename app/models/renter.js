'use strict';

function Renter(name, age, gender, profession){
  this.name = name;
  this.age = parseInt(age);
  this.gender = gender;
  this.profession = profession;

  this.isEvicted = false;
  this.cash = Math.floor(Math.random() * 4900) + 100;
}

Renter.prototype.work = function(){
  if(this.profession === 'movie star'){
    this.cash = this.cash += (Math.floor(Math.random() * 7000)+ 3000);
  }else if(this.profession === 'coder'){
    this.cash = this.cash += (Math.floor(Math.random() * 6000)+ 1000);
  }else if(this.profession === 'waiter'){
    this.cash = this.cash += (Math.floor(Math.random() * 200)+ 50);
  }else{
    this.cash = this.cash += (Math.floor(Math.random() * 600)+ 150);
  }
};

module.exports = Renter;
