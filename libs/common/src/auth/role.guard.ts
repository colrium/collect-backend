import { CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common"
import RequestWithUser from "./request-with-user.interface"
import { Role } from "./role.enum"

export const RolesGuard = (roles: Role[]): Type<CanActivate> => {
	class RoleGuardMixin implements CanActivate {
		canActivate(context: ExecutionContext) {
			const request = context.switchToHttp().getRequest<RequestWithUser>()
			const user = request.user
			return Array.isArray(user?.roles) && roles?.length > 0 && roles.some((role) => user?.roles?.indexOf(role) >= 0)
		}
	}

	return mixin(RoleGuardMixin)
}
