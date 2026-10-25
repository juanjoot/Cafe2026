import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout, catchError, throwError } from 'rxjs';
import { AuthGuard } from '../auth/auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';


const BASE_URL = 'http://localhost:3000/products';

function handleProxyError(error: any, defaultMsg: string, fallbackStatus = 502) {
  const status = error.response?.status || fallbackStatus;
  const message = error.response?.data?.message || defaultMsg;
  throw new HttpException({ message }, status);
}

@Controller('products')
//@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly http: HttpService) {}

  @Get()
  async proxyGetProducts(@Query() query: QueryProductDto) {
    try {
      const url = new URL(BASE_URL);
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value as string);
        }
      });

      const response = await firstValueFrom(
        this.http.get(url.toString()).pipe(timeout(3000), catchError((err) => throwError(() => err))),
      );
      return response.data;
    } catch (error) {
      handleProxyError(error, 'El servicio de productos no está disponible');
    }
  }

  @Post()
  async proxyCreateProduct(@Body() body: CreateProductDto) {
    try {
      const response = await firstValueFrom(
        this.http.post(BASE_URL, body).pipe(timeout(3000), catchError((err) => throwError(() => err))),
      );
      return response.data;
    } catch (error) {
      handleProxyError(error, 'No se pudo crear el producto');
    }
  }

  @Put(':id')
  async proxyUpdateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    try {
      const response = await firstValueFrom(
        this.http.put(`${BASE_URL}/${id}`, dto).pipe(timeout(3000), catchError((err) => throwError(() => err))),
      );
      return response.data;
    } catch (error) {
      handleProxyError(error, 'No se pudo actualizar el producto');
    }
  }

  @Delete(':id')
  async proxyDeleteProduct(@Param('id') id: string) {
    try {
      const response = await firstValueFrom(
        this.http.delete(`${BASE_URL}/${id}`).pipe(timeout(3000), catchError((err) => throwError(() => err))),
      );
      return response.data;
    } catch (error) {
      handleProxyError(error, 'No se pudo eliminar el producto');
    }
  }

  @Get(':id')
  async proxyGetProductById(@Param('id') id: string) {
  try {
    const response = await firstValueFrom(
      this.http.get(`${BASE_URL}/${id}`).pipe(
        timeout(3000),
        catchError((err) => throwError(() => err)),
      ),
    );
    return response.data;
  } catch (error: unknown) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as any;
    const status = err.response?.status || HttpStatus.SERVICE_UNAVAILABLE;
    const message = err.response?.data?.message || 'No se pudo obtener el producto';
    throw new HttpException({ message }, status);
  }

  // Error genérico
  throw new HttpException({ message: 'Error desconocido' }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
 }

}
