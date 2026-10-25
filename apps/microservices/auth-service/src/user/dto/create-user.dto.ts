import {
    IsEmail,
    IsNotEmpty,
    MinLength,
    IsOptional,
    IsString,
    IsDateString,
  } from 'class-validator';
  
  export class CreateUserDto  {
    @IsNotEmpty()
    @IsString()
    username!: string;
  
    @IsEmail()
    email!: string;
  
    @IsNotEmpty()
    @MinLength(6)
    password!: string;
  
    @IsNotEmpty()
    @IsString()
    firstName!: string;
  
    @IsNotEmpty()
    @IsString()
    lastName!: string;
  
    @IsOptional()
    @IsString()
    phone?: string;
  
    @IsOptional()
    @IsDateString()
    fechaNacimiento?: string;
  
    @IsOptional()
    @IsString()
    captchaToken?: string;
  }
  