import { Controller, Post, Body, Get,UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * Controlador encargado del inicio de sesión y autenticación de usuarios.
 * Expuesto en la ruta /auth.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Inicia sesión con email y contraseña.
   * Devuelve un token JWT si las credenciales son válidas.
   */
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Inicia sesión y retorna datos extendidos del cliente.
   * Útil para paneles de usuario donde se necesita más información que solo el token.
   */
  @Post('login/client')
  loginWithClient(@Body() dto: LoginDto) {
    return this.authService.loginWithClient(dto);
  }

  // prueba rutas protegidas token
  @UseGuards(JwtAuthGuard)
  @Get('ping')
  getPing() {
    return { message: '🔐 Acceso permitido: Token válido' };
}

}

