import { Module } from '@nestjs/common';
import { GithubModule } from './github/github.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [GithubModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
