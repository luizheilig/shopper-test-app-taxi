import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { RideLog } from "../models/RideLog";
import { Driver } from "../models/Driver";

export const confirmRide = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
      const driverRepository = AppDataSource.getRepository("Driver"); // Referencia a tabela/entidade existente
      const foundDriver = await driverRepository.findOne({ where: { id: driver.id } });
  
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
      const rideLogRepo = AppDataSource.getRepository(RideLog);
      const rideLog = rideLogRepo.create({
        customer_id,
        origin,
        destination,
        price: value,
        distance,
        duration,
        driver_id: foundDriver.id, // Referencia o ID do motorista existente
      });
      await rideLogRepo.save(rideLog);
  
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Erro ao confirmar a corrida:", error);
      return res.status(500).json({
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: "Ocorreu um erro ao processar a solicitação.",
      });
    }
  };
  