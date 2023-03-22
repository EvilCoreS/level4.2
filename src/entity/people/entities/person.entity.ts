import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../../images/entities/image.entity';
import { Planet } from '../../planet/entities/planet.entity';
import { Film } from '../../films/entities/film.entity';
import { Species } from '../../species/entities/species.entity';
import { Starship } from '../../starships/entities/starship.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('people')
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  height: string;

  @Column()
  mass: string;

  @Column()
  hair_color: string;

  @Column()
  skin_color: string;

  @Column()
  eye_color: string;

  @Column()
  birth_year: string;

  @Column()
  gender: string;

  @ManyToMany(() => Image, { cascade: true, eager: true })
  @JoinTable()
  images: Image[];

  @ManyToOne(() => Planet, (planet) => planet.residents, {
    cascade: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  homeworld: Planet;

  @ManyToMany(() => Film, (film) => film.characters, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  films: Film[];

  @ManyToMany(() => Species, (species) => species.people, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  species: Species[];

  @ManyToMany(() => Starship, (starships) => starships.pilots, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  starships: Starship[];

  @ManyToMany(() => Vehicle, (vehicles) => vehicles.pilots, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  vehicles: Vehicle[];
}
