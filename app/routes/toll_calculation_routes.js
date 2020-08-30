const Car = require("../classes/car");
const Motorbike = require("../classes/motorbike");
const Tractor = require("../classes/tractor");
const Emergency = require("../classes/emergency");
const Diplomat = require("../classes/diplomat");
const Foreign = require("../classes/foreign");
const Military = require("../classes/military");

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
    res.send(toll.toString());
  });
};
