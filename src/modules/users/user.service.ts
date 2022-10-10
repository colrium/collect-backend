import { Injectable, NotFoundException, Logger } from "@nestjs/common"

import { InjectRepository } from "@nestjs/typeorm"
import { MongoRepository } from "typeorm"
import { ObjectID } from "bson"
import { CreateUserDto, UpdateUserDto } from "./dto"
import UserRole from "./user.role.enum"
import User from "./user.entity"

@Injectable()
export default class UserService {
	private readonly logger = new Logger(UserService.name)
	constructor(
		@InjectRepository(User)
		private readonly userRepository: MongoRepository<User>
	) {}

	async getAll(): Promise<User[]> {
		return await this.userRepository.find()
	}
	async getByEmail(email: string) {
		const user = await this.userRepository.findOneBy({ email })

		if (!user) {
			throw new NotFoundException()
		}

		return user
	}

	async getById(id: string | ObjectID) {
		const user = await this.userRepository.findOneBy({ _id: typeof id === "string" ? ObjectID.createFromHexString(id) : id })

		if (!user) {
			throw new NotFoundException(`User not found`)
		}

		return user
	}

	async createMany(usersData: CreateUserDto[]) {
		const users = usersData.reduce((acc, user) => {
			const createdUser = new User(user)
			acc.push(createdUser)
			return acc
		}, [])
		return this.userRepository.insertMany(users)
	}
	async create(userData: CreateUserDto) {
		let user = new User(userData)

		return this.userRepository.save(user)
	}

	async update(id: string, userData: UpdateUserDto) {
		const user = await this.userRepository.findOneBy({ _id: ObjectID.createFromHexString(id) })
		if (!user) {
			throw new NotFoundException()
		}
		return this.userRepository.updateOne({ _id: id }, userData)
	}

	async delete(id: string) {
		const user = await this.userRepository.findOneBy({ _id: ObjectID.createFromHexString(id) })
		if (!user) {
			throw new NotFoundException()
		}
		return this.userRepository.deleteOne({ _id: ObjectID.createFromHexString(id) })
	}
}
