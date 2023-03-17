import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePersonDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  private readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  private readonly height: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  private readonly mass: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  private readonly hair_color: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  private readonly skin_color: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  private readonly eye_color: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  private readonly birth_year: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  private readonly gender: string;
}
