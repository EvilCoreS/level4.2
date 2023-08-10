import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'username' })
  username: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'role' })
  role: string;

  @Column({ default: null, name: 'access_key' })
  access_key: string;

  @Column({ default: null, name: 'refresh_key' })
  refresh_key: string;
}
