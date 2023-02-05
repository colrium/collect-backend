import {
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { FilterQuery } from 'mongoose';
import { DynamicConfigService } from '../dynamic';
import { Cryptography } from '../utils';
import { User, UserPassword } from './models';
import { Role } from './types';
import { UserPasswordRepository } from './user.password.repository';
import { UserRepository } from './user.repository';

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
		private readonly userRepository: UserRepository,
		private readonly userPasswordRepository: UserPasswordRepository
	) {}

	async createDefaultUser() {
		const user: User = await this.userRepository.create({
			email: 'colrium@gmail.com',
			firstName: 'John',
			lastName: 'Doe',
			roles: [Role.SUPER_ADMIN],
			phoneNumber: '254724146857',
			status: 'active',
			staffId: null
		});
		const userPassword = await this.userPasswordRepository.create({
			userId: user.id,
			hash: 'Pj3yNRWQVCLjQfQL',
			isActive: true,
			setOn: new Date()
		});
	}

	assertDefaultUser() {
		this.userRepository
			.findOne({ email: 'colrium@gmail.com' })
			.then((user) => {
				if (!user) {
					this.createDefaultUser();
				}
			})
			.catch((err) => {
				if (err instanceof NotFoundException) {
					this.createDefaultUser();
				}
			});
	}

	async login(user: User, response: Response) {
		const expires = new Date();
		expires.setSeconds(
			expires.getSeconds() + this.configService.get('JWT_EXPIRATION')
		);
		const secret = this.configService.get('JWT_SECRET');
		const tokenPayload: TokenPayload = {
			sub: user.id,
			name: user.fullName,
			admin: Array.isArray(user.roles) && user.roles.includes(Role.ADMIN),
			iat: Date.now()
		};
		const token = this.jwtService.sign(tokenPayload, { secret: secret });
		response.header('Authorization', `Bearer ${token}`);
	}

	logout(response: Response) {
		response.cookie('Authentication', '', {
			httpOnly: true,
			expires: new Date()
		});
	}

	async validateLocalStrategy(username: string, password: string) {
		const user = await this.userRepository.findOne({
			$or: [
				{
					email: username
				},
				{
					phoneNumber: username
				}
			]
		});
		if (!user) {
			throw new UnauthorizedException('User not found');
			return;
		}
		const passwordDoc: UserPassword =
			await this.userPasswordRepository.findOne({
				$and: [
					{
						userId: user.id
					},
					{
						isActive: true
					}
				]
			});
		if (!passwordDoc) {
			throw new UnauthorizedException('Invalid Credentials.');
		}
		const passwordIsValid = await Cryptography.verifyHash(
			password,
			passwordDoc.hash
		);

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
		const user = await this.userRepository.findOne({
			id: sub
		});
		return user;
	}

	async findOne(filterQuery: FilterQuery<User>) {
		return await this.userRepository.findOne(filterQuery);
	}

	async find(filterQuery: FilterQuery<User>) {
		return await this.userRepository.findOne(filterQuery);
	}
	onModuleInit() {
		this.logger.log(`The module has been initialized.`);
	}
}
