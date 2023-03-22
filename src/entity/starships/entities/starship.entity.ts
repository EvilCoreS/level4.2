import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../../images/entities/image.entity';
import { Film } from '../../films/entities/film.entity';
import { Person } from '../../people/entities/person.entity';

@Entity()
export class Starship {
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
  hyperdrive_rating: string;

  @Column()
  MGLT: string;

  @Column()
  starship_class: string;

  @ManyToMany(() => Image, { cascade: true, eager: true })
  @JoinTable()
  images: Image[];

  @ManyToMany(() => Film, (films) => films.starships, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  films: Film[];

  @ManyToMany(() => Person, (person) => person.starships, {
    onDelete: 'CASCADE',
  })
  pilots: Person[];
}
