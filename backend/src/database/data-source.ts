import "reflect-metadata";
import { DataSource } from "typeorm";
import { Driver } from "../models/Driver";
import { RideLog } from "../models/RideLog";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Driver, RideLog],
  migrations: [],
  subscribers: [],
});
