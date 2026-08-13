const locationRepository = require("../repository/locationRepo");
const Location = require("../model/location");

const locationController = {
  // GET /locations?name=
  async getLocations(req, res) {
    const { name } = req.query;
    const rows = await locationRepository.findAll({ name });
    return res.json({ data: rows.map((l) => new Location(l)) });
  },
};

module.exports = locationController;