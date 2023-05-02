import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dtos/signUp.dto';
import { SignUpResponseDTO } from './dtos/signUpResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  singUp(@Body() signUpDTO: SignUpDTO): Promise<SignUpResponseDTO> {
    return this.authService.singUp(signUpDTO);
  }
}
