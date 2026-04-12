import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
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

  @Get('profile/:id')
  getProfile(@Param('id') id: string) {
    return this.authService.getProfile(+id);
  }

  @Put('profile/:id')
  updateProfile(@Param('id') id: string, @Body() body: any) {
    return this.authService.updateProfile(+id, body);
  }
}
