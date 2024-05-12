import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { env } from 'process';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: env['CLIENT_ID'],
      clientSecret: env['CLIENT_SECRET'],
      callbackURL: env['SERVER_BASE_URL'] + '/api/auth/github/callback',
    });
  }

  async validate(
    access: string,
    refresh: string,
    _: Profile,
    done: (
      err?: Error | null,
      tokens?: { access: string; refresh: string },
    ) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    return done(null, { access, refresh });
  }
}
