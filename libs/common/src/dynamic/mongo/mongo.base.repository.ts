import { Logger, NotFoundException } from "@nestjs/common"
import { FilterQuery, Model, Types, UpdateQuery, SaveOptions, Connection } from "mongoose"
import { MongoDocument } from "./mongo.document"

export abstract class MongoBaseRepository<TDocument extends MongoDocument> {
	protected readonly logger = new Logger(TDocument.name)

	constructor(
		protected readonly _model: Model<TDocument>,
		private readonly connection: Connection
	) {

	}

	get model() {
		return this._model
	}

	async validate(document: TDocument, options: SaveOptions = {}): Promise<boolean>{
		return true;
	}

	async create(
		document: Omit<TDocument, '_id'>,
		options?: SaveOptions
	): Promise<TDocument> {
		const createdDocument = new this._model({
			...document,
			_id: new Types.ObjectId(),
		});
		return (
			await createdDocument.save(options)
		).toJSON() as unknown as TDocument;
	}

	async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
		const document = await this._model.findOne(filterQuery, {});

		if (!document) {
			this.logger.warn(
				'Document not found with filterQuery',
				filterQuery
			);
			throw new NotFoundException('Document not found.');
		}

		return document;
	}

	async findOneAndUpdate(
		filterQuery: FilterQuery<TDocument>,
		update: UpdateQuery<TDocument>
	) {
		const document = await this._model.findOneAndUpdate(
			filterQuery,
			update,
			{
				lean: true,
				new: true,
			}
		);

		if (!document) {
			this.logger.warn(
				`Document not found with filterQuery:`,
				filterQuery
			);
			throw new NotFoundException('Document not found.');
		}

		return document;
	}

	async upsert(
		filterQuery: FilterQuery<TDocument>,
		document: Partial<TDocument>
	) {
		return this._model.findOneAndUpdate(filterQuery, document, {
			lean: true,
			upsert: true,
			new: true,
		});
	}

	async find(filterQuery: FilterQuery<TDocument>) {
		return this._model.find(filterQuery, {}, { lean: true });
	}

	async startTransaction() {
		const session = await this.connection.startSession();
		session.startTransaction();
		return session;
	}
}
