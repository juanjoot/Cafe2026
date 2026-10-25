import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Client } from './schemas/client.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import { CreateUserDto } from './dto/create-user.dto'; // importar DTO
import { RabbitMQService } from '@shared/rabbitmq';

/**
 * Servicio encargado de registrar, obtener, actualizar y eliminar
 * usuarios y sus clientes asociados.
 */
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Client.name) private clientModel: Model<Client>,
    private readonly rabbit: RabbitMQService,
  ) {}

  /**
   * Crea un usuario y su cliente correspondiente.
   * Verifica CAPTCHA y encripta la contraseña.
   */
  async createClientAndUser(body: CreateUserDto) {
    const { firstName, lastName, username, email, password, phone, fechaNacimiento, captchaToken } = body;

    /** // Validación básica
    if (!captchaToken || !firstName || !lastName || !email || !password) {
      throw new Error('Faltan datos requeridos o el CAPTCHA no fue proporcionado');
    }

     // Verifica el token CAPTCHA con la API de Google
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${captchaToken}`,
    });
    const captchaData = await response.json();
    if (!captchaData.success) {
      throw new Error('CAPTCHA inválido');
    }
      */

    // Verifica que el correo no exista
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Crea usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, email, password: hashedPassword });
    await newUser.save();

    // Crea cliente vinculado
    const newClient = new this.clientModel({
      usuario: newUser._id,
      firstName,
      lastName,
      email,
      phone,
      direccion: {
        calle: 'Dirección no proporcionada',
        ciudad: 'Ciudad no especificada',
        estado: 'Estado no especificado',
        codigoPostal: '00000',
      },
      fechaNacimiento,
    });
    await newClient.save();

    // Publicar evento en RabbitMQ
  await this.rabbit.publish('user.registered', {
    id: newUser._id,
    email: newUser.email,
    name: newUser.username,
  });

    return { message: 'Registro exitoso' };
  }

  /**
   * Obtiene todos los usuarios y sus clientes asociados.
   */
  async getAllUsers() {
    const usuarios = await this.userModel.find();
    return Promise.all(
      usuarios.map(async (usuario) => {
        const cliente = await this.clientModel.findOne({ usuario: usuario._id });
        return { ...usuario.toObject(), cliente };
      })
    );
  }

  /**
   * Obtiene un usuario por ID.
   */
  async getUserById(id: string) {
    return this.userModel.findById(id);
  }

  /**
   * Actualiza los datos de un usuario.
   */
  async updateUser(id: string, data: any) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  /**
   * Elimina un usuario y su cliente asociado usando el correo.
   */
  async deleteUser(email: string) {
    const usuario = await this.userModel.findOneAndDelete({ email });
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
  

    const cliente = await this.clientModel.findOneAndDelete({ usuario: usuario?.value?._id });
    return cliente
      ? { message: 'Usuario y cliente eliminados' }
      : { message: 'Usuario eliminado, cliente no encontrado' };
  }
}
