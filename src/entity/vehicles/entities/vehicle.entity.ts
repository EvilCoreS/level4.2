import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../../images/entities/image.entity';
import { Person } from '../../people/entities/person.entity';
import { Film } from '../../films/entities/film.entity';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  model: string;

  @Column()
  manufacturer: string;

  @Column()
  cost_in_credits: string;

  @Column()
  length: string;

  @Column()
  max_atmosphering_speed: string;

  @Column()
  crew: string;

  @Column()
  passengers: string;

  @Column()
  cargo_capacity: string;

  @Column()
  consumables: string;

  @Column()
  vehicle_class: string;

  @ManyToMany(() => Image, { cascade: true, eager: true })
  @JoinTable()
  images: Image[];

  @ManyToMany(() => Person, (person) => person.vehicles, {
    onDelete: 'CASCADE',
  })
  pilots: Person[];

  @ManyToMany(() => Film, (film) => film.vehicles, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  films: Film[];
}
