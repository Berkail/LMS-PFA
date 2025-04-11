import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleBadgeLearner } from './entities/module-badge-learner.entity';

@Injectable()
export class ModuleBadgeLearnerService {
  constructor(
    @InjectRepository(ModuleBadgeLearner)
    private repo: Repository<ModuleBadgeLearner>,
  ) {}

  async create(data: {
    learnerId: number;
    moduleBadgeId: number;
    earnedDate: Date;
  }) {
    const association = this.repo.create(data);
    return this.repo.save(association);
  }

  findAll() {
    return this.repo.find({
      relations: ['learner', 'moduleBadge'],
    });
  }

  async findOne(id: number) {
    const association = await this.repo.findOne({
      where: { id },
      relations: ['learner', 'moduleBadge'],
    });
    if (!association) {
      throw new NotFoundException('Association not found');
    }
    return association;
  }

  async update(
    id: number,
    data: { learnerId?: number; moduleBadgeId?: number; earnedDate?: Date },
  ) {
    const association = await this.findOne(id);
    Object.assign(association, data);
    return this.repo.save(association);
  }

  async remove(id: number) {
    const association = await this.findOne(id);
    await this.repo.remove(association);
  }
}