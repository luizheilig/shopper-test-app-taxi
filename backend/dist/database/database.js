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
exports.seedDatabase = void 0;
const data_source_1 = require("./data-source");
const Driver_1 = require("../models/Driver");
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const driverRepository = data_source_1.AppDataSource.getRepository(Driver_1.Driver);
    const drivers = [
        {
            name: "Homer Simpson",
            description: "Motorista simpático, mas errou o caminho 3 vezes.",
            vehicle: "Plymouth Valiant 1973 rosa e enferrujado",
            rating: 2,
            ratePerKm: 2.5,
            minKm: 1,
        },
        {
            name: "Dominic Toretto",
            description: "Que viagem incrível! O carro é um show à parte.",
            vehicle: "Dodge Charger R/T 1970 modificado",
            rating: 4,
            ratePerKm: 5,
            minKm: 5,
        },
        {
            name: "James Bond",
            description: "Serviço impecável. Uma experiência magnífica.",
            vehicle: "Aston Martin DB5 clássico",
            rating: 5,
            ratePerKm: 10,
            minKm: 10,
        },
    ];
    for (const driver of drivers) {
        const exists = yield driverRepository.findOneBy({ name: driver.name });
        if (!exists) {
            yield driverRepository.save(driver);
        }
    }
    console.log("Database seeded with drivers!");
});
exports.seedDatabase = seedDatabase;
