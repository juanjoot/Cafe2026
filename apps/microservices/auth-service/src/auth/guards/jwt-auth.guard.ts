import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No autorizado, sin token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded: any = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'supersecret_dev_token',
      });

      const user = await this.userModel.findById(decoded.sub).select('-password');

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      req.user = user;
      return true;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token ha expirado');
      }
      throw new UnauthorizedException('Token inválido');
    }
  }
}
