import { CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common"
import { Role, RequestWithUser } from '../types';

export const RolesGuard = (roles: Role[]): Type<CanActivate> => {
	class RoleGuardMixin implements CanActivate {
		canActivate(context: ExecutionContext) {
			const request = context.switchToHttp().getRequest()
			const user = request.user
			console.log('RolesGuard user', user);
			return Array.isArray(user?.roles) && roles?.length > 0 && roles.some((role) => user?.roles?.indexOf(role) >= 0)
		}
	}

	return mixin(RoleGuardMixin)
}
