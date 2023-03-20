import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Planet } from '../../planet/entities/planet.entity';
import { CreatePlanetDto } from '../../planet/dto/create-planet.dto';

export class CreatePersonDto {
  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  private readonly name: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  private readonly height: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  private readonly mass: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  private readonly hair_color: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  private readonly skin_color: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  private readonly eye_color: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  private readonly birth_year: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  private readonly gender: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  private readonly files: Express.Multer.File[];
}
