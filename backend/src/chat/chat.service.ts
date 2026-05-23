import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService, private ai: AiService) {}

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, createdAt: true, updatedAt: true },
    });
  }

  async getConversation(id: string, userId: string) {
    const conv = await this.prisma.conversation.findFirst({
      where: { id, userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!conv) throw new NotFoundException('Conversation introuvable');
    return conv;
  }

  async createConversation(userId: string, title?: string) {
    return this.prisma.conversation.create({
      data: { userId, title: title ?? 'Nouvelle conversation' },
    });
  }

  async sendMessage(conversationId: string, userId: string, content: string) {
    const conv = await this.prisma.conversation.findFirst({ where: { id: conversationId, userId } });
    if (!conv) throw new NotFoundException('Conversation introuvable');

    // Get user for level context
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { level: true } });

    // Save user message
    await this.prisma.message.create({ data: { conversationId, role: 'user', content } });

    // Load history (last 20 messages for context)
    const history = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    // Get AI response
    const aiContent = await this.ai.chat(
      history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      user?.level ?? undefined,
    );

    const assistantMessage = await this.prisma.message.create({
      data: { conversationId, role: 'assistant', content: aiContent },
    });

    // Auto-title from first user message
    let conversationTitle = conv.title;
    if (conv.title === 'Nouvelle conversation' && history.length <= 2) {
      conversationTitle = content.length > 60 ? content.slice(0, 57) + '...' : content;
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { title: conversationTitle, updatedAt: new Date() },
      });
    } else {
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });
    }

    // Update progress
    await this.updateProgress(userId);

    return { assistantMessage, conversationTitle };
  }

  async deleteConversation(id: string, userId: string) {
    const conv = await this.prisma.conversation.findFirst({ where: { id, userId } });
    if (!conv) throw new NotFoundException('Conversation introuvable');
    await this.prisma.conversation.delete({ where: { id } });
    return { success: true };
  }

  private async updateProgress(userId: string) {
    await this.prisma.progress.upsert({
      where: { userId },
      create: { userId, totalSessions: 1 },
      update: { totalSessions: { increment: 1 }, updatedAt: new Date() },
    });
  }
}
