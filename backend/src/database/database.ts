import { AppDataSource } from "./data-source";
import { Driver } from "../models/Driver";

export const seedDatabase = async () => {
  const driverRepository = AppDataSource.getRepository(Driver);

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
    const exists = await driverRepository.findOneBy({ name: driver.name });
    if (!exists) {
      await driverRepository.save(driver);
    }
  }
  console.log("Database seeded with drivers!");
};
