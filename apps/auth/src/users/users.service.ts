import { Injectable, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common"
import { FilterQuery } from "mongoose"
import { UsersRepository } from "./users.repository"
import { CreateUserRequest } from "./dto/create-user.request"
import { User } from "./schemas/user.schema"
import { Password } from "@app/common"

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async create(data: Omit<User, "_id">) {
		await this.validateCreate(data)
		const user = await this.usersRepository.create(data)
		return user
	}

	private async validateCreate(data: Omit<User, "_id">) {
		let user: User
		try {
			user = await this.usersRepository.findOne({
				email: data.email,
			})
		} catch (err) {
			// throw err
		}
		if (user) {
			throw new UnprocessableEntityException("Email already exists.")
		}
	}



	async findOne(filterQuery: FilterQuery<User>) {
		return await this.usersRepository.findOne(filterQuery)
	}

	async find(filterQuery: FilterQuery<User>) {
		return await this.usersRepository.find(filterQuery)
	}
}
