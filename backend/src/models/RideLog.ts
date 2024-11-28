import { Driver } from "./Driver";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";

@Entity()
export class RideLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customer_id: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: "float", nullable: true })
  price: number;

  @Column({ type: "float", nullable: true })
  distance: number;

  @Column({ nullable: true })
  duration: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Driver, (driver) => driver.rides, { eager: true })
  driver: Driver;
}
