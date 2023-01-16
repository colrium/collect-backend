import { NestFactory } from "@nestjs/core"
import { RmqService } from "@app/common"
import { RmqOptions } from "@nestjs/microservices"
import { ValidationPipe, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import helmet from "helmet"
import * as csurf from "csurf"
import * as cookieParser from "cookie-parser"
import {
	DocumentBuilder,
	SwaggerCustomOptions,
	SwaggerModule,
} from "@nestjs/swagger"
import { AuthModule } from "./auth.module"

async function bootstrap() {
	const logger = new Logger("bootstrap")
	const app = await NestFactory.create(AuthModule, {
		logger: ["error", "warn", "debug", "verbose"],
	})
	const configService = app.get(ConfigService)
	const rmqService = app.get<RmqService>(RmqService)

	const APP_NAME = configService.get<string>("APP_NAME")
	const APP_DESCRIPTION = configService.get<string>("APP_DESCRIPTION")
	const APP_VERSION = configService.get<string>("APP_VERSION")
	const PORT = configService.get<number>("PORT") || 3001
	logger.verbose(
		`Application MONGODB_URI: ${configService.get<string>("MONGODB_URI")}`
	)
	app.use(helmet())
	// app.use(csurf())
	app.useGlobalPipes(new ValidationPipe({ transform: true }))
	app.use(cookieParser())

	app.connectMicroservice<RmqOptions>(rmqService.getOptions("AUTH", true))
	const swaggerConfigBuilder = new DocumentBuilder()
		.setTitle(APP_NAME)
		.setDescription(APP_DESCRIPTION)
		.setVersion(APP_VERSION)
		.addBearerAuth()
	// .addCookieAuth("Authentication")
	const swaggerConfig = swaggerConfigBuilder.build()
	const customOptions: SwaggerCustomOptions = {
		customSiteTitle: APP_NAME,
	}
	const document = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup("/", app, document, customOptions)

	await app.startAllMicroservices()
	await app.listen(PORT)
	logger.verbose(`Application listening in port: ${PORT}`)
}
bootstrap()
