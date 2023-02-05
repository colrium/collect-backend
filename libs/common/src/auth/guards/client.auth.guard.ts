import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	Logger,
	UnauthorizedException,
	HttpException,
	HttpStatus,
	mixin,
	Type
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Socket } from 'socket.io';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { catchError, Observable, tap } from 'rxjs';
import { Role } from '../types';


export class ClientAuthGuard implements CanActivate {
	private logger = new Logger(ClientAuthGuard.name);
	constructor(
		@Inject('AUTH_CLIENT')
		private readonly client: ClientProxy,
		private reflector: Reflector
	) {
		this.logger.verbose(`reflector: ${JSON.stringify(reflector)}`);
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.get<Role[]>('roles', context.getHandler());

		const jwt = this.getContextAuthorizaionJwt(context);
		this.logger.verbose(`roles from reflector: ${JSON.stringify(roles)}`);
		this.logger.verbose(`jwt ${jwt}`);
		try {
			const user = await this.client
				.send({ role: 'jwt-auth', cmd: 'user'}, { jwt: jwt })
				.pipe(timeout(3000))
				.toPromise();
			this.logger.verbose(`user: ${JSON.stringify(user)}`);
			if (!!user) {
				if (roles?.length > 0) {
					let rolesCanActivate =
						Array.isArray(user?.roles) &&
						roles.some((role) => user?.roles?.indexOf(role) !== -1);
					if (!rolesCanActivate) {
						return false;
					}
				}
				this.addUser(user, context);
			}
			return Boolean(user);
		} catch (err) {
			this.logger.error(err);
			return false;
		}
	}

	private getContextAuthorizaionJwt(context: ExecutionContext) {
		let authorization: string | string[];
		if (context.getType() === 'rpc') {
			authorization = context.switchToRpc().getData().Authorization;
		} else if (context.getType() === 'http') {
			const authorizationCookie = context.switchToHttp().getRequest()
				.cookies?.Authorization;
			const authorizationHeader = context.switchToHttp().getRequest()
				.headers.authorization;
			authorization = authorizationHeader || authorizationCookie;
		} else {
			const socket: Socket = context.switchToWs().getClient<Socket>();
			authorization =
				socket?.handshake?.headers?.authorization ||
				socket?.handshake?.query?.authorization ||
				socket?.handshake?.query?.token;
		}
		// if (!authorization) {
		// 	throw new UnauthorizedException(
		// 		'No value was provided for Authorization'
		// 	);
		// }
		if (!authorization) {
			authorization = [];
		} else {
			if (typeof authorization === 'string') {
				authorization = authorization?.split(' ') || [];
			}
		}
		return authorization?.length > 1 ? authorization[1] : authorization[0];
	}

	private addUser(user: any, context: ExecutionContext) {
		if (context.getType() === 'rpc') {
			context.switchToRpc().getData().user = user;
		} else if (context.getType() === 'http') {
			context.switchToHttp().getRequest().user = user;
		} else {
			context.switchToWs().getClient().user = user;
		}
	}
}
