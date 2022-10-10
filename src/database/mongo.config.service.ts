import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm"
import { User } from "../modules/users"
import { Attachment } from "../modules/attachments"
@Injectable()
export default class MongoConfigService implements TypeOrmOptionsFactory {
	private readonly logger: Logger = new Logger(MongoConfigService.name)
	constructor(private configService: ConfigService) {}

	createTypeOrmOptions(): TypeOrmModuleOptions {
		const mongourl = this.configService.get<string>("MONGO_URL")
		this.logger.debug("MongoDBConfigService mongourl", mongourl)

		return {
			type: "mongodb",
			url: mongourl,
			entities: [Attachment, User],
		}
	}
}
