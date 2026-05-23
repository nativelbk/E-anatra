import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getProgress(userId: string) {
    const [progress, recentResults, user] = await Promise.all([
      this.prisma.progress.upsert({
        where: { userId },
        create: { userId },
        update: {},
      }),
      this.prisma.quizResult.findMany({
        where: { userId },
        orderBy: { completedAt: 'desc' },
        take: 10,
        include: { quiz: { select: { subject: true } } },
      }),
      this.prisma.user.findUnique({ where: { id: userId }, select: { points: true } }),
    ]);

    const subjectScores = (progress.subjectScores as Record<string, number>) ?? {};
    const subjectProgress = Object.entries(subjectScores).map(([subject, score]) => ({ subject, score }));

    const recentActivity = recentResults.map((r) => ({
      date: r.completedAt.toISOString().split('T')[0],
      type: 'quiz',
      label: `Quiz ${r.quiz.subject} — ${r.score}/${r.total}`,
    }));

    return {
      totalSessions:    progress.totalSessions,
      avgScore:         progress.avgScore,
      coursesCompleted: progress.coursesCompleted,
      quizzesTaken:     progress.quizzesTaken,
      streak:           progress.streak,
      points:           user?.points ?? 0,
      subjectProgress,
      recentActivity,
    };
  }

  async getRecommendations(userId: string) {
    const existing = await this.prisma.recommendation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    if (existing.length > 0) return existing;

    // Generate default recommendations for new users
    const defaults = [
      { title: 'Mathématiques — Bases de l\'algèbre', description: 'Maîtrisez les opérations fondamentales et les équations simples.', type: 'course', subject: 'MATH' as const, level: 'MIDDLE' as const },
      { title: 'Sciences — Le monde du vivant',       description: 'Explorez la biologie cellulaire et les écosystèmes.', type: 'course', subject: 'SCIENCE' as const, level: 'MIDDLE' as const },
      { title: 'Quiz — Histoire contemporaine',       description: 'Testez vos connaissances sur les événements du XXe siècle.', type: 'quiz', subject: 'HISTORY' as const, level: 'HIGH' as const },
    ];

    await this.prisma.recommendation.createMany({
      data: defaults.map((d) => ({ ...d, userId })),
    });

    return this.prisma.recommendation.findMany({ where: { userId }, take: 6 });
  }
}
