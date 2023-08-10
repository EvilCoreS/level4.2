import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'user' })
  @IsNotEmpty()
  @IsString()
  role: string;
}
