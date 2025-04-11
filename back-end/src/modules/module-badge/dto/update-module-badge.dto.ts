import { PartialType } from "@nestjs/mapped-types";
import { CreateModuleBadgeDto } from "./create-module-badge.dto";

export class UpdateModuleBadgeDto extends PartialType(CreateModuleBadgeDto) {}
