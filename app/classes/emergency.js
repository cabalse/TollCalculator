var Vehicle = require("./vehicle");

module.exports = class Emergency extends Vehicle {
  constructor() {
    super("emergency");
  }
};
