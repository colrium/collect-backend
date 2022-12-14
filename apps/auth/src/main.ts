import { NestFactory } from "@nestjs/core"
import { RmqService } from "@app/common"
import { RmqOptions } from "@nestjs/microservices"
import { ValidationPipe, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as cookieParser from "cookie-parser"
import { name, version } from "../../../package.json"
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

	const APP_NAME = `${name} Auth`
	const APP_DESCRIPTION = "Authentication & Authorization"
	const APP_VERSION = configService.get<string>("APP_VERSION")
	const PORT = configService.get<number>("PORT") || 3001
	logger.verbose(`${APP_NAME} Application`)
	app.useGlobalPipes(new ValidationPipe({ transform: true }))
	app.use(cookieParser())
	app.connectMicroservice<RmqOptions>(rmqService.getOptions("AUTH", true))
	const swaggerConfigBuilder = new DocumentBuilder()
		.setTitle(APP_NAME)
		.setDescription(APP_DESCRIPTION)
		.setVersion(version)
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
	logger.verbose(`${APP_NAME} Application listening in port: ${PORT}`)
}
bootstrap()
