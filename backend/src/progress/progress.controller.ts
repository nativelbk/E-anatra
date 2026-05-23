import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProgressService } from './progress.service';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private progress: ProgressService) {}

  @Get()
  get(@Request() req: any) {
    return this.progress.getProgress(req.user.sub);
  }

  @Get('recommendations')
  recommendations(@Request() req: any) {
    return this.progress.getRecommendations(req.user.sub);
  }
}
