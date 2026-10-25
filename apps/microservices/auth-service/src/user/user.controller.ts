import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto'; // importar DTO

/**
 * Controlador que gestiona el CRUD de usuarios y sus clientes asociados.
 * Expuesto en la ruta /users.
 */
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Registro de nuevo usuario y cliente asociado.
   */
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createClientAndUser(createUserDto);
  }

  /**
   * Retorna todos los usuarios con sus datos de cliente.
   */
  @Get()
  findAll() {
    return this.userService.getAllUsers();
  }

  /**
   * Retorna un usuario específico por su ID.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  /**
   * Actualiza un usuario por ID.
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.userService.updateUser(id, body);
  }

  /**
   * Elimina un usuario y su cliente asociado por email.
   */
  @Delete(':email')
  delete(@Param('email') email: string) {
    return this.userService.deleteUser(email);
  }
}
