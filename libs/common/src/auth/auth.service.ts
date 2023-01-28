import {
	Logger,
	Injectable,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FilterQuery } from 'mongoose';
import { Response } from 'express';
import { User } from './user.schema';
import { Role } from './types';
import { DynamicConfigService } from '../dynamic';
import { Password } from '../utils';
import { AuthRepository } from './auth.repository';
import { ObjectId } from "bson"

export interface TokenPayload {
	sub: string;
	name: string;
	admin: boolean;
	iat?: number;
}

@Injectable()
export class AuthService {
	private logger = new Logger(AuthService.name);
	constructor(
		private readonly configService: DynamicConfigService,
		private readonly jwtService: JwtService,
		private readonly authRepository: AuthRepository
	) {}

	async login(user: User, response: Response) {
		const expires = new Date();
		expires.setSeconds(
			expires.getSeconds() + this.configService.get('JWT_EXPIRATION')
		);
		const secret = this.configService.get('JWT_SECRET');
		const tokenPayload: TokenPayload = {
			sub: user._id.toHexString(),
			name: user.fullName,
			admin: Array.isArray(user.roles) && user.roles.includes(Role.ADMIN),
			iat: Date.now(),
		};
		const token = this.jwtService.sign(tokenPayload, { secret: secret });
		response.header('Authorization', `Bearer ${token}`);
	}

	logout(response: Response) {
		response.cookie('Authentication', '', {
			httpOnly: true,
			expires: new Date(),
		});
	}

	async validateLocalStrategy(username: string, password: string) {
		const user = await this.authRepository.findOne({
			$or: [
				{
					email: username,
				},
				{
					phoneNumber: username,
				},
			],
		});
		const passwordIsValid = await Password.verify(password, user.password);
		if (!passwordIsValid) {
			throw new UnauthorizedException('Invalid Credentials.');
		}
		return user;
	}

	validateJwt(jwt: string) {
		const secret = this.configService.get('JWT_SECRET');
		return this.jwtService.verify(jwt, { secret });
	}

	async getJwtUser(jwt: string): Promise<User> {
		const decodedToken = this.jwtService.decode(jwt);
		const { sub } = decodedToken;
		const user = await this.authRepository.findOne({
			_id: new ObjectId(sub),
		});
		return user;
	}

	async findOne(filterQuery: FilterQuery<User>) {
		return await this.authRepository.findOne(filterQuery);
	}

	async find(filterQuery: FilterQuery<User>) {
		return await this.authRepository.findOne(filterQuery);
	}
}
