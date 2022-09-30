import { IsString } from 'class-validator';

export class SignOutDto {
  @IsString()
  token: string;
}
