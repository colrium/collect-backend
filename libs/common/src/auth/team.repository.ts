import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { DynamicMongoRepository } from '../dynamic/mongo';
import { Team } from './models';

@Injectable()
export class TeamRepository extends DynamicMongoRepository<Team> {
	protected readonly logger = new Logger(TeamRepository.name);

	constructor(
		@InjectModel(Team.name) userModel: Model<Team>,
		@InjectConnection() connection: Connection
	) {
		super(userModel, connection);
	}
}
