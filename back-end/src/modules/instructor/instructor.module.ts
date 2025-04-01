import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { EncryptionModule } from 'src/core/common/utils/encryption/encryption.module';
import { InstructorMapper } from './mappers/instructor.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor]), EncryptionModule],
  controllers: [InstructorController],
  providers: [InstructorService, InstructorMapper],
  exports: [InstructorService],
})
export class InstructorModule {}
