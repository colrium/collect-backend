import { Injectable, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common"
import { FilterQuery, Connection, Model } from 'mongoose';
import { MongoDocument } from './mongo.document';
import {DynamicMongoRepository} from './mongo.repository'
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
@Injectable()
export class DynamicMongoCrudService<TDocument extends MongoDocument> {
	private _repository: any;
	constructor(
		@InjectModel('model') model: Model<TDocument>,
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
