import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService, private ai: AiService) {}

  async generate(userId: string, subject: string, level: string, count: number) {
    const raw = await this.ai.generateQuiz(subject, level, count);

    let parsed: { title: string; questions: Array<{ question: string; options: string[]; correctIndex: number; explanation: string }> };
    try {
      // Extract JSON from response (sometimes wrapped in markdown code blocks)
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      throw new BadRequestException('Impossible de parser le quiz généré par l\'IA');
    }

    const quiz = await this.prisma.quiz.create({
      data: {
        title: parsed.title ?? `Quiz ${subject}`,
        subject: subject as any,
        level: level as any,
        questions: {
          create: parsed.questions.map((q, i) => ({
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            order: i,
          })),
        },
      },
      include: { questions: { orderBy: { order: 'asc' } } },
    });

    return quiz;
  }

  async submitResult(userId: string, quizId: string, answers: number[]) {
    const quiz = await this.prisma.quiz.findUniqueOrThrow({
      where: { id: quizId },
      include: { questions: { orderBy: { order: 'asc' } } },
    });

    const score = answers.filter((a, i) => quiz.questions[i]?.correctIndex === a).length;

    await this.prisma.quizResult.create({
      data: { userId, quizId, score, total: quiz.questions.length, answers },
    });

    // Update progress
    await this.updateProgressAfterQuiz(userId, score, quiz.questions.length, quiz.subject);

    return { score, total: quiz.questions.length, percentage: Math.round((score / quiz.questions.length) * 100) };
  }

  async getHistory(userId: string) {
    return this.prisma.quizResult.findMany({
      where: { userId },
      include: { quiz: { select: { title: true, subject: true, level: true } } },
      orderBy: { completedAt: 'desc' },
      take: 20,
    });
  }

  private async updateProgressAfterQuiz(userId: string, score: number, total: number, subject: string) {
    const progress = await this.prisma.progress.upsert({
      where: { userId },
      create: { userId, quizzesTaken: 1, avgScore: (score / total) * 100 },
      update: { quizzesTaken: { increment: 1 }, updatedAt: new Date() },
    });

    const pct = (score / total) * 100;
    const subjectScores = (progress.subjectScores as Record<string, number>) ?? {};
    subjectScores[subject] = Math.round((subjectScores[subject] ?? pct + pct) / 2);

    const allResults = await this.prisma.quizResult.findMany({ where: { userId } });
    const avgScore = allResults.reduce((acc, r) => acc + (r.score / r.total) * 100, 0) / allResults.length;

    await this.prisma.progress.update({
      where: { userId },
      data: { avgScore: Math.round(avgScore), subjectScores },
    });

    // Award points
    await this.prisma.user.update({
      where: { id: userId },
      data: { points: { increment: Math.round(pct / 10) } },
    });
  }
}
