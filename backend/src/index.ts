import express from "express";
import "dotenv/config";
import { AppDataSource } from "./database/data-source";
import { seedDatabase } from "./database/database";
import { estimateRide } from "./controllers/rideController";

const app = express();
app.use(express.json());

// Rotas
app.post("/ride/estimate", estimateRide);

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
