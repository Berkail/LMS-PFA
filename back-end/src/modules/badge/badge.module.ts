import { Module } from '@nestjs/common';
import { BadgeController } from './badge.controller';
import { BadgeService } from './badge.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Badge } from './entities/badge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Badge])],
  controllers: [BadgeController],
  providers: [BadgeService]
})
export class BadgeModule {}
