import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateModuleBadgeDto } from './dto/create-module-badge.dto';
import { UpdateModuleBadgeDto } from './dto/update-module-badge.dto';
import { CourseModule } from '../course-module/entities/course-module.entity';
import { Learner } from '../learner/entities/learner.entity';
import { ModuleBadge } from './entities/module-badge.entity';

@Injectable()
export class ModuleBadgeService {
  constructor(
    @InjectRepository(ModuleBadge)
    private readonly moduleBadgeRepository: Repository<ModuleBadge>,
    
    @InjectRepository(CourseModule)
    private readonly courseModuleRepository: Repository<CourseModule>,
    
    @InjectRepository(Learner)
    private readonly learnerRepository: Repository<Learner>,
  ) {}

  async create(createModuleBadgeDto: CreateModuleBadgeDto): Promise<ModuleBadge> {
    const badge = this.moduleBadgeRepository.create(createModuleBadgeDto);
    return this.moduleBadgeRepository.save(badge);
  }

  async findAll(): Promise<ModuleBadge[]> {
    return this.moduleBadgeRepository.find({
      relations: ['courseModule', 'learners'],
    });
  }

  async findOne(id: number): Promise<ModuleBadge> {
    const badge = await this.moduleBadgeRepository.findOne({
      where: { id }, // Correction appliquée ici
      relations: ['courseModule', 'learners'],
    });

    if (!badge) {
      throw new NotFoundException(`ModuleBadge with ID ${id} not found`);
    }

    return badge;
  }

  async update(id: number, updateModuleBadgeDto: UpdateModuleBadgeDto): Promise<ModuleBadge> {
    const badge = await this.findOne(id);
    Object.assign(badge, updateModuleBadgeDto);
    return this.moduleBadgeRepository.save(badge);
  }

  async remove(id: number): Promise<void> {
    const badge = await this.findOne(id);
    await this.moduleBadgeRepository.remove(badge);
  }

  async assignToModule(badgeId: number, moduleId: number): Promise<ModuleBadge> {
    const badge = await this.findOne(badgeId);
    const module = await this.courseModuleRepository.findOneBy({ id: moduleId });

    if (!module) {
      throw new NotFoundException(`CourseModule with ID ${moduleId} not found`);
    }

    badge.courseModule = module;
    return this.moduleBadgeRepository.save(badge);
  }

  async assignLearner(badgeId: number, learnerId: number): Promise<ModuleBadge> {
    const badge = await this.findOne(badgeId);
    const learner = await this.learnerRepository.findOneBy({ id: learnerId });

    if (!learner) {
      throw new NotFoundException(`Learner with ID ${learnerId} not found`);
    }

    badge.learners = [...(badge.learners || []), learner];
    return this.moduleBadgeRepository.save(badge);
  }
}