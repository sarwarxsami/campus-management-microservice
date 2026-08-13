require('dotenv').config({ 
  path: "/home/sami-sarwar/Documents/DevOps/Campus Mangement System/campus-management-microservice/.env"
});
const express = require("express");
const cors = require('cors');


const resourceRoutes    = require("./routes/resourceRoute");
const userRoutes        = require("./routes/userRoute");
const locationRoutes    = require("./routes/locationRoute");
const descriptorRoutes  = require("./routes/descriptorRoute");

const app = express();
const PORT = process.env.PORT || 3001;
const BASE = "/service/search-service";

app.use(express.json());
app.use(cors());

// Routes
app.use(`${BASE}/resources`,    resourceRoutes);
app.use(`${BASE}/users`,        userRoutes);
app.use(`${BASE}/locations`,    locationRoutes);
app.use(`${BASE}/descriptors`,  descriptorRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", message: `${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error", message: "Unexpected error occurred" });
});

app.listen(PORT, () => {
  console.log(`search-service running on port ${PORT}`);
});