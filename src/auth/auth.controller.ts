import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dtos/sign-in.dto';
import { SignInResponseDTO } from './dtos/signIn-response.dto';
import { SignUpDTO } from './dtos/sign-up.dto';
import { SignUpResponseDTO } from './dtos/sign-up-response.dto';

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
}
