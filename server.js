var express = require("express");
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const tollPeriods = require("./data/tollperiods.json");
const tollFees = require("./data/tollFees.json");

const TollCalculator = require("./app/toll_calculator");
require("./app/routes")(app, new TollCalculator(tollPeriods, tollFees));

const port = 3000;

app.listen(port, () => {
  console.log("Server running on port " + port);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Toll Calculator Server");
});
