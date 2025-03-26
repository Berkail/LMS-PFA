import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateInstructorDto } from 'src/modules/instructor/dto/create-instructor.dto';
import { CreateLearnerDto } from 'src/modules/learner/dto/create-learner.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/entities/user.entity';
import { EncryptionInterface } from '../common/utils/encryption/encryption.interface';
import { SessionService } from '../session/session.service';
import { InstructorService } from 'src/modules/instructor/instructor.service';
import { LearnerService } from 'src/modules/learner/learner.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly instructorService: InstructorService,
    private readonly learnerService: LearnerService,
    @Inject('ENCRYPTION_UTIL')
    private readonly encryptionUtil: EncryptionInterface,
    private readonly sessionService: SessionService,
  ) {}

  private async loginUser<T extends User>(
    request: Request,
    credentials: LoginDto,
    userService: UserService<T>,
  ) {
    const user = await this.validateUser(userService, credentials);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    this.setUserSession(request, user);
  }

  private async validateUser<T extends User>(
    userService: UserService<T>,
    credentials: LoginDto,
  ): Promise<T | null> {
    const user = await userService.findByUsername(credentials.username);
    if (!user?.hashedPassword) return null;

    const isPasswordValid = await this.encryptionUtil.compare(
      credentials.plainPassword,
      user.hashedPassword,
    );

    return isPasswordValid ? user : null;
  }

  private setUserSession(request: Request, user: User): void {
    const userId = user.id;
    const username = user.username;
    const userRole = user.getRole();

    this.sessionService.setSession(request, 'userId', userId);
    this.sessionService.setSession(request, 'username', username);
    this.sessionService.setSession(request, 'userRole', userRole);
  }

  async signupInstructor(createInstructorDto: CreateInstructorDto) {
    return this.instructorService.create(createInstructorDto);
  }

  async signupLearner(createLearnerDto: CreateLearnerDto) {
    return this.learnerService.create(createLearnerDto);
  }

  async loginAsInstructor(request: Request, credentials: LoginDto) {
    return this.loginUser(request, credentials, this.instructorService);
  }

  async loginAsLearner(request: Request, credentials: LoginDto) {
    return this.loginUser(request, credentials, this.learnerService);
  }
}
