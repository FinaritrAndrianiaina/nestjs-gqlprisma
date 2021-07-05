import { AuthResolver } from './auth.resolver';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from 'src/module/prisma/prisma.module';
import { PasswordService } from 'src/module/password.service';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.get('JWT_SECRET_KEY'),
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule,
  ],
  providers: [AuthService, AuthResolver, JwtStrategy,PasswordService],
  exports: [],
})
export class AuthModule {}
