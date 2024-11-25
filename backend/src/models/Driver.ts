import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}
