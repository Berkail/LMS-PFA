import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
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

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  async create(learnerId: number, courseId: number, enrollTime: Date) {
    let enrollment = await this.findByLearnerAndCourse(learnerId, courseId);

    if (!enrollment) {
      enrollment = this.enrollmentRepo.create();
      enrollment.courseId = courseId;
      enrollment.learnerId = learnerId;
      enrollment.status = EnrollmentStatus.APPROVED;
    } else {
      if (enrollment.status == EnrollmentStatus.EXPELLED) {
        throw new UnauthorizedException('Prohibited from accessing course');
      }
    }

    enrollment.enrolledAt = enrollTime;

    return this.enrollmentRepo.save(enrollment);
  }

  async findByLearnerAndCourse(
    learnerId: number,
    courseId: number,
  ): Promise<Enrollment> {
    try {
      const enrollment = await this.enrollmentRepo.findOneOrFail({
        where: { learnerId, courseId },
        relations: ['course'],
      });
      return enrollment;
    } catch (error) {
      throw new NotFoundException(`Enrollment not found for learner ${learnerId} in course ${courseId}`);
    }
  }

  private async clearEnrollmentTimestamp(learnerId: number, courseId: number) {
    const enrollment = await this.findByLearnerAndCourse(learnerId, courseId);
    enrollment.enrolledAt = null;
    return this.enrollmentRepo.save(enrollment);
  }

  async withdraw(learnerId: number, courseId: number) {
    const enrollement = await this.clearEnrollmentTimestamp(learnerId, courseId);
    enrollement.status = EnrollmentStatus.WITHDRAWN;
    await this.enrollmentRepo.save(enrollement);
  }

  async expel(learnerId: number, courseId: number){
    const enrollement = await this.clearEnrollmentTimestamp(learnerId, courseId);
    enrollement.status = EnrollmentStatus.EXPELLED;
    await this.enrollmentRepo.save(enrollement);
  }

  async findBy(
    query: PaginateQuery,
    whereCondition: any,
    relations: string[],
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
      where: whereCondition,
      relations: relations,
    };

    return paginate(query, this.enrollmentRepo, config);
  }

  async findByLearner(
    learnerId: number,
    query: PaginateQuery,
  ): Promise<Paginated<Enrollment>> {
    return this.findBy(query, { learnerId }, ['course', 'course.instructor']);
  }

  async findByCourse(
    courseId: number,
    query: PaginateQuery,
  ): Promise<Paginated<Enrollment>> {
    return this.findBy(query, { courseId }, ['learner']);
  }
}
