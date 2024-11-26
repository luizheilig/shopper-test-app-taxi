import { Driver } from "./Driver";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
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

  @Column({ type: "float", nullable: true }) // Permite nulo inicialmente
  price: number;

  @Column({ type: "float", nullable: true }) // Permite nulo inicialmente
  distance: number;

  @Column({ nullable: true }) // Permite nulo inicialmente
  duration: string;

  @Column({ nullable: true }) // Permite nulo inicialmente
  driver_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: "driver_id" })
  driver: Driver;
}
