import { Injectable } from '@nestjs/common';
import { CreateLearnerDto } from './dto/create-learner.dto';
import { UpdateLearnerDto } from './dto/update-learner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Learner } from './entities/learner.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { LearnerMapper } from './mappers/learner.mapper';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
  PaginationType,
} from 'nestjs-paginate';
import { EnrollmentService } from '../enrollment/enrollment.service';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { CourseService } from '../course/course.service';
import { Course } from '../course/entities/course.entity';

@Injectable()
export class LearnerService extends UserService<Learner> {
  constructor(
    protected readonly learnerMapper: LearnerMapper,
    @InjectRepository(Learner)
    protected readonly learnerRepo: Repository<Learner>,
    private readonly enrollmentService: EnrollmentService,
    private readonly courseService: CourseService,
  ) {
    super(learnerMapper, learnerRepo);
  }

  async create(createLearnerDto: CreateLearnerDto) {
    return await super.create(createLearnerDto);
  }

  async update(id: number, updateLearnerDto: UpdateLearnerDto) {
    return await super.update(id, updateLearnerDto);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Learner>> {
    const config: PaginateConfig<Learner> = {
      sortableColumns: ['id', 'createdAt', 'birthdate'],
      searchableColumns: ['firstName', 'lastName', 'username', 'email'],
      defaultSortBy: [['createdAt', 'DESC']],
      paginationType: PaginationType.CURSOR,
      withDeleted: false,
      maxLimit: 25,
      defaultLimit: 10,
    };

    return paginate(query, this.learnerRepo, config);
  }

  async findById(id: number): Promise<Learner> {
    return await super.findById(id);
  }

  async findByUsername(username: string): Promise<Learner> {
    return await super.findByUsername(username);
  }

  async remove(id: number): Promise<boolean> {
    return await super.remove(id);
  }

  async findEnrollments(
    learnerId: number,
    query: PaginateQuery,
  ): Promise<Paginated<Enrollment>> {
    return await this.enrollmentService.findByLearner(learnerId, query);
  }

  async findEnrollment(learnerId: number, courseId: number) {
    await this.checkCourseExists(courseId);
    return await this.enrollmentService.findByCourseAndLearner(
      learnerId,
      courseId,
    );
  }

  async removeEnrollment(learnerId: number, courseId: number) {
    await this.checkCourseExists(courseId);
    await this.enrollmentService.withdraw(learnerId, courseId);
    return { message: 'Enrollment has been successfully removed.' };
  }

  private async checkCourseExists(courseId: number): Promise<Course> {
    return await this.courseService.findById(courseId);
  }
}
