import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class PlanetRelationsDto {
  @ApiProperty({ type: 'number', isArray: true })
  @IsArray()
  @IsNumber({}, { each: true })
  residents: number[];
}
