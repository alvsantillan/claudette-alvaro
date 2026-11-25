import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, IsIn, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'Máximo 100 caracteres' })
  nombre: string;

  @IsEmail({}, { message: 'El email no es válido' })
  @MaxLength(150, { message: 'Máximo 150 caracteres' })
  email: string;

  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(6, { message: 'Mínimo 6 caracteres' })
  @MaxLength(255, { message: 'Máximo 255 caracteres' })
  password: string;

  @IsOptional()
  @IsIn(['admin', 'cliente'], { message: 'El rol debe ser admin o cliente' })
  rol?: string;
}