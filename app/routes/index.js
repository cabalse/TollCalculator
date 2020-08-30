const tollCalculationRoutes = require("./toll_calculation_routes");

module.exports = function(app, db) {
  tollCalculationRoutes(app, db);
};
