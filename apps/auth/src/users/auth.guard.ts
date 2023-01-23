import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { catchError, Observable, tap } from 'rxjs';
export class AuthGuard implements CanActivate {
	constructor(
		@Inject('AUTH_CLIENT')
		private readonly client: ClientProxy
	) {
		Logger.log(client);
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		Logger.log('Auth Guard');
		const req = context.switchToHttp().getRequest();

		try {
			const res = await this.client
				.send(
					{ role: 'auth', cmd: 'check' },
					{ jwt: req.headers['authorization']?.split(' ')[1] }
				)
				/* .pipe(
					tap((res) => {
						console.log(res);
						this.addUser(res, context);
					}),
					catchError(() => {
						throw new UnauthorizedException();
					})
				); */
			.pipe(timeout(5000))
			.toPromise();
			if (res) {
				this.addUser(res, context);
			}
			return Boolean(res);
		} catch (err) {
			Logger.error(err);
			return false;
		}
	}

	private addUser(user: any, context: ExecutionContext) {
		console.log('user', user)
		if (context.getType() === 'rpc') {
			context.switchToRpc().getData().user = user;
		} else if (context.getType() === 'http') {
			context.switchToHttp().getRequest().user = user;
		}
	}
}
