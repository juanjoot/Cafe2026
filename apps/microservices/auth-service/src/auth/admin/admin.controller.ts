import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';


@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('dashboard')
  @Roles('admin')
  getAdminDashboard() {
    return {
      message: 'Bienvenido al panel de administración',
    };
  }

  @Get('stats')
  @Roles('admin')
  getStats() {
    return {
      totalUsers: 452,
      activeOrders: 38,
    };
  }
}
