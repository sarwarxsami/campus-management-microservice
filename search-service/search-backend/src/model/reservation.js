class Reservation {
  constructor({ resource_id, user_id, start, duration, currentstate }) {
    this.resource_id = resource_id;
    this.user_id = user_id;
    this.start = start;
    this.duration = duration;
    this.currentState = currentstate !== undefined ? Number(currentstate) : null;
  }
}

module.exports = Reservation;