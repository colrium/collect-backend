import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { DynamicMongoRepository } from '../dynamic/mongo';
import { UserPassword } from './models';

@Injectable()
export class UserPasswordRepository extends DynamicMongoRepository<UserPassword> {
	protected readonly logger = new Logger(UserPasswordRepository.name);

	constructor(
		@InjectModel(UserPassword.name) model: Model<UserPassword>,
		@InjectConnection() connection: Connection
	) {
		super(model, connection);
	}
}
