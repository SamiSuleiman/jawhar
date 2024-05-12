import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {
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
}
