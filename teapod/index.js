"use strict";

const environment = {
  teapot: new Teapot(1000, 300),

  human: new Human("Алексей"),

  physics: {
    increaseHeat() {
      return console.log("* чайник нагревается *");
    },
    reduceHeat() {
      return console.log("* чайник остужается *");
    }
  }
};

function Teapot(capacity, minWater) {
  if (!new.target) return new Teapot(capacity, minWater);

  this.properties = {
    capacity,
    minWater
  };
  this.waterAmount = 0;
  this.currentHeat = 25;
  this.isEnabled = false;

  this.changeState = function () {
    if (this.isEnabled) {
      this.isEnabled = false;
      console.log("Чайник выключен");
      environment.physics.reduceHeat(); // replace
      return;
    }
    if (this.waterAmount < this.properties.minWater)
      return console.log("Добавьте воды в чайник");
    this.isEnabled = true;
    console.log("Чайник включен");
    environment.physics.increaseHeat(); // replace
  };

  this[Symbol.toPrimitive] = function (hint) {
    return (
      `capacity:${this.properties.capacity}` +
      `, minWater:${this.properties.minWater}` +
      `, waterAmount:${this.waterAmount}` +
      `, currentHeat: ${this.properties.currentHeat}` +
      `, isEnabled: ${this.isEnabled}`
    );
  };
}

function Human(name) {
  if (!new.target) return new Human(name);

  this.name = name;
  this.useTeapot = function () {
    console.log(`${this.name} включил чайник`);
    environment.teapot.changeState(); // replace
  };
  this.adjustWater = function (amount) {
    const teapot = environment.teapot;
    teapot.waterAmount +=
      teapot.properties.capacity - teapot.waterAmount;
    console.log(`${this.name} добавил воды в чайник`);
  };
}

environment.human.adjustWater();
environment.human.useTeapot();