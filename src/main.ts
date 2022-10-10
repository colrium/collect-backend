import { NestFactory } from "@nestjs/core"
import { ConfigService } from "@nestjs/config"
import * as cookieParser from "cookie-parser"
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from "@nestjs/swagger"
import { Logger, UnprocessableEntityException, ValidationPipe } from "@nestjs/common"
import { AppModule } from "./app.module"

async function bootstrap() {
	const logger = new Logger("bootstrap")
	const app = await NestFactory.create(AppModule, {
		logger: ["error", "warn", "debug", "verbose"],
	})
	const configService = app.get(ConfigService)

	const APP_NAME = configService.get<string>("APP_NAME")
	const APP_DESCRIPTION = configService.get<string>("APP_DESCRIPTION")
	const APP_VERSION = configService.get<string>("APP_VERSION")
	const PORT = configService.get<number>("PORT")
	app.useGlobalPipes(new ValidationPipe({ transform: true }))
	app.use(cookieParser())
	const swaggerConfig = new DocumentBuilder().setTitle(APP_NAME).setDescription(APP_DESCRIPTION).setVersion(APP_VERSION).addBearerAuth().addCookieAuth("Authentication").build()
	const customOptions: SwaggerCustomOptions = {
		customSiteTitle: APP_NAME,
	}
	const document = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup("/", app, document, customOptions)
	await app.listen(PORT || 3000)
	logger.verbose(`Application listening in port: ${PORT}`)
}

bootstrap()
