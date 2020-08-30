const {
	isHoliday
} = require("swedish-holidays");
const {
	json
} = require("express");
const TollPassInformation = require("./tollPassInformation");

const freeToll = 0;
const minToll = 0;
const maxToll = 60;

const oneTollIntervalInMinutes = 59;

module.exports = class TollCalculator {
	constructor(tollPeriods, tollFees, tollFreeVehicles) {
		this.tollPeriods = tollPeriods;
		this.tollFees = tollFees;
		this.tollFreeVehicles = tollFreeVehicles;
		this.tollPassInformation = new TollPassInformation();
	}

	calculate(vehicle, dates) {
		this.tollPassInformation.reset();
		this.tollPassInformation.setVehicle(vehicle);

		if (this.isTollFreeVehicle(vehicle)) {
			let result = this.analyseDates(dates);

			this.tollPassInformation.addErrorDates(result.errorDates);
			this.tollPassInformation.passes = result.passes;
			this.tollPassInformation.setTollFree(true);
			this.tollPassInformation.tollFee = freeToll;

			return freeToll;
		}

		var lastDate = null;
		var tollTotal = 0;
		var tollInMemory = 0;

		dates.forEach((dateString) => {
			if (!isNaN(Date.parse(dateString))) {
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

				this.tollPassInformation.pass();
			} else {
				this.tollPassInformation.addErrorDate(dateString);
			}
		});
		tollTotal += tollInMemory;

		var tollFee = tollTotal > maxToll ? maxToll : tollTotal;
		this.tollPassInformation.setTollFee(tollFee);

		return tollFee;
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

		return tollFee in this.tollFees ? this.tollFees[tollFee] : tollFee;
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
		return this.tollFreeVehicles.includes(vehicle.getType());
	}

	analyseDates(dates) {
		var passes = 0;
		var errorDates = [];
		dates.forEach(dateString => {
			if (isNaN(Date.parse(dateString))) {
				errorDates.push(dateString);
			} else {
				passes += 1;
			}
		})
		return {
			"passes": passes,
			"errorDates": errorDates
		}
	}
};