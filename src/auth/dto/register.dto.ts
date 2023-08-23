import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'test' })
  email: string;

  @ApiProperty({ example: 'test' })
  username: string;

  @ApiProperty({ example: 'test' })
  password: string;
}
