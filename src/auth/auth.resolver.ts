import { LoginInput } from './dto/login.input';
import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './auth.model';
import { SignupInput } from './dto/signup.input';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Auth)
  login(@Args('loginInfo') loginInfo: LoginInput) {
    return this.auth.login(loginInfo);
  }

  @Mutation(() => Auth)
  async register(@Args('registerInfo') registerInfo: SignupInput) {
    return this.auth.createUser(registerInfo);
  }

  @ResolveField('user', () => User)
  async user(@Parent() auth: Auth) {
    return this.auth.getUserFromToken(auth);
  }
}
