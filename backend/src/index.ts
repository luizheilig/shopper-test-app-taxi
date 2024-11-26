import express from "express";
import "dotenv/config";
import { AppDataSource } from "./database/data-source";
import { seedDatabase } from "./database/database";
import { estimateRide } from "./controllers/estimateRideController";
import dotenv from "dotenv";
import { confirmRide } from "./controllers/confirmRideController";
import { getRidesByCustomer } from "./controllers/getRidesController";

dotenv.config();

const app = express();
app.use(express.json());

// Rotas
app.post("/ride/estimate", estimateRide);
app.patch("/ride/confirm", confirmRide);
app.get("/ride/:customer_id", getRidesByCustomer);

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected successfully!");
    await seedDatabase();
    app.listen(8080, () => {
      console.log("Server running on port 8080");
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
  });
