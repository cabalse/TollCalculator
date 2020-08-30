const Car = require("../models/car");
const Motorbike = require("../models/motorbike");
const Tractor = require("../models/tractor");
const Emergency = require("../models/emergency");
const Diplomat = require("../models/diplomat");
const Foreign = require("../models/foreign");
const Military = require("../models/military");

const vehicleFactory = {
	car: Car,
	motorbike: Motorbike,
	tractor: Tractor,
	emergency: Emergency,
	diplomat: Diplomat,
	foreign: Foreign,
	military: Military,
};

module.exports = function (app, tollCalculator) {
	app.post("/toll-calculation", (req, res) => {
		var toll = tollCalculator.calculate(
			new vehicleFactory[req.body.vehicle](),
			req.body.tollPasses
		);
		res.json(tollCalculator.tollPassInformation);
	});
};