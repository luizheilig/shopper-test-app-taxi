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
exports.estimateRide = void 0;
const data_source_1 = require("../database/data-source");
const Driver_1 = require("../models/Driver");
const googleMapsService_1 = require("../services/googleMapsService");
const estimateRide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer_id, origin, destination } = req.body;
    // Validações iniciais
    if (!customer_id || !origin || !destination) {
        return res.status(400).json({
            error_code: "INVALID_DATA",
            error_description: "All fields (customer_id, origin, destination) are required.",
        });
    }
    if (origin === destination) {
        return res.status(400).json({
            error_code: "INVALID_DATA",
            error_description: "Origin and destination cannot be the same.",
        });
    }
    try {
        // Obtém o repositório de motoristas
        const driverRepository = data_source_1.AppDataSource.getRepository(Driver_1.Driver);
        const drivers = yield driverRepository.find();
        // Chamada para a API do Google Maps
        const routeDetails = yield (0, googleMapsService_1.fetchRouteDetails)(origin, destination);
        // Calcular motoristas disponíveis
        const availableDrivers = drivers
            .filter(driver => routeDetails.distance >= driver.minKm)
            .map(driver => ({
            id: driver.id,
            name: driver.name,
            description: driver.description,
            vehicle: driver.vehicle,
            review: { rating: driver.rating, comment: "N/A" },
            value: routeDetails.distance * driver.ratePerKm,
        }))
            .sort((a, b) => a.value - b.value);
        res.status(200).json({
            costumerId: customer_id,
            origin: routeDetails.origin,
            destination: routeDetails.destination,
            distance: routeDetails.distance,
            duration: routeDetails.duration,
            options: availableDrivers,
            routeResponse: routeDetails.routeResponse,
        });
    }
    catch (error) {
        res.status(500).json({
            error_code: "INTERNAL_ERROR",
            error_description: "An error occurred while processing your request.",
        });
    }
});
exports.estimateRide = estimateRide;
