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
import { Person } from '../../people/entities/person.entity';
import { Film } from '../../films/entities/film.entity';

@Entity()
export class Species {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  classification: string;

  @Column()
  designation: string;

  @Column()
  average_height: string;

  @Column()
  skin_colors: string;

  @Column()
  hair_colors: string;

  @Column()
  eye_colors: string;

  @Column()
  average_lifespan: string;

  @Column()
  language: string;

  @ManyToMany(() => Image, { cascade: true, eager: true })
  @JoinTable()
  images: Image[];

  @ManyToOne(() => Planet, { eager: true, onDelete: 'SET NULL' })
  homeworld: Planet;

  @ManyToMany(() => Person, (person) => person.species, {
    onDelete: 'CASCADE',
  })
  people: Person;

  @ManyToMany(() => Film, (films) => films.species, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  films: Film[];
}
