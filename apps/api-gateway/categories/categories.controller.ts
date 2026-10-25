import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout, catchError, throwError } from 'rxjs';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const BASE_URL = 'http://localhost:3000/categories';

function handleProxyError(error: any, defaultMsg: string, fallbackStatus = 502) {
  const status = error.response?.status || fallbackStatus;
  const message = error.response?.data?.message || defaultMsg;
  throw new HttpException({ message }, status);
}

@Controller('categories')
export class CategoriesController {
  constructor(private readonly http: HttpService) {}

  @Get()
  async proxyGetCategories() {
    try {
      const response = await firstValueFrom(
        this.http.get(BASE_URL).pipe(timeout(3000), catchError((err) => throwError(() => err))),
      );
      return response.data;
    } catch (error) {
      handleProxyError(error, 'El servicio de categorías no está disponible');
    }
  }

  @Post()
  async proxyCreateCategory(@Body() body: CreateCategoryDto) {
    try {
      const response = await firstValueFrom(
        this.http.post(BASE_URL, body).pipe(timeout(3000), catchError((err) => throwError(() => err))),
      );
      return response.data;
    } catch (error) {
      handleProxyError(error, 'No se pudo crear la categoría');
    }
  }

  @Put(':id')
  async proxyUpdateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    try {
      const response = await firstValueFrom(
        this.http.put(`${BASE_URL}/${id}`, dto).pipe(timeout(3000), catchError((err) => throwError(() => err))),
      );
      return response.data;
    } catch (error) {
      handleProxyError(error, 'No se pudo actualizar la categoría');
    }
  }

  @Delete(':id')
  async proxyDeleteCategory(@Param('id') id: string) {
    try {
      const response = await firstValueFrom(
        this.http.delete(`${BASE_URL}/${id}`).pipe(timeout(3000), catchError((err) => throwError(() => err))),
      );
      return response.data;
    } catch (error) {
      handleProxyError(error, 'No se pudo eliminar la categoría');
    }
  }
}
