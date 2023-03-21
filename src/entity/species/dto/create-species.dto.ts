import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateSpeciesDto {
  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly name: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly classification: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly designation: string;

  @ApiProperty({ example: '0' })
  @IsNumberString()
  @IsNotEmpty()
  private readonly average_height: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly skin_colors: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly hair_colors: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly eye_colors: string;

  @ApiProperty({ example: '0' })
  @IsNumberString()
  @IsNotEmpty()
  private readonly average_lifespan: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  private readonly language: string;

  @ApiProperty({ type: 'string', format: 'binary', isArray: true })
  private readonly files: Express.Multer.File[];
}
