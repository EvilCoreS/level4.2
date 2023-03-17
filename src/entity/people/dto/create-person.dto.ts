import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonDto {
  @ApiProperty()
  private readonly name: string = '1';

  @ApiProperty()
  private readonly height: string = '1';

  @ApiProperty()
  private readonly mass: string = '1';

  @ApiProperty()
  private readonly hair_color: string = '1';

  @ApiProperty()
  private readonly skin_color: string = '1';

  @ApiProperty()
  private readonly eye_color: string = '1';

  @ApiProperty()
  private readonly birth_year: string = '1';

  @ApiProperty()
  private readonly gender: string = '1';
}
