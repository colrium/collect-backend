import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { ClientProxy } from "@nestjs/microservices"
import { catchError, Observable, tap } from "rxjs"
import { AuthService } from '../auth.service';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
	// constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {
	// 	super(authClient);

	// 	console.log('authClient', authClient);
	// }

	constructor(
		private readonly authService: AuthService
	) {
		super();
		console.log('authService', authService);
	}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const authorization = this.getContextAuthorization(context);
		const authorizationArr = authorization?.split(' ') || [];
		const jwt =
			authorizationArr?.length > 1
				? authorizationArr[1]
				: authorizationArr[0];
		console.log('jwt', jwt);
		const jwtValid =  this.authService.validateJwt(jwt);

		return true;
		// if (this.authClient) {
		// 	this.authClient
		// 		.send({ role: 'auth', cmd: 'check' }, {
		// 			jwt: authorization?.split(' ')[1]
		// 		})
		// 		.pipe(
		// 			tap((res) => {
		// 				this.addUser(res, context);
		// 			}),
		// 			catchError(() => {
		// 				throw new UnauthorizedException();
		// 			})
		// 		);
		// }
		// else{
		// 	return true
		// }
	}

	private getContextAuthorization(context: ExecutionContext) {
		let authorization: string;
		if (context.getType() === 'rpc') {
			authorization = context.switchToRpc().getData().Authorization;
		} else if (context.getType() === 'http') {
			const authorizationCookie = context.switchToHttp().getRequest()
				.cookies?.Authorization;
			const authorizationHeader = context.switchToHttp().getRequest()
				.headers.authorization;
			authorization = authorizationHeader || authorizationCookie;
		}
		if (!authorization) {
			throw new UnauthorizedException(
				'No value was provided for Authorization'
			);
		}
		return authorization;
	}

	private addUser(user: any, context: ExecutionContext) {
		if (context.getType() === 'rpc') {
			context.switchToRpc().getData().user = user;
		} else if (context.getType() === 'http') {
			context.switchToHttp().getRequest().user = user;
		}
	}
}
