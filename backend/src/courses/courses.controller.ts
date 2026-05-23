import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CoursesService } from './courses.service';
import { IsString, IsOptional, IsIn } from 'class-validator';

class CreateCourseDto {
  @IsString() title: string = '';
  @IsString() description: string = '';
  @IsString() content: string = '';
  @IsString() @IsIn(['MATH','SCIENCE','COMPUTER_SCIENCE','FRENCH','HISTORY','ENGLISH','OTHER']) subject: string = 'OTHER';
  @IsString() @IsIn(['PRIMARY','MIDDLE','HIGH','UNIVERSITY']) level: string = 'MIDDLE';
  @IsOptional() @IsString() videoUrl?: string;
  @IsOptional() @IsString() fileUrl?: string;
}

@ApiTags('courses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(private courses: CoursesService) {}

  @Get()
  list(@Query('subject') subject?: string, @Query('level') level?: string, @Query('search') search?: string) {
    return this.courses.list({ subject, level, search });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.courses.get(id);
  }

  @Post()
  create(@Body() dto: CreateCourseDto, @Request() req: any) {
    return this.courses.create(req.user.sub, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.courses.delete(id, req.user.sub, req.user.role);
  }

  @Post(':id/explain')
  explain(
    @Param('id') id: string,
    @Body('question') question: string,
    @Request() req: any,
  ) {
    if (!question?.trim()) throw new BadRequestException('La question est requise');
    return this.courses.explain(id, question.trim(), req.user.sub);
  }
}
