import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuizService } from './quiz.service';
import { IsString, IsNumber, Min, Max, IsArray, IsIn } from 'class-validator';

class GenerateQuizDto {
  @IsString()
  @IsIn(['MATH','SCIENCE','COMPUTER_SCIENCE','FRENCH','HISTORY','ENGLISH','OTHER'])
  subject: string = 'MATH';

  @IsString()
  @IsIn(['PRIMARY','MIDDLE','HIGH','UNIVERSITY'])
  level: string = 'MIDDLE';

  @IsNumber() @Min(3) @Max(15)
  count: number = 5;
}

class SubmitQuizDto {
  @IsArray()
  answers: number[] = [];
}

@ApiTags('quiz')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quiz')
export class QuizController {
  constructor(private quiz: QuizService) {}

  @Post('generate')
  generate(@Body() dto: GenerateQuizDto, @Request() req: any) {
    return this.quiz.generate(req.user.sub, dto.subject, dto.level, dto.count);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string, @Body() dto: SubmitQuizDto, @Request() req: any) {
    return this.quiz.submitResult(req.user.sub, id, dto.answers);
  }

  @Get('history')
  history(@Request() req: any) {
    return this.quiz.getHistory(req.user.sub);
  }
}
