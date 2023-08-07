import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('image')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'file_name' })
  file_name: string;

  @Column({ name: 'original_name' })
  original_name: string;

  @Column({ type: 'date', name: 'upload_date' })
  date: string;

  @Column({ type: 'longtext', name: 'aws_link' })
  aws_link: string;
}
