import { UserMapper } from "src/modules/user/mappers/user.mapper";
import { Instructor } from "../entities/instructor.entity";
import { CreateInstructorDto } from "../dto/create-instructor.dto";
import { Inject } from "@nestjs/common";
import { EncryptionInterface } from "src/core/common/utils/encryption/encryption.interface";

export class InstructorMapper extends UserMapper{
    constructor(@Inject('ENCRYPTION_UTIL') encryptionService: EncryptionInterface) {
        super(encryptionService);
    }  
    
    async toEntity(entity: Instructor, dto: Partial<CreateInstructorDto>): Promise<Instructor> {
        entity = entity ?? new Instructor();
        entity = await super.toEntity(entity, dto) as Instructor;
        
        return entity;
    }
}