import "reflect-metadata";
import { DataSource } from "typeorm";
import { Driver } from "../models/Driver";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Driver],
  migrations: [],
  subscribers: [],
});
