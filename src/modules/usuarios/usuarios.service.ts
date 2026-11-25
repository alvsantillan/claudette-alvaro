import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { hashPassword } from '../auth/password.util.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';

const sinPassword = { id: true, nombre: true, email: true, rol: true, createdAt: true } as const;
@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.usuario.findMany({ orderBy: { id: 'asc' }, select: sinPassword });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: { ...sinPassword, contactos: true, carritos: { include: { items: true } } },
    });
    if (!usuario) throw new NotFoundException(`No existe el usuario con id ${id}`);
    return usuario;
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const password = dto.password ? await hashPassword(dto.password) : undefined;
    return this.prisma.usuario.update({
      where: { id },
      data: { ...dto, ...(password && { password }) },
      select: sinPassword,
    });
  }

  remove(id: number) {
    return this.prisma.usuario.delete({ where: { id }, select: sinPassword });
  }
}
