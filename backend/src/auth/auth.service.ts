import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async register(data: { firstName: string; lastName: string; email: string; password: string; role?: string }) {
    const existing = await this.usersRepo.findOne({ where: { email: data.email } });
    if (existing) {
      return { error: 'El email ya está registrado' };
    }

    const user = this.usersRepo.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password, // En producción se hashea
      role: data.role || 'user',
      budget: 4200,
    });

    const saved = await this.usersRepo.save(user);
    const { password, ...result } = saved;
    return { user: result };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return { error: 'Email o contraseña incorrectos' };
    }

    const { password: _, ...result } = user;
    return { user: result };
  }

  async googleLogin(token: string) {
    try {
      // Un JWT consta de cabecera.payload.firma
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { error: 'Token de Google inválido' };
      }
      
      // Decodificar el payload (segunda parte del JWT)
      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
      const payload = JSON.parse(payloadJson);
      
      const email = payload.email;
      const firstName = payload.given_name || 'Google';
      const lastName = payload.family_name || 'User';
      
      if (!email) {
        return { error: 'No se pudo obtener el email del token de Google' };
      }

      let user = await this.usersRepo.findOne({ where: { email } });
      if (!user) {
        // Registrar nuevo usuario automáticamente con Google
        user = this.usersRepo.create({
          firstName,
          lastName,
          email,
          password: 'google-oauth-placeholder-password',
          role: 'user',
          budget: 4200,
          plan: 'Plus', // Le damos Plan Plus de bienvenida en la demo
        });
        user = await this.usersRepo.save(user);
      }
      
      const { password, ...result } = user;
      return { user: result };
    } catch (e) {
      return { error: 'Error al verificar el token de Google: ' + e.message };
    }
  }

  async getProfile(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async updateProfile(userId: number, data: Partial<User>) {
    // Solo permitir campos válidos para evitar errores de columnas inexistentes
    const allowed = ['firstName', 'lastName', 'phone', 'location', 'bio', 'plan', 'budget', 'currency'];
    const safeData: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) safeData[key] = data[key];
    }
    if (Object.keys(safeData).length > 0) {
      await this.usersRepo.update(userId, safeData);
    }
    return this.getProfile(userId);
  }
}
