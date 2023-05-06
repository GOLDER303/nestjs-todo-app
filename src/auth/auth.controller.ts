import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokensDTO } from './dtos/refresh-token.dto';
import { SignInResponseDTO } from './dtos/sign-in-response.dto';
import { SignInDTO } from './dtos/sign-in.dto';
import { SignUpResponseDTO } from './dtos/sign-up-response.dto';
import { SignUpDTO } from './dtos/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  singUp(@Body() signUpDTO: SignUpDTO): Promise<SignUpResponseDTO> {
    return this.authService.singUp(signUpDTO);
  }

  @Post('signIn')
  @HttpCode(HttpStatus.OK)
  singIn(@Body() signInDTO: SignInDTO): Promise<SignInResponseDTO> {
    return this.authService.singIn(signInDTO);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @Body() refreshTokensDTO: RefreshTokensDTO,
  ): Promise<SignInResponseDTO> {
    return this.authService.refreshTokens(refreshTokensDTO);
  }
}
