import { Injectable, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common"
import { FilterQuery } from "mongoose"
import { MongoDocument } from './mongo.document';
import {DynamicMongoRepository} from './mongo._repository'

@Injectable()
export class DynamicMongoCrudService<TDocument extends MongoDocument> {
	constructor(
		@InjectModel(TDocument.name) model: Model<TDocument>,
		@InjectConnection() connection: Connection
	) {
		this._repository = new DynamicMongoRepository(model, connection);
	}

	async create(data: Omit<TDocument, '_id'>) {
		await this.validateCreate(data);
		const doc = await this._repository.create(data);
		return doc;
	}

	private async validateCreate(data: Omit<TDocument, '_id'>) {
		let valid: boolean;
		try {
			valid = await this._repository.validate(data);
		} catch (err) {
			throw new UnprocessableEntityException(err);;
		}
		if (!valid) {
			throw new UnprocessableEntityException('Unprocessable Entity');
		}
	}

	async findOne(filterQuery: FilterQuery<TDocument>) {
		return await this._repository.findOne(filterQuery);
	}

	async find(filterQuery: FilterQuery<TDocument>) {
		return await this._repository.findAll(filterQuery);
	}
}
