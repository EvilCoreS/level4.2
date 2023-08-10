import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
