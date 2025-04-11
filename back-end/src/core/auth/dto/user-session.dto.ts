import { UserRole } from 'src/modules/user/enums/user-role.enum';

export class UserSessionDto {
  id: number;
  username: string;
  role: UserRole;
}
