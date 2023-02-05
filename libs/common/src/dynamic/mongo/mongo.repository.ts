import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { MongoBaseDocument } from './mongo.base.document';
import { MongoBaseRepository } from './mongo.base.repository';

@Injectable()
export class DynamicMongoRepository<
	TDocument extends MongoBaseDocument
> extends MongoBaseRepository<TDocument> {
	protected readonly logger = new Logger('DynamicMongoRepository');

	constructor(
		@InjectModel('model') model: Model<TDocument>,
		@InjectConnection() connection: Connection
	) {
		super(model, connection);
	}
}
