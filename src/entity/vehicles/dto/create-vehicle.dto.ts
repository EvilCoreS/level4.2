import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  manufacturer: string;

  @ApiProperty({ example: '0' })
  @IsNotEmpty()
  @IsNumberString()
  cost_in_credits: string;

  @ApiProperty({ example: '0' })
  @IsNotEmpty()
  @IsNumberString()
  length: string;

  @ApiProperty({ example: '0' })
  @IsNotEmpty()
  @IsNumberString()
  max_atmosphering_speed: string;

  @ApiProperty({ example: '0' })
  @IsNotEmpty()
  @IsNumberString()
  crew: string;

  @ApiProperty({ example: '0' })
  @IsNotEmpty()
  @IsNumberString()
  passengers: string;

  @ApiProperty({ example: '0' })
  @IsNotEmpty()
  @IsNumberString()
  cargo_capacity: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  consumables: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  vehicle_class: string;

  @ApiProperty({ type: 'string', format: 'binary', isArray: true })
  files: Express.Multer.File[];
}
