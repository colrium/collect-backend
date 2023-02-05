import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { DynamicMongoRepository } from '../dynamic/mongo';
import { TeamMember } from './models';

@Injectable()
export class TeamMemberRepository extends DynamicMongoRepository<TeamMember> {
	protected readonly logger = new Logger(TeamMemberRepository.name);

	constructor(
		@InjectModel('TeamMember')
		model: Model<TeamMember>,
		@InjectConnection() connection: Connection
	) {
		super(model, connection);
	}
}
