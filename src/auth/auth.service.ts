import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDTO } from './dtos/sign-in.dto';
import { SignInResponseDTO } from './dtos/signIn-response.dto';
import { SignUpDTO } from './dtos/sign-up.dto';
import { SignUpResponseDTO } from './dtos/sign-up-response.dto';

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

  async singIn(signInDTO: SignInDTO): Promise<SignInResponseDTO> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signInDTO.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Access denied');
    }

    const passwordMatches = await bcrypt.compare(
      signInDTO.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Access denied');
    }

    const accessToken = this.generateAccessToken(user.id, user.email);
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
