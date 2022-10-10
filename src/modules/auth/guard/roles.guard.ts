import { CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common"
import { RequestWithUser } from "../interface"
import { UserRole } from "../../users"

const RolesAuthGuard = (roles: UserRole[]): Type<CanActivate> => {
	class RoleGuardMixin implements CanActivate {
		canActivate(context: ExecutionContext) {
			const request = context.switchToHttp().getRequest<RequestWithUser>()
			const user = request.user
			return Array.isArray(user?.roles) && roles?.length > 0 && roles.some((role) => user?.roles?.indexOf(role) >= 0)
		}
	}

	return mixin(RoleGuardMixin)
}

export default RolesAuthGuard
