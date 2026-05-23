import { Controller, Post, Get, Put, Body, Param, UseGuards, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: { firstName: string; lastName: string; email: string; password: string; role?: string }) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('google')
  googleLogin(@Body() body: { token: string }) {
    return this.authService.googleLogin(body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  getProfile(@Param('id') id: string, @GetUser() user: User) {
    if (user.id !== +id) throw new UnauthorizedException('No autorizado');
    return this.authService.getProfile(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile/:id')
  updateProfile(@Param('id') id: string, @Body() body: any, @GetUser() user: User) {
    if (user.id !== +id) throw new UnauthorizedException('No autorizado');
    return this.authService.updateProfile(+id, body);
  }
}
