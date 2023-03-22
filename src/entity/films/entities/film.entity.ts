import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../../images/entities/image.entity';
import { Person } from '../../people/entities/person.entity';
import { Planet } from '../../planet/entities/planet.entity';
import { Species } from '../../species/entities/species.entity';
import { Starship } from '../../starships/entities/starship.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity()
export class Film {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  episode_id: number;

  @Column()
  opening_crawl: string;

  @Column()
  director: string;

  @Column()
  producer: string;

  @Column({ type: 'date' })
  release_date: string;

  @ManyToMany(() => Image, { cascade: true, eager: true })
  @JoinTable()
  images: Image[];

  @ManyToMany(() => Person, (person) => person.films, {
    onDelete: 'CASCADE',
  })
  characters: Person[];

  @ManyToMany(() => Planet, (planet) => planet.films, {
    onDelete: 'CASCADE',
  })
  planets: Planet[];

  @ManyToMany(() => Species, (species) => species.films, {
    onDelete: 'CASCADE',
  })
  species: Species[];

  @ManyToMany(() => Starship, (starships) => starships.films, {
    onDelete: 'CASCADE',
  })
  starships: Starship[];

  @ManyToMany(() => Vehicle, (vehicles) => vehicles.films, {
    onDelete: 'CASCADE',
  })
  vehicles: Vehicle[];
}
