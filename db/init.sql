DROP TABLE IF EXISTS "Resource-Descriptor" CASCADE;
DROP TABLE IF EXISTS "Reservation" CASCADE;
DROP TABLE IF EXISTS "Resource" CASCADE;
DROP TABLE IF EXISTS "Descriptor" CASCADE;
DROP TABLE IF EXISTS "Location" CASCADE;
DROP TABLE IF EXISTS "Student" CASCADE;
DROP TABLE IF EXISTS "Admin" CASCADE;
DROP TABLE IF EXISTS "BaseUser" CASCADE;

DROP TYPE IF EXISTS "user_type" CASCADE;
DROP TYPE IF EXISTS "reservation_state" CASCADE;

CREATE TYPE "user_type" AS ENUM ('student', 'admin');
CREATE TYPE "reservation_state" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

CREATE TABLE IF NOT EXISTS "Location" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "Descriptor" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "BaseUser" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "email" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "userType" INTEGER DEFAULT 0,  -- ← Added this column
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id"),
    CONSTRAINT "unique_email" UNIQUE("email"),
    CONSTRAINT "unique_username" UNIQUE("username")
);

CREATE TABLE IF NOT EXISTS "Resource" (
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

CREATE TABLE IF NOT EXISTS "Resource-Descriptor" (
    "resource_id" INTEGER NOT NULL,
    "descriptor_id" INTEGER NOT NULL,
    PRIMARY KEY("resource_id", "descriptor_id")
);

CREATE TABLE IF NOT EXISTS "Reservation" (
    "id" SERIAL NOT NULL,  -- Added id for easier reference
    "resource_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "start" TIMESTAMP NOT NULL,
    "duration" INTEGER NOT NULL,
    "currentState" INTEGER DEFAULT 0,  -- 0:PENDING, 1:CONFIRMED, 2:CANCELLED, 3:COMPLETED
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id")  -- Use id as primary key instead of composite
);


ALTER TABLE "Resource" 
ADD CONSTRAINT "fk_resource_location" 
FOREIGN KEY("location_id") REFERENCES "Location"("id");

ALTER TABLE "Resource-Descriptor" 
ADD CONSTRAINT "fk_rd_resource" 
FOREIGN KEY("resource_id") REFERENCES "Resource"("id") ON DELETE CASCADE;

ALTER TABLE "Resource-Descriptor" 
ADD CONSTRAINT "fk_rd_descriptor" 
FOREIGN KEY("descriptor_id") REFERENCES "Descriptor"("id") ON DELETE CASCADE;

ALTER TABLE "Reservation" 
ADD CONSTRAINT "fk_reservation_resource" 
FOREIGN KEY("resource_id") REFERENCES "Resource"("id") ON DELETE CASCADE;

ALTER TABLE "Reservation" 
ADD CONSTRAINT "fk_reservation_user" 
FOREIGN KEY("user_id") REFERENCES "BaseUser"("id") ON DELETE CASCADE;


-- Locations
INSERT INTO "Location" ("name") VALUES 
    ('Building A'),
    ('Building B'),
    ('Building C');

-- Descriptors
INSERT INTO "Descriptor" ("description") VALUES 
    ('projector'),
    ('whiteboard'),
    ('computer'),
    ('HDMI cable'),
    ('conference phone');

-- Users
INSERT INTO "BaseUser" ("name", "email", "password", "username", "userType") VALUES 
    ('John Doe', 'john@example.com', 'password123', 'johndoe', 0),
    ('Jane Smith', 'jane@example.com', 'password123', 'janesmith', 1),
    ('Bob Johnson', 'bob@example.com', 'password123', 'bjohnson', 0),
    ('Alice Williams', 'alice@example.com', 'password123', 'alicew', 0),
    ('Admin User', 'admin@example.com', 'password123', 'admin', 1);

-- Resources
INSERT INTO "Resource" ("type", "name", "location_id", "available", "capacity") VALUES 
    ('classroom', 'Room A', 1, true, 30),
    ('classroom', 'Room B', 1, false, 25),
    ('lab', 'Computer Lab 1', 2, true, 20),
    ('lab', 'Computer Lab 2', 2, true, 15),
    ('meeting', 'Conference Room', 3, true, 10),
    ('classroom', 'Room C', 1, true, 35);

-- Resource-Descriptor (junction)
INSERT INTO "Resource-Descriptor" ("resource_id", "descriptor_id") VALUES 
    (1, 1),  -- Room A has projector
    (1, 2),  -- Room A has whiteboard
    (2, 2),  -- Room B has whiteboard
    (3, 1),  -- Computer Lab 1 has projector
    (3, 3),  -- Computer Lab 1 has computers
    (4, 3),  -- Computer Lab 2 has computers
    (5, 1),  -- Conference Room has projector
    (5, 4),  -- Conference Room has HDMI cable
    (5, 5);  -- Conference Room has conference phone

-- Reservations
INSERT INTO "Reservation" ("resource_id", "user_id", "start", "duration", "currentState") VALUES 
    (1, 1, '2026-08-13 09:00:00', 60, 1),  -- CONFIRMED
    (1, 2, '2026-08-13 11:00:00', 60, 0),  -- PENDING
    (3, 1, '2026-08-14 10:00:00', 120, 1), -- CONFIRMED
    (5, 3, '2026-08-15 14:00:00', 90, 0);  -- PENDING