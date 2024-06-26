import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { RefreshDto } from './auth.model';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.configService.getOrThrow('WEB_BASE_URL');
  }

  @UseGuards(AuthGuard('github'))
  @Get('github')
  authWithGithub() {}

  @UseGuards(AuthGuard('github'))
  @Get('github/callback')
  @Redirect(`${process.env['WEB_BASE_URL']}`)
  async githubCallBack(@Req() req: any) {
    return {
      url: `${process.env['WEB_BASE_URL']}/?access=${req.user.access}&refresh=${req.user.refresh}`,
    };
  }

  @Post('github/refresh')
  async refreshTokens(@Body() body: RefreshDto) {
    const _res = await firstValueFrom(
      this.httpService.post(
        'https://github.com/login/oauth/access_token',
        null,
        {
          params: {
            client_id: this.configService.getOrThrow('CLIENT_ID'),
            client_secret: this.configService.getOrThrow('CLIENT_SECRET'),
            refresh_token: body.refresh,
            grant_type: 'refresh_token',
          },
        },
      ),
    );

    return !_res.data || _res.status !== 200 ? undefined : _res.data;
  }
}
