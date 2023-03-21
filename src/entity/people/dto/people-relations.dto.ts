import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class PeopleRelationsDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  homeworld?: number;

  @ApiProperty({ type: 'number', isArray: true })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  films?: number[];

  @ApiProperty({ type: 'number', isArray: true })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  species?: number[];
}
