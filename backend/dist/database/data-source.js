"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Driver_1 = require("../models/Driver");
const RideLog_1 = require("../models/RideLog");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "./database.sqlite",
    synchronize: true,
    logging: false,
    entities: [Driver_1.Driver, RideLog_1.RideLog],
    migrations: [],
    subscribers: [],
});
