import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RideLog } from "./RideLog";

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  vehicle: string;

  @Column()
  rating: number;

  @Column()
  ratePerKm: number;

  @Column()
  minKm: number;

  @OneToMany(() => RideLog, (ride) => ride.driver)
  rides: RideLog[];
}
