import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { DynamicMongoRepository } from '../dynamic/mongo';
import { UserRole } from './models';

@Injectable()
export class UserRoleRepository extends DynamicMongoRepository<UserRole> {
	protected readonly logger = new Logger(UserRoleRepository.name);

	constructor(
		@InjectModel(UserRole.name) userModel: Model<UserRole>,
		@InjectConnection() connection: Connection
	) {
		super(userModel, connection);
	}
}
