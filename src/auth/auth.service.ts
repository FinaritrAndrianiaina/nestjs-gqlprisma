import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { LoginInput } from './dto/login.input';
import { AuthenticationError, UserInputError } from 'apollo-server-errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(user: Partial<User>) {
    const _user = await this.db.user.findUnique({
      where: { ...user },
    });
    if (!user) {
      throw new UserInputError('User not valid');
    }
    return _user;
  }

  async login(loginInput: LoginInput) {
    const user = await this.validateUser({ email: loginInput.email });
    if (user.password !== loginInput.password) {
      throw new AuthenticationError("You're credentials is not valid!!");
    }
    return {
      accessToken: this.generateToken({ userId: user.id }),
    };
  }

  generateToken(payload: { userId: String }) {
    return this._generateToken(payload.userId);
  }

  private _generateToken(userId: String) {
    return this.jwt.sign({ userId });
  }
}
