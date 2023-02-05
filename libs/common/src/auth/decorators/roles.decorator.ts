import { SetMetadata } from '@nestjs/common';
import { Role } from '../types';
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
