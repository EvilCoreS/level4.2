import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../../images/entities/image.entity';
import { Person } from '../../people/entities/person.entity';
import { Film } from '../../films/entities/film.entity';

@Entity()
export class Planet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  rotation_period: string;

  @Column()
  orbital_period: string;

  @Column()
  diameter: string;

  @Column()
  climate: string;

  @Column()
  gravity: string;

  @Column()
  terrain: string;

  @Column()
  surface_water: string;

  @Column()
  population: string;

  @ManyToMany(() => Image, { cascade: true, eager: true })
  @JoinTable()
  images: Image[];

  @OneToMany(() => Person, (person) => person.homeworld)
  residents?: Person[];

  @ManyToMany(() => Film, (film) => film.planets, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  films: Film[];
}
