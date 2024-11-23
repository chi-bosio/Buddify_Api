import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  handleRequest(err, user, info, context) {
    console.log('Google user in guard:', user);  // Verifica si el usuario está llegando
    if (err || !user) {
      throw err || new Error('No se pudo autenticar al usuario con Google');
    }
    return user;
  }
}