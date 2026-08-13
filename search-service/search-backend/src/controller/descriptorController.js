const descriptorRepository = require("../repository/descriptorRepo");
const Descriptor = require("../model/descriptor");

const descriptorController = {
  // GET /descriptors?description=
  async getDescriptors(req, res) {
    const { description } = req.query;
    const rows = await descriptorRepository.findAll({ description });
    return res.json({ data: rows.map((d) => new Descriptor(d)) });
  },
};

module.exports = descriptorController;