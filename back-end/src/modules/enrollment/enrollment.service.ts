import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { SessionService } from 'src/core/session/session.service';
import {
  FilterOperator,
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
import { CourseService } from '../course/course.service';
import { Course } from '../course/entities/course.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
    private readonly courseService: CourseService,
  ) {}

  async create(learnerId: number, courseId: number, enrollTime: Date) {
    let enrollment = await this.findByCourseAndLearner(courseId, learnerId);

    if (!enrollment) {
      // checks if the passed courseId is valid
      const course: Course = await this.courseService.findById(courseId);

      enrollment = this.enrollmentRepo.create();
      enrollment.course = course;
      enrollment.learnerId = learnerId;
      enrollment.status = EnrollmentStatus.APPROVED;
    }

    enrollment.enrolledAt = enrollTime;

    return this.enrollmentRepo.save(enrollment);
  }

  async findByCourseAndLearner(
    learnerId: number,
    courseId: number,
  ): Promise<Enrollment | null> {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { learnerId, courseId },
    });
    return enrollment;
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
      searchableColumns: ['course.title'],
      defaultSortBy: [
        ['courseId', 'ASC'],
        ['learnerId', 'DESC'],
      ],
      filterableColumns: {
        courseId: [FilterOperator.EQ],
      },
      paginationType: PaginationType.CURSOR,
      withDeleted: false,
      maxLimit: 25,
      defaultLimit: 10,
      where: { learnerId },
      relations: ['course'],
    };

    return paginate(query, this.enrollmentRepo, config);
  }
}
