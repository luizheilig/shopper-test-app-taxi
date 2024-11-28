import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { RideLog } from "../models/RideLog";
import { Driver } from "../models/Driver";

export const getRidesByCustomer = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { customer_id } = req.params;
    const { driver_id } = req.query;

    console.log(driver_id)

    // Validações
    if (!customer_id) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Customer ID cannot be blank",
      });
    }

    if (driver_id) {
      const driverRepository = AppDataSource.getRepository(Driver);
      const driverExists = await driverRepository.findOneBy({ id: Number(driver_id) });

      if (!driverExists) {
        return res.status(400).json({
          error_code: "INVALID_DRIVER",
          error_description: "The driver ID is invalid",
        });
      }
    }

    // Consulta ao banco com join no motorista
    const rideLogRepository = AppDataSource.getRepository(RideLog);

    const query = rideLogRepository.createQueryBuilder("ride")
      .leftJoinAndSelect("ride.driver", "driver") // Realiza o join e inclui os dados do motorista
      .where("ride.customer_id = :customer_id", { customer_id })
      .orderBy("ride.createdAt", "DESC");

    if (driver_id) {
      query.andWhere("ride.driver_id = :driver_id", { driver_id: Number(driver_id) });
    }

    const rides = await query.getMany();

    if (rides.length === 0) {
      return res.status(404).json({
        error_code: "NO_RIDES_FOUND",
        error_description: "No rides found for this customer",
      });
    }

    // Formatar a resposta
    const formattedRides = rides.map((ride) => ({
      id: ride.id,
      date: ride.createdAt,
      origin: ride.origin,
      destination: ride.destination,
      distance: ride.distance,
      duration: ride.duration,
      driver: {
        id: ride.driver?.id || null, // Garante que o código não quebre se o motorista for null
        name: ride.driver?.name || "Driver not found", // Nome do motorista ou mensagem de erro
      },
      value: ride.price,
    }));

    console.log(formattedRides);

    return res.status(200).json({
      customer_id,
      rides: formattedRides,
    });
  } catch (error) {
    console.error("Error fetching rides:", error);
    return res.status(500).json({
      error_code: "INTERNAL_ERROR",
      error_description: "An error occurred while processing your request",
    });
  }
};
