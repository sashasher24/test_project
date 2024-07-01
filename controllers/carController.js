const Car = require('../models/car');

class carController {
  async addCar(request, response) {
    try {
      const { model, year } = request.body;

      const car = new Car({
        model,
        year
      });

      await car.save();
      return response.status(200).json({ message: 'Car added successfully' });
    } catch (e) {
      response.status(500).json({ message: 'Internal server error' });
    }
  }

  async showCars(request, response) {
    try {
      const cars = await Car.find({});

      return response.status(200).json({ cars });
    } catch (e) {
      response.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new carController();