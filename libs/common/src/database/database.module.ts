import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { toJSON as toJSONPlugin } from "./mongo.tojson.plugin"

@Module({
	imports: [
		MongooseModule.forRootAsync({
			useFactory: (configService: ConfigService) => {
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
