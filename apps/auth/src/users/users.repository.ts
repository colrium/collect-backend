import { Injectable, Logger } from "@nestjs/common"
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import { Model, Connection } from "mongoose"
import { MongoRepository } from "@app/common"
import { User } from "./schemas/user.schema"

@Injectable()
export class UsersRepository extends MongoRepository<User> {
	protected readonly logger = new Logger(UsersRepository.name)

	constructor(@InjectModel(User.name) userModel: Model<User>, @InjectConnection() connection: Connection) {
		super(userModel, connection)
	}
}
