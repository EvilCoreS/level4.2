import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class PlanetRelationsDto {
  @ApiProperty({ type: 'number', isArray: true })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  residents?: number[];

  @ApiProperty({ type: 'number', isArray: true })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  films?: number[];
}
