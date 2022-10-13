import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { toJSON as toJSONPlugin } from "./tojson.plugin"

@Module({
	imports: [
		MongooseModule.forRootAsync({
			useFactory: (configService: ConfigService) => {
				console.log(
					"Connecting to database...",
					configService.get("MONGODB_URI")
				)
				return {
					uri: configService.get<string>("MONGODB_URI"),
					connectionFactory: (connection) => {
						connection.plugin(toJSONPlugin)
						return connection
					},
				}
			},

			inject: [ConfigService],
		}),
	],
})
export class DatabaseModule {}
