import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';
import { IsString, IsOptional } from 'class-validator';

class CreateConvDto { @IsOptional() @IsString() title?: string; }
class SendMessageDto { @IsString() content: string = ''; }

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private chat: ChatService) {}

  @Get('conversations')
  getConversations(@Request() req: any) {
    return this.chat.getConversations(req.user.sub);
  }

  @Get('conversations/:id')
  getConversation(@Param('id') id: string, @Request() req: any) {
    return this.chat.getConversation(id, req.user.sub);
  }

  @Post('conversations')
  createConversation(@Body() dto: CreateConvDto, @Request() req: any) {
    return this.chat.createConversation(req.user.sub, dto.title);
  }

  @Post('conversations/:id/messages')
  sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto, @Request() req: any) {
    return this.chat.sendMessage(id, req.user.sub, dto.content);
  }

  @Delete('conversations/:id')
  deleteConversation(@Param('id') id: string, @Request() req: any) {
    return this.chat.deleteConversation(id, req.user.sub);
  }
}
