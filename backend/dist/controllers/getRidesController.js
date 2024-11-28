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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRidesByCustomer = void 0;
const data_source_1 = require("../database/data-source");
const RideLog_1 = require("../models/RideLog");
const Driver_1 = require("../models/Driver");
const getRidesByCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id } = req.params;
        const { driver_id } = req.query;
        console.log(driver_id);
        // Validações
        if (!customer_id) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "Customer ID cannot be blank",
            });
        }
        if (driver_id) {
            const driverRepository = data_source_1.AppDataSource.getRepository(Driver_1.Driver);
            const driverExists = yield driverRepository.findOneBy({ id: Number(driver_id) });
            if (!driverExists) {
                return res.status(400).json({
                    error_code: "INVALID_DRIVER",
                    error_description: "The driver ID is invalid",
                });
            }
        }
        // Consulta ao banco com join no motorista
        const rideLogRepository = data_source_1.AppDataSource.getRepository(RideLog_1.RideLog);
        const query = rideLogRepository.createQueryBuilder("ride")
            .leftJoinAndSelect("ride.driver", "driver") // Realiza o join e inclui os dados do motorista
            .where("ride.customer_id = :customer_id", { customer_id })
            .orderBy("ride.createdAt", "DESC");
        if (driver_id) {
            query.andWhere("ride.driver_id = :driver_id", { driver_id: Number(driver_id) });
        }
        const rides = yield query.getMany();
        if (rides.length === 0) {
            return res.status(404).json({
                error_code: "NO_RIDES_FOUND",
                error_description: "No rides found for this customer",
            });
        }
        // Formatar a resposta
        const formattedRides = rides.map((ride) => {
            var _a, _b;
            return ({
                id: ride.id,
                date: ride.createdAt,
                origin: ride.origin,
                destination: ride.destination,
                distance: ride.distance,
                duration: ride.duration,
                driver: {
                    id: ((_a = ride.driver) === null || _a === void 0 ? void 0 : _a.id) || null,
                    name: ((_b = ride.driver) === null || _b === void 0 ? void 0 : _b.name) || "Driver not found", // Nome do motorista ou mensagem de erro
                },
                value: ride.price,
            });
        });
        console.log(formattedRides);
        return res.status(200).json({
            customer_id,
            rides: formattedRides,
        });
    }
    catch (error) {
        console.error("Error fetching rides:", error);
        return res.status(500).json({
            error_code: "INTERNAL_ERROR",
            error_description: "An error occurred while processing your request",
        });
    }
});
exports.getRidesByCustomer = getRidesByCustomer;
