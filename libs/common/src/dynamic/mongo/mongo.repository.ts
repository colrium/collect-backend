import { Injectable, Logger } from "@nestjs/common"
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import { Model, Connection } from "mongoose"
import { MongoBaseRepository } from './mongo.base.repository';
import { MongoDocument } from './mongo.base.document';

@Injectable()
export class DynamicMongoRepository<TDocument extends MongoDocument> extends MongoBaseRepository<MongoDocument> {
	protected readonly logger = new Logger('DynamicMongoRepository');

	constructor(
		@InjectModel('model') model: Model<TDocument>,
		@InjectConnection() connection: Connection
	) {
		super(model, connection);
	}
}
