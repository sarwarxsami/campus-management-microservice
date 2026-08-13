class Resource {
  constructor({ id, name, type, available, capacity, location_id }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.available = available;
    this.capacity = capacity;
    this.location_id = location_id;
  }
}

module.exports = Resource;