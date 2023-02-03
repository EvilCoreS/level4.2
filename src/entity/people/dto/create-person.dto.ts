import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  height: string;

  @ApiProperty({ required: true })
  mass: string;

  @ApiProperty({ required: true })
  hair_color: string;

  @ApiProperty({ required: true })
  skin_color: string;

  @ApiProperty({ required: true })
  eye_color: string;

  @ApiProperty({ required: true })
  birth_year: string;

  @ApiProperty({ required: true })
  gender: string;
}
