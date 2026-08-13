# Search Service API

Base path: `/service/search-service`  
Port: `3001`

---

## Resource Search

### GET `/service/search-service/resources`
Returns all resources.

**Response**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Room A",
      "type": "classroom",
      "available": true,
      "capacity": 30,
      "location_id": 2
    },
    {
      "id": 2,
      "name": "Lab B",
      "type": "laboratory",
      "available": false,
      "capacity": 20,
      "location_id": 3
    }
  ]
}
```

---

### GET `/service/search-service/resources?name=&type=&location_id=`
Filter resources by any combination of `name`, `type`, and `location_id`. All params are optional.

**Query Params**
| Param | Type | Description |
|---|---|---|
| `name` | string | Partial or full resource name |
| `type` | string | Resource type (e.g. `classroom`) |
| `location_id` | integer | Location foreign key |

**Response**
```json
{
  "filters": {
    "name": "Room",
    "type": "classroom",
    "location_id": 2
  },
  "data": [
    {
      "id": 1,
      "name": "Room A",
      "type": "classroom",
      "available": true,
      "capacity": 30,
      "location_id": 2
    }
  ]
}
```

---

### GET `/service/search-service/resources/location/:locationId`
Returns all resources at a specific location.

**Path Params**
| Param | Type | Description |
|---|---|---|
| `locationId` | integer | Location ID |

**Response**
```json
{
  "location": {
    "id": 2,
    "name": "Building B"
  },
  "data": [
    {
      "id": 1,
      "name": "Room A",
      "type": "classroom",
      "available": true,
      "capacity": 30
    },
    {
      "id": 4,
      "name": "Study Hall",
      "type": "hall",
      "available": true,
      "capacity": 100
    }
  ]
}
```

---

### GET `/service/search-service/resources/type/:type`
Returns all resources of a specific type.

**Path Params**
| Param | Type | Description |
|---|---|---|
| `type` | string | Resource type (e.g. `classroom`, `laboratory`) |

**Response**
```json
{
  "type": "classroom",
  "data": [
    {
      "id": 1,
      "name": "Room A",
      "available": true,
      "capacity": 30,
      "location_id": 2
    },
    {
      "id": 5,
      "name": "Room C",
      "available": false,
      "capacity": 25,
      "location_id": 3
    }
  ]
}
```

---

### GET `/service/search-service/resources/descriptors?resource_id=&descriptor_id=`
Returns resource-descriptor mappings. Filter by `resource_id`, `descriptor_id`, or both.

**Query Params**
| Param | Type | Description |
|---|---|---|
| `resource_id` | integer | Filter by resource |
| `descriptor_id` | integer | Filter by descriptor |

**Response**
```json
{
  "data": [
    {
      "resource_id": 1,
      "resource_name": "Room A",
      "descriptor_id": 3,
      "description": "Has projector"
    },
    {
      "resource_id": 1,
      "resource_name": "Room A",
      "descriptor_id": 5,
      "description": "Air conditioned"
    }
  ]
}
```

---

## User Search *(Admin only)*

### GET `/service/search-service/users?name=&email=&username=`
Search all users (students + admins). All params optional.

**Query Params**
| Param | Type | Description |
|---|---|---|
| `name` | string | Partial or full name |
| `email` | string | Partial or full email |
| `username` | string | Partial or full username |

**Response**
```json
{
  "filters": {
    "name": "John",
    "email": null,
    "username": null
  },
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "userType": 0
    },
    {
      "id": 7,
      "name": "John Smith",
      "email": "jsmith@example.com",
      "username": "jsmith",
      "userType": 1
    }
  ]
}
```

---

### GET `/service/search-service/users/students`
Returns all users with `userType = 0` (Student).

**Response**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "userType": 0
    },
    {
      "id": 3,
      "name": "Sara Ali",
      "email": "sara@example.com",
      "username": "saraali",
      "userType": 0
    }
  ]
}
```

---

## Location & Descriptor Search

### GET `/service/search-service/locations?name=`
Search locations by name. Param is optional — omit to return all.

**Query Params**
| Param | Type | Description |
|---|---|---|
| `name` | string | Partial or full location name |

**Response**
```json
{
  "data": [
    {
      "id": 2,
      "name": "Building B"
    },
    {
      "id": 5,
      "name": "Building E"
    }
  ]
}
```

---

### GET `/service/search-service/descriptors?description=`
Search descriptors by description text. Param is optional — omit to return all.

**Query Params**
| Param | Type | Description |
|---|---|---|
| `description` | string | Partial or full descriptor text |

**Response**
```json
{
  "data": [
    {
      "id": 3,
      "description": "Has projector"
    },
    {
      "id": 7,
      "description": "Has smartboard"
    }
  ]
}
```

---

## Resource~Reservation

### GET `/service/search-service/resources/available?start=&duration=&location_id=`
Returns resources with no overlapping reservation in the given time window.  
Checks: any reservation where `start < query_end AND start + duration > query_start` is considered a conflict and excluded.

**Query Params**
| Param | Type | Description |
|---|---|---|
| `start` | ISO 8601 timestamp | Window start (e.g. `2026-08-13T09:00:00`) |
| `duration` | integer | Duration in minutes |
| `location_id` | integer | (Optional) filter by location |

**Response**
```json
{
  "query": {
    "start": "2026-08-13T09:00:00",
    "duration": 60,
    "location_id": 2
  },
  "data": [
    {
      "id": 1,
      "name": "Room A",
      "type": "classroom",
      "capacity": 30,
      "location_id": 2
    },
    {
      "id": 4,
      "name": "Study Hall",
      "type": "hall",
      "capacity": 100,
      "location_id": 2
    }
  ]
}
```

---

### GET `/service/search-service/resources/:resourceId/reservations`
Returns all reservations for a given resource.

**Path Params**
| Param | Tfile:///home/sami-sarwar/Documents/DevOps/Campus%20Mangement%20System/campus-management-microservice/search-service/search-frontend/index.html#ype | Description |
|---|---|---|
| `resourceId` | integer | Resource ID |

**Response**
```json
{
  "resource_id": 1,
  "data": [
    {
      "user_id": 4,
      "start": "2026-08-13T09:00:00",
      "duration": 60,
      "currentState": 1
    },
    {
      "user_id": 9,
      "start": "2026-08-14T14:00:00",
      "duration": 120,
      "currentState": 0
    }
  ]
}
```

**`currentState` values**
| Value | Meaning |
|---|---|
| `0` | PENDING |
| `1` | CONFIRMED |
| `2` | CANCELLED |
| `3` | COMPLETED |

---

## Error Responses

All endpoints return the same error shape:

**400 Bad Request** — missing or invalid params
```json
{
  "error": "Bad Request",
  "message": "start and duration are required"
}
```

**403 Forbidden** — admin-only route accessed without permission
```json
{
  "error": "Forbidden",
  "message": "Admin access required"
}
```

**404 Not Found** — resource/location does not exist
```json
{
  "error": "Not Found",
  "message": "Resource with id 99 not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal Server Error",
  "message": "Unexpected error occurred"
}
```
