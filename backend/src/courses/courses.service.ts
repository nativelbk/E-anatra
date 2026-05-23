import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

interface ListParams { subject?: string; level?: string; search?: string }
interface CreateCourseDto {
  title: string; description: string; content: string;
  subject: string; level: string; videoUrl?: string; fileUrl?: string;
}

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService, private ai: AiService) {}

  list({ subject, level, search }: ListParams) {
    return this.prisma.course.findMany({
      where: {
        ...(subject ? { subject: subject as any } : {}),
        ...(level   ? { level: level as any }     : {}),
        ...(search  ? { OR: [
          { title:       { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ] } : {}),
      },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true } } },
    });
    if (!course) throw new NotFoundException('Cours introuvable');
    return course;
  }

  create(authorId: string, dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: { ...dto, subject: dto.subject as any, level: dto.level as any, authorId },
      include: { author: { select: { id: true, name: true } } },
    });
  }

  async delete(id: string, userId: string, role: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Cours introuvable');
    if (course.authorId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Accès non autorisé');
    }
    return this.prisma.course.delete({ where: { id } });
  }

  async explain(id: string, question: string, userId: string): Promise<{ answer: string }> {
    const course = await this.get(id);
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { level: true } });

    const system = `Tu es e-Anatra, un assistant pédagogique. L'élève consulte actuellement le cours suivant :

Titre : ${course.title}
Matière : ${course.subject}
Niveau : ${course.level}

Contenu du cours :
${course.content}

Ton rôle est d'aider l'élève à comprendre ce cours. Réponds en français, de manière claire et adaptée au niveau ${course.level}. Utilise le markdown pour structurer ta réponse. Sois précis et pédagogique.`;

    const answer = await this.ai.chat(
      [{ role: 'user', content: question }],
      user?.level ?? undefined,
      system,
    );
    return { answer };
  }
}
