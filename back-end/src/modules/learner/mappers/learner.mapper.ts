import { UserMapper } from "src/modules/user/mappers/user.mapper";
import { Learner } from "../entities/learner.entity";
import { CreateLearnerDto } from "../dto/create-learner.dto";
import { Inject, Injectable } from "@nestjs/common";
import { EncryptionInterface } from "src/core/common/utils/encryption/encryption.interface";

@Injectable()
export class LearnerMapper extends UserMapper {
    constructor(@Inject('ENCRYPTION_UTIL') encryptionService: EncryptionInterface) {
        super(encryptionService);
    }    
    
    async toEntity(entity: Learner, dto: Partial<CreateLearnerDto>): Promise<Learner> {
        entity = entity ?? new Learner();
        entity = await super.toEntity(entity, dto) as Learner;
        
        if (dto.birthdate) entity.birthdate = new Date(dto.birthdate);

        return entity;
    }
}
