import { Injectable, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common"
import { UsersRepository } from "./users.repository"
import { CreateUserRequest } from "./dto/create-user.request"
import { User } from "./schemas/user.schema"
import { Password } from "@app/common"

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async createUser(request: CreateUserRequest) {
		await this.validateCreateUserRequest(request)
		const user = await this.usersRepository.create(request)
		return user
	}

	private async validateCreateUserRequest(request: CreateUserRequest) {
		let user: User
		try {
			user = await this.usersRepository.findOne({
				email: request.email,
			})
		} catch (err) {
			throw err
		}
		if (user) {
			throw new UnprocessableEntityException("Email already exists.")
		}
	}

	async validateUser(email: string, password: string) {
		const user = await this.usersRepository.findOne({ email })
		const passwordIsValid = await Password.verify(password, user.password)
		if (!passwordIsValid) {
			throw new UnauthorizedException("Invalid Credentials.")
		}
		return user
	}

	async getUser(getUserArgs: Partial<User>) {
		return this.usersRepository.findOne(getUserArgs)
	}
}
