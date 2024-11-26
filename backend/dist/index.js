"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const data_source_1 = require("./database/data-source");
const database_1 = require("./database/database");
const estimateRideController_1 = require("./controllers/estimateRideController");
const dotenv_1 = __importDefault(require("dotenv"));
const confirmRideController_1 = require("./controllers/confirmRideController");
const getRidesController_1 = require("./controllers/getRidesController");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5174",
    methods: "GET,POST,PATCH,DELETE",
}));
// Rotas
app.post("/ride/estimate", estimateRideController_1.estimateRide);
app.patch("/ride/confirm", confirmRideController_1.confirmRide);
app.get("/ride/:customer_id", getRidesController_1.getRidesByCustomer);
data_source_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Database connected successfully!");
    yield (0, database_1.seedDatabase)();
    app.listen(8080, () => {
        console.log("Server running on port 8080");
    });
}))
    .catch((error) => {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
});
