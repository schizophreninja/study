"use strict";

const environment = {
  teapot: new Teapot(1000, 300, 0.1),
  human: new Human("Алексей"),
  physics: {
    coolWater: function () {
      const coolRateInMilliseconds = 1000 * environment.coolRate_SecondsPerDegree;
      if(environment.teapot.currentHeat <= environment.roomTemperature) return console.log("* вода остыла *");
      environment.teapot.currentHeat--;
      setTimeout(environment.physics.coolWater, coolRateInMilliseconds);
    }
  },
  waterAmount: 0,
  roomTemperature: 25,
  boilingHeat: 100,
  coolRate_SecondsPerDegree: 0.1 // Скорость охлаждения воды 
};

function Teapot(capacity, minWater, heatRate_SecondsPerDegree) {
  if (!new.target) return new Teapot(capacity, minWater, heatRate_SecondsPerDegree);

  this.properties = {
    capacity,
    minWater,
    heatRate_SecondsPerDegree,    // Скорость нагревания чайника, секунд на градус
  };

  this.waterSensor = {
    getWaterLevel: function () {
      return environment.waterAmount;
    } 
  }

  this.currentHeat = 25;
  this.isEnabled = false;
  this.heatTimer = null;

  this.changeState = function () {
    if (this.isEnabled) {
      this.isEnabled = false;
      console.log("Чайник выключен");
      environment.physics.coolWater();
      return;
    }
    if (this.waterSensor.getWaterLevel() < this.properties.minWater)
      return console.log("Добавьте воды в чайник");
    this.isEnabled = true;
    this.startHeatUp();
    console.log("Чайник включен");
  }

  this.startHeatUp = function() {
    this.heatTimer = setInterval(this.heatUp, 1000 * this.properties.heatRate_SecondsPerDegree, this);
  }
  this.heatUp = function (context) {
    if(context.isEnabled == false) {
      return;
    }
    if(context.currentHeat < environment.boilingHeat) {
      context.currentHeat++;
    }
    else {
      clearInterval(context.heatTimer);
      console.log("* вода нагрелась *");
      context.changeState();
    }
  }

  this[Symbol.toPrimitive] = function (hint) {
    return (
      `capacity:${this.properties.capacity}` +
      `, minWater:${this.properties.minWater}` +
      `, waterAmount:${this.waterSensor.getWaterLevel()}` +
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
    environment.waterAmount +=
      teapot.properties.capacity - environment.waterAmount;
    console.log(`${this.name} добавил воды в чайник`);
  };
}

environment.human.adjustWater();
environment.human.useTeapot();