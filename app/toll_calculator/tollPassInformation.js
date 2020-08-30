const invalidDate = "Date is invalid: ";

module.exports = class TollPassInformation {
	constructor() {
		this.tollFee = 0;
		this.toll_free = false;
		this.errorMessages = [];
		this.vehicle = "";
		this.passes = 0;
	}

	reset() {
		this.errorMessages = [];
		this.tollFee = 0;
		this.vehicle = "";
		this.passes = 0;
		this.toll_free = false;
	}

	pass() {
		this.passes += 1;
	}

	setVehicle(vehicle) {
		this.vehicle = vehicle.getType();
	}

	setTollFee(fee) {
		this.tollFee = fee;
	}

	setTollFree(free) {
		this.toll_free = free;
	}

	addErrorDate(date) {
		this.errorMessages.push(invalidDate + date);
	}

	addErrorDates(dates) {
		dates.forEach(date => {
			addErrorDate(date);
		});
	}
}