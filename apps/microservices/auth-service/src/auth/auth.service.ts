import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { Client } from '../user/schemas/client.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RabbitMQService } from '@shared/rabbitmq';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,           // Modelo de usuario
    @InjectModel(Client.name) private clientModel: Model<Client>,     // Modelo de cliente asociado
    private jwtService: JwtService,                                   // Servicio para generar JWT
    private readonly rabbit: RabbitMQService,                         // Servicio de RabbitMQ (compartido desde shared)
  ) {}

  /**
   * Autenticación básica.
   * Valida las credenciales y devuelve un JWT si son correctas.
   */
  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      console.log('❌ Contraseña incorrecta o usuario no existe');
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user._id, email: user.email };
    return { token: this.jwtService.sign(payload) };
  }

  /**
   * Autenticación con recuperación de información del cliente.
   * Similar a login, pero también retorna datos del cliente asociado.
   */
  async loginWithClient(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const client = await this.clientModel.findOne({ usuario: user._id });
    if (!client) {
      throw new Error('No se encontraron datos del cliente asociados a este usuario.');
    }

    const token = this.jwtService.sign({ sub: user._id, email: user.email });

    // 🔔 Publicar evento de login exitoso
    await this.rabbit.publish('user.logged_in', {
      userId: user._id,
      email: user.email,
      timestamp: new Date().toISOString(),
    });

    return {
      message: 'Inicio de sesión exitoso',
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
      calle: client.direccion.calle,
      ciudad: client.direccion.ciudad,
      estado: client.direccion.estado,
      codigoPostal: client.direccion.codigoPostal,
      fechaNacimiento: client.fechaNacimiento,
      token,
    };
  }
}
