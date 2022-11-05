import { Logger, HttpException } from "@nestjs/common"
import { FilterQuery, Model, Types, UpdateQuery, SaveOptions, Connection } from "mongoose"
import { MongoDocument } from "./mongo.schema"

export abstract class MongoRepository<TDocument extends MongoDocument> {
	protected abstract readonly logger: Logger

	constructor(
		protected readonly model: Model<TDocument>,
		private readonly connection: Connection
	) {}

	async create(
		document: Omit<TDocument, "_id">,
		options?: SaveOptions
	): Promise<TDocument> {
		const createdDocument = new this.model({
			...document,
			_id: new Types.ObjectId(),
		})
		return (
			await createdDocument.save(options)
		).toJSON() as unknown as TDocument
	}

	async findAll(
		filterQuery: FilterQuery<TDocument>
	): Promise<{ count: number; data: TDocument[] }> {
		console.log("filterQuery", filterQuery)
		const data: TDocument[] = await this.model.find(filterQuery, {})
		const count: number = await this.model.count(filterQuery)

		return { count, data }
		// return await this.model.find(filterQuery, {})
	}

	async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
		const document = await this.model.findOne(filterQuery, {})

		if (!document) {
			this.logger.warn("Document not found with filterQuery", filterQuery)
			throw new HttpException("Not found", 404)
		}

		return document
	}

	async findOneAndUpdate(
		filterQuery: FilterQuery<TDocument>,
		update: UpdateQuery<TDocument>
	) {
		const document = await this.model.findOneAndUpdate(
			filterQuery,
			update,
			{
				lean: true,
				new: true,
			}
		)

		if (!document) {
			this.logger.warn(
				`Document not found with filterQuery:`,
				filterQuery
			)
			throw new HttpException("Not found", 404)
		}

		return document
	}

	async upsert(
		filterQuery: FilterQuery<TDocument>,
		document: Partial<TDocument>
	) {
		return this.model.findOneAndUpdate(filterQuery, document, {
			lean: true,
			upsert: true,
			new: true,
		})
	}

	async startTransaction() {
		const session = await this.connection.startSession()
		session.startTransaction()
		return session
	}
}
