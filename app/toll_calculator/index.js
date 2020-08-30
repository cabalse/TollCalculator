const { isHoliday } = require("swedish-holidays");
const { json } = require("express");

const freeToll = 0;
const tollRate1 = 8;
const tollRate2 = 13;
const tollRate3 = 18;

const minToll = 0;
const maxToll = 60;

const oneTollIntervalInMinutes = 59;

const tollFreeVehicles = [
  "motorbike",
  "tractor",
  "emergency",
  "diplomat",
  "foreign",
  "military",
];

var TollPeriods = class {
  constructor(from, to, tollRate) {
    this.from = from;
    this.to = to;
    this.tollRate = tollRate;
  }
};

var tollPeriods = [];

module.exports = class TollCalculator {
  constructor(tollPeriods, tollFees) {
    this.tollPeriods = tollPeriods;
    this.tollFees = tollFees;
  }

  calculate(vehicle, dates) {
    if (this.isTollFreeVehicle(vehicle)) return freeToll;

    var lastDate = null;
    var tollTotal = 0;
    var tollInMemory = 0;

    dates.forEach((dateString) => {
      let date = new Date(dateString);
      let diff = this.calculateDifferenceInMinutes(lastDate, date);
      let toll = this.getTollFee(date);

      if (diff <= oneTollIntervalInMinutes) {
        if (toll > tollInMemory) tollInMemory = toll;
        if (lastDate === null) lastDate = date;
      } else {
        tollTotal += tollInMemory;
        tollInMemory = toll;
        lastDate = date;
      }
    });
    tollTotal += tollInMemory;

    return tollTotal > maxToll ? maxToll : tollTotal;
  }

  calculateDifferenceInMinutes(firstDate, nextDate) {
    if (firstDate === null) return 0;
    var minutes = nextDate.getMinutes() - firstDate.getMinutes();
    var hours = nextDate.getHours() - firstDate.getHours();
    minutes += hours * 60;
    return minutes;
  }

  getTollFee(date) {
    if (this.isWeekend(date)) return minToll;
    if (isHoliday(date)) return minToll;
    return this.findTollFeeForTime(date.getHours(), date.getMinutes());
  }

  findTollFeeForTime(hour, minute) {
    var tollFee = minToll;
    this.tollPeriods.forEach((period) => {
      if (
        this.isTimeBetween(
          period.from,
          period.to,
          parseInt(hour),
          parseInt(minute)
        )
      )
        tollFee = period.tollFee;
    });
    return tollFee;
  }

  isTimeBetween(from, to, hour, minute) {
    var fromTime = from.split(":").map((o) => parseInt(o));
    var toTime = to.split(":").map((o) => parseInt(o));
    if (
      hour < fromTime[0] ||
      toTime[0] < hour ||
      (hour === fromTime[0] && minute < fromTime[1]) ||
      (hour === toTime[0] && toTime[1] < minute)
    )
      return false;
    return true;
  }

  isWeekend(date) {
    var dayOfWeek = date.getDay();
    return dayOfWeek === 6 || dayOfWeek === 0;
  }

  isTollFreeVehicle(vehicle) {
    return tollFreeVehicles.includes(vehicle.getType());
  }
};
