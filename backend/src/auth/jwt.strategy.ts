import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'sanctuary_super_secret_key_123',
    });
  }

  async validate(payload: any) {
    // payload contiene { sub: userId, email: userEmail, plan: userPlan }
    const user = await this.authService.getProfile(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Usuario no válido');
    }
    return user; // Se inyecta en req.user
  }
}
