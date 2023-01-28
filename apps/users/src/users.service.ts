import {
	Injectable,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { UsersRepository } from './users.repository';
import { User } from '@app/common/auth';
import { Password } from '@app/common';

@Injectable()
export class UsersService {
	constructor(private readonly repository: UsersRepository) {}

	async create(data: Omit<User, '_id'>) {
		await this.validateCreate(data);
		const user = await this.repository.create(data);
		return user;
	}

	private async validateCreate(data: Omit<User, '_id'>) {
		let user: User;
		try {
			user = await this.repository.findOne({
				email: data.email,
			});
		} catch (err) {
			// throw err
		}
		if (user) {
			throw new UnprocessableEntityException('Email already exists.');
		}
	}

	async findOne(filterQuery: FilterQuery<User>) {
		return await this.repository.findOne(filterQuery);
	}

	async find(filterQuery: FilterQuery<User>) {
		return await this.repository.find(filterQuery);
	}
}
