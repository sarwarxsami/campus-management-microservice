DROP TABLE IF EXISTS "resource_rescriptor" CASCADE;
DROP TABLE IF EXISTS "reservation" CASCADE;
DROP TABLE IF EXISTS "resource" CASCADE;
DROP TABLE IF EXISTS "descriptor" CASCADE;
DROP TABLE IF EXISTS "location" CASCADE;
DROP TABLE IF EXISTS "student" CASCADE;
DROP TABLE IF EXISTS "admin" CASCADE;
DROP TABLE IF EXISTS "base_user" CASCADE;

DROP TYPE IF EXISTS "user_type" CASCADE;
DROP TYPE IF EXISTS "reservation_state" CASCADE;

-- Required for EXCLUDE with integer equality (resource_id WITH =)
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TYPE "user_type" AS ENUM ('student', 'admin');
CREATE TYPE "reservation_state" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

CREATE TABLE IF NOT EXISTS "location" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "descriptor" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "base_user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "email" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "user_name" VARCHAR(255) NOT NULL,
    "user_type" INTEGER NOT NULL,
    PRIMARY KEY("id"),
    CONSTRAINT "unique_email" UNIQUE("email"),
    CONSTRAINT "unique_user_name" UNIQUE("user_name")
);

CREATE TABLE IF NOT EXISTS "resource" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(100),
    "name" VARCHAR(100) NOT NULL,
    "location_id" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "capacity" INTEGER,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "resource_descriptor" (
    "resource_id" INTEGER NOT NULL,
    "descriptor_id" INTEGER NOT NULL,
    PRIMARY KEY("resource_id", "descriptor_id")
);

CREATE TABLE IF NOT EXISTS "reservation" (
    "id" SERIAL NOT NULL,
    "resource_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "start" TIMESTAMP NOT NULL,
    "duration" INTEGER NOT NULL,
    "currentState" INTEGER DEFAULT 0,  -- 0:PENDING, 1:CONFIRMED, 2:CANCELLED, 3:COMPLETED
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id")
);


ALTER TABLE "resource" 
ADD CONSTRAINT "fk_resource_location" 
FOREIGN KEY("location_id") REFERENCES "location"("id");

ALTER TABLE "resource_descriptor" 
ADD CONSTRAINT "fk_rd_resource" 
FOREIGN KEY("resource_id") REFERENCES "resource"("id") ON DELETE CASCADE;

ALTER TABLE "resource_descriptor" 
ADD CONSTRAINT "fk_rd_descriptor" 
FOREIGN KEY("descriptor_id") REFERENCES "descriptor"("id") ON DELETE CASCADE;

ALTER TABLE "reservation" 
ADD CONSTRAINT "fk_reservation_resource" 
FOREIGN KEY("resource_id") REFERENCES "resource"("id") ON DELETE CASCADE;

ALTER TABLE "reservation" 
ADD CONSTRAINT "fk_reservation_user" 
FOREIGN KEY("user_id") REFERENCES "base_user"("id") ON DELETE CASCADE;

-- Prevents overlapping active reservations on the same resource.
-- Uses duration * INTERVAL '1 minute' (IMMUTABLE) instead of text-concat cast.
ALTER TABLE "reservation"
ADD CONSTRAINT "no_overlapping_active_reservation"
EXCLUDE USING gist (
    "resource_id" WITH =,
    tsrange("start", "start" + ("duration" * INTERVAL '1 minute'), '[)') WITH &&
)
WHERE ("currentState" IN (0, 1));


-- locations
INSERT INTO "location" ("name") VALUES 
    ('Building A'),
    ('Building B'),
    ('Building C');

-- descriptors
INSERT INTO "descriptor" ("description") VALUES 
    ('projector'),
    ('whiteboard'),
    ('computer'),
    ('HDMI cable'),
    ('conference phone');

-- Users
INSERT INTO "base_user" ("name", "email", "password", "user_name", "user_type") VALUES 
    ('John Doe', 'john@example.com', 'password123', 'johndoe', 0),
    ('Jane Smith', 'jane@example.com', 'password123', 'janesmith', 1),
    ('Bob Johnson', 'bob@example.com', 'password123', 'bjohnson', 0),
    ('Alice Williams', 'alice@example.com', 'password123', 'alicew', 0),
    ('Admin User', 'admin@example.com', 'password123', 'admin', 1);

-- resources
INSERT INTO "resource" ("type", "name", "location_id", "available", "capacity") VALUES 
    ('classroom', 'Room A', 1, true, 30),
    ('classroom', 'Room B', 1, false, 25),
    ('lab', 'Computer Lab 1', 2, true, 20),
    ('lab', 'Computer Lab 2', 2, true, 15),
    ('meeting', 'Conference Room', 3, true, 10),
    ('classroom', 'Room C', 1, true, 35);

-- resource_descriptor (junction)
INSERT INTO "resource_descriptor" ("resource_id", "descriptor_id") VALUES 
    (1, 1),  -- Room A has projector
    (1, 2),  -- Room A has whiteboard
    (2, 2),  -- Room B has whiteboard
    (3, 1),  -- Computer Lab 1 has projector
    (3, 3),  -- Computer Lab 1 has computers
    (4, 3),  -- Computer Lab 2 has computers
    (5, 1),  -- Conference Room has projector
    (5, 4),  -- Conference Room has HDMI cable
    (5, 5);  -- Conference Room has conference phone

-- reservations
INSERT INTO "reservation" ("resource_id", "user_id", "start", "duration", "currentState") VALUES 
    (1, 1, '2026-08-13 09:00:00', 60, 1),  -- CONFIRMED
    (1, 2, '2026-08-13 11:00:00', 60, 0),  -- PENDING
    (3, 1, '2026-08-14 10:00:00', 120, 1), -- CONFIRMED
    (5, 3, '2026-08-15 14:00:00', 90, 0);  -- PENDING