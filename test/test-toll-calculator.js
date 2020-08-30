const expect = require("chai").expect;

const tollPeriods = require("./../data/tollperiods.json");
const tollFees = require("./../data/tollFees.json");

Toll_Calculator = require("../app/toll_calculator");
const toll_calculator = new Toll_Calculator(tollPeriods, tollFees);

const Car = require("../app/classes/car");
const Motorbike = require("../app/classes/motorbike");
const Tractor = require("../app/classes/tractor");
const Emergency = require("../app/classes/emergency");
const Diplomat = require("../app/classes/diplomat");
const Foreign = require("../app/classes/foreign");
const Military = require("../app/classes/military");

describe("Testing toll_calculator.js", () => {
  describe("Toll - Car one pass on weekday [2020-01-02]", () => {
    it("At 06:00 should equal 8", () => {
      const result = toll_calculator.calculate(new Car(), ["2020-01-02 06:00"]);
      expect(result).to.equal(8);
    });
    it("At 06:59 should equal 13", () => {
      const result = toll_calculator.calculate(new Car(), ["2020-01-02 06:59"]);
      expect(result).to.equal(13);
    });
    it("At 07:30 should equal 18", () => {
      const result = toll_calculator.calculate(new Car(), ["2020-01-02 07:30"]);
      expect(result).to.equal(18);
    });
    it("At 00:00 should equal 0", () => {
      const result = toll_calculator.calculate(new Car(), ["2020-01-02 00:00"]);
      expect(result).to.equal(0);
    });
  });
  describe("Toll - Car one pass on weekends", () => {
    it("2020-01-04 at 06:00 should equal 0", () => {
      const result = toll_calculator.calculate(new Car(), ["2020-01-04 06:00"]);
      expect(result).to.equal(0);
    });
    it("2020-01-05 at 17:34 should equal 0", () => {
      const result = toll_calculator.calculate(new Car(), ["2020-01-05 17:34"]);
      expect(result).to.equal(0);
    });
  });
  describe("Toll - No toll on Swedish holidays", () => {
    it("2020-01-01 should equal 0", () => {
      const result = toll_calculator.calculate(new Car(), ["2020-01-01 00:00"]);
      expect(result).to.equal(0);
    });
    it("1976-12-24 should equal 0", () => {
      const result = toll_calculator.calculate(new Car(), ["1976-12-24 00:00"]);
      expect(result).to.equal(0);
    });
    it("2025-05-01 should equal 0", () => {
      const result = toll_calculator.calculate(new Car(), ["2025-05-01 00:00"]);
      expect(result).to.equal(0);
    });
  });
  describe("Toll - Toll free vehicle", () => {
    it("Motorbike should equal 0", () => {
      const result = toll_calculator.calculate(new Motorbike(), [
        "2020-01-02 06:00",
      ]);
      expect(result).to.equal(0);
    });
    it("Tractor should equal 0", () => {
      const result = toll_calculator.calculate(new Tractor(), [
        "2020-01-02 06:59",
      ]);
      expect(result).to.equal(0);
    });
    it("Emergency should equal 0", () => {
      const result = toll_calculator.calculate(new Emergency(), [
        "2020-01-02 07:30",
      ]);
      expect(result).to.equal(0);
    });
    it("Diplomat should equal 0", () => {
      const result = toll_calculator.calculate(new Diplomat(), [
        "2020-01-02 12:00",
      ]);
      expect(result).to.equal(0);
    });
    it("Foreign should equal 0", () => {
      const result = toll_calculator.calculate(new Foreign(), [
        "2020-01-02 12:00",
      ]);
      expect(result).to.equal(0);
    });
    it("Military should equal 0", () => {
      const result = toll_calculator.calculate(new Military(), [
        "2020-01-02 12:00",
      ]);
      expect(result).to.equal(0);
    });
  });
  describe("Toll - Car several passes", () => {
    it("Three passes, one per hour should equal 39", () => {
      const result = toll_calculator.calculate(new Car(), [
        "2020-01-02 06:00",
        "2020-01-02 07:00",
        "2020-01-02 08:00",
      ]);
      expect(result).to.equal(39);
    });
    it("Three passes, different hours, all outside toll fee hours, should be 0", () => {
      const result = toll_calculator.calculate(new Car(), [
        "2020-01-02 00:00",
        "2020-01-02 05:00",
        "2020-01-02 18:30",
      ]);
      expect(result).to.equal(0);
    });
    it("Two passes, with the same hour and fee, should be 18", () => {
      const result = toll_calculator.calculate(new Car(), [
        "2020-01-02 07:00",
        "2020-01-02 07:59",
      ]);
      expect(result).to.equal(18);
    });
    it("Three passes, with the same hour and fee, should be 18", () => {
      const result = toll_calculator.calculate(new Car(), [
        "2020-01-02 07:00",
        "2020-01-02 07:31",
        "2020-01-02 07:59",
      ]);
      expect(result).to.equal(18);
    });
    it("Two passes, with the same hour and different fees, should be 13", () => {
      const result = toll_calculator.calculate(new Car(), [
        "2020-01-02 06:00",
        "2020-01-02 06:59",
      ]);
      expect(result).to.equal(13);
    });
    it("Three passes, with the same hour and different fees, should be 13", () => {
      const result = toll_calculator.calculate(new Car(), [
        "2020-01-02 06:00",
        "2020-01-02 06:31",
        "2020-01-02 06:59",
      ]);
      expect(result).to.equal(13);
    });
    it("Two passes, within one hour but at different hours and fees, morning, should be 18", () => {
      const result = toll_calculator.calculate(new Car(), [
        "2020-01-02 06:31",
        "2020-01-02 07:30",
      ]);
      expect(result).to.equal(18);
    });
    it("Three passes, within one hour but at different hours and fees, morning, should be 18", () => {
      const result = toll_calculator.calculate(new Car(), [
        "2020-01-02 06:31",
        "2020-01-02 07:00",
        "2020-01-02 07:30",
      ]);
      expect(result).to.equal(18);
    });
    it("Two passes, within one hour but at different hours and fees, afternoon, should be 13", () => {
      const result = toll_calculator.calculate(new Car(), [
        "2020-01-02 17:31",
        "2020-01-02 18:30",
      ]);
      expect(result).to.equal(13);
    });
    it("Three passes, within one hour but at different hours and fees, afternoon, should be 13", () => {
      const result = toll_calculator.calculate(new Car(), [
        "2020-01-02 17:31",
        "2020-01-02 18:00",
        "2020-01-02 18:30",
      ]);
      expect(result).to.equal(13);
    });
    it("Several passes, between 9 and 14, early hour should be 48", () => {
      const result = toll_calculator.calculate(new Car(), [
        "2020-01-02 09:00",
        "2020-01-02 10:00",
        "2020-01-02 11:00",
        "2020-01-02 12:00",
        "2020-01-02 13:00",
        "2020-01-02 14:00",
      ]);
      expect(result).to.equal(48);
    });
    it("Several passes, different hours and fees, around noon, should be 55", () => {
      const result = toll_calculator.calculate(new Car(), [
        "2020-01-02 08:31",
        "2020-01-02 10:13",
        "2020-01-02 11:57",
        "2020-01-02 12:14",
        "2020-01-02 15:23",
        "2020-01-02 16:29",
      ]);
      expect(result).to.equal(55);
    });
  });
  describe("Toll - Max toll", () => {
    it("Car pass several times, reach over max toll, should be 60", () => {
      const result = toll_calculator.calculate(new Car(), [
        "2020-01-02 06:31",
        "2020-01-02 07:00",
        "2020-01-02 07:30",
        "2020-01-02 09:00",
        "2020-01-02 09:54",
        "2020-01-02 10:00",
        "2020-01-02 11:00",
        "2020-01-02 12:00",
        "2020-01-02 17:31",
        "2020-01-02 18:00",
        "2020-01-02 18:30",
      ]);
      expect(result).to.equal(60);
    });
  });
  describe("Toll - Extreme situations", () => {
    it("Car pass twice within the same minute, should be 8", () => {
      const result = toll_calculator.calculate(new Car(), [
        "2020-01-02 12:00",
        "2020-01-02 12:00",
      ]);
      expect(result).to.equal(8);
    });
  });
});
