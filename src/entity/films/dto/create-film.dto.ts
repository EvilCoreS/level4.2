import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateFilmDto {
  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: '0' })
  @IsNotEmpty()
  @IsNumberString()
  episode_id: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  opening_crawl: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  producer: string;

  @ApiProperty({ example: '1983-05-25' })
  @IsNotEmpty()
  @IsDateString()
  release_date: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  private readonly files: Express.Multer.File[];
}
