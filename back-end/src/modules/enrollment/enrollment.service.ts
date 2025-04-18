import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
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

  async create(courseId: number, learnerId: number, enrollTime: Date) {
    let enrollment: Enrollment | null;

    enrollment = await this.checkEnrollmentStatus(courseId, learnerId);

    if (!enrollment) {
      enrollment = this.createEnrollment(courseId, learnerId);
    }

    enrollment.enrolledAt = enrollTime;
    return this.enrollmentRepo.save(enrollment);
  }

  private async checkEnrollmentStatus(
    courseId: number,
    learnerId: number,
  ): Promise<Enrollment | null> {
    try {
      const enrollment = await this.findByCourseAndLearner(courseId, learnerId);

      if (enrollment.status === EnrollmentStatus.EXPELLED) {
        throw new ForbiddenException('Prohibited from accessing course');
      }

      if (enrollment.enrolledAt !== null) {
        throw new ConflictException(
          'Cannot enroll in an already enrolled course',
        );
      }

      return enrollment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      } else {
        throw error;
      }
    }
  }

  private createEnrollment(courseId: number, learnerId: number): Enrollment {
    return this.enrollmentRepo.create({
      courseId,
      learnerId,
      status: EnrollmentStatus.APPROVED,
    });
  }

  async findByCourseAndLearner(
    learnerId: number,
    courseId: number,
  ): Promise<Enrollment> {
    try {
      const enrollment = await this.enrollmentRepo.findOneOrFail({
        where: { courseId, learnerId },
        relations: ['course', 'course.courseModules', 'course.courseModules.lessons'],
      });
      return enrollment;
    } catch (error) {
      throw new NotFoundException(
        `Enrollment not found for learner ${learnerId} in course ${courseId}`,
      );
    }
  }

  private async clearEnrollmentTimestamp(courseId: number, learnerId: number) {
    const enrollment = await this.findByCourseAndLearner(courseId, learnerId);
    enrollment.enrolledAt = null;
    return this.enrollmentRepo.save(enrollment);
  }

  async withdraw(courseId: number, learnerId: number) {
    const enrollement = await this.clearEnrollmentTimestamp(
      courseId,
      learnerId,
    );
    enrollement.status = EnrollmentStatus.WITHDRAWN;
    await this.enrollmentRepo.save(enrollement);
  }

  async expel(courseId: number, learnerId: number) {
    const enrollement = await this.clearEnrollmentTimestamp(
      courseId,
      learnerId,
    );
    enrollement.status = EnrollmentStatus.EXPELLED;
    await this.enrollmentRepo.save(enrollement);
  }

  async findBy(
    query: PaginateQuery,
    queryBuilder: any,
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
    };

    return paginate(query, queryBuilder, config);
  }

  async findByLearner(
    learnerId: number,
    query: PaginateQuery,
  ): Promise<Paginated<Enrollment>> {
    const queryBuilder = this.enrollmentRepo
      .createQueryBuilder('enrollment')
      .leftJoin('enrollment.course', 'course')
      .leftJoin('course.instructor', 'instructor')
      .select(['enrollment.courseId', 'enrollment.learnerId', 'enrollment.enrolledAt'])
      .addSelect(['course.id', 'course.title', 'course.pathToImg'])
      .addSelect(['instructor.id', 'instructor.username'])
      .where('enrollment.learnerId = :learnerId', {learnerId})

    return this.findBy(query, queryBuilder);
  }

  async findByCourse(
    courseId: number,
    query: PaginateQuery,
  ): Promise<Paginated<Enrollment>> {
    const queryBuilder = this.enrollmentRepo
      .createQueryBuilder('enrollment')
      .leftJoin('enrollment.learner', 'learner')
      .select(['enrollment.courseId', 'enrollment.learnerId', 'enrollment.enrolledAt'])
      .addSelect(['learner.id', 'learner.username'])
      .where('enrollment.courseId = :courseId', {courseId});
  
    return this.findBy(query, queryBuilder);
  }
}
