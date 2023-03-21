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
  @JoinTable()
  characters: Person[];

  @ManyToMany(() => Planet, (planet) => planet.films, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  planets: Planet[];
}
