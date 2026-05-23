import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { QuizModule } from './quiz/quiz.module';
import { ChatModule } from './chat/chat.module';
import { ProgressModule } from './progress/progress.module';
import { AiModule } from './ai/ai.module';
import { SageModule } from './sage/sage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AiModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    QuizModule,
    ChatModule,
    ProgressModule,
    SageModule,
  ],
})
export class AppModule {}
