import {
  Body,
  Controller,
  Get,
  HttpException,
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
      url: `${process.env['WEB_BASE_URL']}/auth/?access=${req.user.access}&refresh=${req.user.refresh}`,
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
            grant_type: 'refresh_token',
            refresh_token: body.refresh,
          },
        },
      ),
    );

    const _paramsFromRes = new URLSearchParams(_res.data);
    const _error = _paramsFromRes.get('error');

    if (_error) throw new HttpException('Invalid refresh token', 400);

    const _tokens: RefreshDto = {
      access: _paramsFromRes.get('access_token'),
      refresh: _paramsFromRes.get('refresh_token'),
    };

    if (!_tokens.access || !_tokens.refresh)
      throw new HttpException('Invalid refresh token', 400);

    return _tokens;
  }
}
