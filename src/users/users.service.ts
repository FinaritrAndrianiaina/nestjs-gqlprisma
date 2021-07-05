import { Injectable } from '@nestjs/common';
import { UserCreateInput } from 'src/@generated/prisma-nestjs-graphql/user/user-create.input';
import { PasswordService } from 'src/module/password.service';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class UsersService {}
