import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/user/enums/user-role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
