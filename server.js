var express = require("express");
var app = express();

app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

const tollPeriods = require("./config/tollperiods.json");
const tempTollFees = require("./config/tollFees.json");
var tollFees = {};
tempTollFees.forEach(toll => {
	tollFees[toll.name] = toll.fee;
});
const tollFreeVehicles = require("./config/tollFreeVehicles.json");

const TollCalculator = require("./app/toll_calculator");
require("./app/routes")(app, new TollCalculator(tollPeriods, tollFees, tollFreeVehicles));

const port = 3000;

app.listen(port, () => {
	console.log("Server running on port " + port);
});

app.get("/", (req, res) => {
	res.send("Welcome to the Toll Calculator Server");
});