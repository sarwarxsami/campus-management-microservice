CREATE TYPE "student" AS ENUM (
	'0'
);

CREATE TYPE "admin" AS ENUM (
	'1'
);

CREATE TYPE "PENDING" AS ENUM (
	'0'
);

CREATE TYPE "CONFIRMED" AS ENUM (
	'1'
);

CREATE TYPE "CANCELLED" AS ENUM (
	'2'
);

CREATE TYPE "COMPLETED" AS ENUM (
	'3'
);

CREATE TABLE IF NOT EXISTS "Descriptor" (
	"id" SERIAL NOT NULL,
	"description" TEXT NOT NULL,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "Location" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR(100) NOT NULL,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "BaseUser" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR(100),
	"email" VARCHAR(255),
	"password" VARCHAR(255) NOT NULL,
	"username" VARCHAR(255) NOT NULL,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "Resource" (
	"id" SERIAL NOT NULL,
	"type" VARCHAR(100),
	"name" VARCHAR(100) NOT NULL,
	"location_id" INTEGER NOT NULL,
	"available" BOOLEAN NOT NULL,
	"capacity" INTEGER,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "Resource-Descriptor" (
	"resource_id" INTEGER,
	"descriptor_id" INTEGER,
	PRIMARY KEY("resource_id", "descriptor_id")
);




CREATE TABLE IF NOT EXISTS "Reservation" (
	"resource_id" INTEGER,
	"user_id" INTEGER,
	"start" TIMESTAMP,
	"duration" INTEGER,
	"currentState" INTEGER,
	PRIMARY KEY("resource_id", "user_id", "start")
);




CREATE TABLE IF NOT EXISTS "Student" (
	"userType" STUDENT NOT NULL
) INHERITS ("BaseUser");




CREATE TABLE IF NOT EXISTS "Admin" (
	"userType" ADMIN NOT NULL
) INHERITS ("BaseUser");



ALTER TABLE "Resource"
ADD FOREIGN KEY("location_id") REFERENCES "Location"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Resource-Descriptor"
ADD FOREIGN KEY("resource_id") REFERENCES "Resource"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Resource-Descriptor"
ADD FOREIGN KEY("descriptor_id") REFERENCES "Descriptor"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Reservation"
ADD FOREIGN KEY("resource_id") REFERENCES "Resource"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Reservation"
ADD FOREIGN KEY("user_id") REFERENCES "BaseUser"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;