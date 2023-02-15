import { UserRepository } from '@app/common';
import { User } from '@app/common/auth';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';

@Injectable()
export class UsersService {
	constructor(private readonly repository: UserRepository) {}

	async create(data: Omit<User, '_id'>) {
		await this.validateCreate(data);
		const user = await this.repository.create(data);
		return user;
	}

	private async validateCreate(data: Omit<User, '_id'>) {
		let user: User;
		try {
			user = await this.repository.findOne({
				email: data.email
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
