import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { LoginInput } from './dto/login.input';
import { AuthenticationError, UserInputError } from 'apollo-server-errors';
import { PasswordService } from 'src/module/password.service';
import { UserCreateInput } from 'src/@generated/prisma-nestjs-graphql/user/user-create.input';
import { SignupInput } from './dto/signup.input';
import { Auth } from './auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwt: JwtService,
    private readonly passwordService: PasswordService,
  ) {}
  private readonly user = this.db.user;

  async createUser(userInput: SignupInput) {
    userInput.password = await this.passwordService.hashPassword(
      userInput.password,
    );
    const user = await this.user.create({ data: userInput });
    return {
      accessToken: this.generateToken({ userId: user.id }),
    };
  }

  async validateUser(user: Partial<User>) {
    const _user = await this.db.user.findUnique({
      where: { ...user },
    });
    if (!_user) {
      throw new UnauthorizedException();
    }
    return _user;
  }

  async login(loginInput: LoginInput) {
    const user = await this.validateUser({ email: loginInput.email });
    if (
      !(await this.passwordService.validatePassword(
        loginInput.password,
        user.password,
      ))
    ) {
      throw new UnauthorizedException();
    }
    return {
      accessToken: this.generateToken({ userId: user.id }),
    };
  }

  async getUserFromToken(auth: Auth) {
    const payload = await this.jwt.decode(auth.accessToken.toString());
    const user = await this.user.findUnique({
      where: { id: payload['userId'] },
      include: { profile: true },
    });
    return user;
  }

  generateToken(payload: { userId: String }) {
    return this._generateToken(payload.userId);
  }

  private _generateToken(userId: String) {
    return this.jwt.sign({ userId });
  }
}
