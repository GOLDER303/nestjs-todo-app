import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDTO } from './dtos/signUp.dto';
import { SignUpResponseDTO } from './dtos/signUpResponse.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async singUp(signUpDTO: SignUpDTO): Promise<SignUpResponseDTO> {
    const hashedPassword = await this.hashData(signUpDTO.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: signUpDTO.email,
        password: hashedPassword,
      },
    });
    const accessToken = this.generateAccessToken(newUser.id, newUser.email);
    return { accessToken };
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }

  generateAccessToken(userId: number, email: string) {
    return this.jwtService.sign(
      {
        sub: userId,
        email,
      },
      {
        secret: 'access_token_secret',
        expiresIn: 15 * 60,
      },
    );
  }
}
