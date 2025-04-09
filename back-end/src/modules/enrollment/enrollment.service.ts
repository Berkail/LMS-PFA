import { Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { SessionService } from 'src/core/session/session.service';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
  PaginationType,
} from 'nestjs-paginate';
import { Enrollment } from './entities/enrollment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentStatus } from './enums/enrollement-status.enum';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  create(learnerId: number, courseId: number) {
    const enrollment: Enrollment = this.enrollmentRepo.create();
    enrollment.courseId = courseId;
    enrollment.learnerId = learnerId;
    enrollment.status = EnrollmentStatus.APPROVED;

    return this.enrollmentRepo.save(enrollment);
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollment`;
  }

  update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    return `This action updates a #${id} enrollment`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollment`;
  }

  async findEnrollmentsByLearner(
    query: PaginateQuery,
    learnerId: number,
  ): Promise<Paginated<Enrollment>> {
    const config: PaginateConfig<Enrollment> = {
      sortableColumns: ['courseId', 'learnerId', 'enrolledAt'],
      searchableColumns: ['course.title', 'enrolledAt'],
      defaultSortBy: [
        ['courseId', 'ASC'],
        ['learnerId', 'DESC'],
      ],
      paginationType: PaginationType.CURSOR,
      withDeleted: false,
      maxLimit: 25,
      defaultLimit: 10,
      where: { learnerId: learnerId },
    };

    return paginate(query, this.enrollmentRepo, config);
  }
}
