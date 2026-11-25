import { IsString, IsNotEmpty, IsEmail, MaxLength, IsIn, IsOptional, IsInt } from 'class-validator';

export class CreateContactoDto {
  // Si la consulta la envía una clienta registrada, queda relacionada con ella.
  @IsOptional()
  @IsInt({ message: 'usuarioId debe ser un número entero' })
  usuarioId?: number;

  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'Máximo 100 caracteres' })
  nombre: string;

  @IsEmail({}, { message: 'El email no es válido' })
  @MaxLength(150, { message: 'Máximo 150 caracteres' })
  email: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser texto' })
  @MaxLength(30, { message: 'Máximo 30 caracteres' })
  telefono?: string;

  @IsIn(['consulta', 'talles', 'envios', 'cambios'], { message: 'Motivo no válido' })
  motivo: string;

  @IsString({ message: 'El mensaje debe ser texto' })
  @IsNotEmpty({ message: 'El mensaje es obligatorio' })
  mensaje: string;
}
