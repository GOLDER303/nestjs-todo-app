import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RefreshTokensDTO } from './dtos/refresh-token.dto';
import { SignInResponseDTO } from './dtos/sign-in-response.dto';
import { SignInDTO } from './dtos/sign-in.dto';
import { SignUpResponseDTO } from './dtos/sign-up-response.dto';
import { SignUpDTO } from './dtos/sign-up.dto';

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
    const tokens = await this.generateTokens(newUser.id, newUser.email);
    return tokens;
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

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateUserHashedRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async generateTokens(userId: number, email: string) {
    const jwtPayload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: 15 * 60,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: 60 * 60 * 24 * 7,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(
    refreshTokensDTO: RefreshTokensDTO,
  ): Promise<SignInResponseDTO> {
    try {
      this.jwtService.verify(refreshTokensDTO.refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException();
    }

    const refreshTokenData = this.jwtService.decode(
      refreshTokensDTO.refreshToken,
    );

    const userId = refreshTokenData.sub;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException();
    }

    if (
      !bcrypt.compare(refreshTokensDTO.refreshToken, user.hashedRefreshToken)
    ) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateUserHashedRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateUserHashedRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }
}
