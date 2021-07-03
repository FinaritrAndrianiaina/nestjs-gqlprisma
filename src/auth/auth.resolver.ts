import { LoginInput } from './dto/login.input';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './auth.model';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Auth)
  login(@Args('loginInfo') loginInfo: LoginInput) {
    return this.auth.login(loginInfo);
  }
}
