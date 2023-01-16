import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { ClientProxy } from "@nestjs/microservices"
import { catchError, Observable, tap } from "rxjs"
import { AUTH_SERVICE } from "./services"

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const authorization = this.getContextAuthorization(context)
		return this.authClient
			.send("validate_user", {
				Authorization: authorization,
			})
			.pipe(
				tap((res) => {
					this.addUser(res, context)
				}),
				catchError(() => {
					throw new UnauthorizedException()
				})
			)
	}

	private getContextAuthorization(context: ExecutionContext) {
		let authorization: string
		if (context.getType() === "rpc") {
			authorization = context.switchToRpc().getData().Authorization
		} else if (context.getType() === "http") {
			authorization = context.switchToHttp().getRequest()
				.cookies?.Authorization
		}
		if (!authorization) {
			throw new UnauthorizedException(
				"No value was provided for Authorization"
			)
		}
		return authorization
	}

	private addUser(user: any, context: ExecutionContext) {
		if (context.getType() === "rpc") {
			context.switchToRpc().getData().user = user
		} else if (context.getType() === "http") {
			context.switchToHttp().getRequest().user = user
		}
	}
}
