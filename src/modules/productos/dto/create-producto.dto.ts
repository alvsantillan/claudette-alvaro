import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

// Datos para CREAR un producto (tabla "productos").
export class CreateProductoDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'Máximo 100 caracteres' })
  nombre: string;

  @IsInt({ message: 'El precio debe ser un número entero' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precio: number;

  @IsOptional()
  @IsString({ message: 'La imagen debe ser texto' })
  imagen?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  descripcion?: string;

  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @IsOptional()
  @IsBoolean({ message: 'destacado debe ser true o false' })
  destacado?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'activo debe ser true o false' })
  activo?: boolean;

  @IsInt({ message: 'categoriaId debe ser un número entero' })
  categoriaId: number;

  // ids de la tabla talles, ej: [1, 2, 3] = S, M, L
  @IsOptional()
  @IsArray({ message: 'Los talles deben ser una lista' })
  @ArrayUnique({ message: 'Hay talles repetidos' })
  @IsInt({ each: true, message: 'Cada talle debe ser un id numérico' })
  talles?: number[];
}
