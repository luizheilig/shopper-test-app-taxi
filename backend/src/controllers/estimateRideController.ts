import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Driver } from "../models/Driver";
import { fetchRouteDetails } from "../services/googleMapsService";
import { RideLog } from "../models/RideLog";
import { constants } from "buffer";

export const estimateRide = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
    const driverRepository = AppDataSource.getRepository(Driver);
    const drivers = await driverRepository.find();

    const routeDetails = await fetchRouteDetails(origin, destination);

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

  } catch (error) {
    res.status(500).json({
      error_code: "INTERNAL_ERROR",
      error_description: "An error occurred while processing your request.",
    });
  }
};
