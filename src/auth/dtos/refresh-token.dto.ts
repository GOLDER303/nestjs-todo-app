import { IsNotEmpty } from 'class-validator';

export class RefreshTokensDTO {
  @IsNotEmpty()
  refreshToken: string;
}
