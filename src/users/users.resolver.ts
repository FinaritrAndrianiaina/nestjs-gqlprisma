import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserCreateInput } from 'src/@generated/prisma-nestjs-graphql/user/user-create.input';
import { UserOrderByInput } from 'src/@generated/prisma-nestjs-graphql/user/user-order-by.input';
import { UserScalarWhereWithAggregatesInput } from 'src/@generated/prisma-nestjs-graphql/user/user-scalar-where-with-aggregates.input';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';
import { UserEntity } from 'src/decorators/user.decorator';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly db: PrismaService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@UserEntity() user) {
    return user;
  }

  @Query(() => [User])
  queryUser(
    @Args('queryUserInput') queryUserInput: UserScalarWhereWithAggregatesInput,
    @Args('take', { nullable: true, type: () => Int, defaultValue: 10 }) take,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 }) skip,
    @Args('orderBy', { nullable: true }) orderBy: UserOrderByInput,
  ) {
    return this.db.user.findMany({
      where: queryUserInput,
      take,
      skip,
      orderBy,
    });
  }
}
