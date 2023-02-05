import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { DynamicMongoRepository } from '../dynamic/mongo';
import { User } from './models';

@Injectable()
export class UserRepository extends DynamicMongoRepository<User> {
	protected readonly logger = new Logger(UserRepository.name);

	constructor(
		@InjectModel(User.name) model: Model<User>,
		@InjectConnection() connection: Connection
	) {
		super(model, connection);
	}
}
