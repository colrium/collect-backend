import { Injectable, Logger } from "@nestjs/common"
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import { Model, Connection } from "mongoose"
import { DynamicMongoBaseRepository } from "./mongo.base.repository"
import { MongoDocument } from './mongo.document';

@Injectable()
export class DynamicMongoRepository extends DynamicMongoBaseRepository<TDocument extends MongoDocument> {
	protected readonly logger = new Logger(TDocument.name)

	constructor(@InjectModel(TDocument.name) model: Model<TDocument>, @InjectConnection() connection: Connection) {
		super(model, connection)
	}
}
