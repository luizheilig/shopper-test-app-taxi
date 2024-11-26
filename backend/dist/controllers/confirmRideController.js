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
exports.confirmRide = void 0;
const data_source_1 = require("../database/data-source");
const RideLog_1 = require("../models/RideLog");
const confirmRide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id, origin, destination, distance, duration, driver, value } = req.body;
        // Validações obrigatórias
        if (!customer_id || !origin || !destination || !driver || !value) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "Campos obrigatórios estão faltando.",
            });
        }
        if (origin === destination) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "Os endereços de origem e destino não podem ser iguais.",
            });
        }
        // Verificar se o motorista existe no banco de motoristas preexistente
        const driverRepository = data_source_1.AppDataSource.getRepository("Driver"); // Referencia a tabela/entidade existente
        const foundDriver = yield driverRepository.findOne({ where: { id: driver.id } });
        if (!foundDriver) {
            return res.status(404).json({
                error_code: "DRIVER_NOT_FOUND",
                error_description: "O motorista informado não foi encontrado.",
            });
        }
        // Validação da quilometragem com base no banco de dados de motoristas existente
        if (distance <= 0 || distance > foundDriver.max_distance) {
            return res.status(406).json({
                error_code: "INVALID_DISTANCE",
                error_description: "A quilometragem informada é inválida.",
            });
        }
        // Salvar os dados no banco de dados
        const rideLogRepo = data_source_1.AppDataSource.getRepository(RideLog_1.RideLog);
        const rideLog = rideLogRepo.create({
            customer_id,
            origin,
            destination,
            price: value,
            distance,
            duration,
            driver_id: foundDriver.id, // Referencia o ID do motorista existente
        });
        yield rideLogRepo.save(rideLog);
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.error("Erro ao confirmar a corrida:", error);
        return res.status(500).json({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: "Ocorreu um erro ao processar a solicitação.",
        });
    }
});
exports.confirmRide = confirmRide;
