import { PartialType } from '@nestjs/mapped-types';
import { CreateModuleBadgeLearnerDto } from './create-module-badge-learner.dto';

export class UpdateModuleBadgeLearnerDto extends PartialType(CreateModuleBadgeLearnerDto) {}