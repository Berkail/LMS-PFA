import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { EncryptionModule } from 'src/core/common/utils/encryption/encryption.module';
import { PaginationModule } from 'src/core/pagination/pagination.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Instructor]),
    EncryptionModule,
    PaginationModule,
  ],
  controllers: [InstructorController],
  providers: [InstructorService],
  exports: [InstructorService],
})
export class InstructorModule {}
