const resourceRepository = require("../repository/resourceRepo");
const Resource = require("../model/resource");
const Reservation = require("../model/reservation");

const resourceController = {
  // GET /resources
  // GET /resources?name=&type=&location_id=
  async getResources(req, res) {
    const { name, type, location_id } = req.query;
    const filters = { name, type, location_id };

    const rows = await resourceRepository.findAll(filters);
    const data = rows.map((r) => new Resource(r));

    const hasFilters = name || type || location_id;
    if (hasFilters) {
      return res.json({
        filters: {
          name: name || null,
          type: type || null,
          location_id: location_id ? Number(location_id) : null,
        },
        data,
      });
    }

    return res.json({ data });
  },

  // GET /resources/location/:locationId
  async getResourcesByLocation(req, res) {
    const locationId = Number(req.params.locationId);
    if (isNaN(locationId)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "locationId must be a number",
      });
    }

    const { location, resources } = await resourceRepository.findByLocation(locationId);

    if (!location) {
      return res.status(404).json({
        error: "Not Found",
        message: `Location with id ${locationId} not found`,
      });
    }

    return res.json({
      location,
      data: resources.map((r) => new Resource(r)),
    });
  },

  // GET /resources/type/:type
  async getResourcesByType(req, res) {
    const { type } = req.params;
    const rows = await resourceRepository.findByType(type);

    return res.json({
      type,
      data: rows.map((r) => new Resource(r)),
    });
  },

  // GET /resources/descriptors?resource_id=&descriptor_id=
  async getResourceDescriptors(req, res) {
    const { resource_id, descriptor_id } = req.query;
    const rows = await resourceRepository.findDescriptors({ resource_id, descriptor_id });

    return res.json({ data: rows });
  },

  // GET /resources/available?start=&duration=&location_id=
  async getAvailableResources(req, res) {
    const { start, duration, location_id } = req.query;

    if (!start || !duration) {
      return res.status(400).json({
        error: "Bad Request",
        message: "start and duration are required",
      });
    }

    const parsedDuration = Number(duration);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "duration must be a positive number (minutes)",
      });
    }

    const rows = await resourceRepository.findAvailable({
      start,
      duration: parsedDuration,
      location_id,
    });

    return res.json({
      query: {
        start,
        duration: parsedDuration,
        location_id: location_id ? Number(location_id) : null,
      },
      data: rows.map((r) => new Resource(r)),
    });
  },

  // GET /resources/:resourceId/reservations
  async getResourceReservations(req, res) {
    const resourceId = Number(req.params.resourceId);
    if (isNaN(resourceId)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "resourceId must be a number",
      });
    }

    const { exists, reservations } = await resourceRepository.findReservationsByResource(resourceId);

    if (!exists) {
      return res.status(404).json({
        error: "Not Found",
        message: `Resource with id ${resourceId} not found`,
      });
    }

    return res.json({
      resource_id: resourceId,
      data: reservations.map((r) => new Reservation(r)),
    });
  },
};

module.exports = resourceController;