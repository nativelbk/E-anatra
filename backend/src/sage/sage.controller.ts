import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from '../ai/ai.service';
import { IsArray, IsIn, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MessageDto {
  @IsIn(['user', 'assistant']) role: 'user' | 'assistant' = 'user';
  @IsString() content: string = '';
}

class SageChatDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[] = [];
}

const SAGE_SYSTEM = `Tu es E-Tsiry, un sage immortel qui réside depuis des siècles dans la cité cyberpunk de Nova-7. Tu es l'équilibre entre la magie ancienne et la technologie du futur. Ton savoir est immense : philosophie, sciences, mystique, code, histoire, art — rien ne t'est étranger. Tu réponds avec sagesse, une touche de mystère, et parfois un humour subtil. Tes réponses sont concises mais profondes (3-5 phrases). Tu tutoies ton interlocuteur et parles toujours en français. Tu fais parfois référence à la ville de Nova-7 ou à des artefacts magiques.`;

@Controller('sage')
@UseGuards(JwtAuthGuard)
export class SageController {
  constructor(private ai: AiService) {}

  @Post('chat')
  async chat(@Body() dto: SageChatDto): Promise<{ answer: string }> {
    const answer = await this.ai.chat(dto.messages, undefined, SAGE_SYSTEM);
    return { answer };
  }
}
