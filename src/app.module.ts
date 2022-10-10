import { Module, Logger } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import * as Joi from "@hapi/joi"
import { join } from "path"
import { ServeStaticModule } from "@nestjs/serve-static"
import { SeedModule } from "./modules/seeds"
import { AttachmentModule } from "./modules/attachments"
import { User, UserModule } from "./modules/users"
import { AuthModule } from "./modules/auth"
import { MongoConfigService } from "./database"

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			// envFilePath: `.env.${process.env.NODE_ENV}`,
			envFilePath: `.env`,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string().valid("development", "test", "staging", "production").default("development"),
				PORT: Joi.number().default(3000),
				APP_NAME: Joi.string().required(),
				APP_VERSION: Joi.string().required(),
				APP_DESCRIPTION: Joi.string(),
				MONGO_URL: Joi.string().required(),
				ADMIN_USERNAME: Joi.string().required(),
				ADMIN_PASSWORD: Joi.string().required(),
				SALT_ROUNDS: Joi.number().required(),
				JWT_EXPIRATION_TIME: Joi.number().required(),
			}),
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useClass: MongoConfigService,
			inject: [ConfigService, Logger],
		}),
		TypeOrmModule.forFeature([User]),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "..", "public"),
		}),
		SeedModule,
		AttachmentModule,
		AuthModule,
		UserModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
