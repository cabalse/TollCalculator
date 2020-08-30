const tollCalculationRoutes = require("./toll_calculation_routes");

module.exports = function (app, tollCalculator) {
	tollCalculationRoutes(app, tollCalculator);
};