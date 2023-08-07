import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlanetDto {
  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly name: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly rotation_period: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly orbital_period: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly diameter: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly climate: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly gravity: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly terrain: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly surface_water: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly population: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  private readonly files: Express.Multer.File[];
}
