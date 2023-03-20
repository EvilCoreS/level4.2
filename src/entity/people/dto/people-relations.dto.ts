import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PeopleRelationsDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  homeworld?: number;
}
