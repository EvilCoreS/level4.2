import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  height: string;

  @ApiProperty()
  mass: string;

  @ApiProperty()
  hair_color: string;

  @ApiProperty()
  skin_color: string;

  @ApiProperty()
  eye_color: string;

  @ApiProperty()
  birth_year: string;

  @ApiProperty()
  gender: string;
}
