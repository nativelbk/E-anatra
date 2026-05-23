import { Module } from '@nestjs/common';
import { SageController } from './sage.controller';

@Module({ controllers: [SageController] })
export class SageModule {}
