import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, level: true, points: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, level: true, points: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async update(id: string, requesterId: string, requesterRole: string, data: { name?: string; role?: string; level?: string }) {
    if (requesterId !== id && requesterRole !== 'ADMIN') {
      throw new ForbiddenException('Accès non autorisé');
    }
    // Only admins can change roles
    if (data.role && requesterRole !== 'ADMIN') delete data.role;

    return this.prisma.user.update({
      where: { id },
      data: { ...data, role: data.role as any, level: data.level as any },
      select: { id: true, email: true, name: true, role: true, level: true, points: true, createdAt: true },
    });
  }

  async remove(id: string, requesterRole: string) {
    if (requesterRole !== 'ADMIN') throw new ForbiddenException('Accès non autorisé');
    return this.prisma.user.delete({ where: { id } });
  }
}
