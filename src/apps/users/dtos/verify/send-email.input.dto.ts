import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendEmailInput {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  email: string;
}
