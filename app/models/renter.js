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

Renter.prototype.payRent = function(amount){
  this.cash -= amount;
  if(this.cash < 0){
    this.isEvicted = true;
  }
};

Renter.prototype.party = function(){
  var party = Math.floor(Math.random()*9)+1;
  if(party < 8){
    this.isEvicted = false;
  }else{
    this.isEvicted = true;
  }
  console.log(party);
};



module.exports = Renter;
