import { Injectable, Logger } from "@nestjs/common"
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import { Model, Connection } from "mongoose"
import { MongoRepository } from "../database"
import { User } from "./user.schema"

@Injectable()
export class AuthRepository extends MongoRepository<User> {
	protected readonly logger = new Logger(AuthRepository.name);

	constructor(
		@InjectModel(User.name) userModel: Model<User>,
		@InjectConnection() connection: Connection
	) {
		super(userModel, connection);
	}
}
