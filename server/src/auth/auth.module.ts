import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { GithubStrategy } from './github.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [GithubStrategy],
})
export class AuthModule {}
